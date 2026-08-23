<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicActivity extends Model
{
    use HasFactory;

    protected $table = 'academic_activities';

    protected $fillable = [
        'user_id',
        'tanggal',
        'kegiatan_ilmiah',
        'penanggung_jawab',
        'status'
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function score()
    {
        return $this->hasOne(AcademicActivityScore::class, 'academic_activity_id', 'id');
    }
    
    public function attendances()
    {
        return $this->hasMany(AcademicActivityAttendance::class, 'academic_activity_id', 'id');
    }
}