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
