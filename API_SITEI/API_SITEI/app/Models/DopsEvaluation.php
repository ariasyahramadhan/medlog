<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DopsEvaluation extends Model
{
    use HasFactory;

    protected $table = 'dops_evaluations';

    protected $fillable = [
        'user_id',
        'lecturer_id',
        'jenis_dops',
        'tanggal',
        'scores',
        'total_skor',
        'status_kelayakan'
    ];

    protected $casts = [
        'scores' => 'array',
        'tanggal' => 'date:Y-m-d'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

}