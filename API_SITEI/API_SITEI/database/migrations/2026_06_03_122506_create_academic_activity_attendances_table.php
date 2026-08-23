<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_activity_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_activity_id')->constrained('academic_activities')->onDelete('cascade');
            $table->string('nama_peserta');
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_activity_attendances');
    }
};