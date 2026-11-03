<?php

namespace App\Http\Controllers;

use App\Models\MallaCurricular;
use App\Models\ModuloDiplomado;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class IntegraController extends Controller
{
    // ========================================
    // LISTAR RELACIONES
    // ========================================

    public function listarRelaciones()
    {
        $mallas = MallaCurricular::whereHas(
            'programa',
            function ($consulta) {
                $consulta->where('tipo_programa', 'Diplomado');
            }
        )
        ->with([
            'programa',
            'materiasDiplomado.materia',
        ])
        ->get();

        return response()->json([
            'success' => true,
            'data' => $mallas,
        ], 200);
    }

    // ========================================
    // LISTAR MATERIAS DE UNA MALLA
    // ========================================

    public function listarMateriasPorMalla(int $idMalla)
    {
        $malla = MallaCurricular::with([
            'programa',
            'materiasDiplomado.materia',
        ])->find($idMalla);

        if (!$malla) {
            return response()->json([
                'success' => false,
                'message' => 'Malla curricular no encontrada',
            ], 404);
        }

        if ($malla->programa->tipo_programa !== 'Diplomado') {
            return response()->json([
                'success' => false,
                'message' =>
                    'La malla seleccionada no pertenece a un diplomado',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'data' => $malla->materiasDiplomado,
        ], 200);
    }

    // ========================================
    // ASOCIAR MATERIA A MALLA
    // ========================================

    public function crearRelacion(Request $request)
    {
        $datos = $request->validate([
            'id_malla' => [
                'required',
                'integer',
                Rule::exists('malla_curricular', 'id_malla'),
            ],
            'id_mat' => [
                'required',
                'integer',
                Rule::exists('modulo_diplomado', 'id_mat'),
            ],
            'creditos' => [
                'required',
                'integer',
                'min:1',
            ],
            'carga_horaria' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);

        $malla = MallaCurricular::with('programa')
            ->findOrFail($datos['id_malla']);

        // Solo las mallas de diplomado utilizan Integra.
        if ($malla->programa->tipo_programa !== 'Diplomado') {
            return response()->json([
                'success' => false,
                'message' =>
                    'Solo se pueden asociar materias a mallas de diplomado',
            ], 422);
        }

        // Evitar relaciones duplicadas.
        if (
            $malla->materiasDiplomado()
                ->where('modulo_diplomado.id_mat', $datos['id_mat'])
                ->exists()
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                    'La materia ya está asociada a esta malla',
            ], 409);
        }

        try {
            $malla->materiasDiplomado()->attach($datos['id_mat'], [
                'creditos' => $datos['creditos'],
                'carga_horaria' => $datos['carga_horaria'],
            ]);
        } catch (QueryException $error) {
            if ($error->getCode() === '23505') {
                return response()->json([
                    'success' => false,
                    'message' => 'La relación ya existe',
                ], 409);
            }

            throw $error;
        }

        return response()->json([
            'success' => true,
            'message' =>
                'Materia asociada a la malla correctamente',
            'data' => $malla->fresh()->load('materiasDiplomado.materia'),
        ], 201);
    }

    // ========================================
    // ACTUALIZAR CREDITOS Y HORAS
    // ========================================

    public function actualizarRelacion(
        Request $request,
        int $idMalla,
        int $idMateria
    ) {
        $malla = MallaCurricular::find($idMalla);

        if (!$malla) {
            return response()->json([
                'success' => false,
                'message' => 'Malla curricular no encontrada',
            ], 404);
        }

        $datos = $request->validate([
            'creditos' => ['sometimes', 'required', 'integer', 'min:1'],
            'carga_horaria' => ['sometimes', 'required', 'integer', 'min:1'],
        ]);

        if (
            !$malla->materiasDiplomado()
                ->where('modulo_diplomado.id_mat', $idMateria)
                ->exists()
        ) {
            return response()->json([
                'success' => false,
                'message' => 'La relación no existe',
            ], 404);
        }

        $malla->materiasDiplomado()->updateExistingPivot(
            $idMateria,
            $datos
        );

        return response()->json([
            'success' => true,
            'message' => 'Relación actualizada correctamente',
            'data' => $malla->fresh()->load('materiasDiplomado.materia'),
        ], 200);
    }

    // ========================================
    // ELIMINAR RELACION
    // ========================================

    public function eliminarRelacion(int $idMalla, int $idMateria)
    {
        $malla = MallaCurricular::find($idMalla);

        if (!$malla) {
            return response()->json([
                'success' => false,
                'message' => 'Malla curricular no encontrada',
            ], 404);
        }

        $eliminados = $malla->materiasDiplomado()
            ->detach($idMateria);

        if ($eliminados === 0) {
            return response()->json([
                'success' => false,
                'message' => 'La relación no existe',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' =>
                'Materia desvinculada de la malla correctamente',
        ], 200);
    }
}
