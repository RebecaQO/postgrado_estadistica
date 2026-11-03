<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use App\Models\MateriaMaestria;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class MateriaMaestriaController extends Controller
{
    // ========================================
    // LISTAR MATERIAS DE MAESTRIA
    // ========================================

    public function listarMateriasMaestria()
    {
        $materias = MateriaMaestria::with([
            'materia',
            'modulos',
        ])
        ->orderBy('id_mat', 'asc')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $materias,
        ], 200);
    }

    // ========================================
    // OBTENER MATERIA DE MAESTRIA
    // ========================================

    public function obtenerMateriaMaestria(int $id)
    {
        $materia = MateriaMaestria::with([
            'materia',
            'modulos.malla.programa',
        ])->find($id);

        if (!$materia) {
            return response()->json([
                'success' => false,
                'message' =>
                    'Materia de maestría no encontrada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $materia,
        ], 200);
    }

    // ========================================
    // CLASIFICAR MATERIA COMO MAESTRIA
    // ========================================

    public function crearMateriaMaestria(Request $request)
    {
        $datos = $request->validate([
            'id_mat' => [
                'required',
                'integer',
                Rule::exists('materia', 'id_mat'),
                Rule::unique('materia_maestria', 'id_mat'),
            ],
        ]);

        $materia = Materia::findOrFail(
            $datos['id_mat']
        );

        // Una materia ya registrada puede ser
        // clasificada para utilizarse en maestrias.

        $materiaMaestria = DB::transaction(
            function () use ($materia) {

                return $materia->materiaMaestria()
                    ->create([]);
            }
        );

        return response()->json([
            'success' => true,
            'message' =>
                'Materia clasificada como materia de maestría correctamente',
            'data' => $materiaMaestria->load('materia'),
        ], 201);
    }

    // ========================================
    // ELIMINAR CLASIFICACION DE MAESTRIA
    // ========================================

    public function eliminarMateriaMaestria(int $id)
    {
        $materiaMaestria = MateriaMaestria::find($id);

        if (!$materiaMaestria) {
            return response()->json([
                'success' => false,
                'message' =>
                    'Materia de maestría no encontrada',
            ], 404);
        }

        // No quitar la clasificacion si la materia
        // se utiliza actualmente en algun modulo.

        if ($materiaMaestria->modulos()->exists()) {
            return response()->json([
                'success' => false,
                'message' =>
                    'No se puede eliminar la clasificación porque la materia está asociada a módulos',
            ], 409);
        }

        try {
            $materiaMaestria->delete();

        } catch (QueryException $error) {

            if ($error->getCode() === '23503') {
                return response()->json([
                    'success' => false,
                    'message' =>
                        'No se puede eliminar porque la materia está en uso',
                ], 409);
            }

            throw $error;
        }

        return response()->json([
            'success' => true,
            'message' =>
                'Clasificación de materia de maestría eliminada correctamente',
        ], 200);
    }
}
