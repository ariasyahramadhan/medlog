<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SoftSkillGuidance;
use App\Models\Mentorship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SoftSkillGuidanceController extends Controller
{
    public function getStudents()
    {
        try {
            $lecturerId = Auth::id();
            
            $students = Mentorship::with('mahasiswa') 
                ->where('lecturer_id', $lecturerId)
                ->get()
                ->pluck('mahasiswa')
                ->filter();

            return response()->json($students->values(), 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat daftar anak bimbingan.'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'    => 'required|exists:users,id',
            'tanggal'    => 'required|date',
            'keterangan' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $guidance = SoftSkillGuidance::create([
            'user_id'    => $request->user_id,
            'tanggal'    => $request->tanggal,
            'keterangan' => $request->keterangan,
            'status'     => 'verified' 
        ]);

        return response()->json([
            'message' => 'Catatan pembinaan soft skill residen berhasil ditambahkan.',
            'data'    => $guidance
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id'    => 'required|exists:users,id',
            'tanggal'    => 'required|date',
            'keterangan' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $guidance = SoftSkillGuidance::find($id);

        if (!$guidance) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        $guidance->update([
            'user_id'    => $request->user_id,
            'tanggal'    => $request->tanggal,
            'keterangan' => $request->keterangan,
        ]);

        return response()->json([
            'message' => 'Data pembinaan soft skill berhasil diperbarui.',
            'data'    => $guidance
        ], 200);
    }

    public function destroy($id)
    {
        $guidance = SoftSkillGuidance::find($id);

        if (!$guidance) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        $guidance->delete();

        return response()->json(['message' => 'Data pembinaan soft skill berhasil dihapus.'], 200);
    }

    public function getLecturerHistory()
    {
        try {
            $lecturerId = Auth::id();
            $studentIds = Mentorship::where('lecturer_id', $lecturerId)->pluck('student_id');

            if ($studentIds->isEmpty()) {
                return response()->json([], 200);
            }

            $history = SoftSkillGuidance::with('user')
                ->whereIn('user_id', $studentIds)
                ->orderBy('tanggal', 'desc')
                ->get();

            return response()->json($history, 200);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal memuat riwayat.'], 500);
        }
    }
}