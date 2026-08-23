<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CompetencyProgress;
use Illuminate\Support\Facades\Auth;

class CompetencyProgressController extends Controller
{
    public function getStudentProgress()
    {
        try {
            $studentId = Auth::id();
            
            $progressData = CompetencyProgress::where('user_id', $studentId)
                ->orderBy('stase_klinis', 'asc')
                ->get();

            return response()->json($progressData, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat kompetensi internal Eloquent.'
            ], 500);
        }
    }
}