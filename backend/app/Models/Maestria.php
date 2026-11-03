<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Maestria extends Model
{
    // Tabla de PostgreSQL
    protected $table = 'maestria';

    // Clave primaria compartida con ProgramaPostgrado
    protected $primaryKey = 'id_programa';

    // No genera ID propio
    public $incrementing = false;

    // El ID ahora es BIGINT
    protected $keyType = 'int';

    // La tabla no tiene timestamps
    public $timestamps = false;

    // Campos permitidos
    protected $fillable = [
        'id_programa',
        'tipo',
    ];

    // Conversion de tipos
    protected $casts = [
        'id_programa' => 'integer',
    ];

    // ========================================
    // RELACION CON PROGRAMA DE POSTGRADO
    // ========================================

    public function programa()
    {
        return $this->belongsTo(
            ProgramaPostgrado::class,
            'id_programa',
            'id_programa'
        );
    }
}
