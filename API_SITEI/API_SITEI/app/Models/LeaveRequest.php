<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lecturer_id',
        'jenis',
        'tanggal_mulai',
        'tanggal_selesai',
        'alasan',
        'lampiran',
        'status',
        'catatan_konsulen',
        'processed_at',
    ];

    protected $casts = [
        'tanggal_mulai'   => 'date',
        'tanggal_selesai' => 'date',
        'processed_at'    => 'datetime',
    ];

    /**
     * Residen (mahasiswa) pengaju izin/cuti/sakit.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Konsulen / dosen pembimbing yang menyetujui/menolak.
     */
    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    /**
     * Jumlah hari pengajuan (inklusif tanggal mulai & selesai).
     */
    public function getDurasiHariAttribute()
    {
        if (!$this->tanggal_mulai || !$this->tanggal_selesai) {
            return 0;
        }
        return $this->tanggal_mulai->diffInDays($this->tanggal_selesai) + 1;
    }
}