<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dops_evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // ID Dokter Residen
            $table->foreignId('lecturer_id')->constrained('users')->onDelete('cascade'); // ID Konsulen Penguji
            $table->string('jenis_dops'); // 'cvc_femoral', 'anestesi_umum', 'anestesi_regional', 'cvc_subclavia'
            $table->date('tanggal');
            $table->json('scores'); // Menyimpan item penilaian dan poin skor secara dinamis
            $table->integer('total_skor')->default(0);
            $table->enum('status_kelayakan', ['LAYAK', 'TIDAK LAYAK'])->default('TIDAK LAYAK');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dops_evaluations');
    }
};