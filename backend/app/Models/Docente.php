<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Docente extends Model
{
    // Tabla de PostgreSQL
    protected $table = 'docente';

    // Clave primaria
    protected $primaryKey = 'id_doc';

    // ID generado automaticamente
    public $incrementing = true;

    // Tipo BIGINT
    protected $keyType = 'int';

    // La tabla no tiene timestamps
    public $timestamps = false;

    // Campos permitidos
    protected $fillable = [
        'nombre_doc',
        'apellido_doc',
        'foto',
    ];

    // Conversion de tipos
    protected $casts = [
        'id_doc' => 'integer',
    ];

    // ========================================
    // RELACION CON EDICIONES
    // ========================================

    public function ediciones()
    {
        return $this->belongsToMany(
            EdicionPrograma::class,
            'enseña',
            'id_doc',
            'id_edicion',
            'id_doc',
            'id_edicion'
        );
    }
}
