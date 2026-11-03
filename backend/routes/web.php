<?php

use App\Http\Controllers\AutenticacionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS
|--------------------------------------------------------------------------
*/
Route::get('/', fn () => redirect()->route('login'));

Route::get('/login', [AutenticacionController::class, 'mostrarLogin'])->name('login');
Route::post('/login', [AutenticacionController::class, 'iniciarSesion'])
    ->middleware('throttle:5,1')
    ->name('login.store');

/*
|--------------------------------------------------------------------------
| RUTAS PARA USUARIOS AUTENTICADOS
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function (): void {
    Route::get('/inicio', [AutenticacionController::class, 'mostrarInicio'])->name('inicio');
    Route::post('/logout', [AutenticacionController::class, 'cerrarSesion'])->name('logout');
});
