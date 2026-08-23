<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicalCase;
use App\Models\Mentorship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LecturerMentorshipController extends Controller {

    /**
     * Mengambil seluruh riwayat kasus residen bimbingan yang TELAH dikurasi (Verified/Rejected)
     * URL: GET /api/lecturer/validation-history
     */
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

    /**
     * Mengkalkulasi seluruh progres pemenuhan kurikulum dokter residen bimbingan konsulen
     * URL: GET /api/lecturer/residents-progress
     */
    public function getResidentsProgress() {
        try {
            $lecturerId = Auth::id();

            if (!$lecturerId) {
                return response()->json(['message' => 'Token Dosen Tidak Valid / Terotentikasi'], 401);
            }

            // Ambil daftar relasi bimbingan mahasiswa
            $mentorships = Mentorship::with('student')
                ->where('lecturer_id', $lecturerId)
                ->get();

            $result = [];

            // Master Array Sinkronisasi String Buku Logbook PDF UNRI
            $subTindakanAnestesiUtama = [
                "Anestesi Bedah Elektif", "Anestesi Bedah Darurat", "Anestesi Umum", "Anestesi / Analgesia Regional", 
                "Teknik Anestesi / Analgesia Subarakhnoid", "Teknik Anestesi / Analgesia Epidural", 
                "Teknik Anestesi / Analgesia Blok Saraf Tepi Basic", "Teknik Anestesi / Analgesia Kaudal"
            ];

            $subAnestesiBedahUmum = [
                "Teknik Anestesi / Analgesia Blok Saraf Tepi intermediate", "Anestesi Bedah Umum Digestif", 
                "Anestesi Bedah Umum THT dan Bedah Mulut", "Anestesi Bedah Umum Mata", "Anestesi Bedah Umum Urologi", 
                "Anestesi Bedah Umum Ortopedi", "Anestesi Bedah Umum Plastik", "Anestesi Bedah Umum Onkologi", 
                "Anestesi Bedah Umum Minimal Invasif", "Anestesi / Analgesia Rawat Jalan", 
                "Anestesi / Analgesia diluar kamar operasi", "Lain-lain (dapat berupa kompetensi diatas)"
            ];

            $subManajemenNyeri = ["Manajemen Nyeri akut", "Manajemen Nyeri kronik", "Manajemen Nyeri paliatif", "Interventional Pain Management"];
            $subObstetriGinekologi = ["Anestesi dan analgesia Obstetri dan Ginekologi Pre-eklamsi dan eklamsi", "Lain-lain (operasi selain eklamsi dan pre-eklamsi)"];
            $subBedahSaraf = ["Anestesi Bedah Saraf Trauma kepala", "Perdarahan intracranial non-trauma", "Tumor intrakranial", "Ventricular drainage (VP shunt, EVD)", "Medula spinalis"];
            
            $subKondisiKhususLanjut = [
                "Anestesi Bedah Thoraks Non Jantung dan Jantung Terbuka", "Anestesi pada Kondisi khusus Kelainan jantung pada operasi non jantung", 
                "Anestesi pada Kondisi khusus COPD / asma", "Anestesi pada Kondisi khusus DM", "Anestesi pada Kondisi khusus Tiroid", 
                "Anestesi pada Kondisi khusus Geriatri", "Anestesi pada Kondisi khusus Obesitas", "Mengelola pasien ICU (10 variasi kasus)", 
                "Melakukan resusitasi di luar kamar bedah dan ICU", "Memasang kateter intra-arterial dan pungsi intra-arterial", 
                "Memasang kateter vena central", "Melakukan intubasi sulit", "Anestesi Bedah Pediatri Neonatus", "Anestesi Bedah Pediatri Bayi", "Anestesi Bedah Pediatri Anak-anak"
            ];

            foreach ($mentorships as $m) {
                // Gunakan Cek Kondisi jika data user atau objeknya hilang/null di DB
                if (!isset($m->student_id) || !$m->student) {
                    continue; 
                }

                $student = $m->student;

                // Ambil kasus terverifikasi miliki mahasiswa bersangkutan
                $verifiedCases = MedicalCase::where('user_id', $student->id)
                    ->where('status', 'verified')
                    ->get();

                $kompetensiDasarCount = 0;
                $bedahUmumCount = 0;
                $manajemenNyeriCount = 0;
                $obstetriCount = 0;
                $bedahSarafCount = 0;
                $kompetensiLanjutCount = 0;

                if ($verifiedCases && $verifiedCases->count() > 0) {
                    $kompetensiDasarCount = $verifiedCases->filter(function($c) use ($subTindakanAnestesiUtama, $subAnestesiBedahUmum) {
                        return isset($c->tindakan) && (in_array($c->tindakan, $subTindakanAnestesiUtama) || in_array($c->tindakan, $subAnestesiBedahUmum));
                    })->count();

                    $bedahUmumCount = $verifiedCases->filter(function($c) use ($subAnestesiBedahUmum) {
                        return isset($c->tindakan) && in_array($c->tindakan, $subAnestesiBedahUmum);
                    })->count();

                    $manajemenNyeriCount = $verifiedCases->filter(function($c) use ($subManajemenNyeri) {
                        return isset($c->tindakan) && in_array($c->tindakan, $subManajemenNyeri);
                    })->count();

                    $obstetriCount = $verifiedCases->filter(function($c) use ($subObstetriGinekologi) {
                        return isset($c->tindakan) && in_array($c->tindakan, $subObstetriGinekologi);
                    })->count();

                    $bedahSarafCount = $verifiedCases->filter(function($c) use ($subBedahSaraf) {
                        return isset($c->tindakan) && in_array($c->tindakan, $subBedahSaraf);
                    })->count();

                    $kompetensiLanjutCount = $verifiedCases->filter(function($c) use ($subKondisiKhususLanjut) {
                        return isset($c->tindakan) && in_array($c->tindakan, $subKondisiKhususLanjut);
                    })->count();
                }

                $result[] = [
                    'id' => $student->id,
                    'name' => $student->name ?? 'Residen Dokter (Nama Kosong)',
                    'identifier' => $student->identifier ?? $student->nim ?? '—', 
                    'total_verified_cases' => $verifiedCases->count(),
                    'progress' => [
                        'kompetensi_dasar'    => $kompetensiDasarCount,
                        'bedah_umum'          => $bedahUmumCount,
                        'manajemen_nyeri'     => $manajemenNyeriCount,
                        'obstetri_ginekologi' => $obstetriCount,
                        'bedah_saraf'         => $bedahSarafCount,
                        'kompetensi_lanjut'   => $kompetensiLanjutCount
                    ]
                ];
            }

            return response()->json($result, 200);

        } catch (\Throwable $e) {
            // MENANGKAP FATAL EXCEPTION DATABASE & STRUKTUR LUAR UNTUK DIPILIH DI FRONTEND KOORDINAT KOTAK MERAH
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memproses data internal Eloquent.',
                'debug_exception' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}