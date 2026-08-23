<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'days_of_week',
        'check_in_start',
        'check_in_end',
        'check_out_start',
        'check_out_end',
        'allow_home_location',
        'created_by'
    ];

    protected $casts = [
        'days_of_week' => 'array',
        'allow_home_location' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function locationAreas()
    {
        return $this->belongsToMany(LocationArea::class, 'schedule_location_areas');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'schedule_user');
    }
}
