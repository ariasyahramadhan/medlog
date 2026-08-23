<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LocationArea;
use App\Models\User;
use Illuminate\Http\Request;

class LocationAreaController extends Controller
{
    public function index()
    {
        return response()->json(LocationArea::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|in:radius,polygon',
            'center_lat' => 'nullable|numeric',
            'center_lng' => 'nullable|numeric',
            'radius_meters' => 'nullable|numeric',
            'polygon_points' => 'nullable|array',
        ]);

        $status = 'approved';
        if (strtolower($request->user()->role) !== 'admin') {
            $status = 'pending';
            $validated['type'] = 'radius';
            $validated['radius_meters'] = 40.0;
        }

        // Check if an area created by this user already exists
        $area = LocationArea::where('created_by', $request->user()->id)->first();
        if ($area) {
            $area->update($validated + [
                'status' => $status
            ]);
            // Ensure relationship exists in location_area_user pivot table
            if ($status === 'pending' && !$area->users()->where('users.id', $request->user()->id)->exists()) {
                $area->users()->attach($request->user()->id);
            }
        } else {
            $area = LocationArea::create($validated + [
                'created_by' => $request->user()->id,
                'status' => $status
            ]);
            if ($status === 'pending') {
                $area->users()->attach($request->user()->id);
            }
        }

        return response()->json($area, 201);
    }
    public function update(Request $request, $id)
    {
        $area = LocationArea::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|in:radius,polygon',
            'center_lat' => 'nullable|numeric',
            'center_lng' => 'nullable|numeric',
            'radius_meters' => 'nullable|numeric',
            'polygon_points' => 'nullable|array',
        ]);

        $area->update($validated);
        return response()->json($area);
    }

    public function destroy($id)
    {
        $area = LocationArea::findOrFail($id);
        $area->delete();
        return response()->json(['message' => 'Area dihapus']);
    }

    public function getAssignedUsers($id)
    {
        $area = LocationArea::findOrFail($id);
        return response()->json([
            'assigned_user_ids' => $area->users()->pluck('users.id')
        ]);
    }

    public function syncUsers(Request $request, $id)
    {
        $area = LocationArea::findOrFail($id);
        $request->validate([
            'user_ids' => 'array'
        ]);
        $area->users()->sync($request->user_ids ?? []);
        return response()->json(['message' => 'Users synced']);
    }

    public function approve($id)
    {
        $area = LocationArea::findOrFail($id);
        $area->update(['status' => 'approved']);
        return response()->json($area);
    }

    public function reject($id)
    {
        $area = LocationArea::findOrFail($id);
        $area->update(['status' => 'rejected']);
        return response()->json($area);
    }

    public function getUserLocations($userId)
    {
        $user = User::findOrFail($userId);
        return response()->json([
            'assigned_location_ids' => $user->locationAreas()->pluck('location_areas.id')
        ]);
    }

    public function syncUserLocations(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $request->validate([
            'location_ids' => 'array'
        ]);
        $user->locationAreas()->sync($request->location_ids ?? []);
        return response()->json(['message' => 'User locations synced']);
    }
}
