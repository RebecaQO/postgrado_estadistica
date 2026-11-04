<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Institucion extends Model
{
    protected $table = 'institucion';

    protected $fillable = [
        'nombre_carrera',
        'direccion',
        'email',
        'telefono',
        'whatsapp',
        'horarios_atencion',
        'director',
        'campus_virtual_url',
        'descripcion_ieta',
        'descripcion_club',
    ];

    protected $appends = [
        'email_principal',
        'horario_atencion',
        'director_nombre',
        'ieta_descripcion',
        'club_cientifico_descripcion',
    ];

    public function getEmailPrincipalAttribute(): ?string
    {
        return $this->attributes['email'] ?? null;
    }

    public function getHorarioAtencionAttribute(): ?string
    {
        return $this->attributes['horarios_atencion'] ?? null;
    }

    public function getDirectorNombreAttribute(): ?string
    {
        return $this->attributes['director'] ?? null;
    }

    public function getIetaDescripcionAttribute(): ?string
    {
        return $this->attributes['descripcion_ieta'] ?? null;
    }

    public function getClubCientificoDescripcionAttribute(): ?string
    {
        return $this->attributes['descripcion_club'] ?? null;
    }
}
