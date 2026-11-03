<?php

namespace App\Http\Controllers;

use App\Models\MallaCurricular;
use App\Models\ProgramaPostgrado;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MallaCurricularController extends Controller
{
    // LISTAR TODAS LAS MALLAS
    // Incluye activas e inactivas para administración.
    public function listarMallas()
    {
        $mallas = MallaCurricular::with('programa')
            ->orderBy('id_malla', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $mallas,
        ], 200);
    }

    // OBTENER UNA MALLA POR ID
    // Se conserva acceso a mallas históricas e inactivas.
    public function obtenerMalla(int $id)
    {
        $malla = MallaCurricular::with([
            'programa',
            'modulos.materias.materia',
            'materiasDiplomado.materia',
            'ediciones',
        ])->find($id);

        if (!$malla) {
            return response()->json([
                'success' => false,
                'message' => 'Malla curricular no encontrada.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $malla,
        ], 200);
    }

    // LISTAR MALLAS DE UN PROGRAMA
    // Incluye inactivas para consulta histórica y administración.
    public function listarMallasPorPrograma(int $id)
    {
        $programa = ProgramaPostgrado::find($id);

        if (!$programa) {
            return response()->json([
                'success' => false,
                'message' => 'Programa no encontrado.',
            ], 404);
        }

        $mallas = $programa->mallas()
            ->orderBy('id_malla', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $mallas,
        ], 200);
    }

    // CREAR MALLA CURRICULAR
    public function crearMalla(Request $request)
    {
        $datos = $request->validate([
            'nombre_malla' => [
                'required',
                'string',
                'max:150',
            ],
            'id_programa' => [
                'required',
                'integer',
                Rule::exists(
                    'programa_postgrado',
                    'id_programa'
                ),
            ],
        ]);

        $programa = ProgramaPostgrado::find(
            $datos['id_programa']
        );

        if (!$programa->activo) {
            return response()->json([
                'success' => false,
                'message' =>
                    'No se pueden crear mallas en un programa inactivo.',
            ], 422);
        }

        $malla = MallaCurricular::create([
            'nombre_malla' => $datos['nombre_malla'],
            'id_programa' => $datos['id_programa'],
            'activo' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' =>
                'Malla curricular creada correctamente.',
            'data' => $malla->load('programa'),
        ], 201);
    }

    // ACTUALIZAR NOMBRE DE MALLA
    public function actualizarMalla(Request $request, int $id)
    {
        $malla = MallaCurricular::find($id);

        if (!$malla) {
            return response()->json([
                'success' => false,
                'message' => 'Malla curricular no encontrada.',
            ], 404);
        }

        if (!$malla->activo) {
            return response()->json([
                'success' => false,
                'message' =>
                    'No se puede editar una malla inactiva. Reactívala primero.',
            ], 409);
        }

        $datos = $request->validate([
            'nombre_malla' => [
                'required',
                'string',
                'max:150',
            ],
        ]);

        $malla->update($datos);

        return response()->json([
            'success' => true,
            'message' =>
                'Malla curricular actualizada correctamente.',
            'data' => $malla->fresh()->load('programa'),
        ], 200);
    }

    // DESACTIVAR MALLA (BORRADO LÓGICO)
    public function desactivarMalla(int $id)
    {
        $malla = MallaCurricular::find($id);

        if (!$malla) {
            return response()->json([
                'success' => false,
                'message' => 'Malla curricular no encontrada.',
            ], 404);
        }

        if (!$malla->activo) {
            return response()->json([
                'success' => false,
                'message' => 'La malla ya está inactiva.',
            ], 409);
        }

        // No borramos módulos, materias ni ediciones.
        $malla->activo = false;
        $malla->save();

        return response()->json([
            'success' => true,
            'message' =>
                'Malla desactivada correctamente. Se conservaron sus datos y relaciones.',
            'data' => $malla,
        ], 200);
    }

    // REACTIVAR MALLA
    public function reactivarMalla(int $id)
    {
        $malla = MallaCurricular::with('programa')
            ->find($id);

        if (!$malla) {
            return response()->json([
                'success' => false,
                'message' => 'Malla curricular no encontrada.',
            ], 404);
        }

        if ($malla->activo) {
            return response()->json([
                'success' => false,
                'message' => 'La malla ya está activa.',
            ], 409);
        }

        // Para reactivar, el programa debe estar activo.
        if (!$malla->programa || !$malla->programa->activo) {
            return response()->json([
                'success' => false,
                'message' =>
                    'No se puede reactivar la malla porque su programa está inactivo.',
            ], 422);
        }

        $malla->activo = true;
        $malla->save();

        return response()->json([
            'success' => true,
            'message' => 'Malla reactivada correctamente.',
            'data' => $malla,
        ], 200);
    }
}
