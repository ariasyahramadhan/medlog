<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\Mentorship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class LeaveRequestController extends Controller
{
    /**
     * Daftar riwayat pengajuan izin/cuti/sakit milik residen yang sedang login.
     */
    public function index()
    {
        try {
            $requests = LeaveRequest::with('lecturer')
                ->where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($requests, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat riwayat pengajuan.',
                'debug_exception' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Residen mengajukan izin / cuti / sakit baru.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'jenis'            => 'required|string|in:Izin,Cuti,Sakit',
            'tanggal_mulai'    => 'required|date',
            'tanggal_selesai'  => 'required|date|after_or_equal:tanggal_mulai',
            'alasan'           => 'required|string',
            'lampiran'         => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Tentukan konsulen (dosen pembimbing) residen ini secara otomatis dari data Mentorship
        $lecturerId = Mentorship::where('student_id', Auth::id())->value('lecturer_id');

        if (!$lecturerId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda belum memiliki dosen pembimbing (konsulen) terdaftar. Hubungi admin program studi.'
            ], 422);
        }

        $lampiranPath = null;
        if ($request->hasFile('lampiran')) {
            $lampiranPath = $request->file('lampiran')->store('lampiran_izin', 'public');
        }

        $leaveRequest = LeaveRequest::create([
            'user_id'          => Auth::id(),
            'lecturer_id'      => $lecturerId,
            'jenis'            => $request->jenis,
            'tanggal_mulai'    => $request->tanggal_mulai,
            'tanggal_selesai'  => $request->tanggal_selesai,
            'alasan'           => $request->alasan,
            'lampiran'         => $lampiranPath,
            'status'           => 'pending',
        ]);

        return response()->json([
            'message' => 'Pengajuan berhasil dikirim dan menunggu persetujuan konsulen.',
            'data'    => $leaveRequest
        ], 201);
    }

    /**
     * Residen membatalkan pengajuan miliknya sendiri — hanya jika masih berstatus pending.
     */
    public function destroy($id)
    {
        $leaveRequest = LeaveRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$leaveRequest) {
            return response()->json(['message' => 'Data pengajuan tidak ditemukan.'], 404);
        }

        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Hanya pengajuan berstatus PENDING yang dapat dibatalkan.'
            ], 422);
        }

        if ($leaveRequest->lampiran) {
            Storage::disk('public')->delete($leaveRequest->lampiran);
        }

        $leaveRequest->delete();

        return response()->json([
            'message' => 'Pengajuan berhasil dibatalkan.'
        ], 200);
    }
}