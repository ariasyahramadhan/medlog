<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThesisGuidance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lecturer_id',
        'judul_tesis',
        'tahap',
        'tanggal',
        'keterangan',
        'status',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    /**
     * Residen (mahasiswa) pemilik bimbingan tesis ini.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Dosen pembimbing yang menginput rekam ini.
     */
    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

}