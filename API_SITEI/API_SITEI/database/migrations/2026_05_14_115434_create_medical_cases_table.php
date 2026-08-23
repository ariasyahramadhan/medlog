<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up() {
        Schema::create('medical_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('tanggal_tindakan');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->integer('umur');
            $table->json('diagnosis'); 
            $table->string('tindakan');
            $table->enum('jenis_kasus', ['Elektif', 'Non-Elektif']);
            $table->string('jenis_anestesi');
            $table->string('dpjp_name'); 
            $table->text('catatan')->nullable();
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('medical_cases');
    }
};
