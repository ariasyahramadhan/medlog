<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('mentorships', function (Blueprint $table) {
            $table->id();
            // ID Mahasiswa (Harus unik karena 1 mahasiswa 1 pembimbing)
            $table->foreignId('student_id')->unique()->constrained('users')->onDelete('cascade');
            // ID Dosen
            $table->foreignId('lecturer_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentorships');
    }
};
