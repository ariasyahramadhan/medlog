<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dops_evaluations', function (Blueprint $table) {
            $table->json('keterangan')->nullable()->after('scores')
                ->comment('Array keterangan per item, hanya untuk jenis CVC');
            $table->json('nilai')->nullable()->after('keterangan')
                ->comment('Array nilai per item, hanya untuk jenis Anestesi');
        });
    }

    public function down(): void
    {
        Schema::table('dops_evaluations', function (Blueprint $table) {
            $table->dropColumn(['keterangan', 'nilai']);
        });
    }
};
