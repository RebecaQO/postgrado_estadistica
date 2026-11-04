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
        'email',
        'password',
        'rol',
        'activo',
    ];

    // Ocultar información sensible.
    protected $hidden = [
        'password',
    ];

    protected $appends = [
        'id',
    ];

    public function getIdAttribute(): ?int
    {
        return $this->id_usuario;
    }

    // Conversión de tipos.
    protected function casts(): array
    {
        return [
            'id_usuario' => 'integer',
            'activo' => 'boolean',
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
