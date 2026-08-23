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
            // Mengubah tipe data enum menjadi string biasa agar muat menampung teks nama stase kurikulum
            $table->string('jenis_kasus')->change(); 
        });
    }

    public function down(): void
    {
        Schema::table('medical_cases', function (Blueprint $table) {
            $table->enum('jenis_kasus', ['Elektif', 'Non-Elektif'])->change();
        });
}
};
