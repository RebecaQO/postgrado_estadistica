<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AutenticacionController extends Controller
{
    public function mostrarLogin(): View
    {
        return view('auth.login');
    }

    public function iniciarSesion(Request $request): RedirectResponse
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $usuario = Usuario::where('nombre', $datos['nombre'])->first();

        if (
            !$usuario ||
            !Hash::check($datos['password'], $usuario->password) ||
            (array_key_exists('activo', $usuario->getAttributes()) && !$usuario->activo)
        ) {
            return back()
                ->withErrors(['nombre' => 'Las credenciales no son válidas o la cuenta está inactiva.'])
                ->onlyInput('nombre');
        }

        Auth::login($usuario);
        $request->session()->regenerate();

        return redirect()->route('inicio');
    }

    public function mostrarInicio(Request $request): View
    {
        return view('inicio', ['usuario' => $request->user()]);
    }

    public function cerrarSesion(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

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

        if (!$usuario->activo) {
            return response()->json([
                'success' => false,
                'message' => 'La cuenta está inactiva. Contacta al administrador.',
            ], 403);
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
