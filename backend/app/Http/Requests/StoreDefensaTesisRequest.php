<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDefensaTesisRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $crear = $this->isMethod('post');

        $obligatorio = $crear ? 'required' : 'sometimes';

        return [
            'id_edicion' => [
                $crear ? 'required' : 'prohibited',
                'integer',
                Rule::exists('edicion_programa', 'id_edicion'),
            ],

            'titulo_tesis' => [
                $obligatorio,
                'required',
                'string',
                'max:255',
            ],

            'autor' => [
                $obligatorio,
                'required',
                'string',
                'max:255',
            ],

            'tutor' => [
                'nullable',
                'string',
                'max:255',
            ],

            'fecha_defensa' => [
                $obligatorio,
                'required',
                'date_format:Y-m-d',
            ],

            'hora_defensa' => [
                'nullable',
                'date_format:H:i',
            ],

            'lugar' => [
                'nullable',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    if ($value !== null && trim($value) === '') {
                        $fail('El lugar no puede estar vacío.');
                    }
                },
            ],

            'resultado' => [
                $obligatorio,
                'required',
                Rule::in([
                    'pendiente',
                    'aprobado',
                    'reprobado',
                ]),
            ],

            'observaciones' => [
                'nullable',
                'string',
            ],
        ];
    }
}
