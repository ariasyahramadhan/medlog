<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicActivity;
use App\Models\AcademicActivityScore;
use App\Models\AcademicActivityAttendance;
use App\Models\Mentorship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AcademicActivityController extends Controller
{
   public function index()
    {
        try {
            // Memastikan data relasi score dan attendances ditarik secara aman 
            // tanpa memutus siklus loop data jika bernilai kosong/null
            $data = AcademicActivity::with([
                'score', 
                'attendances'
            ])
            ->where('user_id', Auth::id())
            ->orderBy('tanggal', 'desc')
            ->get();

            return response()->json($data, 200);

        } catch (\Throwable $e) {
            // Mencegah error 500 mentah dari SQL bocor ke frontend, 
            // diganti dengan respons JSON debug yang aman
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat logbook kegiatan ilmiah relasional mahasiswa.',
                'debug_exception' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }
    
    public function verifyActivity(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'tahap_semester' => 'nullable|string',
            'judul_resmi' => 'nullable|string',
            'persiapan_bahan' => 'nullable|integer',
            'persiapan_narsum' => 'nullable|integer',
            'makalah_judul' => 'nullable|integer',
            'makalah_isi' => 'nullable|integer',
            'makalah_pembahasan' => 'nullable|integer',
            'penampilan_cara' => 'nullable|integer',
            'penampilan_kuasa' => 'nullable|integer',
            'diskusi_teori' => 'nullable|integer',
            'diskusi_kemampuan' => 'nullable|integer',
            'nilai_akhir' => 'nullable|integer',
            'kesimpulan' => 'nullable|in:Lulus,Gagal',
            'attendances' => 'nullable|array',
            'attendances.*.nama_peserta' => 'required|string',
            'attendances.*.keterangan' => 'nullable|string'
        ]);

        $activity = AcademicActivity::find($id);
        if (!$activity) return response()->json(['message' => 'Data tidak ditemukan.'], 404);

        if ($request->action === 'reject') {
            $activity->status = 'rejected';
            $activity->save();
            return response()->json(['message' => 'Kegiatan ilmiah ditolak.'], 200);
        }

        DB::beginTransaction();
        try {
            // Mengubah atau mempertahankan status tetap 'verified'
            $activity->status = 'verified';
            $activity->save();

            AcademicActivityScore::updateOrCreate(
                ['academic_activity_id' => $activity->id],
                [
                    'tahap_semester' => $request->tahap_semester,
                    'judul_resmi' => $request->judul_resmi,
                    'persiapan_bahan' => $request->persiapan_bahan,
                    'persiapan_narsum' => $request->persiapan_narsum,
                    'makalah_judul' => $request->makalah_judul,
                    'makalah_isi' => $request->makalah_isi,
                    'makalah_pembahasan' => $request->makalah_pembahasan,
                    'penampilan_cara' => $request->penampilan_cara,
                    'penampilan_kuasa' => $request->penampilan_kuasa,
                    'diskusi_teori' => $request->diskusi_teori,
                    'diskusi_kemampuan' => $request->diskusi_kemampuan,
                    'nilai_akhir' => $request->nilai_akhir,
                    'kesimpulan' => $request->kesimpulan,
                ]
            );

            // 2. Untuk absensi: Hapus record absensi lama milik activity ini, lalu masukkan yang baru hasil editan
            AcademicActivityAttendance::where('academic_activity_id', $activity->id)->delete();
            if ($request->has('attendances') && is_array($request->attendances)) {
                foreach ($request->attendances as $attendee) {
                    AcademicActivityAttendance::create([
                        'academic_activity_id' => $activity->id,
                        'nama_peserta' => $attendee['nama_peserta'],
                        'keterangan' => $attendee['keterangan'] ?? 'Hadir'
                    ]);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Data penilaian dan absensi kegiatan ilmiah berhasil diperbarui.'], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Gagal memperbarui transaksi data.', 'debug' => $e->getMessage()], 500);
        }
    }

    public function getLecturerHistory()
    {
        try {
            $lecturerId = Auth::id();
            $studentIds = Mentorship::where('lecturer_id', $lecturerId)->pluck('student_id');

            if ($studentIds->isEmpty()) {
                return response()->json([], 200);
            }
            $historyActivities = AcademicActivity::with([
                'user:id,name,identifier', 
                'score', 
                'attendances'
            ])
            ->whereIn('user_id', $studentIds)
            ->whereIn('status', ['verified', 'rejected'])
            ->orderBy('updated_at', 'desc')
            ->get();

            return response()->json($historyActivities, 200);

        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat data relasi riwayat ilmiah.',
                'debug_exception' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getLecturerPending()
    {
        try {
            $lecturerId = Auth::id();
            $studentIds = Mentorship::where('lecturer_id', $lecturerId)->pluck('student_id');

            if ($studentIds->isEmpty()) {
                return response()->json([], 200);
            }

            $pendingActivities = AcademicActivity::with([
                'user:id,name,identifier',
                'score',
                'attendances'
            ])
            ->whereIn('user_id', $studentIds)
            ->where('status', 'pending')
            ->orderBy('tanggal', 'asc')
            ->get();

            return response()->json($pendingActivities, 200);
            
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Gagal memuat antrean kegiatan ilmiah relasional.',
                'debug_exception' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        // 1. Validasi input standar yang dikirim oleh Mahasiswa
        $validator = Validator::make($request->all(), [
            'tanggal'         => 'required|date',
            'kegiatan_ilmiah' => 'required|string',
            'penanggung_jawab' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $activity = AcademicActivity::create([
                'user_id'          => Auth::id(),
                'tanggal'          => $request->tanggal,
                'kegiatan_ilmiah'  => $request->kegiatan_ilmiah,
                'penanggung_jawab' => $request->penanggung_jawab,
                'status'           => 'pending' 
            ]);

            $activity->load(['score', 'attendances']);

            return response()->json([
                'message' => 'Logbook kegiatan ilmiah berhasil diajukan ke Konsulen.',
                'data'    => $activity
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'status'          => 'error',
                'message'         => 'Gagal menyimpan logbook kegiatan ilmiah.',
                'debug_exception' => $e->getMessage()
            ], 500);
        }
    }

    public function getMyStudents()
    {
        try {
            $lecturerId = Auth::id();
            
            // Ambil data residen melalui tabel mentorships beserta profil user-nya
            $students = \App\Models\Mentorship::with('student:id,name,identifier')
                ->where('lecturer_id', $lecturerId)
                ->get()
                ->map(function ($m) {
                    return [
                        'id' => $m->student->id ?? null,
                        'name' => $m->student->name ?? '—',
                        'identifier' => $m->student->identifier ?? '—'
                    ];
                })
                ->filter(fn($s) => !is_null($s['id']))
                ->values();

            return response()->json($students, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat daftar residen bimbingan.',
                'debug' => $e->getMessage()
            ], 500);
        }
    }
}