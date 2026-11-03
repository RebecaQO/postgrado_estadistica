<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diplomado extends Model
{
    // Tabla de PostgreSQL
    protected $table = 'diplomado';

    // Clave primaria compartida con ProgramaPostgrado
    protected $primaryKey = 'id_programa';

    // No genera un ID propio
    public $incrementing = false;

    // El identificador es BIGINT
    protected $keyType = 'int';

    // La tabla no utiliza timestamps
    public $timestamps = false;

    // Campos permitidos para insercion
    protected $fillable = [
        'id_programa',
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
