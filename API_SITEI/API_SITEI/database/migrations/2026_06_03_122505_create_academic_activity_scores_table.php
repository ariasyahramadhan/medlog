<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_activity_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_activity_id')->constrained('academic_activities')->onDelete('cascade');
            $table->string('tahap_semester')->nullable();
            $table->string('judul_resmi')->nullable();
            
            // Komponen Rubrik Form Nilai Ilmiah
            $table->integer('persiapan_bahan')->default(0);
            $table->integer('persiapan_narsum')->default(0);
            $table->integer('makalah_judul')->default(0);
            $table->integer('makalah_isi')->default(0);
            $table->integer('makalah_pembahasan')->default(0);
            $table->integer('penampilan_cara')->default(0);
            $table->integer('penampilan_kuasa')->default(0);
            $table->integer('diskusi_teori')->default(0);
            $table->integer('diskusi_kemampuan')->default(0);
            
            // Hasil Kelulusan
            $table->integer('nilai_akhir')->default(0);
            $table->enum('kesimpulan', ['Lulus', 'Gagal'])->default('Gagal');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_activity_scores');
    }
};