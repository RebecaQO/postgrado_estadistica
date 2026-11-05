<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\EdicionPrograma;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DocenteController extends Controller
{
    // ========================================
    // LISTAR DOCENTES
    // ========================================

    public function listarDocentes()
    {
        $docentes = Docente::with([
            'ediciones.programa',
        ])
            ->orderByDesc('activo')
            ->orderBy('apellido_doc')
            ->orderBy('nombre_doc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $docentes,
        ], 200);
    }

    // ========================================
    // OBTENER DOCENTE
    // ========================================

    public function obtenerDocente(int $id)
    {
        $docente = Docente::with([
            'ediciones.programa',
        ])->find($id);

        if (!$docente) {
            return response()->json([
                'success' => false,
                'message' => 'Docente no encontrado.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $docente,
        ], 200);
    }

    // ========================================
    // LISTAR DOCENTES DE UNA EDICION
    // ========================================

    public function listarDocentesPorEdicion(int $id)
    {
        $edicion = EdicionPrograma::find($id);

        if (!$edicion) {
            return response()->json([
                'success' => false,
                'message' => 'Edicion no encontrada.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $edicion->docentes()
                ->orderBy('apellido_doc')
                ->orderBy('nombre_doc')
                ->get(),
        ], 200);
    }

    // ========================================
    // CREAR DOCENTE
    // ========================================

    public function crearDocente(Request $request)
    {
        $datos = $request->validate([
            'nombre_doc' => [
                'required',
                'string',
                'max:150',
                Rule::unique('docente', 'nombre_doc')->where('apellido_doc', $request->input('apellido_doc')),
            ],
            'apellido_doc' => [
                'required',
                'string',
                'max:150',
            ],
            'foto' => [
                'nullable',
                'string',
            ],
        ]);

        $docente = Docente::create($datos);

        return response()->json([
            'success' => true,
            'message' => 'Docente creado correctamente.',
            'data' => $docente,
        ], 201);
    }

    // ========================================
    // ACTUALIZAR DOCENTE
    // ========================================

    public function actualizarDocente(Request $request, int $id)
    {
        $docente = Docente::find($id);

        if (!$docente) {
            return response()->json([
                'success' => false,
                'message' => 'Docente no encontrado.',
            ], 404);
        }


        if (!$docente->activo) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede modificar un docente inactivo.',
            ], 422);
        }


        $datos = $request->validate([
            'nombre_doc' => [
                'sometimes',
                'required',
                'string',
                'max:150',
                Rule::unique('docente', 'nombre_doc')
                    ->where('apellido_doc', $request->input('apellido_doc', $docente->apellido_doc))
                    ->ignore($docente->id_doc, 'id_doc'),
            ],
            'apellido_doc' => [
                'sometimes',
                'required',
                'string',
                'max:150',
            ],
            'foto' => [
                'sometimes',
                'nullable',
                'string',
            ],
        ]);

        $docente->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Docente actualizado correctamente.',
            'data' => $docente->fresh(),
        ], 200);
    }

    // ========================================
    // ASIGNAR DOCENTE A EDICION
    // ========================================

    public function asignarDocente(Request $request, int $id)
    {
        $edicion = EdicionPrograma::find($id);

        if (!$edicion) {
            return response()->json([
                'success' => false,
                'message' => 'Edicion no encontrada.',
            ], 404);
        }

        $datos = $request->validate([

            'id_doc' => [
                'required',
                'integer',
                Rule::exists('docente', 'id_doc')
                    ->where('activo', true),
            ],

        ]);

        if (
            $edicion->docentes()
            ->wherePivot('id_doc', $datos['id_doc'])
            ->exists()
        ) {
            return response()->json([
                'success' => false,
                'message' => 'El docente ya esta asignado a esta edicion.',
            ], 409);
        }

        try {
            $edicion->docentes()->attach($datos['id_doc']);
        } catch (QueryException $error) {
            if ($error->getCode() === '23505') {
                return response()->json([
                    'success' => false,
                    'message' => 'El docente ya esta asignado a esta edicion.',
                ], 409);
            }

            throw $error;
        }

        return response()->json([
            'success' => true,
            'message' => 'Docente asignado correctamente.',
            'data' => $edicion->load('docentes'),
        ], 201);
    }

    // ========================================
    // QUITAR DOCENTE DE EDICION
    // ========================================

    public function quitarDocente(int $id, int $idDoc)
    {
        $edicion = EdicionPrograma::find($id);

        if (!$edicion) {
            return response()->json([
                'success' => false,
                'message' => 'Edicion no encontrada.',
            ], 404);
        }

        if (!$edicion->docentes()
            ->wherePivot('id_doc', $idDoc)
            ->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'El docente no esta asignado a esta edicion.',
            ], 404);
        }

        $edicion->docentes()->detach($idDoc);

        return response()->json([
            'success' => true,
            'message' => 'Docente retirado de la edicion.',
        ], 200);
    }

    // ========================================
    // ELIMINAR DOCENTE
    // ========================================

    public function eliminarDocente(int $id)
    {
        $docente = Docente::find($id);

        if (!$docente) {
            return response()->json([
                'success' => false,
                'message' => 'Docente no encontrado.',
            ], 404);
        }

        if ($docente->ediciones()->exists()) {
            return response()->json([
                'success' => false,
                'message' =>
                'No se puede eliminar un docente asignado a ediciones.',
            ], 409);
        }

        try {
            $docente->delete();
        } catch (QueryException $error) {
            if ($error->getCode() === '23503') {
                return response()->json([
                    'success' => false,
                    'message' => 'El docente tiene registros relacionados.',
                ], 409);
            }

            throw $error;
        }

        return response()->json([
            'success' => true,
            'message' => 'Docente eliminado correctamente.',
        ], 200);
    }


    // ========================================
    // DESACTIVAR DOCENTE
    // ========================================

    public function desactivarDocente(int $id)
    {
        $docente = Docente::find($id);

        if (!$docente) {
            return response()->json([
                'success' => false,
                'message' => 'Docente no encontrado.',
            ], 404);
        }

        if (!$docente->activo) {
            return response()->json([
                'success' => false,
                'message' => 'El docente ya está inactivo.',
            ], 409);
        }

        $docente->activo = false;
        $docente->save();

        return response()->json([
            'success' => true,
            'message' => 'Docente desactivado correctamente.',
            'data' => $docente,
        ], 200);
    }

    // ========================================
    // REACTIVAR DOCENTE
    // ========================================

    public function reactivarDocente(int $id)
    {
        $docente = Docente::find($id);

        if (!$docente) {
            return response()->json([
                'success' => false,
                'message' => 'Docente no encontrado.',
            ], 404);
        }

        if ($docente->activo) {
            return response()->json([
                'success' => false,
                'message' => 'El docente ya está activo.',
            ], 409);
        }

        $docente->activo = true;
        $docente->save();

        return response()->json([
            'success' => true,
            'message' => 'Docente reactivado correctamente.',
            'data' => $docente,
        ], 200);
    }
}
