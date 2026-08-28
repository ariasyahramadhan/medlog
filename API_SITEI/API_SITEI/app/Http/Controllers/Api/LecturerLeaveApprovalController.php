<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\Mentorship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LecturerLeaveApprovalController extends Controller
{
    /**
     * Daftar seluruh pengajuan izin/cuti/sakit dari residen bimbingan dosen yang login.
     */
    public function index()
    {
        try {
            $lecturerId = Auth::id();
            $studentIds = Mentorship::where('lecturer_id', $lecturerId)->pluck('student_id');

            if ($studentIds->isEmpty()) {
                return response()->json([], 200);
            }

            $requests = LeaveRequest::with('user')
                ->whereIn('user_id', $studentIds)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($requests, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat daftar pengajuan izin residen.',
                'debug_exception' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Dosen menyetujui pengajuan.
     */
    public function approve(Request $request, $id)
    {
        return $this->processDecision($request, $id, 'approved');
    }

    /**
     * Dosen menolak pengajuan.
     */
    public function reject(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'catatan_konsulen' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
                'message' => 'Alasan penolakan wajib diisi.'
            ], 422);
        }

        return $this->processDecision($request, $id, 'rejected');
    }

    /**
     * Logika bersama untuk approve/reject, memastikan hanya konsulen terkait yang bisa memutuskan.
     */
    private function processDecision(Request $request, $id, string $status)
    {
        $leaveRequest = LeaveRequest::find($id);

        if (!$leaveRequest) {
            return response()->json(['message' => 'Data pengajuan tidak ditemukan.'], 404);
        }

        if ($leaveRequest->lecturer_id !== Auth::id()) {
            return response()->json([
                'message' => 'Anda tidak berwenang memproses pengajuan residen ini.'
            ], 403);
        }

        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Pengajuan ini sudah diproses sebelumnya.'
            ], 422);
        }

        $leaveRequest->update([
            'status'           => $status,
            'catatan_konsulen' => $request->catatan_konsulen,
            'processed_at'     => now(),
        ]);

        $message = $status === 'approved'
            ? 'Pengajuan berhasil disetujui.'
            : 'Pengajuan berhasil ditolak.';

        return response()->json([
            'message' => $message,
            'data'    => $leaveRequest
        ], 200);
    }
}