<?php

namespace App\Http\Controllers;

use App\Models\Modulo;
use App\Models\MallaCurricular;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ModuloController extends Controller
{
    // ========================================
    // LISTAR TODOS LOS MODULOS
    // ========================================

    public function listarModulos()
    {
        $modulos = Modulo::with([
            'malla.programa',
            'materias.materia',
        ])
            ->orderBy('id_mod', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $modulos,
        ], 200);
    }

    // ========================================
    // OBTENER MODULO POR ID
    // ========================================

    public function obtenerModulo(int $id)
    {
        $modulo = Modulo::with([
            'malla.programa',
            'materias.materia',
        ])->find($id);

        if (!$modulo) {
            return response()->json([
                'success' => false,
                'message' => 'Módulo no encontrado.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $modulo,
        ], 200);
    }

    // ========================================
    // LISTAR MODULOS POR MALLA
    // ========================================

    public function listarModulosPorMalla(int $id)
    {
        $malla = MallaCurricular::with('programa')
            ->find($id);

        if (!$malla) {
            return response()->json([
                'success' => false,
                'message' => 'Malla curricular no encontrada.',
            ], 404);
        }

        if ($malla->programa->tipo_programa !== 'Maestria') {
            return response()->json([
                'success' => false,
                'message' =>
                'Los módulos pertenecen únicamente a mallas de maestría.',
            ], 422);
        }

        $modulos = $malla->modulos()
            ->with('materias.materia')
            ->orderBy('id_mod', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $modulos,
        ], 200);
    }

    // ========================================
    // CREAR MODULO
    // ========================================

    public function crearModulo(Request $request)
    {
        $datos = $request->validate([
            'nombre_mod' => [
                'required',
                'string',
                'max:150',
                'filled',
            ],

            'id_malla' => [
                'required',
                'integer',
                Rule::exists(
                    'malla_curricular',
                    'id_malla'
                ),
            ],
        ]);

        // Buscar la malla y su programa.
        $malla = MallaCurricular::with('programa')
            ->findOrFail($datos['id_malla']);

        // Verificar que la malla y su programa estén activos.
        if (
            !$malla->activo ||
            !$malla->programa ||
            !$malla->programa->activo
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                'No se pueden crear módulos en una malla o programa inactivo.',
            ], 422);
        }

        // Los módulos solo corresponden a maestrías.
        if ($malla->programa->tipo_programa !== 'Maestria') {
            return response()->json([
                'success' => false,
                'message' =>
                'No se pueden crear módulos en una malla de diplomado.',
            ], 422);
        }

        // PostgreSQL genera id_mod automáticamente.
        $modulo = Modulo::create([
            'nombre_mod' => $datos['nombre_mod'],
            'id_malla' => $datos['id_malla'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Módulo creado correctamente.',
            'data' => $modulo->load('malla.programa'),
        ], 201);
    }

    // ========================================
    // ACTUALIZAR MODULO
    // ========================================

    public function actualizarModulo(Request $request, int $id)
    {
        $modulo = Modulo::with('malla.programa')->find($id);

        if (!$modulo) {
            return response()->json([
                'success' => false,
                'message' => 'Módulo no encontrado.',
            ], 404);
        }

        if (
            !$modulo->activo ||
            !$modulo->malla ||
            !$modulo->malla->activo ||
            !$modulo->malla->programa ||
            !$modulo->malla->programa->activo
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                'No se puede modificar un módulo inactivo o perteneciente a una malla o programa inactivo.',
            ], 422);
        }

        $datos = $request->validate([
            'nombre_mod' => [
                'required',
                'string',
                'max:150',
                'filled',
            ],
        ]);

        // No permitimos cambiar la malla asociada.
        $modulo->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Módulo actualizado correctamente.',
            'data' => $modulo->fresh()->load('malla.programa'),
        ], 200);
    }

    // ========================================
    // ELIMINAR MODULO
    // ========================================

    public function eliminarModulo(int $id)
    {
        $modulo = Modulo::find($id);

        if (!$modulo) {
            return response()->json([
                'success' => false,
                'message' => 'Módulo no encontrado.',
            ], 404);
        }

        // No eliminar si tiene materias relacionadas.
        if ($modulo->materias()->exists()) {
            return response()->json([
                'success' => false,
                'message' =>
                'No se puede eliminar el módulo porque tiene materias relacionadas.',
            ], 409);
        }

        $modulo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Módulo eliminado correctamente.',
        ], 200);
    }


    // DESACTIVAR MODULO
    public function desactivarModulo(int $id)
    {
        $modulo = Modulo::find($id);

        if (!$modulo) {
            return response()->json([
                'success' => false,
                'message' => 'Módulo no encontrado.',
            ], 404);
        }

        if (!$modulo->activo) {
            return response()->json([
                'success' => false,
                'message' => 'El módulo ya está inactivo.',
            ], 409);
        }

        $modulo->activo = false;
        $modulo->save();

        return response()->json([
            'success' => true,
            'message' => 'Módulo desactivado correctamente.',
            'data' => $modulo,
        ], 200);
    }

    // REACTIVAR MODULO
    public function reactivarModulo(int $id)
    {
        $modulo = Modulo::with('malla.programa')->find($id);

        if (!$modulo) {
            return response()->json([
                'success' => false,
                'message' => 'Módulo no encontrado.',
            ], 404);
        }

        if ($modulo->activo) {
            return response()->json([
                'success' => false,
                'message' => 'El módulo ya está activo.',
            ], 409);
        }

        if (
            !$modulo->malla ||
            !$modulo->malla->activo ||
            !$modulo->malla->programa ||
            !$modulo->malla->programa->activo
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                'No se puede reactivar el módulo porque su malla o programa está inactivo.',
            ], 422);
        }

        $modulo->activo = true;
        $modulo->save();

        return response()->json([
            'success' => true,
            'message' => 'Módulo reactivado correctamente.',
            'data' => $modulo,
        ], 200);
    }
}
