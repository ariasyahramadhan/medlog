<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('type'); // check_in or check_out
            $table->string('photo_path')->nullable();
            $table->double('latitude')->nullable();
            $table->double('longitude')->nullable();
            $table->boolean('is_flagged')->default(false);
            $table->string('flag_reason')->nullable();
            $table->foreignId('schedule_id')->nullable()->constrained('schedules')->nullOnDelete();
            $table->foreignId('location_area_id')->nullable()->constrained('location_areas')->nullOnDelete();
            $table->timestamp('attended_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_logs');
    }
};
