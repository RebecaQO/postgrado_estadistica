<?php

namespace App\Http\Controllers;

use App\Models\Modulo;
use App\Models\MateriaMaestria;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ComponeController extends Controller
{
    // ========================================
    // LISTAR RELACIONES
    // ========================================

    public function listarRelaciones()
    {
        $modulos = Modulo::with([
            'malla.programa',
            'materias.materia',
        ])->get();

        return response()->json([
            'success' => true,
            'data' => $modulos,
        ], 200);
    }

    // ========================================
    // LISTAR MATERIAS DE UN MODULO
    // ========================================

    public function listarMateriasPorModulo(int $idModulo)
    {
        $modulo = Modulo::with('materias.materia')
            ->find($idModulo);

        if (!$modulo) {
            return response()->json([
                'success' => false,
                'message' => 'Módulo no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $modulo->materias,
        ], 200);
    }

    // ========================================
    // ASOCIAR MATERIA A MODULO
    // ========================================

    public function crearRelacion(Request $request)
    {
        $datos = $request->validate([
            'id_mod' => [
                'required',
                'integer',
                Rule::exists('modulo', 'id_mod'),
            ],
            'id_mat' => [
                'required',
                'integer',
                Rule::exists('materia_maestria', 'id_mat'),
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

        $modulo = Modulo::with('malla.programa')
            ->findOrFail($datos['id_mod']);

        // Solo se permiten modulos de maestria.
        if ($modulo->malla->programa->tipo_programa !== 'Maestria') {
            return response()->json([
                'success' => false,
                'message' =>
                    'Solo se pueden asociar materias a módulos de maestría',
            ], 422);
        }

        // Verificar que la relacion no exista.
        if (
            $modulo->materias()
                ->where('materia_maestria.id_mat', $datos['id_mat'])
                ->exists()
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                    'La materia ya está asociada a este módulo',
            ], 409);
        }

        try {
            $modulo->materias()->attach($datos['id_mat'], [
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
                'Materia asociada al módulo correctamente',
            'data' => $modulo->fresh()->load('materias.materia'),
        ], 201);
    }

    // ========================================
    // ACTUALIZAR CREDITOS Y HORAS
    // ========================================

    public function actualizarRelacion(
        Request $request,
        int $idModulo,
        int $idMateria
    ) {
        $modulo = Modulo::find($idModulo);

        if (!$modulo) {
            return response()->json([
                'success' => false,
                'message' => 'Módulo no encontrado',
            ], 404);
        }

        $datos = $request->validate([
            'creditos' => ['sometimes', 'required', 'integer', 'min:1'],
            'carga_horaria' => ['sometimes', 'required', 'integer', 'min:1'],
        ]);

        if (
            !$modulo->materias()
                ->where('materia_maestria.id_mat', $idMateria)
                ->exists()
        ) {
            return response()->json([
                'success' => false,
                'message' => 'La relación no existe',
            ], 404);
        }

        $modulo->materias()->updateExistingPivot(
            $idMateria,
            $datos
        );

        return response()->json([
            'success' => true,
            'message' => 'Relación actualizada correctamente',
            'data' => $modulo->fresh()->load('materias.materia'),
        ], 200);
    }

    // ========================================
    // ELIMINAR RELACION
    // ========================================

    public function eliminarRelacion(int $idModulo, int $idMateria)
    {
        $modulo = Modulo::find($idModulo);

        if (!$modulo) {
            return response()->json([
                'success' => false,
                'message' => 'Módulo no encontrado',
            ], 404);
        }

        $eliminados = $modulo->materias()->detach($idMateria);

        if ($eliminados === 0) {
            return response()->json([
                'success' => false,
                'message' => 'La relación no existe',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Materia desvinculada del módulo correctamente',
        ], 200);
    }
}
