<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicalCase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RiwayatKasusController extends Controller
{
    public function index(Request $request)
    {
        $query = MedicalCase::where('user_id', Auth::id());

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by jenis_kasus
        if ($request->filled('jenis_kasus') && $request->jenis_kasus !== 'all') {
            $query->where('jenis_kasus', $request->jenis_kasus);
        }

        // Filter by bulan (format: YYYY-MM)
        if ($request->filled('bulan')) {
            $query->whereRaw("DATE_FORMAT(tanggal_tindakan, '%Y-%m') = ?", [$request->bulan]);
        }

        // Search by tindakan atau diagnosis (JSON contains)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('tindakan', 'like', "%{$search}%")
                  ->orWhere('dpjp_name', 'like', "%{$search}%")
                  ->orWhere('catatan', 'like', "%{$search}%")
                  ->orWhereJsonContains('diagnosis', $search);
            });
        }

        // Sort
        $sortBy    = $request->get('sort_by', 'tanggal_tindakan');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['tanggal_tindakan', 'tindakan', 'status', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        }

        $cases = $query->get();

        // Summary stats
        $stats = [
            'total'    => $cases->count(),
            'verified' => $cases->where('status', 'verified')->count(),
            'pending'  => $cases->where('status', 'pending')->count(),
            'rejected' => $cases->where('status', 'rejected')->count(),
        ];

        return response()->json([
            'data'  => $cases,
            'stats' => $stats,
        ]);
    }

    /**
     * Ambil detail satu kasus milik user yang login.
     */
    public function show($id)
    {
        $case = MedicalCase::where('user_id', Auth::id())->find($id);

        if (!$case) {
            return response()->json(['message' => 'Kasus tidak ditemukan.'], 404);
        }

        return response()->json($case);
    }

    /**
     * Hapus kasus (hanya jika masih pending).
     */
    public function destroy($id)
    {
        $case = MedicalCase::where('user_id', Auth::id())->find($id);

        if (!$case) {
            return response()->json(['message' => 'Kasus tidak ditemukan.'], 404);
        }

        if ($case->status !== 'pending') {
            return response()->json(['message' => 'Hanya kasus berstatus pending yang dapat dihapus.'], 403);
        }

        $case->delete();

        return response()->json(['message' => 'Kasus berhasil dihapus.']);
    }
}