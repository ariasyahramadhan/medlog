<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class MahasiswaAccountController extends Controller
{
    /**
     * READ: Mengambil profil mahasiswa yang sedang login
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();

        // Menyisipkan URL avatar yang valid ke dalam response
        if ($user->avatar) {
            $user->avatar_url = asset($user->avatar);
        } else {
            $user->avatar_url = null;
        }

        return response()->json($user, 200);
    }

    /**
     * UPDATE: Memperbarui informasi profil dan ganti avatar
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'department' => 'required|string',
            'email'      => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($user->id)
            ],
            'avatar'     => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        // Upload Avatar/Foto jika ada berkas yang dikirimkan
        if ($request->hasFile('avatar')) {
            // Hapus avatar lama dari disk public jika ada
            if ($user->avatar) {
                $oldPath = str_replace('/storage/', '', $user->avatar);
                Storage::disk('public')->delete($oldPath);
            }

            // Simpan file baru ke: storage/app/public/avatars/
            $path = $request->file('avatar')->store('avatars', 'public');
            
            // Konversi path internal menjadi URL public (/storage/avatars/namafile.jpg)
            $validated['avatar'] = Storage::url($path);
        }

        $user->update($validated);

        // Tambahkan avatar_url ke respons terbaru agar state di React langsung tersinkronisasi
        $user->avatar_url = $user->avatar ? asset($user->avatar) : null;

        return response()->json([
            'message' => 'Profil mahasiswa berhasil diperbarui',
            'user'    => $user
        ], 200);
    }

    /**
     * UPDATE: Memperbarui password mahasiswa
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8|regex:/^(?=.*[A-Z])(?=.*\d).+$/',
        ], [
            'new_password.regex' => 'Password baru harus memiliki minimal satu huruf kapital dan angka.'
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Password saat ini salah'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        return response()->json([
            'message' => 'Password berhasil diperbarui'
        ], 200);
    }
}