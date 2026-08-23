<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DopsEvaluation;
use App\Models\Mentorship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DopsEvaluationController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'jenis_dops' => 'required|in:cvc_femoral,anestesi_umum,anestesi_regional,cvc_subclavia',
            'tanggal' => 'required|date',
            'scores' => 'required|array',
            'total_skor' => 'required|integer',
            'status_kelayakan' => 'required|in:LAYAK,TIDAK LAYAK'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $evaluation = DopsEvaluation::create([
            'user_id' => $request->user_id,
            'lecturer_id' => Auth::id(),
            'jenis_dops' => $request->jenis_dops,
            'tanggal' => $request->tanggal,
            'scores' => $request->scores,
            'total_skor' => $request->total_skor,
            'status_kelayakan' => $request->status_kelayakan
        ]);

        return response()->json([
            'message' => 'Penilaian ujian DOPS residen berhasil disimpan.',
            'data' => $evaluation
        ], 201);
    }

    public function getLecturerHistory()
    {
        try {
            $history = DopsEvaluation::with('user')
                ->where('lecturer_id', Auth::id())
                ->orderBy('tanggal', 'desc')
                ->get();
            return response()->json($history, 200);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Gagal memuat riwayat DOPS.'], 500);
        }
    }

    public function destroy($id)
    {
        $evaluation = DopsEvaluation::find($id);
        if (!$evaluation) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }
        $evaluation->delete();
        return response()->json(['message' => 'Data penilaian DOPS berhasil dihapus.'], 200);
    }

    public function getStudentHistory()
    {
        try {
            // Membaca user_id sesuai kolom nomor 2 di database Anda
            $studentId = Auth::id();

            $dopsData = \App\Models\DopsEvaluation::with('lecturer:id,name,identifier')
                ->where('user_id', $studentId)
                ->orderBy('tanggal', 'desc')
                ->get();

            return response()->json($dopsData, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat rekam evaluasi DOPS mahasiswa.',
                'debug_exception' => $e->getMessage()
            ], 500);
        }
    }
}