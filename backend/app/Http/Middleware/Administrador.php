<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Administrador
{
    /**
     * Verifica que el usuario autenticado
     * tenga el rol de administrador.
     *
     * Roles del sistema:
     * - admin
     * - usuario
     */
    public function handle(
        Request $request,
        Closure $next
    ): Response {

        // Obtener el usuario autenticado por Sanctum.
        $usuario = $request->user();

        // Si no existe un usuario autenticado.
        if (!$usuario) {
            return response()->json([
                'success' => false,
                'message' => 'Debes iniciar sesión.',
            ], 401);
        }

        // Verificar que tenga rol administrador.
        if (!$usuario->esAdministrador()) {
            return response()->json([
                'success' => false,
                'message' =>
                    'Acceso denegado. Solo los administradores pueden realizar esta operación.',
            ], 403);
        }

        // Autorizar la solicitud.
        return $next($request);
    }
}
