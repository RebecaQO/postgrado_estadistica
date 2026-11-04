<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AutenticacionController extends Controller
{
    // ==========================================
    // INICIAR SESION
    // ==========================================

    public function loginApi(Request $request)
    {
        // Validar que se reciba password y al menos nombre o email.
        $datos = $request->validate([
            'password' => ['required', 'string'],
        ]);

        $identifier = $request->input('nombre') ?? $request->input('email');
        if (empty($identifier)) {
            return response()->json([
                'message' => 'The nombre or email field is required.',
                'errors' => [
                    'nombre' => ['The nombre field is required when email is not present.'],
                ],
            ], 422);
        }

        // Buscar el usuario en PostgreSQL por nombre de usuario o correo electronico.
        $usuario = Usuario::where('nombre', $identifier)
            ->orWhere('email', $identifier)
            ->first();

        // Comprobar usuario y contraseña.
        if (
            !$usuario ||
            !Hash::check(
                $datos['password'],
                $usuario->password
            )
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

        // Aceptar solamente los roles existentes.
        if (!in_array(
            $usuario->rol,
            ['admin', 'usuario'],
            true
        )) {
            return response()->json([
                'success' => false,
                'message' => 'La cuenta no tiene un rol válido.',
            ], 403);
        }

        // Generar un token de autenticación Sanctum.
        $token = $usuario->createToken(
            'portal-postgrado'
        )->plainTextToken;

        // Responder al frontend.
        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión correcto.',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $usuario->id_usuario,
                'nombre' => $usuario->nombre,
                'role' => $usuario->rol,
            ],
        ], 200);
    }

    // ==========================================
    // OBTENER USUARIO AUTENTICADO
    // ==========================================

    public function perfilApi(Request $request)
    {
        $usuario = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'Usuario autenticado.',
            'user' => [
                'id' => $usuario->id_usuario,
                'nombre' => $usuario->nombre,
                'role' => $usuario->rol,
            ],
        ], 200);
    }

    // ==========================================
    // CERRAR SESION
    // ==========================================

    public function logoutApi(Request $request)
    {
        // Obtener el token usado en esta petición.
        $token = $request->user()->currentAccessToken();

        // Revocar el token actual.
        if ($token && method_exists($token, 'delete')) {
            $token->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada correctamente.',
        ], 200);
    }
}
