<?php

namespace App\Http\Controllers;

use App\Models\Diplomado;

class DiplomadoController extends Controller
{
    // ========================================
    // LISTAR DIPLOMADOS
    // ========================================

    public function listarDiplomados()
    {
        $diplomados = Diplomado::with('programa')
            ->orderBy('id_programa', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $diplomados,
        ], 200);
    }

    // ========================================
    // OBTENER UN DIPLOMADO
    // ========================================

    public function obtenerDiplomado(int $id)
    {
        $diplomado = Diplomado::with('programa')
            ->find($id);

        if (!$diplomado) {
            return response()->json([
                'success' => false,
                'message' => 'Diplomado no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $diplomado,
        ], 200);
    }
}
