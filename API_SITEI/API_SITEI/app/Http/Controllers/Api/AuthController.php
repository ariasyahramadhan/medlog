<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller; 

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Exception;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'identifier' => 'required|string|unique:users',
            'role' => 'required|in:Mahasiswa,Dosen,Admin',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'identifier' => $request->identifier,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user' => $user
        ], 201);
    }

    /**
     * Ambil semua face_vector dari seluruh Dosen yang sudah mendaftar biometrik.
     * Digunakan oleh frontend untuk melakukan pencocokan di sisi AI Server (FastAPI).
     */
    public function getAllDosenvectors()
    {
        try {
            $dosens = User::where('role', 'Dosen')
                ->whereNotNull('face_vector')
                ->select('id', 'name', 'identifier', 'face_vector')
                ->get();

            if ($dosens->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Belum ada Dosen yang mendaftarkan biometrik wajah.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data'    => $dosens
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ambil vector wajah satu dosen berdasarkan identifier.
     * (Tetap dipertahankan untuk kebutuhan lain, misal: registrasi biometrik)
     */
    public function getUserVector($identifier)
    {
        try {
            $user = User::where('identifier', $identifier)->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User dengan identifier tersebut tidak ditemukan.'
                ], 404);
            }

            if (!$user->face_vector) {
                return response()->json([
                    'success' => false,
                    'message' => 'User ditemukan, tetapi belum mendaftarkan biometrik wajah.'
                ], 404);
            }

            return response()->json([
                'success'     => true,
                'face_vector' => $user->face_vector
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login via Biometrik — hanya butuh identifier hasil cocok dari AI Server.
     * Frontend tidak perlu menginput NIP; AI Server yang menemukan siapa orangnya
     * lalu mengembalikan identifier-nya ke frontend, dan frontend meneruskannya ke sini.
     */
    public function loginBiometric(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'identifier' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Identifier wajib diisi.'
            ], 422);
        }

        try {
            $user = User::where('identifier', $request->identifier)
                        ->where('role', 'Dosen')
                        ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak. Akun tidak ditemukan.'
                ], 401);
            }

            $token        = $user->createToken('auth_token')->plainTextToken;
            $isFirstLogin = Hash::check($user->identifier, $user->password);

            return response()->json([
                'message'      => 'Login Berhasil',
                'access_token' => $token,
                'user'         => $user,
                'is_first_login' => $isFirstLogin
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'identifier' => 'required',
            'password'   => 'required',
            'role'       => 'required|in:Mahasiswa,Dosen,Admin'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $query = User::where('role', $request->role);

        if ($request->role === 'Dosen') {
            $query->where(function ($q) use ($request) {
                $q->where('identifier', $request->identifier)
                  ->orWhere('name', $request->identifier);
            });
        } else {
            $query->where('identifier', $request->identifier);
        }

        $user = $query->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Kredensial tidak cocok dengan data kami.'
            ], 401);
        }

        $isFirstLogin = Hash::check($user->identifier, $user->password);
        $token        = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'        => 'Login Berhasil',
            'access_token'   => $token,
            'user'           => $user,
            'is_first_login' => $isFirstLogin
        ]);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user           = $request->user();
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Password berhasil diperbarui!'
        ], 200);
    }
}