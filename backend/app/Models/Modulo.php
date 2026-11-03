<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Modulo extends Model
{
    // Tabla de PostgreSQL
    protected $table = 'modulo';

    // Clave primaria
    protected $primaryKey = 'id_mod';

    // ID autoincremental
    public $incrementing = true;

    // Tipo de identificador BIGINT
    protected $keyType = 'int';

    // La tabla no utiliza timestamps
    public $timestamps = false;

    // Campos permitidos
    protected $fillable = [
        'nombre_mod',
        'id_malla',
    ];

    // Conversion de tipos
    protected $casts = [
        'id_mod' => 'integer',
        'id_malla' => 'integer',
    ];

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
    // RELACION CON MATERIAS DE MAESTRIA
    // ========================================

    public function materias()
    {
        return $this->belongsToMany(
            MateriaMaestria::class,
            'compone',
            'id_mod',
            'id_mat',
            'id_mod',
            'id_mat'
        )->withPivot([
            'creditos',
            'carga_horaria',
        ]);
    }
}
