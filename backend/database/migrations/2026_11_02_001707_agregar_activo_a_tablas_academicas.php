
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('programa_postgrado', function (Blueprint $table) {
            $table->boolean('activo')->default(true);
        });

        Schema::table('malla_curricular', function (Blueprint $table) {
            $table->boolean('activo')->default(true);
        });

        Schema::table('modulo', function (Blueprint $table) {
            $table->boolean('activo')->default(true);
        });

        Schema::table('materia', function (Blueprint $table) {
            $table->boolean('activo')->default(true);
        });

        Schema::table('docente', function (Blueprint $table) {
            $table->boolean('activo')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('docente', function (Blueprint $table) {
            $table->dropColumn('activo');
        });

        Schema::table('materia', function (Blueprint $table) {
            $table->dropColumn('activo');
        });

        Schema::table('modulo', function (Blueprint $table) {
            $table->dropColumn('activo');
        });

        Schema::table('malla_curricular', function (Blueprint $table) {
            $table->dropColumn('activo');
        });

        Schema::table('programa_postgrado', function (Blueprint $table) {
            $table->dropColumn('activo');
        });
    }
};
