<?php

namespace App\Http\Controllers;

use App\Models\EdicionPrograma;
use App\Models\ProgramaPostgrado;
use App\Models\MallaCurricular;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class EdicionProgramaController extends Controller
{
    // ========================================
    // LISTAR CONVOCATORIAS PUBLICAS
    // ========================================

    public function listarConvocatorias()
    {
        $convocatorias = EdicionPrograma::with([
            'programa',
        ])
            ->where('estado', 'Abierta')
            ->orderBy('fecha_inicio', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $convocatorias,
        ], 200);
    }

    // ========================================
    // LISTAR TODAS LAS EDICIONES
    // ========================================

    public function listarEdiciones()
    {
        $ediciones = EdicionPrograma::with([
            'programa',
            'malla',
            'docentes',
        ])
            ->orderBy('id_edicion', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $ediciones,
        ], 200);
    }

    // ========================================
    // OBTENER EDICION POR ID
    // ========================================

    public function obtenerEdicion(int $id)
    {
        $edicion = EdicionPrograma::with([
            'programa.maestria',
            'programa.diplomado',
            'malla.modulos.materias.materia',
            'malla.materiasDiplomado.materia',
            'docentes',
            'defensas',
        ])->find($id);

        if (!$edicion) {
            return response()->json([
                'success' => false,
                'message' => 'Edición no encontrada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $edicion,
        ], 200);
    }

    // ========================================
    // LISTAR EDICIONES DE UN PROGRAMA
    // ========================================

    public function listarEdicionesPorPrograma(int $id)
    {
        $programa = ProgramaPostgrado::find($id);

        if (!$programa) {
            return response()->json([
                'success' => false,
                'message' => 'Programa no encontrado',
            ], 404);
        }

        $ediciones = $programa->ediciones()
            ->with([
                'malla',
                'docentes',
            ])
            ->orderBy('id_edicion', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $ediciones,
        ], 200);
    }

    // ========================================
    // CREAR UNA EDICION
    // ========================================

    public function crearEdicion(Request $request)
    {
        $datos = $request->validate([
            // Nombre de la edicion
            'nombre_edicion' => [
                'required',
                'string',
                'max:100',
                'filled',
            ],

            'fecha_inicio' => [
                'required',
                'date_format:Y-m-d',
            ],

            'fecha_fin' => [
                'required',
                'date_format:Y-m-d',
                'after_or_equal:fecha_inicio',
            ],

            'duracion' => [
                'required',
                'string',
                'max:100',
                'filled',
            ],

            'horario' => [
                'required',
                'string',
                'max:150',
                'filled',
            ],

            'descripcion' => [
                'required',
                'string',
                'filled',
            ],

            'modalidad_titulacion' => [
                'required',
                'string',
                'filled',
            ],

            'requisitos' => [
                'required',
                'string',
                'filled',
            ],

            'convocatoria' => [
                'required',
                'string',
                'filled',
            ],

            'formulario' => [
                'required',
                'string',
                'filled',
            ],

            'estado' => [
                'sometimes',
                'required',
                Rule::in([
                    'En Proceso',
                    'Abierta',
                    'En Curso',
                    'Concluida',
                    'Cancelada',
                ]),
            ],

            'id_programa' => [
                'required',
                'integer',
                Rule::exists(
                    'programa_postgrado',
                    'id_programa'
                ),
            ],

            'id_malla' => [
                'required',
                'integer',
                Rule::exists('malla_curricular', 'id_malla')
                    ->where('id_programa', $request->input('id_programa'))
                    ->where('activo', true),
            ],
        ]);

        // Validar nuevamente la relacion programa-malla.
        $malla = MallaCurricular::findOrFail(
            $datos['id_malla']
        );

        if ($malla->id_programa !== (int) $datos['id_programa']) {
            return response()->json([
                'success' => false,
                'message' =>
                'La malla curricular no pertenece al programa seleccionado',
            ], 422);
        }

        // Estado inicial por defecto.
        $datos['estado'] = $datos['estado'] ?? 'En Proceso';

        // PostgreSQL genera automaticamente id_edicion.
        $edicion = EdicionPrograma::create($datos);

        return response()->json([
            'success' => true,
            'message' => 'Edición creada correctamente',
            'data' => $edicion->load([
                'programa',
                'malla',
                'docentes',
            ]),
        ], 201);
    }

    // ========================================
    // ACTUALIZAR EDICION
    // ========================================

    public function actualizarEdicion(Request $request, int $id)
    {
        $edicion = EdicionPrograma::find($id);

        if (!$edicion) {
            return response()->json([
                'success' => false,
                'message' => 'Edición no encontrada',
            ], 404);
        }

        // Combinar las fechas actuales con las recibidas
        // para validar actualizaciones parciales.

        $fechaInicio = $request->input(
            'fecha_inicio',
            $edicion->fecha_inicio->format('Y-m-d')
        );

        $fechaFin = $request->input(
            'fecha_fin',
            $edicion->fecha_fin->format('Y-m-d')
        );

        Validator::make([
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin,
        ], [
            'fecha_inicio' => [
                'required',
                'date_format:Y-m-d',
            ],
            'fecha_fin' => [
                'required',
                'date_format:Y-m-d',
                'after_or_equal:fecha_inicio',
            ],
        ])->validate();

        // No se permite cambiar id_programa ni id_malla.

        $datos = $request->validate([
            // Nombre identificativo modificable
            'nombre_edicion' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                'filled',
            ],

            'fecha_inicio' => [
                'sometimes',
                'required',
                'date_format:Y-m-d',
            ],

            'fecha_fin' => [
                'sometimes',
                'required',
                'date_format:Y-m-d',
            ],

            'duracion' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                'filled',
            ],

            'horario' => [
                'sometimes',
                'required',
                'string',
                'max:150',
                'filled',
            ],

            'descripcion' => [
                'sometimes',
                'required',
                'string',
                'filled',
            ],

            'modalidad_titulacion' => [
                'sometimes',
                'required',
                'string',
                'filled',
            ],

            'requisitos' => [
                'sometimes',
                'required',
                'string',
                'filled',
            ],

            'convocatoria' => [
                'sometimes',
                'required',
                'string',
                'filled',
            ],

            'formulario' => [
                'sometimes',
                'required',
                'string',
                'filled',
            ],

            'estado' => [
                'sometimes',
                'required',
                Rule::in([
                    'En Proceso',
                    'Abierta',
                    'En Curso',
                    'Concluida',
                    'Cancelada',
                ]),
            ],
        ]);

        $edicion->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Edición actualizada correctamente',
            'data' => $edicion->fresh()->load([
                'programa',
                'malla',
                'docentes',
                'defensas',
            ]),
        ], 200);
    }

    // ========================================
    // ELIMINAR EDICION
    // ========================================

    public function eliminarEdicion(int $id)
    {
        $edicion = EdicionPrograma::find($id);

        if (!$edicion) {
            return response()->json([
                'success' => false,
                'message' => 'Edición no encontrada',
            ], 404);
        }

        // No eliminar si tiene docentes o defensas.
        if (
            $edicion->docentes()->exists() ||
            $edicion->defensas()->exists()
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                'No se puede eliminar la edición porque tiene docentes o defensas relacionados',
            ], 409);
        }

        try {
            $edicion->delete();
        } catch (QueryException $error) {

            if ($error->getCode() === '23503') {
                return response()->json([
                    'success' => false,
                    'message' =>
                    'No se puede eliminar la edición porque tiene registros relacionados',
                ], 409);
            }

            throw $error;
        }

        return response()->json([
            'success' => true,
            'message' => 'Edición eliminada correctamente',
        ], 200);
    }
}
