<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('defensa_tesis', function (Blueprint $table) {
            $table->time('hora_defensa')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('defensa_tesis', function (Blueprint $table) {
            $table->time('hora_defensa')->nullable(false)->change();
        });
    }
};
