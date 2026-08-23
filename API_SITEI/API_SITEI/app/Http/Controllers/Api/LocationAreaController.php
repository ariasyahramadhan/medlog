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
        return response()->json([
            'success' => true,
            'data' => LocationArea::all()
        ]);
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

        $isAdmin = strtolower($request->user()->role) === 'admin';
        $status = $isAdmin ? 'approved' : 'pending';

        if (!$isAdmin) {
            $validated['type'] = 'radius';
            $validated['radius_meters'] = 40.0;

            // Jika mahasiswa, update jika sudah pernah ajukan lokasi
            $area = LocationArea::where('created_by', $request->user()->id)->first();
            if ($area) {
                $area->update($validated + ['status' => $status]);
                if (!$area->users()->where('users.id', $request->user()->id)->exists()) {
                    $area->users()->attach($request->user()->id);
                }
                return response()->json([
                    'success' => true,
                    'data' => $area,
                    'message' => 'Pengajuan lokasi berhasil diperbarui.'
                ], 200);
            }
        }

        // Untuk Admin (atau mahasiswa pertama kali), buat lokasi baru
        $area = LocationArea::create($validated + [
            'created_by' => $request->user()->id,
            'status' => $status
        ]);

        if (!$isAdmin) {
            $area->users()->attach($request->user()->id);
        }

        return response()->json([
            'success' => true,
            'data' => $area,
            'message' => 'Area lokasi berhasil dibuat.'
        ], 201);
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
        return response()->json([
            'success' => true,
            'data' => $area,
            'message' => 'Area lokasi berhasil diperbarui.'
        ]);
    }

    public function destroy($id)
    {
        $area = LocationArea::findOrFail($id);
        $area->delete();
        return response()->json([
            'success' => true,
            'message' => 'Area lokasi berhasil dihapus.'
        ]);
    }

    public function getAssignedUsers($id)
    {
        $area = LocationArea::findOrFail($id);
        return response()->json([
            'success' => true,
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
        return response()->json([
            'success' => true,
            'message' => 'Daftar pengguna berhasil diperbarui.'
        ]);
    }

    public function approve($id)
    {
        $area = LocationArea::findOrFail($id);
        $area->update(['status' => 'approved']);
        return response()->json([
            'success' => true,
            'data' => $area,
            'message' => 'Pengajuan lokasi berhasil disetujui.'
        ]);
    }

    public function reject($id)
    {
        $area = LocationArea::findOrFail($id);
        $area->update(['status' => 'rejected']);
        return response()->json([
            'success' => true,
            'data' => $area,
            'message' => 'Pengajuan lokasi berhasil ditolak.'
        ]);
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
