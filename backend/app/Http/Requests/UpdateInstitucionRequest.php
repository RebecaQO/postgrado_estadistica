<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInstitucionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Support frontend aliases
        $merge = [];
        if ($this->has('email_principal') && !$this->has('email')) {
            $merge['email'] = $this->email_principal;
        }
        if ($this->has('horario_atencion') && !$this->has('horarios_atencion')) {
            $merge['horarios_atencion'] = $this->horario_atencion;
        }
        if ($this->has('director_nombre') && !$this->has('director')) {
            $merge['director'] = $this->director_nombre;
        }
        if ($this->has('ieta_descripcion') && !$this->has('descripcion_ieta')) {
            $merge['descripcion_ieta'] = $this->ieta_descripcion;
        }
        if ($this->has('club_cientifico_descripcion') && !$this->has('descripcion_club')) {
            $merge['descripcion_club'] = $this->club_cientifico_descripcion;
        }
        if (!empty($merge)) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'nombre_carrera' => 'sometimes|string|max:255',
            'direccion' => 'nullable|string|max:500',
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:100',
            'whatsapp' => 'nullable|string|max:100',
            'horarios_atencion' => 'nullable|string|max:255',
            'director' => 'nullable|string|max:255',
            'campus_virtual_url' => 'nullable|url|max:500',
            'descripcion_ieta' => 'nullable|string',
            'descripcion_club' => 'nullable|string',
        ];
    }
}
