<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guidance_counselings', function (Blueprint $table) {
            $table->id();
            // Terhubung ke mahasiswa yang mengajukan bimbingan
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('tanggal'); // Sesuai kolom TANGGAL
            $table->text('keterangan'); // Sesuai kolom KETERANGAN
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending'); // Sesuai kolom PARAF
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guidance_counselings');
    }
};