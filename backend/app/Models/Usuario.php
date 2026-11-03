<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens;

    // Tabla de PostgreSQL.
    protected $table = 'usuarios';

    // Clave primaria personalizada.
    protected $primaryKey = 'id_usuario';

    // ID autoincremental.
    public $incrementing = true;

    protected $keyType = 'int';

    // Fechas de creación y actualización.
    public $timestamps = true;

    // Campos permitidos.
    protected $fillable = [
        'nombre',
        'password',
        'rol',
    ];

    // Ocultar información sensible.
    protected $hidden = [
        'password',
    ];

    // Conversión de tipos.
    protected function casts(): array
    {
        return [
            'id_usuario' => 'integer',
            'password' => 'hashed',
        ];
    }

    // Verificar rol administrador.
    public function esAdministrador(): bool
    {
        return $this->rol === 'admin';
    }

    // Verificar rol usuario.
    public function esUsuario(): bool
    {
        return $this->rol === 'usuario';
    }
}
