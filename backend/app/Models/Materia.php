<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materia extends Model
{
    // Tabla de PostgreSQL
    protected $table = 'materia';

    // Clave primaria
    protected $primaryKey = 'id_mat';

    // ID generado automaticamente
    public $incrementing = true;

    // Tipo de identificador BIGINT
    protected $keyType = 'int';

    // La tabla no utiliza timestamps
    public $timestamps = false;

    // Campos permitidos
    protected $fillable = [
        'nombre_mat',
        'descripcion',
    ];

    // Conversion de tipos
    protected $casts = [
        'id_mat' => 'integer',
    ];

    // ========================================
    // RELACION CON MATERIA DE MAESTRIA
    // ========================================

    public function materiaMaestria()
    {
        return $this->hasOne(
            MateriaMaestria::class,
            'id_mat',
            'id_mat'
        );
    }

    // ========================================
    // RELACION CON MODULO DE DIPLOMADO
    // ========================================

    public function moduloDiplomado()
    {
        return $this->hasOne(
            ModuloDiplomado::class,
            'id_mat',
            'id_mat'
        );
    }
}
