<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MateriaMaestria extends Model
{
    // Tabla de PostgreSQL
    protected $table = 'materia_maestria';

    // Clave primaria compartida con Materia
    protected $primaryKey = 'id_mat';

    // No genera un ID propio
    public $incrementing = false;

    // Tipo de identificador BIGINT
    protected $keyType = 'int';

    // La tabla no utiliza timestamps
    public $timestamps = false;

    // Campo permitido para insercion
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
    // RELACION CON MODULOS DE MAESTRIA
    // ========================================

    public function modulos()
    {
        return $this->belongsToMany(
            Modulo::class,
            'compone',
            'id_mat',
            'id_mod',
            'id_mat',
            'id_mod'
        )->withPivot([
            'creditos',
            'carga_horaria',
        ]);
    }
}
