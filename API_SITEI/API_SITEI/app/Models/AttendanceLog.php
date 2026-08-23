<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'photo_path',
        'latitude',
        'longitude',
        'is_flagged',
        'flag_reason',
        'schedule_id',
        'location_area_id',
        'attended_at'
    ];

    protected $casts = [
        'is_flagged' => 'boolean',
        'attended_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function locationArea()
    {
        return $this->belongsTo(LocationArea::class);
    }
}
