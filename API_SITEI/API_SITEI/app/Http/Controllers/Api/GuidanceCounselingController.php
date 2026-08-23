<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GuidanceCounseling;
use App\Models\Mentorship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class GuidanceCounselingController extends Controller
{
    public function getStudents()
    {
        try {
            $lecturerId = Auth::id();
            
            // Ambil data mentorship beserta data user mahasiswa (residen)
            $students = Mentorship::with('mahasiswa') // Sesuaikan jika nama relasi di Mentorship Anda adalah 'user' atau 'mahasiswa'
                ->where('lecturer_id', $lecturerId)
                ->get()
                ->pluck('mahasiswa') // Ambil objek mahasiswanya saja
                ->filter(); // Bersihkan jika ada yang null

            return response()->json($students->values(), 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat daftar residen bimbingan.',
                'debug_exception' => $e->getMessage()
            ], 500);
        }
    }

    public function storeByLecturer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'    => 'required|exists:users,id', // ID Residen yang dipilih dosen
            'tanggal'    => 'required|date',
            'keterangan' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Karena diinput langsung oleh Dosen, status otomatis langsung 'verified' (Disetujui/Paraf)
        $guidance = GuidanceCounseling::create([
            'user_id'    => $request->user_id,
            'tanggal'    => $request->tanggal,
            'keterangan' => $request->keterangan,
            'status'     => 'verified' 
        ]);

        return response()->json([
            'message' => 'Logbook bimbingan residen berhasil ditambahkan dan diparaf.',
            'data'    => $guidance
        ], 201);
    }

    public function getLecturerHistory()
    {
        try {
            $lecturerId = Auth::id();
            $studentIds = Mentorship::where('lecturer_id', $lecturerId)->pluck('student_id');

            if ($studentIds->isEmpty()) {
                return response()->json([], 200);
            }

            $historyGuidances = GuidanceCounseling::with('user')
                ->whereIn('user_id', $studentIds)
                ->orderBy('tanggal', 'desc')
                ->get();

            return response()->json($historyGuidances, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat riwayat bimbingan.',
                'debug_exception' => $e->getMessage()
            ], 500);
        }
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

        $guidance = GuidanceCounseling::find($id);

        if (!$guidance) {
            return response()->json(['message' => 'Data bimbingan tidak ditemukan.'], 404);
        }

        $guidance->update([
            'user_id'    => $request->user_id,
            'tanggal'    => $request->tanggal,
            'keterangan' => $request->keterangan,
        ]);

        return response()->json([
            'message' => 'Data bimbingan residen berhasil diperbarui.',
            'data'    => $guidance
        ], 200);
    }

    public function destroy($id)
    {
        $guidance = GuidanceCounseling::find($id);

        if (!$guidance) {
            return response()->json(['message' => 'Data bimbingan tidak ditemukan.'], 404);
        }

        $guidance->delete();

        return response()->json([
            'message' => 'Data bimbingan residen berhasil dihapus dari logbook.'
        ], 200);
    }
}