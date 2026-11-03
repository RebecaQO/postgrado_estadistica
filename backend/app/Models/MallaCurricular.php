<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MallaCurricular extends Model
{
    // Tabla de PostgreSQL
    protected $table = 'malla_curricular';

    // Clave primaria
    protected $primaryKey = 'id_malla';

    // ID autoincremental
    public $incrementing = true;

    // Tipo de identificador BIGINT
    protected $keyType = 'int';

    // La tabla no tiene timestamps
    public $timestamps = false;

    // Campos permitidos
    protected $fillable = [
        'nombre_malla',
        'id_programa',
    ];

    // Conversion de tipos
    protected $casts = [
        'id_malla' => 'integer',
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

    // ========================================
    // RELACION CON MODULOS DE MAESTRIA
    // ========================================

    public function modulos()
    {
        return $this->hasMany(
            Modulo::class,
            'id_malla',
            'id_malla'
        );
    }

    // ========================================
    // RELACION CON MATERIAS DE DIPLOMADO
    // ========================================

    public function materiasDiplomado()
    {
        return $this->belongsToMany(
            ModuloDiplomado::class,
            'integra',
            'id_malla',
            'id_mat',
            'id_malla',
            'id_mat'
        )->withPivot([
            'creditos',
            'carga_horaria',
        ]);
    }

    // ========================================
    // RELACION CON EDICIONES
    // ========================================

    public function ediciones()
    {
        return $this->hasMany(
            EdicionPrograma::class,
            'id_malla',
            'id_malla'
        );
    }
}
