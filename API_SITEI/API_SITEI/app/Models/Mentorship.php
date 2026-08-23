<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mentorship extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'lecturer_id'];

    public function mahasiswa()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function dosen()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function lecturer() {
        return $this->belongsTo(User::class, 'lecturer_id');    
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}