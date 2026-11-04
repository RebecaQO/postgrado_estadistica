<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstitucionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre_carrera' => $this->nombre_carrera,
            'direccion' => $this->direccion,
            'email' => $this->email,
            'email_principal' => $this->email,
            'telefono' => $this->telefono,
            'whatsapp' => $this->whatsapp,
            'horarios_atencion' => $this->horarios_atencion,
            'horario_atencion' => $this->horarios_atencion,
            'director' => $this->director,
            'director_nombre' => $this->director,
            'campus_virtual_url' => $this->campus_virtual_url,
            'descripcion_ieta' => $this->descripcion_ieta,
            'ieta_descripcion' => $this->descripcion_ieta,
            'descripcion_club' => $this->descripcion_club,
            'club_cientifico_descripcion' => $this->descripcion_club,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
