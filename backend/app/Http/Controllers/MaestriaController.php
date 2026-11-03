<?php

namespace App\Http\Controllers;

use App\Models\Maestria;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MaestriaController extends Controller
{
    // ========================================
    // LISTAR MAESTRIAS
    // ========================================

    public function listarMaestrias()
    {
        $maestrias = Maestria::with('programa')
            ->orderBy('id_programa', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $maestrias,
        ], 200);
    }

    // ========================================
    // OBTENER UNA MAESTRIA
    // ========================================

    public function obtenerMaestria(int $id)
    {
        $maestria = Maestria::with('programa')
            ->find($id);

        if (!$maestria) {
            return response()->json([
                'success' => false,
                'message' => 'Maestría no encontrada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $maestria,
        ], 200);
    }

    // ========================================
    // ACTUALIZAR TIPO DE MAESTRIA
    // ========================================

    public function actualizarMaestria(Request $request, int $id)
    {
        $maestria = Maestria::find($id);

        if (!$maestria) {
            return response()->json([
                'success' => false,
                'message' => 'Maestría no encontrada',
            ], 404);
        }

        $datos = $request->validate([
            'tipo' => [
                'required',
                Rule::in([
                    'Terminal',
                    'Autosostenible',
                ]),
            ],
        ]);

        $maestria->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Maestría actualizada correctamente',
            'data' => $maestria->fresh()->load('programa'),
        ], 200);
    }
}
