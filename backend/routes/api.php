<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AutenticacionController;
use App\Http\Controllers\ProgramaPostgradoController;
use App\Http\Controllers\MaestriaController;
use App\Http\Controllers\DiplomadoController;
use App\Http\Controllers\MallaCurricularController;
use App\Http\Controllers\ModuloController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\EdicionProgramaController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\RegistroAcademicoController;

/*
|--------------------------------------------------------------------------
| API REST - PORTAL DE POSTGRADO
| CARRERA DE ESTADISTICA - UMSA
|--------------------------------------------------------------------------
|
| PUBLICO:
| - Consultar convocatorias.
| - Consultar programas con ediciones vigentes.
| - Iniciar sesion.
|
| AUTENTICADO:
| - Consultar programas y registros academicos.
|
| ADMINISTRADOR:
| - Crear y actualizar registros academicos.
| - Activar y desactivar mallas, modulos, materias y docentes.
| - Administrar ediciones y asignaciones academicas.
|
*/

// ======================================================
// 1. RUTAS PUBLICAS
// ======================================================

Route::get(
    '/convocatorias',
    [EdicionProgramaController::class, 'listarConvocatorias']
);

Route::post(
    '/auth/login',
    [AutenticacionController::class, 'loginApi']
)->middleware('throttle:5,1');

Route::get(
    '/programas/activos',
    [ProgramaPostgradoController::class, 'listarProgramasActivos']
);


// ======================================================
// 2. RUTAS AUTENTICADAS
// ======================================================

Route::middleware('auth:sanctum')->group(function () {

    // ==============================================
    // AUTENTICACION
    // ==============================================

    Route::get(
        '/auth/me',
        [AutenticacionController::class, 'perfilApi']
    );

    Route::post(
        '/auth/logout',
        [AutenticacionController::class, 'logoutApi']
    );

    // ==============================================
    // PROGRAMAS
    // ==============================================

    Route::get(
        '/programas',
        [ProgramaPostgradoController::class, 'listarProgramas']
    );

    Route::get(
        '/programas/{id}',
        [ProgramaPostgradoController::class, 'obtenerPrograma']
    );

    // ==============================================
    // MAESTRIAS
    // ==============================================

    Route::get(
        '/maestrias',
        [MaestriaController::class, 'listarMaestrias']
    );

    Route::get(
        '/maestrias/{id}',
        [MaestriaController::class, 'obtenerMaestria']
    );

    // ==============================================
    // DIPLOMADOS
    // ==============================================

    Route::get(
        '/diplomados',
        [DiplomadoController::class, 'listarDiplomados']
    );

    Route::get(
        '/diplomados/{id}',
        [DiplomadoController::class, 'obtenerDiplomado']
    );

    // ==============================================
    // MALLAS CURRICULARES
    // ==============================================

    Route::get(
        '/mallas',
        [MallaCurricularController::class, 'listarMallas']
    );

    Route::get(
        '/programas/{id}/mallas',
        [MallaCurricularController::class, 'listarMallasPorPrograma']
    );

    Route::get(
        '/programas/{id}/malla',
        [MallaCurricularController::class, 'listarMallasPorPrograma']
    );

    Route::get(
        '/mallas/{id}',
        [MallaCurricularController::class, 'obtenerMalla']
    );

    // ==============================================
    // MODULOS
    // ==============================================

    Route::get(
        '/modulos',
        [ModuloController::class, 'listarModulos']
    );

    Route::get(
        '/mallas/{id}/modulos',
        [ModuloController::class, 'listarModulosPorMalla']
    );

    Route::get(
        '/modulos/{id}',
        [ModuloController::class, 'obtenerModulo']
    );

    // ==============================================
    // MATERIAS
    // ==============================================

    Route::get(
        '/materias',
        [MateriaController::class, 'listarMaterias']
    );

    Route::get(
        '/materias/{id}',
        [MateriaController::class, 'obtenerMateria']
    );

    // ==============================================
    // EDICIONES
    // ==============================================

    Route::get(
        '/ediciones',
        [EdicionProgramaController::class, 'listarEdiciones']
    );

    Route::get(
        '/programas/{id}/ediciones',
        [EdicionProgramaController::class, 'listarEdicionesPorPrograma']
    );

    Route::get(
        '/ediciones/{id}',
        [EdicionProgramaController::class, 'obtenerEdicion']
    );

    // ==============================================
    // DOCENTES
    // ==============================================

    Route::get(
        '/docentes',
        [DocenteController::class, 'listarDocentes']
    );

    Route::get(
        '/docentes/{id}',
        [DocenteController::class, 'obtenerDocente']
    );

    Route::get(
        '/ediciones/{id}/docentes',
        [DocenteController::class, 'listarDocentesPorEdicion']
    );

    // ==================================================
    // 3. RUTAS EXCLUSIVAS DE ADMINISTRADOR
    // ==================================================

    Route::middleware('administrador')->group(function () {

        // ==========================================
        // PROGRAMAS
        // ==========================================

        Route::post(
            '/programas',
            [ProgramaPostgradoController::class, 'crearPrograma']
        );

        Route::put(
            '/programas/{id}',
            [ProgramaPostgradoController::class, 'actualizarPrograma']
        );

        Route::delete(
            '/programas/{id}',
            [ProgramaPostgradoController::class, 'eliminarPrograma']
        );

        // ==========================================
        // MAESTRIAS
        // ==========================================

        Route::put(
            '/maestrias/{id}',
            [MaestriaController::class, 'actualizarMaestria']
        );

        // ==========================================
        // MALLAS CURRICULARES
        // ==========================================

        Route::post(
            '/mallas',
            [MallaCurricularController::class, 'crearMalla']
        );

        Route::put(
            '/mallas/{id}',
            [MallaCurricularController::class, 'actualizarMalla']
        );

        Route::patch(
            '/mallas/{id}/desactivar',
            [MallaCurricularController::class, 'desactivarMalla']
        );

        Route::patch(
            '/mallas/{id}/reactivar',
            [MallaCurricularController::class, 'reactivarMalla']
        );

        // ==========================================
        // MODULOS
        // ==========================================

        Route::post(
            '/modulos',
            [ModuloController::class, 'crearModulo']
        );

        Route::put(
            '/modulos/{id}',
            [ModuloController::class, 'actualizarModulo']
        );

        Route::delete(
            '/modulos/{id}',
            [ModuloController::class, 'eliminarModulo']
        );

        Route::patch(
            '/modulos/{id}/desactivar',
            [ModuloController::class, 'desactivarModulo']
        );

        Route::patch(
            '/modulos/{id}/reactivar',
            [ModuloController::class, 'reactivarModulo']
        );

        // ==========================================
        // MATERIAS
        // ==========================================

        Route::post(
            '/materias',
            [MateriaController::class, 'crearMateria']
        );

        Route::put(
            '/materias/{id}',
            [MateriaController::class, 'actualizarMateria']
        );

        Route::post(
            '/modulos/{id}/materias',
            [MateriaController::class, 'asignarMateriaModulo']
        );

        Route::post(
            '/mallas/{id}/materias',
            [MateriaController::class, 'asignarMateriaDiplomado']
        );

        Route::patch(
            '/materias/{id}/desactivar',
            [MateriaController::class, 'desactivarMateria']
        );

        Route::patch(
            '/materias/{id}/reactivar',
            [MateriaController::class, 'reactivarMateria']
        );

        // ==========================================
        // EDICIONES
        // ==========================================

        Route::post(
            '/ediciones',
            [EdicionProgramaController::class, 'crearEdicion']
        );

        Route::put(
            '/ediciones/{id}',
            [EdicionProgramaController::class, 'actualizarEdicion']
        );

        Route::delete(
            '/ediciones/{id}',
            [EdicionProgramaController::class, 'eliminarEdicion']
        );

        // ==========================================
        // DOCENTES
        // ==========================================

        Route::post(
            '/docentes',
            [DocenteController::class, 'crearDocente']
        );

        Route::put(
            '/docentes/{id}',
            [DocenteController::class, 'actualizarDocente']
        );

        Route::delete(
            '/docentes/{id}',
            [DocenteController::class, 'eliminarDocente']
        );

        Route::patch(
            '/docentes/{id}/desactivar',
            [DocenteController::class, 'desactivarDocente']
        );

        Route::patch(
            '/docentes/{id}/reactivar',
            [DocenteController::class, 'reactivarDocente']
        );

        Route::post(
            '/ediciones/{id}/docentes',
            [DocenteController::class, 'asignarDocente']
        );

        Route::delete(
            '/ediciones/{id}/docentes/{idDoc}',
            [DocenteController::class, 'quitarDocente']
        );

        // ==========================================
        // REGISTRO ACADEMICO COMPLETO
        // ==========================================

        Route::post(
            '/registros-academicos',
            [RegistroAcademicoController::class, 'registrar']
        );
    });
});
