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
        $response = Http::timeout(120)->post(
            env('AI_SERVICE_URL') . '/extract-face',
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

        $response = Http::timeout(120)->post(
            env('AI_SERVICE_URL') . '/verify-face',
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