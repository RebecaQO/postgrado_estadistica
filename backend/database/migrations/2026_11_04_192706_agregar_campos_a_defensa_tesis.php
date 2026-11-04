<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('defensa_tesis', function (Blueprint $table) {
            $table->string('titulo_tesis')->nullable();
            $table->string('autor')->nullable();
            $table->string('tutor')->nullable();
            $table->string('lugar')->nullable();
            $table->string('resultado')->default('pendiente');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('defensa_tesis', function (Blueprint $table) {
            $table->dropColumn([
                'titulo_tesis',
                'autor',
                'tutor',
                'lugar',
                'resultado',
                'observaciones',
                'created_at',
                'updated_at',
            ]);
        });
    }
};
