<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalCase extends Model
{
    protected $fillable = [
        'user_id', 
        'tanggal_tindakan', 
        'jenis_kelamin', 
        'umur', 
        'diagnosis', 
        'tindakan', 
        'jenis_kasus', 
        'urgensi', 
        'jenis_anestesi', 
        'regimen_analgesia',
        'lokasi_insersi',
        'teknik_intervensi',
        'dpjp_name', 
        'catatan', 
        'score',
        'status'
    ];

    protected $casts = [
        'diagnosis' => 'array',
        'tanggal_tindakan' => 'date'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeOwnedBy($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}