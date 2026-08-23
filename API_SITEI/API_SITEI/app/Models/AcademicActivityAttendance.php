<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicActivityAttendance extends Model
{
    protected $table = 'academic_activity_attendances';
    protected $fillable = ['academic_activity_id', 'nama_peserta', 'keterangan'];
}