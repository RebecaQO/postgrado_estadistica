<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EdicionPrograma extends Model
{
    // Tabla de PostgreSQL
    protected $table = 'edicion_programa';

    // Clave primaria
    protected $primaryKey = 'id_edicion';

    // ID generado automaticamente
    public $incrementing = true;

    // Tipo BIGINT
    protected $keyType = 'int';

    // La tabla no tiene timestamps
    public $timestamps = false;

    // Campos permitidos
    protected $fillable = [
        'nombre_edicion',
        'fecha_inicio',
        'fecha_fin',
        'duracion',
        'horario',
        'descripcion',
        'modalidad_titulacion',
        'requisitos',
        'convocatoria',
        'formulario',
        'estado',
        'id_malla',
        'id_programa',
    ];

    // Conversion de tipos
    protected function casts(): array
    {
        return [
            'id_edicion' => 'integer',
            'id_malla' => 'integer',
            'id_programa' => 'integer',
            'fecha_inicio' => 'date:Y-m-d',
            'fecha_fin' => 'date:Y-m-d',
        ];
    }

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

    // ========================================
    // RELACION CON MALLA CURRICULAR
    // ========================================

    public function malla()
    {
        return $this->belongsTo(
            MallaCurricular::class,
            'id_malla',
            'id_malla'
        );
    }

    // ========================================
    // RELACION CON DOCENTES
    // ========================================

    public function docentes()
    {
        return $this->belongsToMany(
            Docente::class,
            'enseña',
            'id_edicion',
            'id_doc',
            'id_edicion',
            'id_doc'
        );
    }

    // ========================================
    // RELACION CON DEFENSAS DE TESIS
    // ========================================

    public function defensas()
    {
        return $this->hasMany(
            DefensaTesis::class,
            'id_edicion',
            'id_edicion'
        );
    }
}
