<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Exception;

class AttendanceController extends Controller
{
    public function checkIn(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo_base64' => 'required|string'
        ]);

        $user = $request->user();

        // 1. Call Python microservice
        $aiServiceUrl = env('AI_SERVICE_URL', 'http://127.0.0.1:8001');
        try {
            $pythonResponse = Http::timeout(3)->post($aiServiceUrl . '/detect-face', [
                'image_base64' => $request->photo_base64
            ]);

            if ($pythonResponse->successful()) {
                $pythonData = $pythonResponse->json();
                if (isset($pythonData['face_detected']) && $pythonData['face_detected'] === false) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Wajah tidak terdeteksi dalam foto. Pastikan wajah terlihat jelas di kamera.'
                    ], 400);
                }
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Face detection microservice offline or unreachable: ' . $e->getMessage());
        }

        // 2. Save photo (decode base64 and store)
        $photoData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->photo_base64));
        $filename = 'attendance/check_in_' . $user->id . '_' . time() . '.jpg';
        Storage::disk('public')->put($filename, $photoData);

        $matchedAreaId = null;
        $areas = \App\Models\LocationArea::where('status', 'approved')->whereHas('users', function($q) use ($user) {
            $q->where('users.id', $user->id);
        })->get();

        if ($areas->isEmpty()) {
            $areas = \App\Models\LocationArea::where('status', 'approved')->get();
        }

        foreach ($areas as $area) {
            if ($area->type === 'radius' && $area->center_lat && $area->center_lng) {
                $dist = $this->calculateDistance($request->latitude, $request->longitude, $area->center_lat, $area->center_lng);
                if ($dist <= ($area->radius_meters ?: 100)) {
                    $matchedAreaId = $area->id;
                    break;
                }
            } else if ($area->type === 'polygon' && !empty($area->polygon_points)) {
                if ($this->isPointInPolygon($request->latitude, $request->longitude, $area->polygon_points)) {
                    $matchedAreaId = $area->id;
                    break;
                }
            }
        }

        $isFlagged = $matchedAreaId === null;
        $flagReason = $isFlagged ? "Lokasi berada di luar area yang diizinkan." : null;

        // 4. Save to DB
        AttendanceLog::create([
            'user_id' => $user->id,
            'type' => 'check_in',
            'photo_path' => $filename,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'is_flagged' => $isFlagged,
            'flag_reason' => $flagReason,
            'location_area_id' => $matchedAreaId,
            'attended_at' => Carbon::now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Berhasil melakukan Check-in.'
        ]);
    }

    public function checkOut(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo_base64' => 'required|string'
        ]);

        $user = $request->user();

        // 1. Call Python microservice
        $aiServiceUrl = env('AI_SERVICE_URL', 'http://127.0.0.1:8001');
        try {
            $pythonResponse = Http::timeout(3)->post($aiServiceUrl . '/detect-face', [
                'image_base64' => $request->photo_base64
            ]);

            if ($pythonResponse->successful()) {
                $pythonData = $pythonResponse->json();
                if (isset($pythonData['face_detected']) && $pythonData['face_detected'] === false) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Wajah tidak terdeteksi dalam foto. Pastikan wajah terlihat jelas di kamera.'
                    ], 400);
                }
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Face detection microservice offline or unreachable: ' . $e->getMessage());
        }

        // 2. Save photo (decode base64 and store)
        $photoData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->photo_base64));
        $filename = 'attendance/check_out_' . $user->id . '_' . time() . '.jpg';
        Storage::disk('public')->put($filename, $photoData);

        $matchedAreaId = null;
        $areas = \App\Models\LocationArea::where('status', 'approved')->whereHas('users', function($q) use ($user) {
            $q->where('users.id', $user->id);
        })->get();

        if ($areas->isEmpty()) {
            $areas = \App\Models\LocationArea::where('status', 'approved')->get();
        }

        foreach ($areas as $area) {
            if ($area->type === 'radius' && $area->center_lat && $area->center_lng) {
                $dist = $this->calculateDistance($request->latitude, $request->longitude, $area->center_lat, $area->center_lng);
                if ($dist <= ($area->radius_meters ?: 100)) {
                    $matchedAreaId = $area->id;
                    break;
                }
            } else if ($area->type === 'polygon' && !empty($area->polygon_points)) {
                if ($this->isPointInPolygon($request->latitude, $request->longitude, $area->polygon_points)) {
                    $matchedAreaId = $area->id;
                    break;
                }
            }
        }

        $isFlagged = $matchedAreaId === null;
        $flagReason = $isFlagged ? "Lokasi berada di luar area yang diizinkan." : null;

        // 4. Save to DB
        AttendanceLog::create([
            'user_id' => $user->id,
            'type' => 'check_out',
            'photo_path' => $filename,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'is_flagged' => $isFlagged,
            'flag_reason' => $flagReason,
            'location_area_id' => $matchedAreaId,
            'attended_at' => Carbon::now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Berhasil melakukan Check-out.'
        ]);
    }

    public function getToday(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today();

        $logs = AttendanceLog::with('locationArea')
            ->where('user_id', $user->id)
            ->whereDate('attended_at', $today)
            ->orderBy('attended_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    public function show($id)
    {
        $log = AttendanceLog::with(['locationArea', 'user'])->find($id);
        if (!$log) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $log]);
    }

    public function history(Request $request)
    {
        $user = $request->user();
        
        $query = AttendanceLog::where('user_id', $user->id)->with('locationArea');

        if ($request->has('month') && $request->has('year')) {
            $query->whereMonth('attended_at', $request->month)
                  ->whereYear('attended_at', $request->year);
        }

        $history = $query->orderBy('attended_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $history
        ]);
    }

    public function adminHistory(Request $request)
    {
        $month = $request->query('month', Carbon::now()->month);
        $year = $request->query('year', Carbon::now()->year);
        $userId = $request->query('user_id');
        $isFlagged = $request->query('is_flagged');

        $query = AttendanceLog::with(['locationArea', 'user']);

        if ($month) {
            $query->whereMonth('attended_at', $month);
        }
        if ($year) {
            $query->whereYear('attended_at', $year);
        }
        if (!empty($userId)) {
            $query->where('user_id', $userId);
        }
        if ($isFlagged !== null && $isFlagged !== '') {
            $flagVal = filter_var($isFlagged, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($flagVal !== null) {
                $query->where('is_flagged', $flagVal);
            }
        }

        $logs = $query->orderBy('attended_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    public function destroy($id)
    {
        $attendance = AttendanceLog::find($id);
        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Log presensi tidak ditemukan.'
            ], 404);
        }

        $attendance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Log presensi berhasil dihapus.'
        ]);
    }

    public function resetFlag($id)
    {
        $attendance = AttendanceLog::find($id);
        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        $attendance->is_flagged = false;
        $attendance->flag_reason = null;
        $attendance->save();
        return response()->json(['success' => true, 'message' => 'Flag reset']);
    }

    public function exportCsv(Request $request)
    {
        $month = $request->query('month', Carbon::now()->month);
        $year = $request->query('year', Carbon::now()->year);
        $userId = $request->query('user_id');

        $query = AttendanceLog::with(['locationArea', 'user']);

        if ($month) {
            $query->whereMonth('attended_at', $month);
        }
        if ($year) {
            $query->whereYear('attended_at', $year);
        }
        if (!empty($userId)) {
            $query->where('user_id', $userId);
        }

        $logs = $query->orderBy('attended_at', 'desc')->get();

        $filename = "rekap_presensi_{$year}_{$month}.csv";

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $callback = function () use ($logs) {
            $file = fopen('php://output', 'w');
            // Add UTF-8 BOM for Excel compatibility
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // Header row
            fputcsv($file, [
                'ID',
                'Nama Mahasiswa',
                'NIM / Identifier',
                'Tipe Presensi',
                'Waktu Presensi',
                'Area / Lokasi',
                'Latitude',
                'Longitude',
                'Status Validasi',
                'Catatan / Alasan Flag'
            ]);

            foreach ($logs as $log) {
                fputcsv($file, [
                    $log->id,
                    $log->user ? $log->user->name : 'N/A',
                    $log->user ? $log->user->identifier : 'N/A',
                    $log->type === 'check_in' ? 'Masuk (Check In)' : 'Pulang (Check Out)',
                    $log->attended_at ? $log->attended_at->format('Y-m-d H:i:s') : 'N/A',
                    $log->locationArea ? $log->locationArea->name : 'Di Luar Area',
                    $log->latitude,
                    $log->longitude,
                    $log->is_flagged ? 'Perlu Ditinjau (Flagged)' : 'Valid',
                    $log->flag_reason ?? '-'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function calculateDistance($lat1, $lon1, $lat2, $lon2) {
        $earthRadius = 6371000;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon/2) * sin($dLon/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        return $earthRadius * $c;
    }

    private function isPointInPolygon($lat, $lng, $polygonPoints) {
        $inside = false;
        $j = count($polygonPoints) - 1;
        for ($i = 0; $i < count($polygonPoints); $i++) {
            $xi = $polygonPoints[$i]['lat'];
            $yi = $polygonPoints[$i]['lng'];
            $xj = $polygonPoints[$j]['lat'];
            $yj = $polygonPoints[$j]['lng'];
            
            $intersect = (($yi > $lng) != ($yj > $lng))
                && ($lat < ($xj - $xi) * ($lng - $yi) / ($yj - $yi) + $xi);
            if ($intersect) $inside = !$inside;
            $j = $i;
        }
        return $inside;
    }
}
