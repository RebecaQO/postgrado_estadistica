<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDefensaTesisRequest;
use App\Http\Resources\DefensaTesisResource;
use App\Models\DefensaTesis;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DefensaTesisController extends Controller
{
    private function estadoDesdeResultado(string $resultado): string
    {
        return match ($resultado) {
            'aprobado' => 'Aprobada',
            'reprobado' => 'Rechazada',
            default => 'Pendiente',
        };
    }

    private function prepararDatos(array $datos): array
    {
        if (array_key_exists('lugar', $datos)) {
            $datos['lugar_defensa'] =
                $datos['lugar'] === null
                    ? null
                    : trim($datos['lugar']);

            $datos['lugar'] = $datos['lugar_defensa'];
        }

        if (array_key_exists('resultado', $datos)) {
            $datos['estado'] =
                $this->estadoDesdeResultado(
                    $datos['resultado']
                );
        }

        return $datos;
    }

    public function index(
        Request $request
    ): AnonymousResourceCollection
    {
        $query = DefensaTesis::with([
            'edicion.programa',
        ])->orderBy('id_defensa', 'desc');

        $grupo = $request->query('grupo', 'pendientes');

        if ($grupo === 'eliminadas') {
            $query->where('activo', false);
        } else {
            $query->where('activo', true);

            if ($grupo === 'pendientes') {
                $query->where('estado', 'Pendiente');
            } elseif ($grupo === 'finalizadas') {
                $query->whereIn('estado', [
                    'Aprobada',
                    'Rechazada',
                ]);
            }
        }

        if ($request->filled('id_edicion')) {
            $query->where(
                'id_edicion',
                $request->integer('id_edicion')
            );
        }

        if ($request->filled('resultado')) {
            $query->where(
                'resultado',
                $request->input('resultado')
            );
        }

        return DefensaTesisResource::collection(
            $query->paginate(20)->withQueryString()
        );
    }

    public function show(int $id): DefensaTesisResource|JsonResponse
    {
        $defensa = DefensaTesis::with([
            'edicion.programa',
        ])->find($id);

        if (!$defensa) {
            return response()->json([
                'success' => false,
                'message' => 'Defensa de tesis no encontrada.',
            ], 404);
        }

        return new DefensaTesisResource($defensa);
    }

    public function store(
        StoreDefensaTesisRequest $request
    ): JsonResponse
    {
        $datos = $this->prepararDatos(
            $request->validated()
        );

        $datos['activo'] = true;

        $defensa = DefensaTesis::create($datos);

        return response()->json([
            'success' => true,
            'message' => 'Defensa registrada correctamente.',
            'data' => new DefensaTesisResource(
                $defensa->load('edicion.programa')
            ),
        ], 201);
    }

    public function update(
        StoreDefensaTesisRequest $request,
        int $id
    ): JsonResponse
    {
        $defensa = DefensaTesis::find($id);

        if (!$defensa) {
            return response()->json([
                'success' => false,
                'message' => 'Defensa de tesis no encontrada.',
            ], 404);
        }

        if (!$defensa->activo) {
            return response()->json([
                'success' => false,
                'message' =>
                    'No puedes editar una defensa eliminada. Primero debes restaurarla.',
            ], 409);
        }

        $datos = $this->prepararDatos(
            $request->validated()
        );

        $defensa->update($datos);

        return response()->json([
            'success' => true,
            'message' => 'Defensa actualizada correctamente.',
            'data' => new DefensaTesisResource(
                $defensa->fresh(['edicion.programa'])
            ),
        ], 200);
    }

    // DELETE = ELIMINACIÓN LÓGICA
    public function destroy(int $id): JsonResponse
    {
        $defensa = DefensaTesis::find($id);

        if (!$defensa) {
            return response()->json([
                'success' => false,
                'message' => 'Defensa no encontrada.',
            ], 404);
        }

        if (!$defensa->activo) {
            return response()->json([
                'success' => false,
                'message' => 'Esta defensa ya está eliminada.',
            ], 409);
        }

        $defensa->update([
            'activo' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' =>
                'Defensa eliminada correctamente. Puedes restaurarla desde la pestaña Eliminadas.',
        ], 200);
    }

    // RESTAURACIÓN LÓGICA
    public function reactivar(int $id): JsonResponse
    {
        $defensa = DefensaTesis::find($id);

        if (!$defensa) {
            return response()->json([
                'success' => false,
                'message' => 'Defensa no encontrada.',
            ], 404);
        }

        if ($defensa->activo) {
            return response()->json([
                'success' => false,
                'message' => 'Esta defensa ya está activa.',
            ], 409);
        }

        $defensa->update([
            'activo' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Defensa restaurada correctamente.',
            'data' => new DefensaTesisResource(
                $defensa->fresh(['edicion.programa'])
            ),
        ], 200);
    }
}
