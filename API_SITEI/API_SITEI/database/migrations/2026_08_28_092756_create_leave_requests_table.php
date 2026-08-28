<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();

            // Residen (mahasiswa) pengaju
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Konsulen / dosen pembimbing yang berwenang menyetujui
            $table->foreignId('lecturer_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');

            $table->enum('jenis', ['Izin', 'Cuti', 'Sakit'])->default('Izin');

            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->text('alasan');

            // Path file pendukung (mis. surat sakit dari dokter), opsional
            $table->string('lampiran')->nullable();

            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('catatan_konsulen')->nullable();
            $table->timestamp('processed_at')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['lecturer_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};