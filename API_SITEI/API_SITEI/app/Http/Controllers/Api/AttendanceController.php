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
        try {
            $pythonResponse = Http::post('http://127.0.0.1:8002/detect-face', [
                'image_base64' => $request->photo_base64
            ]);

            if (!$pythonResponse->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menghubungi face detection service.'
                ], 500);
            }

            $pythonData = $pythonResponse->json();
            if (empty($pythonData['face_detected'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Wajah tidak terdeteksi dalam foto.'
                ], 400);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }

        // 2. Save photo (decode base64 and store)
        $photoData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->photo_base64));
        $filename = 'attendance/check_in_' . $user->id . '_' . time() . '.jpg';
        Storage::disk('public')->put($filename, $photoData);

        $matchedAreaId = null;
        $areas = \App\Models\LocationArea::where('status', 'approved')->whereHas('users', function($q) use ($user) {
            $q->where('users.id', $user->id);
        })->get();

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
        try {
            $pythonResponse = Http::post('http://127.0.0.1:8002/detect-face', [
                'image_base64' => $request->photo_base64
            ]);

            if (!$pythonResponse->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menghubungi face detection service.'
                ], 500);
            }

            $pythonData = $pythonResponse->json();
            if (empty($pythonData['face_detected'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Wajah tidak terdeteksi dalam foto.'
                ], 400);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }

        // 2. Save photo (decode base64 and store)
        $photoData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->photo_base64));
        $filename = 'attendance/check_out_' . $user->id . '_' . time() . '.jpg';
        Storage::disk('public')->put($filename, $photoData);

        $matchedAreaId = null;
        $areas = \App\Models\LocationArea::where('status', 'approved')->whereHas('users', function($q) use ($user) {
            $q->where('users.id', $user->id);
        })->get();

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

        $logs = AttendanceLog::with(['locationArea', 'user'])
            ->whereMonth('attended_at', $month)
            ->whereYear('attended_at', $year)
            ->orderBy('attended_at', 'desc')
            ->get();

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

    public function exportCsv()
    {
        return response()->json(['success' => true, 'message' => 'Export CSV dummy']);
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
