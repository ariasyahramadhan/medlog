<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('location_areas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // radius or polygon
            $table->double('center_lat')->nullable();
            $table->double('center_lng')->nullable();
            $table->double('radius_meters')->nullable();
            $table->json('polygon_points')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('location_areas');
    }
};
