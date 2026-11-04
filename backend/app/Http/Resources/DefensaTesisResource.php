<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DefensaTesisResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id_defensa,
            'id_defensa' => $this->id_defensa,
            'id_edicion' => $this->id_edicion,
            'titulo_tesis' => $this->titulo_tesis,
            'autor' => $this->autor,
            'tutor' => $this->tutor,
            'fecha_defensa' => $this->fecha_defensa ? (is_string($this->fecha_defensa) ? $this->fecha_defensa : $this->fecha_defensa->format('Y-m-d')) : null,
            'hora_defensa' => $this->hora_defensa,
            'lugar' => $this->lugar ?? $this->lugar_defensa,
            'resultado' => $this->resultado ?? 'pendiente',
            'observaciones' => $this->observaciones,
            'edicion' => $this->whenLoaded('edicion', function () {
                return [
                    'id' => $this->edicion->id_edicion,
                    'nombre_edicion' => $this->edicion->nombre_edicion,
                    'programa' => $this->edicion->programa ? [
                        'id' => $this->edicion->programa->id_programa,
                        'nombre_programa' => $this->edicion->programa->nombre_programa,
                    ] : null,
                ];
            }),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

