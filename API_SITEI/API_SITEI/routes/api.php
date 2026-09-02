<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\LecturerController;
use App\Http\Controllers\Api\AccountSettingsController;
use App\Http\Controllers\Api\MahasiswaAccountController;
use App\Http\Controllers\Api\MentorController;
use App\Http\Controllers\Api\FaceRegistrationController;
use App\Http\Controllers\Api\MedicalCaseController;
use App\Http\Controllers\Api\RiwayatKasusController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\LecturerMentorshipController;
use App\Http\Controllers\Api\CommunityServiceController;
use App\Http\Controllers\Api\AcademicActivityController;
use App\Http\Controllers\Api\GuidanceCounselingController;
use App\Http\Controllers\Api\SoftSkillGuidanceController;
use App\Http\Controllers\Api\CompetencyProgressController;
use App\Http\Controllers\Api\DopsEvaluationController;
use App\Http\Controllers\Api\ThesisGuidanceController;
use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\LeaveRequestController;
use App\Http\Controllers\Api\LecturerLeaveApprovalController;

//Api Prensensi
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\LocationAreaController;
use App\Http\Controllers\Api\ProfileController;


// ─── Public Routes ────────────────────────────────────────────────────────────

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/get-user-vector/{identifier}', [AuthController::class, 'getUserVector']);
Route::post('/login-biometric', [AuthController::class, 'loginBiometric']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password-action', [ForgotPasswordController::class, 'resetPassword']);
Route::get('/get-all-dosen-vectors', [AuthController::class, 'getAllDosenVectors']);
Route::middleware('auth:sanctum')->post('/change-password', [AuthController::class, 'changePassword']);

Route::get('/students', [StudentController::class, 'index']);
Route::post('/students', [StudentController::class, 'store']);
Route::put('/students/{id}', [StudentController::class, 'update']);
Route::delete('/students/{id}', [StudentController::class, 'destroy']);

Route::get('/lecturers', [LecturerController::class, 'index']);
Route::post('/lecturers', [LecturerController::class, 'store']);
Route::put('/lecturers/{id}', [LecturerController::class, 'update']);
Route::delete('/lecturers/{id}', [LecturerController::class, 'destroy']);

Route::post('/extract-face', [AiController::class, 'extractFace']);
Route::post('/verify-face', [AiController::class, 'verifyFace']);
Route::post('/detect-face', [AiController::class, 'detectFace']);

// ─── Lecturer & Admin Routes ──────────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/lecturer/profile', [AccountSettingsController::class, 'getProfile']);
    Route::post('/lecturer/profile', [AccountSettingsController::class, 'updateProfile']);
    Route::put('/lecturer/password', [AccountSettingsController::class, 'updatePassword']);
    Route::post('/lecturer/register-face', [FaceRegistrationController::class, 'registerFace']);
    Route::get('/lecturer/pending-cases', [MedicalCaseController::class, 'getPendingCases']);
    Route::post('/lecturer/verify-case/{id}', [MedicalCaseController::class, 'verifyCase']);
    Route::get('/lecturer/pending-cases', [MedicalCaseController::class, 'getLecturerCases']);
    Route::get('/lecturer/validation-history', [MedicalCaseController::class, 'getLecturerHistory']);
    Route::get('/lecturer/validation-history', [LecturerMentorshipController::class, 'getLecturerHistory']);
    Route::get('/lecturer/residents-progress', [LecturerMentorshipController::class, 'getResidentsProgress']);
    Route::get('/lecturer/pending-community-services', [CommunityServiceController::class, 'getLecturerPending']);
    Route::post('/lecturer/verify-community-service/{id}', [CommunityServiceController::class, 'verifyService']);
    Route::get('/lecturer/history-community-services', [CommunityServiceController::class, 'getLecturerHistory']);
    Route::get('/lecturer/pending-academic-activities', [AcademicActivityController::class, 'getLecturerPending']);
    Route::post('/lecturer/verify-academic-activity/{id}', [AcademicActivityController::class, 'verifyActivity']);
    Route::get('/lecturer/history-academic-activities', [AcademicActivityController::class, 'getLecturerHistory']);
    Route::get('/lecturer/my-mentorship-students', [AcademicActivityController::class, 'getMyStudents']);
    Route::get('/lecturer/my-students', [GuidanceCounselingController::class, 'getStudents']);
    Route::get('/lecturer/history-guidance-counselings', [GuidanceCounselingController::class, 'getLecturerHistory']);
    Route::post('/lecturer/store-guidance-counseling', [GuidanceCounselingController::class, 'storeByLecturer']);
    Route::put('/lecturer/update-guidance-counseling/{id}', [GuidanceCounselingController::class, 'update']);
    Route::delete('/lecturer/delete-guidance-counseling/{id}', [GuidanceCounselingController::class, 'destroy']);
    Route::get('/lecturer/my-softskill-students', [SoftSkillGuidanceController::class, 'getStudents']);
    Route::get('/lecturer/history-soft-skill-guidances', [SoftSkillGuidanceController::class, 'getLecturerHistory']);
    Route::post('/lecturer/store-soft-skill-guidance', [SoftSkillGuidanceController::class, 'store']);
    Route::put('/lecturer/update-soft-skill-guidance/{id}', [SoftSkillGuidanceController::class, 'update']);
    Route::delete('/lecturer/delete-soft-skill-guidance/{id}', [SoftSkillGuidanceController::class, 'destroy']);
    Route::get('/lecturer/dops-history', [DopsEvaluationController::class, 'getLecturerHistory']);
    Route::post('/lecturer/store-dops', [DopsEvaluationController::class, 'store']);
    Route::delete('/lecturer/delete-dops/{id}', [DopsEvaluationController::class, 'destroy']);
    Route::get('/lecturer/my-students-thesis', [ThesisGuidanceController::class, 'getStudents']);
    Route::get('/lecturer/history-thesis-guidances', [ThesisGuidanceController::class, 'getLecturerHistory']);
    Route::post('/lecturer/store-thesis-guidance', [ThesisGuidanceController::class, 'storeByLecturer']);
    Route::put('/lecturer/update-thesis-guidance/{id}', [ThesisGuidanceController::class, 'update']);
    Route::delete('/lecturer/delete-thesis-guidance/{id}', [ThesisGuidanceController::class, 'destroy']);
    Route::get('/lecturer/leave-requests', [LecturerLeaveApprovalController::class, 'index']);
    Route::post('/lecturer/leave-requests/{id}/approve', [LecturerLeaveApprovalController::class, 'approve']);
    Route::post('/lecturer/leave-requests/{id}/reject', [LecturerLeaveApprovalController::class, 'reject']);

    Route::get('/admin/mentorship', [MentorController::class, 'index']);
    Route::post('/admin/update-mentor', [MentorController::class, 'updateMentor']);
    Route::get('/admin/users', [FaceRegistrationController::class, 'getUsers']);
    Route::post('/admin/reset-face/{id}', [FaceRegistrationController::class, 'resetFace']);

    //Prensensi API Admin
    Route::get('/admin/schedules', [ScheduleController::class, 'index']);
    Route::post('/admin/schedules', [ScheduleController::class, 'store']);
    Route::get('/admin/schedules/{id}', [ScheduleController::class, 'show']);
    Route::put('/admin/schedules/{id}', [ScheduleController::class, 'update']);
    Route::delete('/admin/schedules/{id}', [ScheduleController::class, 'destroy']);
    Route::get('/admin/schedules/{id}/users', [ScheduleController::class, 'getAssignedUsers']);
    Route::post('/admin/schedules/{id}/users', [ScheduleController::class, 'assignUsers']);

    // Admin Locations
    Route::get('/admin/locations', [LocationAreaController::class, 'index']);
    Route::post('/admin/locations', [LocationAreaController::class, 'store']);
    Route::put('/admin/locations/{id}', [LocationAreaController::class, 'update']);
    Route::delete('/admin/locations/{id}', [LocationAreaController::class, 'destroy']);
    Route::get('/admin/locations/{id}/users', [LocationAreaController::class, 'getAssignedUsers']);
    Route::post('/admin/locations/{id}/users', [LocationAreaController::class, 'syncUsers']);
    Route::post('/admin/locations/{id}/approve', [LocationAreaController::class, 'approve']);
    Route::post('/admin/locations/{id}/reject', [LocationAreaController::class, 'reject']);
    Route::get('/admin/users/{id}/locations', [LocationAreaController::class, 'getUserLocations']);
    Route::post('/admin/users/{id}/locations', [LocationAreaController::class, 'syncUserLocations']);

        Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
    Route::post('/attendance/check-out', [AttendanceController::class, 'checkOut']);
    Route::get('/attendance/today', [AttendanceController::class, 'getToday']);
    Route::get('/attendance/history', [AttendanceController::class, 'history']);
    Route::get('/attendance/locations', [LocationAreaController::class, 'getApprovedLocations']);
    Route::get('/user/schedule/today', [ScheduleController::class, 'todayForUser']);
    
    // Phase 4 Routes
    Route::post('/user/profile', [ProfileController::class, 'update']);
    Route::post('/user/fcm-token', [ProfileController::class, 'updateFcmToken']);
    Route::get('/admin/attendance/photo', [AttendanceController::class, 'servePhoto']);
    Route::get('/attendance/photo', [AttendanceController::class, 'servePhoto']);
    Route::post('/admin/attendance/{id}/reset-flag', [AttendanceController::class, 'resetFlag'])->whereNumber('id');
    Route::get('/admin/attendance/history', [AttendanceController::class, 'adminHistory']);
    Route::get('/admin/attendance/export', [AttendanceController::class, 'exportCsv']);
    Route::get('/admin/attendance/{id}', [AttendanceController::class, 'show'])->whereNumber('id');
    Route::delete('/admin/attendance/{id}', [AttendanceController::class, 'destroy'])->whereNumber('id');
});

// ─── Mahasiswa Routes ─────────────────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/mahasiswa/profile', [MahasiswaAccountController::class, 'getProfile']);
    Route::post('/mahasiswa/profile', [MahasiswaAccountController::class, 'updateProfile']);
    Route::put('/mahasiswa/password', [MahasiswaAccountController::class, 'updatePassword']);
    Route::get('/mahasiswa/konsulen', [MedicalCaseController::class, 'getKonsulen']);
    Route::get('/mahasiswa/cases', [MedicalCaseController::class, 'index']);
    Route::post('/mahasiswa/cases', [MedicalCaseController::class, 'store']);
    Route::get('/mahasiswa/riwayat', [RiwayatKasusController::class, 'index']);
    Route::get('/mahasiswa/riwayat/{id}', [RiwayatKasusController::class, 'show']);
    Route::delete('/mahasiswa/riwayat/{id}', [RiwayatKasusController::class, 'destroy']);
    Route::get('/mahasiswa/community-services', [CommunityServiceController::class, 'index']);
    Route::post('/mahasiswa/community-services', [CommunityServiceController::class, 'store']);
    Route::get('/mahasiswa/academic-activities', [AcademicActivityController::class, 'index']);
    Route::post('/mahasiswa/academic-activities', [AcademicActivityController::class, 'store']);
    Route::get('/mahasiswa/competency-progress', [CompetencyProgressController::class, 'getStudentProgress']);
    Route::get('/mahasiswa/dops-evaluations', [DopsEvaluationController::class, 'getStudentHistory']);
    Route::get('/mahasiswa/thesis-guidances', [ThesisGuidanceController::class, 'getStudentHistory']);
    Route::get('/mahasiswa/leave-requests', [LeaveRequestController::class, 'index']);
    Route::post('/mahasiswa/leave-requests', [LeaveRequestController::class, 'store']);
    Route::delete('/mahasiswa/leave-requests/{id}', [LeaveRequestController::class, 'destroy']);
    Route::get('/mahasiswa/guidance-counselings', function () {
        return response()->json(
            \App\Models\GuidanceCounseling::where('user_id', auth()->id())
                ->orderBy('tanggal', 'desc')
                ->get(),
            200
        );
    });

    Route::get('/mahasiswa/soft-skill-guidances', function () {
        return response()->json(
            \App\Models\SoftSkillGuidance::where('user_id', auth()->id())
                ->orderBy('tanggal', 'desc')
                ->get(),
            200
        );
    });

Route::get('/mahasiswa/dashboard-stats', function () {
    try {
        $userId = auth()->id();
 
        // ════════════════════════════════════════════════════════════════════
        // 1. TOTAL KASUS & PROGRES — dihitung dari medical_cases langsung
        // ════════════════════════════════════════════════════════════════════
        $totalKasus    = \App\Models\MedicalCase::where('user_id', $userId)->count();
        $verifiedKasus = \App\Models\MedicalCase::where('user_id', $userId)->where('status', 'verified')->count();
        $pendingKasus  = \App\Models\MedicalCase::where('user_id', $userId)->where('status', 'pending')->count();
        $rejectedKasus = \App\Models\MedicalCase::where('user_id', $userId)->where('status', 'rejected')->count();
 
        // Target kurikulum total (sesuai standar PPDS — bisa disesuaikan)
        $targetTotal   = 100;
        $progresPersen = $targetTotal > 0 ? min(round(($verifiedKasus / $targetTotal) * 100), 100) : 0;
 
        // ════════════════════════════════════════════════════════════════════
        // 2. LOGBOOK PENGABDIAN & KEGIATAN ILMIAH
        // ════════════════════════════════════════════════════════════════════
        $approvedCount = \App\Models\CommunityService::where('user_id', $userId)->where('status', 'verified')->count()
                       + \App\Models\AcademicActivity::where('user_id', $userId)->where('status', 'verified')->count();
 
        $pendingCount  = \App\Models\CommunityService::where('user_id', $userId)->where('status', 'pending')->count()
                       + \App\Models\AcademicActivity::where('user_id', $userId)->where('status', 'pending')->count();
 
        // ════════════════════════════════════════════════════════════════════
        // 3. GRAFIK PER JENIS_KASUS — dari kolom jenis_kasus di medical_cases
        // ════════════════════════════════════════════════════════════════════
 
        // Target per jenis kasus (sesuai kurikulum PPDS Anestesiologi UNRI)
        $targetPerJenis = [
            'Kompetensi Dasar'           => 50,
            'Bedah Umum'                 => 40,
            'Manajemen Nyeri'            => 20,
            'Obstetri & Ginekologi'      => 20,
            'Bedah Saraf'                => 15,
            'Kompetensi Lanjut'          => 30,
        ];
 
        $kasusPerJenis = \App\Models\MedicalCase::where('user_id', $userId)
            ->where('status', 'verified')
            ->select('jenis_kasus')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('jenis_kasus')
            ->get()
            ->keyBy('jenis_kasus');
 
        $chartData = [];
        foreach ($targetPerJenis as $jenis => $target) {
            $capaian = $kasusPerJenis->has($jenis) ? $kasusPerJenis[$jenis]->total : 0;
            $pct     = $target > 0 ? min(round(($capaian / $target) * 100), 100) : 0;
            $chartData[] = [
                'label'      => $jenis,
                'capaian'    => $capaian,
                'target'     => $target,
                'percentage' => $pct,
            ];
        }
 
        // ════════════════════════════════════════════════════════════════════
        // 4. FEED AKTIVITAS TERBARU — gabungan B&K + Soft Skill (3 terbaru)
        // ════════════════════════════════════════════════════════════════════
        $bkFeeds = \App\Models\GuidanceCounseling::where('user_id', $userId)
            ->orderBy('tanggal', 'desc')
            ->take(3)
            ->get()
            ->map(function ($item) {
                return [
                    'type'     => 'bk',
                    'title'    => 'Bimbingan & Konseling',
                    'subtitle' => \Illuminate\Support\Str::limit($item->keterangan, 50),
                    'tanggal'  => $item->tanggal
                        ? (is_string($item->tanggal)
                            ? strtotime($item->tanggal) * 1000
                            : $item->tanggal->getTimestamp() * 1000)
                        : null,
                    'status'   => $item->status,
                ];
            });
 
        $ssFeeds = \App\Models\SoftSkillGuidance::where('user_id', $userId)
            ->orderBy('tanggal', 'desc')
            ->take(3)
            ->get()
            ->map(function ($item) {
                return [
                    'type'     => 'softskill',
                    'title'    => 'Pembinaan Soft Skill',
                    'subtitle' => \Illuminate\Support\Str::limit($item->keterangan, 50),
                    'tanggal'  => $item->tanggal
                        ? (is_string($item->tanggal)
                            ? strtotime($item->tanggal) * 1000
                            : $item->tanggal->getTimestamp() * 1000)
                        : null,
                    'status'   => $item->status,
                ];
            });
 
        // Gabungkan & ambil 4 terbaru
        $feeds = $bkFeeds->concat($ssFeeds)
            ->sortByDesc('tanggal')
            ->take(4)
            ->values();
 
        // ════════════════════════════════════════════════════════════════════
        // 5. KASUS TERBARU (3 logbook terakhir untuk preview)
        // ════════════════════════════════════════════════════════════════════
        $recentCases = \App\Models\MedicalCase::where('user_id', $userId)
            ->orderBy('tanggal_tindakan', 'desc')
            ->take(3)
            ->get()
            ->map(function ($item) {
                return [
                    'tindakan'         => $item->tindakan,
                    'jenis_kasus'      => $item->jenis_kasus,
                    'tanggal_tindakan' => $item->tanggal_tindakan,
                    'status'           => $item->status,
                    'dpjp_name'        => $item->dpjp_name,
                ];
            });
 
        return response()->json([
            // Statistik utama
            'total_kasus'    => $totalKasus,
            'verified_kasus' => $verifiedKasus,
            'pending_kasus'  => $pendingKasus,
            'rejected_kasus' => $rejectedKasus,
            'progres_persen' => $progresPersen,
            'target_total'   => $targetTotal,
 
            // Logbook pengabdian & ilmiah
            'approved_count' => $approvedCount,
            'pending_count'  => $pendingCount,
 
            // Grafik & feed
            'chart_data'     => $chartData,
            'feeds'          => $feeds,
            'recent_cases'   => $recentCases,
        ], 200);
 
    } catch (\Throwable $e) {
        return response()->json([
            'status'          => 'error',
            'message'         => 'Gagal memproses perhitungan dasbor analitikal internal.',
            'debug_exception' => $e->getMessage(),
        ], 500);
        }
    });

    Route::get('/lecturer/dashboard-stats', function () {
    try {
        $lecturerId = auth()->id();
 
        // Ambil semua student_id di bawah bimbingan konsulen ini
        $studentIds = \App\Models\Mentorship::where('lecturer_id', $lecturerId)
            ->pluck('student_id');
 
        $totalResiden = $studentIds->count();
 
        // ════════════════════════════════════════════════════════════════════
        // 1. ANTRIAN VALIDASI — kasus pending milik residen bimbingan
        // ════════════════════════════════════════════════════════════════════
        $pendingKasus = \App\Models\MedicalCase::whereIn('user_id', $studentIds)
            ->where('status', 'pending')
            ->count();
 
        $pendingCommunity = \App\Models\CommunityService::whereIn('user_id', $studentIds)
            ->where('status', 'pending')
            ->count();
 
        $pendingAcademic = \App\Models\AcademicActivity::whereIn('user_id', $studentIds)
            ->where('status', 'pending')
            ->count();
 
        $totalAntrian = $pendingKasus + $pendingCommunity + $pendingAcademic;
 
        // ════════════════════════════════════════════════════════════════════
        // 2. DIVALIDASI HARI INI
        // ════════════════════════════════════════════════════════════════════
        $validasiHariIni = \App\Models\MedicalCase::whereIn('user_id', $studentIds)
            ->where('status', 'verified')
            ->whereDate('updated_at', today())
            ->count();
 
        // ════════════════════════════════════════════════════════════════════
        // 3. TOTAL TERVALIDASI KESELURUHAN
        // ════════════════════════════════════════════════════════════════════
        $totalVerified = \App\Models\MedicalCase::whereIn('user_id', $studentIds)
            ->where('status', 'verified')
            ->count();
 
        $totalRejected = \App\Models\MedicalCase::whereIn('user_id', $studentIds)
            ->where('status', 'rejected')
            ->count();
 
        // ════════════════════════════════════════════════════════════════════
        // 4. ANTRIAN TERBARU (5 kasus pending terbaru untuk preview)
        // ════════════════════════════════════════════════════════════════════
        $antrianTerbaru = \App\Models\MedicalCase::with('user:id,name,identifier')
            ->whereIn('user_id', $studentIds)
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id'               => $item->id,
                    'residen_name'     => $item->user?->name ?? '—',
                    'residen_initials' => collect(explode(' ', $item->user?->name ?? 'DR'))
                        ->map(fn($w) => strtoupper(substr($w, 0, 1)))
                        ->take(2)
                        ->implode(''),
                    'tindakan'         => $item->tindakan,
                    'jenis_kasus'      => $item->jenis_kasus,
                    'jenis_anestesi'   => $item->jenis_anestesi,
                    'tanggal_tindakan' => $item->tanggal_tindakan,
                    'created_at'       => $item->created_at,
                    'status'           => $item->status,
                ];
            });
 
        // ════════════════════════════════════════════════════════════════════
        // 5. PROGRESS PER RESIDEN BIMBINGAN
        // ════════════════════════════════════════════════════════════════════
        $residenProgress = \App\Models\Mentorship::with('student:id,name,identifier')
            ->where('lecturer_id', $lecturerId)
            ->get()
            ->map(function ($m) {
                if (!$m->student) return null;
 
                $total    = \App\Models\MedicalCase::where('user_id', $m->student_id)->count();
                $verified = \App\Models\MedicalCase::where('user_id', $m->student_id)->where('status', 'verified')->count();
                $pending  = \App\Models\MedicalCase::where('user_id', $m->student_id)->where('status', 'pending')->count();
 
                // Target kurikulum 100 kasus
                $pct = $verified > 0 ? min(round(($verified / 100) * 100), 100) : 0;
 
                return [
                    'id'         => $m->student->id,
                    'name'       => $m->student->name,
                    'identifier' => $m->student->identifier ?? '—',
                    'initials'   => collect(explode(' ', $m->student->name))
                        ->map(fn($w) => strtoupper(substr($w, 0, 1)))
                        ->take(2)
                        ->implode(''),
                    'total'      => $total,
                    'verified'   => $verified,
                    'pending'    => $pending,
                    'percentage' => $pct,
                ];
            })
            ->filter()
            ->values();
 
        // ════════════════════════════════════════════════════════════════════
        // 6. RATA-RATA PENCAPAIAN TARGET SELURUH RESIDEN
        // ════════════════════════════════════════════════════════════════════
        $avgPencapaian = $residenProgress->count() > 0
            ? round($residenProgress->avg('percentage'))
            : 0;
 
        // ════════════════════════════════════════════════════════════════════
        // 7. BREAKDOWN ANTRIAN PER JENIS LOGBOOK
        // ════════════════════════════════════════════════════════════════════
        $antrianBreakdown = [
            ['label' => 'Kasus Klinis',       'count' => $pendingKasus,     'color' => 'blue'   ],
            ['label' => 'Kegiatan Ilmiah',     'count' => $pendingAcademic,  'color' => 'purple' ],
            ['label' => 'Pengabdian Masyarakat','count' => $pendingCommunity,'color' => 'amber'  ],
        ];
 
        return response()->json([
            // Stat cards
            'total_antrian'      => $totalAntrian,
            'validasi_hari_ini'  => $validasiHariIni,
            'total_verified'     => $totalVerified,
            'total_rejected'     => $totalRejected,
            'total_residen'      => $totalResiden,
            'avg_pencapaian'     => $avgPencapaian,
 
            // Breakdown antrian
            'antrian_breakdown'  => $antrianBreakdown,
 
            // Data tabel & progress
            'antrian_terbaru'    => $antrianTerbaru,
            'residen_progress'   => $residenProgress,
        ], 200);
 
    } catch (\Throwable $e) {
        return response()->json([
            'status'          => 'error',
            'message'         => 'Gagal memproses data dasbor konsulen.',
            'debug_exception' => $e->getMessage(),
        ], 500);
        }
    });

    Route::get('/admin/dashboard-stats', function () {
    try {
 
        // ════════════════════════════════════════════════════════════════════
        // 1. STATISTIK PENGGUNA
        // ════════════════════════════════════════════════════════════════════
        $totalMahasiswa     = \App\Models\User::where('role', 'Mahasiswa')->count();
        $totalDosen         = \App\Models\User::where('role', 'Dosen')->count();
        $mahasiswaAktif     = \App\Models\User::where('role', 'Mahasiswa')->where('status', 'Aktif')->count();
        $dosenAktif         = \App\Models\User::where('role', 'Dosen')->where('status', 'Aktif')->count();
 
        // Tambahan bulan ini
        $mahasiswaBulanIni  = \App\Models\User::where('role', 'Mahasiswa')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $dosenBulanIni      = \App\Models\User::where('role', 'Dosen')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
 
        // ════════════════════════════════════════════════════════════════════
        // 2. STATISTIK LOGBOOK KESELURUHAN SISTEM
        // ════════════════════════════════════════════════════════════════════
        $totalKasus         = \App\Models\MedicalCase::count();
        $kasusVerified      = \App\Models\MedicalCase::where('status', 'verified')->count();
        $kasusPending       = \App\Models\MedicalCase::where('status', 'pending')->count();
        $kasusRejected      = \App\Models\MedicalCase::where('status', 'rejected')->count();
 
        $totalCommunity     = \App\Models\CommunityService::count();
        $communityVerified  = \App\Models\CommunityService::where('status', 'verified')->count();
        $communityPending   = \App\Models\CommunityService::where('status', 'pending')->count();
 
        $totalAcademic      = \App\Models\AcademicActivity::count();
        $academicVerified   = \App\Models\AcademicActivity::where('status', 'verified')->count();
        $academicPending    = \App\Models\AcademicActivity::where('status', 'pending')->count();
 
        $totalGuidance      = \App\Models\GuidanceCounseling::count();
        $totalSoftSkill     = \App\Models\SoftSkillGuidance::count();
 
        // Total pending seluruh sistem
        $totalPendingSystem = $kasusPending + $communityPending + $academicPending;
 
        // ════════════════════════════════════════════════════════════════════
        // 3. STATISTIK MENTORSHIP
        // ════════════════════════════════════════════════════════════════════
        $totalMentorship        = \App\Models\Mentorship::count();
        $mahasiswaBelumDibimbing = \App\Models\User::where('role', 'Mahasiswa')
            ->whereNotIn('id', \App\Models\Mentorship::pluck('student_id'))
            ->count();
 
        // ════════════════════════════════════════════════════════════════════
        // 4. BIOMETRIK FACE REGISTRATION
        // ════════════════════════════════════════════════════════════════════
        $dosenTerdaftarWajah  = \App\Models\User::where('role', 'Dosen')
            ->whereNotNull('face_vector')
            ->count();
        $dosenBelumDaftarWajah = $totalDosen - $dosenTerdaftarWajah;
 
        // ════════════════════════════════════════════════════════════════════
        // 5. AKTIVITAS TERBARU SISTEM (10 user terbaru terdaftar)
        // ════════════════════════════════════════════════════════════════════
        $penggunaTerbaru = \App\Models\User::orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map(fn($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'role'       => $u->role,
                'identifier' => $u->identifier ?? '—',
                'initials'   => collect(explode(' ', $u->name))
                    ->map(fn($w) => strtoupper(substr($w, 0, 1)))
                    ->take(2)
                    ->implode(''),
                'created_at' => $u->created_at,
                'status'     => $u->status ?? 'Aktif',
            ]);
 
        // ════════════════════════════════════════════════════════════════════
        // 6. LOGBOOK PER JENIS — untuk grafik breakdown
        // ════════════════════════════════════════════════════════════════════
        $logbookBreakdown = [
            ['label' => 'Kasus Klinis',        'total' => $totalKasus,    'verified' => $kasusVerified,     'pending' => $kasusPending,    'color' => 'blue'   ],
            ['label' => 'Pengabdian Masyarakat','total' => $totalCommunity,'verified' => $communityVerified, 'pending' => $communityPending,'color' => 'purple' ],
            ['label' => 'Kegiatan Ilmiah',      'total' => $totalAcademic, 'verified' => $academicVerified,  'pending' => $academicPending, 'color' => 'amber'  ],
            ['label' => 'B&K',                  'total' => $totalGuidance, 'verified' => $totalGuidance,     'pending' => 0,                'color' => 'teal'   ],
            ['label' => 'Soft Skill',           'total' => $totalSoftSkill,'verified' => $totalSoftSkill,    'pending' => 0,                'color' => 'green'  ],
        ];
 
        // ════════════════════════════════════════════════════════════════════
        // 7. KASUS TERBARU DI SELURUH SISTEM (5 kasus pending terbaru)
        // ════════════════════════════════════════════════════════════════════
        $kasusTerbaru = \App\Models\MedicalCase::with('user:id,name,identifier')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(fn($item) => [
                'id'               => $item->id,
                'residen_name'     => $item->user?->name ?? '—',
                'residen_initials' => collect(explode(' ', $item->user?->name ?? 'DR'))
                    ->map(fn($w) => strtoupper(substr($w, 0, 1)))
                    ->take(2)->implode(''),
                'tindakan'         => $item->tindakan,
                'jenis_kasus'      => $item->jenis_kasus,
                'tanggal_tindakan' => $item->tanggal_tindakan,
                'created_at'       => $item->created_at,
                'status'           => $item->status,
            ]);
 
        return response()->json([
            // Pengguna
            'total_mahasiswa'          => $totalMahasiswa,
            'total_dosen'              => $totalDosen,
            'mahasiswa_aktif'          => $mahasiswaAktif,
            'dosen_aktif'              => $dosenAktif,
            'mahasiswa_bulan_ini'      => $mahasiswaBulanIni,
            'dosen_bulan_ini'          => $dosenBulanIni,
 
            // Logbook sistem
            'total_kasus'              => $totalKasus,
            'kasus_verified'           => $kasusVerified,
            'kasus_pending'            => $kasusPending,
            'kasus_rejected'           => $kasusRejected,
            'total_pending_system'     => $totalPendingSystem,
 
            // Mentorship & biometrik
            'total_mentorship'         => $totalMentorship,
            'mahasiswa_belum_dibimbing'=> $mahasiswaBelumDibimbing,
            'dosen_terdaftar_wajah'    => $dosenTerdaftarWajah,
            'dosen_belum_daftar_wajah' => $dosenBelumDaftarWajah,
 
            // Breakdown & tabel
            'logbook_breakdown'        => $logbookBreakdown,
            'pengguna_terbaru'         => $penggunaTerbaru,
            'kasus_terbaru'            => $kasusTerbaru,
        ], 200);
 
    } catch (\Throwable $e) {
        return response()->json([
            'status'          => 'error',
            'message'         => 'Gagal memproses data dasbor admin.',
            'debug_exception' => $e->getMessage(),
        ], 500);
     }
    });
});