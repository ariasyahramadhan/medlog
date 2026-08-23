<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('tanggal'); // Sesuai kolom TGL
            $table->text('kegiatan_ilmiah'); // Sesuai kolom KEGIATAN ILMIAH
            $table->string('penanggung_jawab'); // Sesuai kolom PENANGGUNG JAWAB
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending'); // Sesuai kolom PARAF
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_activities');
    }
};