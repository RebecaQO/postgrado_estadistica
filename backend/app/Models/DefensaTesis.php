<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DefensaTesis extends Model
{
    // Tabla de PostgreSQL
    protected $table = 'defensa_tesis';

    // Clave primaria
    protected $primaryKey = 'id_defensa';

    // ID generado automaticamente
    public $incrementing = true;

    // Tipo de identificador BIGINT
    protected $keyType = 'int';

    // La tabla no utiliza timestamps
    public $timestamps = false;

    // Campos permitidos
    protected $fillable = [
        'fecha_defensa',
        'hora_defensa',
        'lugar_defensa',
        'estado',
        'id_edicion',
    ];

    // Conversion de tipos
    protected function casts(): array
    {
        return [
            'id_defensa' => 'integer',
            'id_edicion' => 'integer',
            'fecha_defensa' => 'date:Y-m-d',
        ];
    }

    // ========================================
    // RELACION CON EDICION DE PROGRAMA
    // ========================================

    public function edicion()
    {
        return $this->belongsTo(
            EdicionPrograma::class,
            'id_edicion',
            'id_edicion'
        );
    }
}
