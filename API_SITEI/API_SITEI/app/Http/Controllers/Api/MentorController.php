<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Mentorship;
use Illuminate\Http\Request;

class MentorController extends Controller
{
    public function index()
    {
        $students = User::where('role', 'Mahasiswa')
            ->with(['mentorship.dosen:id,name,identifier'])
            ->get();
            
        $lecturers = User::where('role', 'Dosen')->get(['id', 'name', 'identifier']);

        return response()->json([
            'students' => $students,
            'lecturers' => $lecturers
        ]);
    }

    public function updateMentor(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'lecturer_id' => 'required|exists:users,id'
        ]);

        Mentorship::updateOrCreate(
            ['student_id' => $request->student_id],
            ['lecturer_id' => $request->lecturer_id]
        );

        return response()->json(['message' => 'Pembimbing berhasil di-plot']);
    }
}