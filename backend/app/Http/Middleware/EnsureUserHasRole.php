<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Debes iniciar sesión.',
            ], 401);
        }

        if ($user->rol !== $role) {
            return response()->json([
                'success' => false,
                'message' => 'Sin permiso',
            ], 403);
        }

        return $next($request);
    }
}
