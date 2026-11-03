<?php

namespace App\Http\Controllers;

use App\Models\ProgramaPostgrado;
use App\Models\MallaCurricular;
use App\Models\Modulo;
use App\Models\Materia;
use App\Models\MateriaMaestria;
use App\Models\ModuloDiplomado;
use App\Models\EdicionPrograma;
use App\Models\Docente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class RegistroAcademicoController extends Controller
{
    // ============================================
    // REGISTRO ACADEMICO COMPLETO
    // ============================================

    public function registrar(Request $request)
    {
        $tipo = $request->input('programa.tipo_programa');

        $validator = Validator::make($request->all(), [

            // ====================================
            // PASO 1: PROGRAMA
            // ====================================

            'programa' => ['required', 'array'],

            'programa.nombre_programa' => [
                'required', 'string', 'max:150',
            ],

            'programa.descripcion' => [
                'required', 'string',
            ],

            'programa.tipo_programa' => [
                'required',
                Rule::in(['Maestria', 'Diplomado']),
            ],

            'programa.tipo_maestria' => [
                Rule::requiredIf($tipo === 'Maestria'),
                'nullable',
                Rule::in(['Terminal', 'Autosostenible']),
            ],

            // Campos academicos del programa

            'programa.area_conocimiento' => [
                'nullable', 'string', 'max:150',
            ],

            'programa.mencion' => [
                'nullable', 'string', 'max:150',
            ],

            'programa.perfil_aspirante' => [
                'nullable', 'string',
            ],

            'programa.perfil_egreso' => [
                'nullable', 'string',
            ],

            'programa.enlace_pdf_programa' => [
                'nullable', 'url', 'max:2048',
            ],

            // ====================================
            // PASO 2: MALLA
            // ====================================

            'malla' => ['required', 'array'],

            'malla.nombre_malla' => [
                'required', 'string', 'max:150',
            ],

            // ====================================
            // PASO 3A: MODULOS DE MAESTRIA
            // ====================================

            'malla.modulos' => [
                Rule::requiredIf($tipo === 'Maestria'),
                'array',
                'min:1',
            ],

            'malla.modulos.*.nombre_mod' => [
                'required', 'string', 'max:150',
            ],

            'malla.modulos.*.materias' => [
                'required', 'array', 'min:1',
            ],

            'malla.modulos.*.materias.*.id_mat' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('materia_maestria', 'id_mat'),
            ],

            'malla.modulos.*.materias.*.nombre_mat' => [
                'sometimes', 'string', 'max:150',
            ],

            'malla.modulos.*.materias.*.descripcion' => [
                'sometimes', 'string',
            ],

            'malla.modulos.*.materias.*.creditos' => [
                'required', 'integer', 'min:1',
            ],

            'malla.modulos.*.materias.*.carga_horaria' => [
                'required', 'integer', 'min:1',
            ],

            // ====================================
            // PASO 3B: MATERIAS DE DIPLOMADO
            // ====================================

            'malla.materias' => [
                Rule::requiredIf($tipo === 'Diplomado'),
                'array',
                'min:1',
            ],

            'malla.materias.*.id_mat' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('modulo_diplomado', 'id_mat'),
            ],

            'malla.materias.*.nombre_mat' => [
                'sometimes', 'string', 'max:150',
            ],

            'malla.materias.*.descripcion' => [
                'sometimes', 'string',
            ],

            'malla.materias.*.creditos' => [
                'required', 'integer', 'min:1',
            ],

            'malla.materias.*.carga_horaria' => [
                'required', 'integer', 'min:1',
            ],

            // ====================================
            // PASO 4: EDICION
            // ====================================

            'edicion' => ['required', 'array'],

            // Nuevo nombre identificativo de la edicion

            'edicion.nombre_edicion' => [
                'required', 'string', 'max:100',
            ],

            'edicion.fecha_inicio' => [
                'required', 'date_format:Y-m-d',
            ],

            'edicion.fecha_fin' => [
                'required',
                'date_format:Y-m-d',
                'after_or_equal:edicion.fecha_inicio',
            ],

            'edicion.duracion' => [
                'required', 'string', 'max:100',
            ],

            'edicion.horario' => [
                'required', 'string', 'max:150',
            ],

            'edicion.descripcion' => [
                'required', 'string',
            ],

            'edicion.modalidad_titulacion' => [
                'required', 'string',
            ],

            'edicion.requisitos' => [
                'required', 'string',
            ],

            'edicion.convocatoria' => [
                'required', 'string',
            ],

            'edicion.formulario' => [
                'required', 'string',
            ],

            'edicion.estado' => [
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

            // ====================================
            // PASO 5: DOCENTES
            // ====================================

            'docentes' => [
                'sometimes', 'array',
            ],

            'docentes.*.id_doc' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('docente', 'id_doc'),
            ],

            'docentes.*.nombre_doc' => [
                'sometimes', 'string', 'max:100',
            ],

            'docentes.*.apellido_doc' => [
                'sometimes', 'string', 'max:100',
            ],

            'docentes.*.foto' => [
                'nullable', 'string',
            ],
        ]);

        // ====================================
        // VALIDACIONES ADICIONALES
        // ====================================

        $validator->after(function ($validator) use ($request, $tipo) {

            if (!in_array($tipo, ['Maestria', 'Diplomado'], true)) {
                return;
            }

            $malla = $request->input('malla', []);

            if (!is_array($malla)) {
                return;
            }

            if ($tipo === 'Maestria') {

                if (array_key_exists('materias', $malla)) {
                    $validator->errors()->add(
                        'malla.materias',
                        'Las materias de maestria deben estar dentro de modulos.'
                    );
                }

                $modulos = $malla['modulos'] ?? [];

                if (is_array($modulos)) {
                    foreach ($modulos as $i => $modulo) {

                        if (!is_array($modulo)) {
                            continue;
                        }

                        $this->validarItems(
                            $validator,
                            $modulo['materias'] ?? [],
                            "malla.modulos.$i.materias",
                            'id_mat',
                            ['nombre_mat', 'descripcion']
                        );
                    }
                }

            } else {

                if (array_key_exists('modulos', $malla)) {
                    $validator->errors()->add(
                        'malla.modulos',
                        'Los diplomados utilizan materias directamente en la malla.'
                    );
                }

                $this->validarItems(
                    $validator,
                    $malla['materias'] ?? [],
                    'malla.materias',
                    'id_mat',
                    ['nombre_mat', 'descripcion']
                );
            }

            $this->validarItems(
                $validator,
                $request->input('docentes', []),
                'docentes',
                'id_doc',
                ['nombre_doc', 'apellido_doc']
            );
        });

        $datos = $validator->validate();

        // ====================================
        // TRANSACCION DE BASE DE DATOS
        // ====================================

        $resultado = DB::transaction(function () use ($datos) {

            $datosPrograma = $datos['programa'];

            // ====================================
            // PASO 1: CREAR PROGRAMA
            // ====================================

            $programa = ProgramaPostgrado::create([
                'nombre_programa' =>
                    $datosPrograma['nombre_programa'],

                'descripcion' =>
                    $datosPrograma['descripcion'],

                'tipo_programa' =>
                    $datosPrograma['tipo_programa'],

                'area_conocimiento' =>
                    $datosPrograma['area_conocimiento'] ?? null,

                'mencion' =>
                    $datosPrograma['mencion'] ?? null,

                'perfil_aspirante' =>
                    $datosPrograma['perfil_aspirante'] ?? null,

                'perfil_egreso' =>
                    $datosPrograma['perfil_egreso'] ?? null,

                'enlace_pdf_programa' =>
                    $datosPrograma['enlace_pdf_programa'] ?? null,
            ]);

            $tipoPrograma = $programa->tipo_programa;

            if ($tipoPrograma === 'Maestria') {

                $programa->maestria()->create([
                    'tipo' => $datosPrograma['tipo_maestria'],
                ]);

            } else {

                $programa->diplomado()->create([]);
            }

            // ====================================
            // PASO 2: CREAR MALLA
            // ====================================

            $malla = MallaCurricular::create([
                'nombre_malla' => $datos['malla']['nombre_malla'],
                'id_programa' => $programa->id_programa,
            ]);

            // ====================================
            // PASO 3: CREAR ESTRUCTURA ACADEMICA
            // ====================================

            $idsModulos = [];
            $idsMaterias = [];

            if ($tipoPrograma === 'Maestria') {

                foreach ($datos['malla']['modulos'] as $itemModulo) {

                    $modulo = Modulo::create([
                        'nombre_mod' => $itemModulo['nombre_mod'],
                        'id_malla' => $malla->id_malla,
                    ]);

                    $idsModulos[] = $modulo->id_mod;
                    $idsEnModulo = [];

                    foreach ($itemModulo['materias'] as $itemMateria) {

                        if (isset($itemMateria['id_mat'])) {
                            $idMateria = $itemMateria['id_mat'];
                        } else {

                            $materia = Materia::create([
                                'nombre_mat' => $itemMateria['nombre_mat'],
                                'descripcion' => $itemMateria['descripcion'],
                            ]);

                            MateriaMaestria::create([
                                'id_mat' => $materia->id_mat,
                            ]);

                            $idMateria = $materia->id_mat;
                        }

                        if (in_array($idMateria, $idsEnModulo)) {
                            throw ValidationException::withMessages([
                                'malla.modulos' =>
                                    'Una materia no puede repetirse dentro del mismo modulo.',
                            ]);
                        }

                        $idsEnModulo[] = $idMateria;
                        $idsMaterias[] = $idMateria;

                        $modulo->materias()->attach($idMateria, [
                            'creditos' => $itemMateria['creditos'],
                            'carga_horaria' => $itemMateria['carga_horaria'],
                        ]);
                    }
                }

            } else {

                $idsEnMalla = [];

                foreach ($datos['malla']['materias'] as $itemMateria) {

                    if (isset($itemMateria['id_mat'])) {
                        $idMateria = $itemMateria['id_mat'];
                    } else {

                        $materia = Materia::create([
                            'nombre_mat' => $itemMateria['nombre_mat'],
                            'descripcion' => $itemMateria['descripcion'],
                        ]);

                        ModuloDiplomado::create([
                            'id_mat' => $materia->id_mat,
                        ]);

                        $idMateria = $materia->id_mat;
                    }

                    if (in_array($idMateria, $idsEnMalla)) {
                        throw ValidationException::withMessages([
                            'malla.materias' =>
                                'Una materia no puede repetirse dentro de la misma malla.',
                            ]);
                    }

                    $idsEnMalla[] = $idMateria;
                    $idsMaterias[] = $idMateria;

                    $malla->materiasDiplomado()->attach(
                        $idMateria,
                        [
                            'creditos' => $itemMateria['creditos'],
                            'carga_horaria' => $itemMateria['carga_horaria'],
                        ]
                    );
                }
            }

            // ====================================
            // PASO 4: CREAR EDICION
            // ====================================

            $datosEdicion = $datos['edicion'];

            $edicion = EdicionPrograma::create([
                'nombre_edicion' =>
                    $datosEdicion['nombre_edicion'],

                'fecha_inicio' => $datosEdicion['fecha_inicio'],
                'fecha_fin' => $datosEdicion['fecha_fin'],
                'duracion' => $datosEdicion['duracion'],
                'horario' => $datosEdicion['horario'],
                'descripcion' => $datosEdicion['descripcion'],

                'modalidad_titulacion' =>
                    $datosEdicion['modalidad_titulacion'],

                'requisitos' => $datosEdicion['requisitos'],
                'convocatoria' => $datosEdicion['convocatoria'],
                'formulario' => $datosEdicion['formulario'],

                'estado' =>
                    $datosEdicion['estado'] ?? 'En Proceso',

                'id_programa' => $programa->id_programa,
                'id_malla' => $malla->id_malla,
            ]);

            // ====================================
            // PASO 5: REGISTRAR Y ASIGNAR DOCENTES
            // ====================================

            $idsDocentes = [];

            foreach ($datos['docentes'] ?? [] as $itemDocente) {

                if (isset($itemDocente['id_doc'])) {
                    $idDocente = $itemDocente['id_doc'];
                } else {

                    $docente = Docente::create([
                        'nombre_doc' => $itemDocente['nombre_doc'],
                        'apellido_doc' => $itemDocente['apellido_doc'],
                        'foto' => $itemDocente['foto'] ?? null,
                    ]);

                    $idDocente = $docente->id_doc;
                }

                if (in_array($idDocente, $idsDocentes)) {
                    throw ValidationException::withMessages([
                        'docentes' =>
                            'Un docente no puede asignarse dos veces a la misma edicion.',
                    ]);
                }

                $idsDocentes[] = $idDocente;
                $edicion->docentes()->attach($idDocente);
            }

            // ====================================
            // CONSULTAR RESULTADO COMPLETO
            // ====================================

            $edicion->load([
                'programa.maestria',
                'programa.diplomado',
                'malla.modulos.materias.materia',
                'malla.materiasDiplomado.materia',
                'docentes',
            ]);

            return [
                'id_programa' => $programa->id_programa,
                'id_malla' => $malla->id_malla,
                'ids_modulos' => $idsModulos,
                'ids_materias' => $idsMaterias,
                'id_edicion' => $edicion->id_edicion,
                'ids_docentes' => $idsDocentes,
                'registro' => $edicion,
            ];
        });

        return response()->json([
            'success' => true,
            'message' =>
                'Registro academico completo creado correctamente.',
            'data' => $resultado,
        ], 201);
    }

    // ============================================
    // VALIDAR REGISTROS NUEVOS O EXISTENTES
    // ============================================

    private function validarItems(
        $validator,
        $items,
        string $ruta,
        string $campoId,
        array $camposNuevos
    ): void {
        if (!is_array($items)) {
            return;
        }

        foreach ($items as $i => $item) {

            if (!is_array($item)) {
                continue;
            }

            $tieneId = isset($item[$campoId]);

            if ($tieneId) {

                foreach ($camposNuevos as $campo) {

                    if (array_key_exists($campo, $item)) {
                        $validator->errors()->add(
                            "$ruta.$i.$campo",
                            'No envies datos de creacion cuando seleccionas un registro existente.'
                        );
                    }
                }

            } else {

                foreach ($camposNuevos as $campo) {

                    if (
                        !isset($item[$campo]) ||
                        !is_string($item[$campo]) ||
                        trim($item[$campo]) === ''
                    ) {
                        $validator->errors()->add(
                            "$ruta.$i.$campo",
                            'Este campo es obligatorio para un registro nuevo.'
                        );
                    }
                }
            }
        }
    }
}
