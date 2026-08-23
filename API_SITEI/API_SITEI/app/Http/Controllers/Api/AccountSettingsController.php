<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AccountSettingsController extends Controller
{
    /**
     * Helper: Menormalkan avatar path menjadi full URL yang konsisten
     * Dipanggil di semua method agar output selalu berupa URL lengkap
     */
    private function formatAvatarUrl($user): ?string
    {
        if (!$user->avatar) return null;

        // Jika sudah berupa full URL (http/https), kembalikan apa adanya
        if (str_starts_with($user->avatar, 'http')) {
            return $user->avatar;
        }

        // Jika berupa path relatif seperti /storage/avatars/xxx.jpg
        // url() akan menghasilkan: http://localhost:8000/storage/avatars/xxx.jpg
        return url($user->avatar);
    }

    /**
     * READ: Mengambil profil user yang sedang login
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();

        // Sisipkan avatar_url yang sudah dinormalkan ke response
        $user->avatar_url = $this->formatAvatarUrl($user);

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

        // Upload Avatar jika ada file yang dikirimkan
        if ($request->hasFile('avatar')) {
            // Hapus avatar lama dari disk jika ada
            if ($user->avatar) {
                // Konversi path publik (/storage/avatars/x.jpg)
                // menjadi path internal storage (avatars/x.jpg) untuk dihapus
                $oldInternalPath = ltrim(str_replace('/storage', '', $user->avatar), '/');
                Storage::disk('public')->delete($oldInternalPath);
            }

            // Simpan file baru ke: storage/app/public/avatars/
            $path = $request->file('avatar')->store('avatars', 'public');

            // Storage::url() menghasilkan: /storage/avatars/namafile.jpg
            // Path inilah yang disimpan di database
            $validated['avatar'] = Storage::url($path);
        }

        $user->update($validated);

        // Refresh data user dari database setelah update
        $user->refresh();

        // Sisipkan avatar_url yang sudah dinormalkan (konsisten dengan getProfile)
        $user->avatar_url = $this->formatAvatarUrl($user);

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user'    => $user
        ], 200);
    }

    /**
     * UPDATE: Memperbarui password user
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8|regex:/^(?=.*[A-Z])(?=.*\d).+$/',
        ], [
            'new_password.regex' => 'Password baru harus memiliki minimal satu huruf kapital dan satu angka.'
        ]);

        // Verifikasi password lama
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