<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DefensaTesis extends Model
{
    protected $table = 'defensa_tesis';

    protected $primaryKey = 'id_defensa';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = true;

    protected $fillable = [
        'id_edicion',
        'titulo_tesis',
        'autor',
        'tutor',
        'fecha_defensa',
        'hora_defensa',
        'lugar',
        'lugar_defensa',
        'resultado',
        'estado',
        'observaciones',
    ];

    protected $casts = [
        'id_defensa' => 'integer',
        'id_edicion' => 'integer',
        'fecha_defensa' => 'date:Y-m-d',
    ];

    protected $appends = [
        'id',
    ];

    public function getIdAttribute(): ?int
    {
        return $this->attributes['id_defensa'] ?? null;
    }

    public function edicion()
    {
        return $this->belongsTo(
            EdicionPrograma::class,
            'id_edicion',
            'id_edicion'
        );
    }
}
