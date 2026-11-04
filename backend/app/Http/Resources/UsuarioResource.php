<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UsuarioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id_usuario ?? $this->id,
            'id_usuario' => $this->id_usuario ?? $this->id,
            'nombre' => $this->nombre,
            'email' => $this->email,
            'rol' => $this->rol,
            'activo' => (bool) $this->activo,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
