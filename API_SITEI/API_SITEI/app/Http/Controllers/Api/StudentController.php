<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'Mahasiswa');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('identifier', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('department') && $request->department !== 'Semua Departemen') {
            $query->where('department', $request->department);
        }

        if ($request->filled('batch') && $request->batch !== 'Semua Angkatan') {
            $query->where('batch', $request->batch);
        }

        return response()->json($query->orderBy('name', 'asc')->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'identifier' => 'required|string|unique:users,identifier',
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|string|min:8', // Validasi password saat buat baru
            'department' => 'required|string',
            'batch'      => 'required|string',
            'status'     => 'required|in:Aktif,Tidak Aktif',
        ]);

        $validated['role'] = 'Mahasiswa';
        // Gunakan password yang dikirim dari frontend, jika kosong (fail safe) gunakan identifier
        $validated['password'] = Hash::make($request->password ?? $request->identifier);

        $student = User::create($validated);

        return response()->json([
            'message' => 'Mahasiswa berhasil ditambahkan',
            'data'    => $student
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $student = User::where('role', 'Mahasiswa')->findOrFail($id);

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
            'batch'      => 'required|string',
            'status'     => 'required|in:Aktif,Tidak Aktif',
        ]);

        // Logic Update Password: Hanya update jika password diisi
        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        } else {
            // Hapus dari array validated agar tidak menimpa password lama dengan null
            unset($validated['password']);
        }

        $student->update($validated);

        return response()->json([
            'message' => 'Data mahasiswa berhasil diperbarui',
            'data'    => $student
        ], 200);
    }

    public function destroy($id)
    {
        $student = User::where('role', 'Mahasiswa')->findOrFail($id);
        $student->delete();

        return response()->json([
            'message' => 'Data mahasiswa berhasil dihapus'
        ], 200);
    }
}