<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class LecturerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'Dosen');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('identifier', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('department') && 
            $request->department !== 'Semua Departemen' && 
            $request->department !== 'Semua Spesialisasi') {
            $query->where('department', $request->department);
        }

        if ($request->filled('status') && 
            $request->status !== 'Semua Status' && 
            in_array($request->status, ['Aktif', 'Tidak Aktif'])) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('name', 'asc')->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'identifier' => 'required|string|unique:users,identifier',
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|string|min:8', // Tambahkan validasi password
            'department' => 'required|string',
            'status'     => 'required|in:Aktif,Tidak Aktif',
        ]);

        $validated['role'] = 'Dosen';
        // Gunakan password dari request
        $validated['password'] = Hash::make($request->password);

        $lecturer = User::create($validated);

        return response()->json([
            'message' => 'Dosen berhasil ditambahkan',
            'data'    => $lecturer
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $lecturer = User::where('role', 'Dosen')->findOrFail($id);

        $validated = $request->validate([
            'identifier' => [
                'required',
                'string',
                Rule::unique('users', 'identifier')->ignore($id)
            ],
            'name'       => 'required|string|max:255',
            'email'      => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($id)
            ],
            'password'   => 'nullable|string|min:8', // Password opsional saat update
            'department' => 'required|string',
            'status'     => 'required|in:Aktif,Tidak Aktif',
        ]);

        // Hanya update password jika diisi di form
        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        } else {
            unset($validated['password']);
        }

        $lecturer->update($validated);

        return response()->json([
            'message' => 'Data dosen berhasil diperbarui',
            'data'    => $lecturer
        ], 200);
    }

    public function destroy($id)
    {
        $lecturer = User::where('role', 'Dosen')->findOrFail($id);
        $lecturer->delete();

        return response()->json(['message' => 'Data dosen berhasil dihapus'], 200);
    }
}