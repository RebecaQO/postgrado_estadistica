<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use App\Models\ModuloDiplomado;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ModuloDiplomadoController extends Controller
{
    // ========================================
    // LISTAR MODULOS DE DIPLOMADO
    // ========================================

    public function listarModulosDiplomado()
    {
        $modulos = ModuloDiplomado::with([
            'materia',
            'mallas',
        ])
        ->orderBy('id_mat', 'asc')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $modulos,
        ], 200);
    }

    // ========================================
    // OBTENER MODULO DE DIPLOMADO
    // ========================================

    public function obtenerModuloDiplomado(int $id)
    {
        $modulo = ModuloDiplomado::with([
            'materia',
            'mallas.programa',
        ])->find($id);

        if (!$modulo) {
            return response()->json([
                'success' => false,
                'message' => 'Módulo de diplomado no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $modulo,
        ], 200);
    }

    // ========================================
    // CLASIFICAR MATERIA COMO MODULO DIPLOMADO
    // ========================================

    public function crearModuloDiplomado(Request $request)
    {
        $datos = $request->validate([
            'id_mat' => [
                'required',
                'integer',
                Rule::exists('materia', 'id_mat'),
                Rule::unique('modulo_diplomado', 'id_mat'),
            ],
        ]);

        $materia = Materia::findOrFail($datos['id_mat']);

        // Reutilizar el ID de la materia existente.
        $modulo = $materia->moduloDiplomado()->create([]);

        return response()->json([
            'success' => true,
            'message' =>
                'Materia clasificada como módulo de diplomado correctamente',
            'data' => $modulo->load('materia'),
        ], 201);
    }

    // ========================================
    // ELIMINAR CLASIFICACION
    // ========================================

    public function eliminarModuloDiplomado(int $id)
    {
        $modulo = ModuloDiplomado::find($id);

        if (!$modulo) {
            return response()->json([
                'success' => false,
                'message' => 'Módulo de diplomado no encontrado',
            ], 404);
        }

        // No eliminar si esta asociado a una malla.
        if ($modulo->mallas()->exists()) {
            return response()->json([
                'success' => false,
                'message' =>
                    'No se puede eliminar porque está asociado a mallas curriculares',
            ], 409);
        }

        try {
            $modulo->delete();
        } catch (QueryException $error) {
            if ($error->getCode() === '23503') {
                return response()->json([
                    'success' => false,
                    'message' =>
                        'No se puede eliminar porque el módulo está en uso',
                ], 409);
            }

            throw $error;
        }

        return response()->json([
            'success' => true,
            'message' =>
                'Clasificación de módulo de diplomado eliminada correctamente',
        ], 200);
    }
}
