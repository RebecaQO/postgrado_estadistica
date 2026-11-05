<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $usuarioParam = $this->route('usuario');
        $usuarioId = $usuarioParam instanceof \App\Models\Usuario
            ? $usuarioParam->id_usuario
            : $usuarioParam;

        return [
            'nombre' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('usuarios', 'nombre')->ignore($usuarioId, 'id_usuario'),
            ],
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('usuarios', 'email')->ignore($usuarioId, 'id_usuario'),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'rol' => ['sometimes', 'required', 'in:admin,usuario'],
            'activo' => ['boolean'],
        ];
    }
}
