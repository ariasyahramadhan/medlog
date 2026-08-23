<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedule_location_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained('schedules')->onDelete('cascade');
            $table->foreignId('location_area_id')->constrained('location_areas')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedule_location_areas');
    }
};
