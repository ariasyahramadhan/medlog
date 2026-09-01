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
}