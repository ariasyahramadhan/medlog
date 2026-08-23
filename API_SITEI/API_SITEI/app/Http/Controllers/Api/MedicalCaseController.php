<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicalCase;
use App\Models\Mentorship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MedicalCaseController extends Controller {

    /**
     * Menampilkan riwayat logbook milik mahasiswa yang sedang login
     */
    public function index() {
        return response()->json(
            MedicalCase::where('user_id', Auth::id())
                ->orderBy('tanggal_tindakan', 'desc')
                ->get()
        );
    }

    /**
     * Menyimpan data kasus klinis adaptif dari mahasiswa ke database
     */
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'tanggal_tindakan'  => 'required|date',
            'jenis_kelamin'     => 'required', 
            'umur'              => 'required|integer',
            'diagnosis'         => 'required|array',
            'tindakan'          => 'required|string',
            'jenis_kasus'       => 'required|string', // Kategori stase induk besar kurikulum
            'urgensi'           => 'nullable|string', // Kolom $E/N$ Anestesi Standar
            'jenis_anestesi'    => 'nullable|string',
            'regimen_analgesia' => 'nullable|string', // Kolom Khas Manajemen Nyeri
            'lokasi_insersi'    => 'nullable|string', // Kolom Khas Pemasangan CVC
            'teknik_intervensi' => 'nullable|string', // Kolom Khas PNB / IPM
            'dpjp_name'         => 'required|string',
            'catatan'           => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        $jk = strtoupper($data['jenis_kelamin']);
        if (str_starts_with($jk, 'L')) { $jk = 'L'; } 
        elseif (str_starts_with($jk, 'P')) { $jk = 'P'; }

        $case = MedicalCase::create([
            'user_id'           => Auth::id(),
            'tanggal_tindakan'  => $data['tanggal_tindakan'],
            'jenis_kelamin'     => $jk,
            'umur'              => $data['umur'],
            'diagnosis'         => $data['diagnosis'],
            'tindakan'          => $data['tindakan'],
            'jenis_kasus'       => $data['jenis_kasus'],
            'urgensi'           => $data['urgensi'] ?? null,
            'jenis_anestesi'    => $data['jenis_anestesi'] ?? null,
            'regimen_analgesia' => $data['regimen_analgesia'] ?? null,
            'lokasi_insersi'    => $data['lokasi_insersi'] ?? null,
            'teknik_intervensi' => $data['teknik_intervensi'] ?? null,
            'dpjp_name'         => $data['dpjp_name'],
            'catatan'           => $data['catatan'] ?? null,
            'status'            => 'pending',
            'score'             => 0 
        ]);

        return response()->json([
            'message' => 'Kasus berhasil disimpan',
            'data'    => $case
        ], 201);
    }

    public function getKonsulen() {
        $user = Auth::user();
        $mentorship = Mentorship::with('lecturer')
            ->where('student_id', $user->id)
            ->first();

        return response()->json([
            'konsulen_name' => $mentorship ? $mentorship->lecturer->name : null
        ]);
    }

    public function getLecturerCases() {
        $lecturerId = Auth::id();
        $studentIds = Mentorship::where('lecturer_id', $lecturerId)->pluck('student_id');

        $cases = MedicalCase::with('user')
            ->whereIn('user_id', $studentIds)
            ->orderBy('tanggal_tindakan', 'desc')
            ->get();

        return response()->json($cases);
    }

    public function verifyCase(Request $request, $id) {
        $request->validate([
            'action' => 'required|in:approve,reject,pending'
        ]);

        $case = MedicalCase::find($id);

        if (!$case) {
            return response()->json(['message' => 'Kasus tidak ditemukan.'], 404);
        }
        $isMentor = Mentorship::where('lecturer_id', Auth::id())
            ->where('student_id', $case->user_id)
            ->exists();

        if (!$isMentor) {
            return response()->json(['message' => 'Anda tidak memiliki hak akses untuk memverifikasi residen ini.'], 403);
        }

        $status = 'pending';
        $finalScore = 0;

        if ($request->action === 'approve') {
            $status = 'verified';
            $finalScore = 25; 
        } elseif ($request->action === 'reject') {
            $status = 'rejected';
        }

        $case->update([
            'status' => $status,
            'score'  => $finalScore
        ]);

        $messages = [
            'verified' => 'Kasus berhasil diverifikasi. Kuantitas target stase residen otomatis bertambah.',
            'rejected' => 'Logbook tindakan residen telah ditolak.',
            'pending'  => 'Status verifikasi kasus berhasil dibatalkan (Revoked).'
        ];

        return response()->json([
            'message' => $messages[$status],
            'data' => $case
        ]);
    }

    public function getLecturerHistory() {
        $lecturerId = Auth::id();
        
        $studentIds = Mentorship::where('lecturer_id', $lecturerId)->pluck('student_id');
        $historyCases = MedicalCase::with('user')
            ->whereIn('user_id', $studentIds)
            ->whereIn('status', ['verified', 'rejected']) 
            ->orderBy('tanggal_tindakan', 'desc')
            ->get();

        return response()->json($historyCases, 200);
    }
}