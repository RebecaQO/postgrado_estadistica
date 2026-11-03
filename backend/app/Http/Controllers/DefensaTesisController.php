<?php

namespace App\Http\Controllers;

use App\Models\DefensaTesis;
use App\Models\EdicionPrograma;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DefensaTesisController extends Controller
{
    // ========================================
    // LISTAR TODAS LAS DEFENSAS
    // ========================================

    public function listarDefensas()
    {
        $defensas = DefensaTesis::with([
            'edicion.programa',
        ])
        ->orderBy('fecha_defensa', 'desc')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $defensas,
        ], 200);
    }

    // ========================================
    // OBTENER DEFENSA POR ID
    // ========================================

    public function obtenerDefensa(int $id)
    {
        $defensa = DefensaTesis::with([
            'edicion.programa',
        ])->find($id);

        if (!$defensa) {
            return response()->json([
                'success' => false,
                'message' => 'Defensa de tesis no encontrada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $defensa,
        ], 200);
    }

    // ========================================
    // LISTAR DEFENSAS DE UNA EDICION
    // ========================================

    public function listarDefensasPorEdicion(int $idEdicion)
    {
        $edicion = EdicionPrograma::find($idEdicion);

        if (!$edicion) {
            return response()->json([
                'success' => false,
                'message' => 'Edición no encontrada',
            ], 404);
        }

        $defensas = $edicion->defensas()
            ->orderBy('fecha_defensa', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $defensas,
        ], 200);
    }

    // ========================================
    // CREAR DEFENSA DE TESIS
    // ========================================

    public function crearDefensa(Request $request)
    {
        $datos = $request->validate([
            'fecha_defensa' => [
                'required',
                'date_format:Y-m-d',
            ],

            'hora_defensa' => [
                'required',
                'date_format:H:i',
            ],

            'lugar_defensa' => [
                'required',
                'string',
                'max:150',
                function ($attribute, $value, $fail) {
                    if (trim($value) === '') {
                        $fail('El lugar de defensa es obligatorio.');
                    }
                },
            ],

            'estado' => [
                'sometimes',
                'required',
                Rule::in([
                    'Pendiente',
                    'Aprobada',
                    'Rechazada',
                ]),
            ],

            'id_edicion' => [
                'required',
                'integer',
                Rule::exists(
                    'edicion_programa',
                    'id_edicion'
                ),
            ],
        ]);

        // PostgreSQL utiliza Pendiente como estado inicial.
        $datos['estado'] = $datos['estado'] ?? 'Pendiente';

        $defensa = DefensaTesis::create($datos);

        return response()->json([
            'success' => true,
            'message' =>
                'Defensa de tesis creada correctamente',
            'data' => $defensa->load('edicion.programa'),
        ], 201);
    }

    // ========================================
    // ACTUALIZAR DEFENSA
    // ========================================

    public function actualizarDefensa(Request $request, int $id)
    {
        $defensa = DefensaTesis::find($id);

        if (!$defensa) {
            return response()->json([
                'success' => false,
                'message' => 'Defensa de tesis no encontrada',
            ], 404);
        }

        $datos = $request->validate([
            'fecha_defensa' => [
                'sometimes',
                'required',
                'date_format:Y-m-d',
            ],

            'hora_defensa' => [
                'sometimes',
                'required',
                'date_format:H:i',
            ],

            'lugar_defensa' => [
                'sometimes',
                'required',
                'string',
                'max:150',
                function ($attribute, $value, $fail) {
                    if (trim($value) === '') {
                        $fail('El lugar no puede estar vacío.');
                    }
                },
            ],

            'estado' => [
                'sometimes',
                'required',
                Rule::in([
                    'Pendiente',
                    'Aprobada',
                    'Rechazada',
                ]),
            ],
        ]);

        // La defensa permanece vinculada a su edicion.
        // No se permite modificar id_edicion.

        $defensa->update($datos);

        return response()->json([
            'success' => true,
            'message' =>
                'Defensa de tesis actualizada correctamente',
            'data' => $defensa->fresh([
                'edicion.programa',
            ]),
        ], 200);
    }

    // ========================================
    // ELIMINAR DEFENSA
    // ========================================

    public function eliminarDefensa(int $id)
    {
        $defensa = DefensaTesis::find($id);

        if (!$defensa) {
            return response()->json([
                'success' => false,
                'message' => 'Defensa de tesis no encontrada',
            ], 404);
        }

        try {
            $defensa->delete();
        } catch (QueryException $error) {
            if ($error->getCode() === '23503') {
                return response()->json([
                    'success' => false,
                    'message' =>
                        'No se puede eliminar la defensa porque tiene registros relacionados',
                ], 409);
            }

            throw $error;
        }

        return response()->json([
            'success' => true,
            'message' =>
                'Defensa de tesis eliminada correctamente',
        ], 200);
    }
}
