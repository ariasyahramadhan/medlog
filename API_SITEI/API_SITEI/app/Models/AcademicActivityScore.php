<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicActivityScore extends Model
{
    protected $table = 'academic_activity_scores';
    protected $fillable = [
        'academic_activity_id', 'tahap_semester', 'judul_resmi',
        'persiapan_bahan', 'persiapan_narsum', 'makalah_judul', 'makalah_isi', 
        'makalah_pembahasan', 'penampilan_cara', 'penampilan_kuasa', 
        'diskusi_teori', 'diskusi_kemampuan', 'nilai_akhir', 'kesimpulan'
    ];
}