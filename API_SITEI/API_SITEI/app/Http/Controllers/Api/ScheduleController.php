<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::with('locationAreas', 'users')->get();

        return response()->json([
            'success' => true,
            'data' => $schedules
        ]);
    }

    public function todayForUser(Request $request)
    {
        $user = $request->user();
        $now = \Carbon\Carbon::now();
        
        $dayOfWeekIso = (string)$now->isoFormat('E'); // 1 (Mon) to 7 (Sun)
        $dayOfWeekIndex = (string)$now->dayOfWeek;    // 0 (Sun) to 6 (Sat)
        $dayNameEn = $now->format('l');              // Monday
        $dayNameEnShort = $now->format('D');         // Mon
        $dayNameId = match($dayOfWeekIso) {
            '1' => 'Senin',
            '2' => 'Selasa',
            '3' => 'Rabu',
            '4' => 'Kamis',
            '5' => 'Jumat',
            '6' => 'Sabtu',
            '7' => 'Minggu',
            default => 'Senin'
        };

        // Cari schedule yang di-assign ke user ini
        $schedules = Schedule::whereHas('users', function ($q) use ($user) {
            $q->where('users.id', $user->id);
        })->with('locationAreas')->get();

        if ($schedules->isEmpty()) {
            // Fallback: jika user belum di-assign spesifik, ambil semua schedule yang aktif
            $schedules = Schedule::with('locationAreas')->get();
        }

        // Cari yang match hari ini
        $matchedSchedule = $schedules->first(function ($schedule) use ($dayOfWeekIso, $dayOfWeekIndex, $dayNameEn, $dayNameEnShort, $dayNameId) {
            $days = is_array($schedule->days_of_week) ? $schedule->days_of_week : json_decode($schedule->days_of_week, true);
            if (empty($days)) return true;

            foreach ($days as $d) {
                $dStr = (string)$d;
                if (
                    strcasecmp($dStr, $dayNameEn) === 0 ||
                    strcasecmp($dStr, $dayNameEnShort) === 0 ||
                    strcasecmp($dStr, $dayNameId) === 0 ||
                    $dStr === $dayOfWeekIso ||
                    $dStr === $dayOfWeekIndex
                ) {
                    return true;
                }
            }
            return false;
        });

        return response()->json([
            'success' => true,
            'data' => $matchedSchedule
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'days_of_week' => 'required|array',
            'check_in_start' => 'required',
            'check_in_end' => 'required',
            'check_out_start' => 'required',
            'check_out_end' => 'required',
            'allow_home_location' => 'boolean',
            'location_area_ids' => 'nullable|array',
        ]);

        $schedule = Schedule::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'days_of_week' => $validated['days_of_week'],
            'check_in_start' => $validated['check_in_start'],
            'check_in_end' => $validated['check_in_end'],
            'check_out_start' => $validated['check_out_start'],
            'check_out_end' => $validated['check_out_end'],
            'allow_home_location' => $validated['allow_home_location'] ?? false,
            'created_by' => $request->user()->id,
        ]);

        if (!empty($validated['location_area_ids'])) {
            $schedule->locationAreas()->sync($validated['location_area_ids']);
        }

        $schedule->load('locationAreas', 'users');

        return response()->json([
            'success' => true,
            'data' => $schedule,
            'message' => 'Template jadwal berhasil dibuat.'
        ], 201);
    }

    public function show($id)
    {
        $schedule = Schedule::with('locationAreas', 'users')->find($id);

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $schedule
        ]);
    }

    public function update(Request $request, $id)
    {
        $schedule = Schedule::find($id);

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found.'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'days_of_week' => 'required|array',
            'check_in_start' => 'required',
            'check_in_end' => 'required',
            'check_out_start' => 'required',
            'check_out_end' => 'required',
            'allow_home_location' => 'boolean',
            'location_area_ids' => 'nullable|array',
        ]);

        $schedule->update([
            'name' => $validated['name'],
            'days_of_week' => $validated['days_of_week'],
            'check_in_start' => $validated['check_in_start'],
            'check_in_end' => $validated['check_in_end'],
            'check_out_start' => $validated['check_out_start'],
            'check_out_end' => $validated['check_out_end'],
            'allow_home_location' => $validated['allow_home_location'] ?? false,
        ]);

        if (array_key_exists('location_area_ids', $validated)) {
            $schedule->locationAreas()->sync($validated['location_area_ids'] ?? []);
        }

        $schedule->load('locationAreas', 'users');

        return response()->json([
            'success' => true,
            'data' => $schedule,
            'message' => 'Template jadwal berhasil diperbarui.'
        ]);
    }

    public function destroy($id)
    {
        $schedule = Schedule::find($id);

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found.'
            ], 404);
        }

        $schedule->delete();

        return response()->json([
            'success' => true,
            'message' => 'Template jadwal berhasil dihapus.'
        ]);
    }

    public function getAssignedUsers($id)
    {
        $schedule = Schedule::findOrFail($id);

        return response()->json([
            'assigned_user_ids' => $schedule->users()->pluck('users.id')
        ]);
    }

    public function assignUsers(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);

        $request->validate([
            'user_ids' => 'array'
        ]);

        $schedule->users()->sync($request->user_ids ?? []);

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil di-assign.'
        ]);
    }
}
