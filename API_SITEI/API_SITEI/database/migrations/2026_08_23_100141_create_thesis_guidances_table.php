<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('thesis_guidances', function (Blueprint $table) {
            $table->id();

            // Residen (mahasiswa) yang dibimbing
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Dosen pembimbing yang menginput (opsional, untuk jejak audit)
            $table->foreignId('lecturer_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');

            $table->string('judul_tesis')->nullable();

            $table->enum('tahap', [
                'Penyusunan Proposal',
                'Seminar Proposal',
                'Penelitian & Pengambilan Data',
                'Seminar Hasil',
                'Ujian Akhir Tesis',
                'Revisi Naskah',
                'Lainnya',
            ])->default('Lainnya');

            $table->date('tanggal');
            $table->text('keterangan');

            // Karena diinput langsung oleh dosen, default langsung verified/diparaf
            $table->string('status')->default('verified');

            $table->timestamps();

            $table->index(['user_id', 'tanggal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('thesis_guidances');
    }
};