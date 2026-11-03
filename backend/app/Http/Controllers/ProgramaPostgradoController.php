<?php

namespace App\Http\Controllers;

use App\Models\ProgramaPostgrado;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProgramaPostgradoController extends Controller
{
    // ========================================
    // ESTADOS VISIBLES EN EL PORTAL PUBLICO
    // ========================================

    private const ESTADOS_PUBLICOS = [
        'En Proceso',
        'Abierta',
        'En Curso',
    ];

    // ========================================
    // LISTAR PROGRAMAS ACTIVOS - PUBLICO
    // ========================================

    public function listarProgramasActivos()
    {
        $estados = self::ESTADOS_PUBLICOS;

        $programas = ProgramaPostgrado::query()
            ->whereHas('ediciones', function ($consulta) use ($estados) {
                $consulta->whereIn('estado', $estados);
            })
            ->with([
                'maestria',
                'diplomado',

                // Solo las ediciones visibles publicamente.
                'ediciones' => function ($consulta) use ($estados) {
                    $consulta
                        ->whereIn('estado', $estados)
                        ->with([
                            // Malla de la edicion.
                            'malla',

                            // Modulos y materias de maestria.
                            'malla.modulos.materias.materia',

                            // Materias de diplomado.
                            'malla.materiasDiplomado.materia',

                            // Docentes asignados a la edicion.
                            'docentes',
                        ])
                        ->orderBy('fecha_inicio', 'desc');
                },
            ])
            ->orderBy('id_programa', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $programas,
        ], 200);
    }

    // ========================================
    // LISTAR TODOS LOS PROGRAMAS - GESTION
    // ========================================

    public function listarProgramas()
    {
        $programas = ProgramaPostgrado::with([
            'maestria',
            'diplomado',
            'mallas',
            'ediciones',
        ])
        ->orderBy('id_programa', 'asc')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $programas,
        ], 200);
    }

    // ========================================
    // OBTENER UN PROGRAMA
    // ========================================

    public function obtenerPrograma(int $id)
    {
        $programa = ProgramaPostgrado::with([
            'maestria',
            'diplomado',
            'mallas',
            'ediciones',
        ])->find($id);

        if (!$programa) {
            return response()->json([
                'success' => false,
                'message' => 'Programa no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $programa,
        ], 200);
    }

    // ========================================
    // CREAR PROGRAMA
    // ========================================

    public function crearPrograma(Request $request)
    {
        $datos = $request->validate([
            'nombre_programa' => [
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

            'tipo_programa' => [
                'required',
                Rule::in(['Maestria', 'Diplomado']),
            ],

            'tipo_maestria' => [
                Rule::requiredIf(
                    $request->input('tipo_programa') === 'Maestria'
                ),
                'nullable',
                Rule::in(['Terminal', 'Autosostenible']),
            ],

            // Campos academicos adicionales.

            'area_conocimiento' => [
                'nullable',
                'string',
                'max:150',
            ],

            'mencion' => [
                'nullable',
                'string',
                'max:150',
            ],

            'perfil_aspirante' => [
                'nullable',
                'string',
            ],

            'perfil_egreso' => [
                'nullable',
                'string',
            ],

            'enlace_pdf_programa' => [
                'nullable',
                'url',
                'max:2048',
            ],
        ]);

        $programa = DB::transaction(function () use ($datos) {

            $programa = ProgramaPostgrado::create([
                'nombre_programa' => $datos['nombre_programa'],
                'descripcion' => $datos['descripcion'],
                'tipo_programa' => $datos['tipo_programa'],

                'area_conocimiento' =>
                    $datos['area_conocimiento'] ?? null,

                'mencion' =>
                    $datos['mencion'] ?? null,

                'perfil_aspirante' =>
                    $datos['perfil_aspirante'] ?? null,

                'perfil_egreso' =>
                    $datos['perfil_egreso'] ?? null,

                'enlace_pdf_programa' =>
                    $datos['enlace_pdf_programa'] ?? null,
            ]);

            if ($datos['tipo_programa'] === 'Maestria') {
                $programa->maestria()->create([
                    'tipo' => $datos['tipo_maestria'],
                ]);
            } else {
                $programa->diplomado()->create([]);
            }

            return $programa;
        });

        $programa->load([
            'maestria',
            'diplomado',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Programa creado correctamente',
            'data' => $programa,
        ], 201);
    }

    // ========================================
    // ACTUALIZAR PROGRAMA
    // ========================================

    public function actualizarPrograma(Request $request, int $id)
    {
        $programa = ProgramaPostgrado::find($id);

        if (!$programa) {
            return response()->json([
                'success' => false,
                'message' => 'Programa no encontrado',
            ], 404);
        }

        $datos = $request->validate([
            'nombre_programa' => [
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

            'area_conocimiento' => [
                'sometimes',
                'nullable',
                'string',
                'max:150',
            ],

            'mencion' => [
                'sometimes',
                'nullable',
                'string',
                'max:150',
            ],

            'perfil_aspirante' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'perfil_egreso' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'enlace_pdf_programa' => [
                'sometimes',
                'nullable',
                'url',
                'max:2048',
            ],

            // La clasificacion academica no se modifica.
        ]);

        $programa->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Programa actualizado correctamente',
            'data' => $programa->fresh([
                'maestria',
                'diplomado',
                'mallas',
                'ediciones',
            ]),
        ], 200);
    }

    // ========================================
    // ELIMINAR PROGRAMA
    // ========================================

    public function eliminarPrograma(int $id)
    {
        $programa = ProgramaPostgrado::find($id);

        if (!$programa) {
            return response()->json([
                'success' => false,
                'message' => 'Programa no encontrado',
            ], 404);
        }

        if (
            $programa->mallas()->exists() ||
            $programa->ediciones()->exists()
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                    'No se puede eliminar el programa porque tiene mallas o ediciones relacionadas',
            ], 409);
        }

        try {
            DB::transaction(function () use ($programa) {

                if ($programa->tipo_programa === 'Maestria') {
                    $programa->maestria()->delete();
                }

                if ($programa->tipo_programa === 'Diplomado') {
                    $programa->diplomado()->delete();
                }

                $programa->delete();
            });

        } catch (QueryException $error) {

            if ($error->getCode() === '23503') {
                return response()->json([
                    'success' => false,
                    'message' =>
                        'No se puede eliminar el programa porque tiene registros relacionados',
                ], 409);
            }

            throw $error;
        }

        return response()->json([
            'success' => true,
            'message' => 'Programa eliminado correctamente',
        ], 200);
    }
}
