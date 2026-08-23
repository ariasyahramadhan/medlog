<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunityService;
use App\Models\Mentorship;  
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommunityServiceController extends Controller
{

    public function index()
    {
        $data = CommunityService::where('user_id', Auth::id())
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json($data, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tanggal'             => 'required|date',
            'kegiatan_pengabdian' => 'required|string',
            'penanggung_jawab'    => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $service = CommunityService::create([
            'user_id'             => Auth::id(),
            'tanggal'             => $request->tanggal,
            'kegiatan_pengabdian' => $request->kegiatan_pengabdian,
            'penanggung_jawab'    => $request->penanggung_jawab,
            'status'              => 'pending' 
        ]);

        return response()->json([
            'message' => 'Kegiatan pengabdian masyarakat berhasil disimpan',
            'data'    => $service
        ], 201);
    }

    public function getLecturerPending()
    {
        $lecturerId = Auth::id();

        $studentIds = Mentorship::where('lecturer_id', $lecturerId)->pluck('student_id');

        $pendingServices = CommunityService::with('user')
            ->whereIn('user_id', $studentIds)
            ->where('status', 'pending')
            ->orderBy('tanggal', 'asc')
            ->get();

        return response()->json($pendingServices, 200);
    }

    public function verifyService(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:approve,reject'
        ]);

        $service = CommunityService::find($id);

        if (!$service) {
            return response()->json(['message' => 'Data pengabdian tidak ditemukan.'], 404);
        }

        $service->status = $request->action === 'approve' ? 'verified' : 'rejected';
        $service->save();

        $msg = $request->action === 'approve' ? 'Kegiatan pengabdian berhasil diverifikasi.' : 'Kegiatan pengabdian telah ditolak.';
        
        return response()->json([
            'message' => $msg,
            'data' => $service
        ], 200);
    }

    public function getLecturerHistory()
    {
        try {
            $lecturerId = Auth::id();

            if (!$lecturerId) {
                return response()->json(['message' => 'Dosen tidak terotentikasi.'], 401);
            }

            $studentIds = Mentorship::where('lecturer_id', $lecturerId)->pluck('student_id');

            if ($studentIds->isEmpty()) {
                return response()->json([], 200);
            }

            $historyServices = CommunityService::with('user')
                ->whereIn('user_id', $studentIds)
                ->whereIn('status', ['verified', 'rejected'])
                ->orderBy('updated_at', 'desc')
                ->get();

            return response()->json($historyServices, 200);

        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memproses data riwayat internal Eloquent.',
                'debug_exception' => $e->getMessage()
            ], 500);
        }
    }
}