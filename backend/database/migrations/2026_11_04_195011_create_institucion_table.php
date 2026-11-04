<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('institucion', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_carrera')->default('Carrera de Estadística');
            $table->string('direccion', 500)->nullable();
            $table->string('email')->nullable();
            $table->string('telefono')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('horarios_atencion')->nullable();
            $table->string('director')->nullable();
            $table->string('campus_virtual_url', 500)->nullable();
            $table->text('descripcion_ieta')->nullable();
            $table->text('descripcion_club')->nullable();
            $table->timestamps();
        });

        // Insert singleton row
        DB::table('institucion')->insert([
            'nombre_carrera' => 'Carrera de Estadística - Universidad Mayor de San Andrés',
            'direccion' => 'Campus Universitario Cota Cota, Calle 27, Edificio FCPN - Carrera de Estadística, La Paz - Bolivia',
            'email' => 'estapost@fcpn.edu.bo',
            'telefono' => '+591 (2) 279-2999',
            'whatsapp' => '+591 76543210',
            'horarios_atencion' => 'Lunes a Viernes 08:30 - 18:30',
            'director' => 'Dirección de la Carrera de Estadística y Posgrado',
            'campus_virtual_url' => 'https://maestria.estadistica.fcpn.edu.bo',
            'descripcion_ieta' => 'Instituto de Estadística Teórica y Aplicada (IETA): Centro de investigación cuantitativa avanzada y consultoría estadística aplicada para el desarrollo nacional.',
            'descripcion_club' => 'Club Científico de Estadística: Comunidad estudiantil y académica de investigación formativa, semilleros y proyectos de ciencia de datos.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institucion');
    }
};
