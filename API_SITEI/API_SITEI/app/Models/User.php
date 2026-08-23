<?php
namespace App\Models;

use App\Models\MentorProfile;
use App\Models\StudentProfile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
    'name',
    'identifier',
    'role',
    'email',
    'password',
    'department',
    'batch',       
    'status',
    'avatar',  
    'face_vector',
    'fcm_token',
    ];

    protected $casts = [
    'face_vector' => 'array',
    ];

    public function mentorship() {
     return $this->hasOne(Mentorship::class, 'student_id');
    }

    public function locationAreas() {
        return $this->belongsToMany(LocationArea::class, 'location_area_user');
    }
}
