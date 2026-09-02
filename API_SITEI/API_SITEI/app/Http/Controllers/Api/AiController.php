<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\User;

class AiController extends Controller
{
    public function extractFace(Request $request)
    {
        $aiServiceUrl = env('AI_SERVICE_URL', 'https://ai.sigmaeducation.id');
        $response = Http::timeout(10)->post(
            $aiServiceUrl . '/extract-face',
            [
                'image_base64' => $request->image_base64
            ]
        );

        return response()->json(
            $response->json(),
            $response->status()
        );
    }

    public function verifyFace(Request $request)
    {
        $dosens = User::where('role', 'Dosen')
            ->whereNotNull('face_vector')
            ->select('identifier', 'face_vector')
            ->get();

        $aiServiceUrl = env('AI_SERVICE_URL', 'https://ai.sigmaeducation.id');
        $response = Http::timeout(10)->post(
            $aiServiceUrl . '/verify-face',
            [
                'image_base64' => $request->image_base64,
                'dosen_list' => $dosens
            ]
        );

        return response()->json(
            $response->json(),
            $response->status()
        );
    }

    public function detectFace(Request $request)
    {
        $request->validate([
            'image_base64' => 'required|string'
        ]);

        $aiServiceUrl = env('AI_SERVICE_URL', 'https://ai.sigmaeducation.id');
        try {
            $response = Http::timeout(8)->post(
                $aiServiceUrl . '/detect-face',
                [
                    'image_base64' => $request->image_base64
                ]
            );

            if ($response->successful()) {
                return response()->json($response->json(), $response->status());
            }

            return response()->json([
                'face_detected' => true,
                'message' => 'Layanan AI merespon dengan status ' . $response->status()
            ], 200);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Face detection microservice unreachable: ' . $e->getMessage());
            // Fallback graceful jika microservice AI tidak dapat diakses
            return response()->json([
                'face_detected' => true,
                'message' => 'Layanan AI verifikasi wajah offline, presensi tetap dapat dilanjutkan.'
            ], 200);
        }
    }
}