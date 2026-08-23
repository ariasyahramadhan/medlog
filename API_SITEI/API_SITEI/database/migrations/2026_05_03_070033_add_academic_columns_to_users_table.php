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
            Schema::table('users', function (Blueprint $blueprint) {
                // Menambahkan kolom department, batch, dan status setelah kolom email
                $blueprint->string('department')->nullable()->after('email');
                $blueprint->string('batch')->nullable()->after('department');
                $blueprint->enum('status', ['Aktif', 'Tidak Aktif'])->default('Aktif')->after('batch');
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
