<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUsuarioRequest;
use App\Http\Requests\UpdateUsuarioRequest;
use App\Http\Resources\UsuarioResource;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Usuario::query()->orderBy('id_usuario', 'asc');
        $usuarios = $request->has('page') ? $query->paginate(20) : $query->get();
        return UsuarioResource::collection($usuarios);
    }

    public function store(StoreUsuarioRequest $request): JsonResponse
    {
        $datos = $request->validated();
        $datos['password'] = Hash::make($datos['password']);
        if (!isset($datos['activo'])) {
            $datos['activo'] = true;
        }

        $usuario = Usuario::create($datos);

        return (new UsuarioResource($usuario))
            ->response()
            ->setStatusCode(201);
    }

    public function show(int $id): UsuarioResource|JsonResponse
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        return new UsuarioResource($usuario);
    }

    public function update(UpdateUsuarioRequest $request, int $id): UsuarioResource|JsonResponse
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $datos = $request->validated();
        if (!empty($datos['password'])) {
            $datos['password'] = Hash::make($datos['password']);
        } else {
            unset($datos['password']);
        }

        $usuario->update($datos);

        return new UsuarioResource($usuario);
    }

    public function destroy(Request $request, int $id): Response|JsonResponse
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $currentUser = $request->user();
        if ($currentUser && $currentUser->id_usuario === $usuario->id_usuario) {
            return response()->json(['message' => 'No puedes eliminarte a ti mismo'], 409);
        }

        if ($usuario->rol === 'admin') {
            $adminActivos = Usuario::where('rol', 'admin')->where('activo', true)->count();
            if ($adminActivos <= 1) {
                return response()->json(['message' => 'No se puede eliminar el último administrador'], 409);
            }
        }

        $usuario->delete();

        return response()->noContent();
    }

    public function desactivar(int $id): UsuarioResource|JsonResponse
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        if ($usuario->rol === 'admin') {
            $adminActivos = Usuario::where('rol', 'admin')->where('activo', true)->count();
            if ($adminActivos <= 1) {
                return response()->json(['message' => 'No se puede desactivar el último administrador'], 409);
            }
        }

        $usuario->update(['activo' => false]);

        return new UsuarioResource($usuario);
    }

    public function reactivar(int $id): UsuarioResource|JsonResponse
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $usuario->update(['activo' => true]);

        return new UsuarioResource($usuario);
    }
}
