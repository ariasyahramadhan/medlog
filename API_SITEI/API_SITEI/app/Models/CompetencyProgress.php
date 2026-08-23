<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompetencyProgress extends Model
{   
    protected $table = 'competency_progresses';

    protected $fillable = [
        'user_id',
        'stase_klinis', 
        'capaian_saat_ini',
        'target_total'
    ];
}