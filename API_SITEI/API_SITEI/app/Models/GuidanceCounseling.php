<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuidanceCounseling extends Model
{
    use HasFactory;

    protected $table = 'guidance_counselings';

    protected $fillable = [
        'user_id',
        'tanggal',
        'keterangan',
        'status'
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}