<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuloDiplomado extends Model
{
    // Tabla de PostgreSQL
    protected $table = 'modulo_diplomado';

    // Clave primaria compartida con Materia
    protected $primaryKey = 'id_mat';

    // No genera un ID propio
    public $incrementing = false;

    // Tipo de identificador BIGINT
    protected $keyType = 'int';

    // La tabla no utiliza timestamps
    public $timestamps = false;

    // Campos permitidos
    protected $fillable = [
        'id_mat',
    ];

    // Conversion de tipos
    protected $casts = [
        'id_mat' => 'integer',
    ];

    // ========================================
    // RELACION CON MATERIA
    // ========================================

    public function materia()
    {
        return $this->belongsTo(
            Materia::class,
            'id_mat',
            'id_mat'
        );
    }

    // ========================================
    // RELACION CON MALLAS CURRICULARES
    // ========================================

    public function mallas()
    {
        return $this->belongsToMany(
            MallaCurricular::class,
            'integra',
            'id_mat',
            'id_malla',
            'id_mat',
            'id_malla'
        )->withPivot([
            'creditos',
            'carga_horaria',
        ]);
    }
}
