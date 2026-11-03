<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use App\Models\MateriaMaestria;
use App\Models\ModuloDiplomado;
use App\Models\Modulo;
use App\Models\MallaCurricular;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class MateriaController extends Controller
{
    // ========================================
    // LISTAR MATERIAS
    // ========================================

    public function listarMaterias()
    {
        $materias = Materia::with([
            'materiaMaestria',
            'moduloDiplomado',
        ])
            ->orderBy('id_mat')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $materias,
        ], 200);
    }

    // ========================================
    // OBTENER MATERIA
    // ========================================

    public function obtenerMateria(int $id)
    {
        $materia = Materia::with([
            'materiaMaestria.modulos',
            'moduloDiplomado.mallas',
        ])->find($id);

        if (!$materia) {
            return response()->json([
                'success' => false,
                'message' => 'Materia no encontrada.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $materia,
        ], 200);
    }

    // ========================================
    // CREAR MATERIA Y SU SUBTIPO
    // ========================================

    public function crearMateria(Request $request)
    {
        $datos = $request->validate([
            'nombre_mat' => [
                'required',
                'string',
                'max:150',
            ],
            'descripcion' => [
                'required',
                'string',
            ],
            'tipo' => [
                'required',
                Rule::in(['Maestria', 'Diplomado']),
            ],
        ]);

        $materia = DB::transaction(function () use ($datos) {
            $materia = Materia::create([
                'nombre_mat' => $datos['nombre_mat'],
                'descripcion' => $datos['descripcion'],
            ]);

            if ($datos['tipo'] === 'Maestria') {
                MateriaMaestria::create([
                    'id_mat' => $materia->id_mat,
                ]);
            } else {
                ModuloDiplomado::create([
                    'id_mat' => $materia->id_mat,
                ]);
            }

            return $materia;
        });

        return response()->json([
            'success' => true,
            'message' => 'Materia creada correctamente.',
            'data' => $materia->load([
                'materiaMaestria',
                'moduloDiplomado',
            ]),
        ], 201);
    }

    // ========================================
    // ASIGNAR MATERIA A MODULO DE MAESTRIA
    // ========================================

    public function asignarMateriaModulo(Request $request, int $id)
    {
        $modulo = Modulo::with('malla.programa')->find($id);

        if (!$modulo) {
            return response()->json([
                'success' => false,
                'message' => 'Módulo no encontrado.',
            ], 404);
        }

        // Verificar módulo, malla y programa activos.
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
                    'No se pueden asignar materias a un módulo, malla o programa inactivo.',
            ], 422);
        }

        if ($modulo->malla->programa->tipo_programa !== 'Maestria') {
            return response()->json([
                'success' => false,
                'message' => 'El módulo no pertenece a una maestría.',
            ], 422);
        }

        $datos = $request->validate([
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

        // La materia debe estar activa.
        $materia = Materia::find($datos['id_mat']);

        if (!$materia || !$materia->activo) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede asignar una materia inactiva.',
            ], 422);
        }

        // Evitar asignaciones duplicadas.
        if (
            $modulo->materias()
                ->where('materia_maestria.id_mat', $datos['id_mat'])
                ->exists()
        ) {
            return response()->json([
                'success' => false,
                'message' => 'La materia ya está asignada a este módulo.',
            ], 409);
        }

        $modulo->materias()->attach($datos['id_mat'], [
            'creditos' => $datos['creditos'],
            'carga_horaria' => $datos['carga_horaria'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Materia asignada al módulo correctamente.',
            'data' => $modulo->load('materias.materia'),
        ], 201);
    }

    // ========================================
    // ASIGNAR MATERIA A MALLA DE DIPLOMADO
    // ========================================

    public function asignarMateriaDiplomado(Request $request, int $id)
    {
        $malla = MallaCurricular::with('programa')->find($id);

        if (!$malla) {
            return response()->json([
                'success' => false,
                'message' => 'Malla curricular no encontrada.',
            ], 404);
        }

        // Verificar malla y programa activos.
        if (
            !$malla->activo ||
            !$malla->programa ||
            !$malla->programa->activo
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                    'No se pueden asignar materias a una malla o programa inactivo.',
            ], 422);
        }

        if ($malla->programa->tipo_programa !== 'Diplomado') {
            return response()->json([
                'success' => false,
                'message' => 'La malla no pertenece a un diplomado.',
            ], 422);
        }

        $datos = $request->validate([
            'id_mat' => [
                'required',
                'integer',
                Rule::exists('modulo_diplomado', 'id_mat'),
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

        // La materia debe estar activa.
        $materia = Materia::find($datos['id_mat']);

        if (!$materia || !$materia->activo) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede asignar una materia inactiva.',
            ], 422);
        }

        // Evitar asignaciones duplicadas.
        if (
            $malla->materiasDiplomado()
                ->where('modulo_diplomado.id_mat', $datos['id_mat'])
                ->exists()
        ) {
            return response()->json([
                'success' => false,
                'message' => 'La materia ya está asignada a esta malla.',
            ], 409);
        }

        $malla->materiasDiplomado()->attach($datos['id_mat'], [
            'creditos' => $datos['creditos'],
            'carga_horaria' => $datos['carga_horaria'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Materia asignada al diplomado correctamente.',
            'data' => $malla->load('materiasDiplomado.materia'),
        ], 201);
    }

    // ========================================
    // ACTUALIZAR DATOS DE UNA MATERIA
    // ========================================

    public function actualizarMateria(Request $request, int $id)
    {
        $materia = Materia::find($id);

        if (!$materia) {
            return response()->json([
                'success' => false,
                'message' => 'Materia no encontrada.',
            ], 404);
        }

        // No modificar materias inactivas.
        if (!$materia->activo) {
            return response()->json([
                'success' => false,
                'message' =>
                    'No se puede modificar una materia inactiva.',
            ], 422);
        }

        $datos = $request->validate([
            'nombre_mat' => [
                'sometimes',
                'required',
                'string',
                'max:150',
            ],
            'descripcion' => [
                'sometimes',
                'required',
                'string',
            ],
        ]);

        $materia->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Materia actualizada correctamente.',
            'data' => $materia->fresh(),
        ], 200);
    }

    // ========================================
    // DESACTIVAR MATERIA
    // ========================================

    public function desactivarMateria(int $id)
    {
        $materia = Materia::find($id);

        if (!$materia) {
            return response()->json([
                'success' => false,
                'message' => 'Materia no encontrada.',
            ], 404);
        }

        if (!$materia->activo) {
            return response()->json([
                'success' => false,
                'message' => 'La materia ya está inactiva.',
            ], 409);
        }

        $materia->activo = false;
        $materia->save();

        return response()->json([
            'success' => true,
            'message' => 'Materia desactivada correctamente.',
            'data' => $materia,
        ], 200);
    }

    // ========================================
    // REACTIVAR MATERIA
    // ========================================

    public function reactivarMateria(int $id)
    {
        $materia = Materia::find($id);

        if (!$materia) {
            return response()->json([
                'success' => false,
                'message' => 'Materia no encontrada.',
            ], 404);
        }

        if ($materia->activo) {
            return response()->json([
                'success' => false,
                'message' => 'La materia ya está activa.',
            ], 409);
        }

        $materia->activo = true;
        $materia->save();

        return response()->json([
            'success' => true,
            'message' => 'Materia reactivada correctamente.',
            'data' => $materia,
        ], 200);
    }
}
