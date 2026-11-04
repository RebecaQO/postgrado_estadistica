<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramaPostgrado extends Model
{
    protected $table = 'programa_postgrado';

    protected $primaryKey = 'id_programa';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = false;

    protected $fillable = [
        'nombre_programa',
        'descripcion',
        'tipo_programa',
        'area_conocimiento',
        'mencion',
        'perfil_aspirante',
        'perfil_egreso',
        'enlace_pdf_programa',
    ];

    protected $casts = [
        'id_programa' => 'integer',
    ];

    protected $appends = [
        'id',
        'title',
        'type',
        'area',
        'description',
        'activo',
    ];

    public function getIdAttribute(): ?int
    {
        return $this->id_programa;
    }

    public function getTitleAttribute(): ?string
    {
        return $this->nombre_programa;
    }

    public function getTypeAttribute(): ?string
    {
        return $this->tipo_programa;
    }

    public function getAreaAttribute(): ?string
    {
        return $this->area_conocimiento;
    }

    public function getDescriptionAttribute(): ?string
    {
        return $this->descripcion;
    }

    public function getActivoAttribute(): bool
    {
        return true;
    }

    // ========================================
    // RELACION CON MAESTRIA
    // ========================================

    public function maestria()
    {
        return $this->hasOne(
            Maestria::class,
            'id_programa',
            'id_programa'
        );
    }

    // ========================================
    // RELACION CON DIPLOMADO
    // ========================================

    public function diplomado()
    {
        return $this->hasOne(
            Diplomado::class,
            'id_programa',
            'id_programa'
        );
    }

    // ========================================
    // RELACION CON MALLAS CURRICULARES
    // ========================================

    public function mallas()
    {
        return $this->hasMany(
            MallaCurricular::class,
            'id_programa',
            'id_programa'
        );
    }

    // ========================================
    // RELACION CON EDICIONES
    // ========================================

    public function ediciones()
    {
        return $this->hasMany(
            EdicionPrograma::class,
            'id_programa',
            'id_programa'
        );
    }
}
