<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocationArea extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'center_lat',
        'center_lng',
        'radius_meters',
        'polygon_points',
        'status',
        'created_by'
    ];

    protected $casts = [
        'polygon_points' => 'array',
    ];

    public function schedules()
    {
        return $this->belongsToMany(Schedule::class, 'schedule_location_areas');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'location_area_user');
    }
}
