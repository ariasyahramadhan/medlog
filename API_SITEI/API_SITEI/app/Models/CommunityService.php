<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityService extends Model
{
    use HasFactory;

    protected $table = 'community_services';

    protected $fillable = [
        'user_id',
        'tanggal',
        'kegiatan_pengabdian',
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
}