<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FaceRegistrationController extends Controller
{
    // Mengambil status apakah user sudah mendaftar atau belum
    public function checkStatus()
    {
        $user = Auth::user();
        
        return response()->json([
            // Memastikan nilainya true jika face_vector tidak kosong/null
            'is_registered' => !empty($user->face_vector) 
        ]);
    }

    public function registerFace(Request $request)
    {
        $user = Auth::user();

        // PROTEKSI SERVER: Jika sudah ada vector di database, tolak pendaftaran ulang
        if (!empty($user->face_vector)) {
            return response()->json([
                'message' => 'Aksi ditolak. Wajah Anda sudah terdaftar di dalam sistem atau hubungin admin untuk melakukan reset.'
            ], 422);
        }

        $request->validate([
            'face_vector' => 'required|array'
        ]);

        $user->update([
            'face_vector' => $request->face_vector
        ]);

        return response()->json([
            'message' => 'Registrasi biometrik Facenet berhasil.'
        ]);
    }

    public function resetFace($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Pengguna tidak ditemukan.'
            ], 404);
        }

        $user->update([
            'face_vector' => null
        ]);

        return response()->json([
            'message' => "Berhasil mereset kredensial wajah untuk pengguna: {$user->name}."
        ]);
    }

    public function getUsers()
{
    try {
        // Ambil semua data user dari database
        $users = User::all();

        // Kita konversi secara manual dan aman agar tidak memicu crash internal PHP
        $formattedUsers = [];
        
        foreach ($users as $user) {
            // Ambil data vector secara aman, jika string kita decode, jika sudah array tinggal pakai
            $vector = $user->face_vector;
            if (is_string($vector)) {
                $vector = json_decode($vector, true);
            }

            $formattedUsers[] = [
                'id' => $user->id,
                'name' => $user->name,
                'identity_number' => $user->identifier ?? '-',
                'face_vector' => $vector
            ];
        }

        return response()->json($formattedUsers, 200);

    } catch (\Throwable $e) {
        return response()->json([
            'message' => 'Laravel Crash Internal!',
            'error_line' => $e->getLine(),
            'error_file' => $e->getFile(),
            'error_message' => $e->getMessage()
        ], 500);
    }
}
}