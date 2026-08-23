<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('medical_cases', function (Blueprint $table) {
            // Menambahkan kolom adaptif setelah kolom 'jenis_anestesi' yang sudah ada
            $table->string('urgensi')->nullable()->after('jenis_kasus'); // Penampung Elektif / Non-Elektif ($E/N$)
            $table->text('regimen_analgesia')->nullable()->after('jenis_anestesi'); 
            $table->string('lokasi_insersi')->nullable()->after('regimen_analgesia'); 
            $table->string('teknik_intervensi')->nullable()->after('lokasi_insersi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medical_cases', function (Blueprint $table) {
            $table->dropColumn(['urgensi', 'regimen_analgesia', 'lokasi_insersi', 'teknik_intervensi']);
        });
    }
};