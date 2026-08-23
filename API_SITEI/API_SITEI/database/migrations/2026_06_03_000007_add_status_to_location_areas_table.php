<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('location_areas', function (Blueprint $table) {
            $table->enum('status', ['approved', 'pending', 'rejected'])->default('approved')->after('type');
        });
    }

    public function down()
    {
        Schema::table('location_areas', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
