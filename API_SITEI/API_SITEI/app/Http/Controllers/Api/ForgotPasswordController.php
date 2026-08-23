<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class ForgotPasswordController extends Controller
{
    /**
     * Mengirim email tautan reset password
     */
    public function sendResetLinkEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Alamat email tidak terdaftar di sistem kami.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email;
        $token = Str::random(64);

        // Simpan token ke database (update jika sudah ada pengajuan sebelumnya)
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => $token,
                'created_at' => now()
            ]
        );

        // Tautan yang akan diklik oleh residen/dosen di email mereka
        // Sesuaikan port atau domain frontend React Anda (misal: localhost:5173)
        $resetLink = "http://localhost:5173/reset-password?token=" . $token . "&email=" . urlencode($email);

        Mail::send([], [], function ($message) use ($email, $resetLink) {
    $year = date('Y');
    $emailAddress = htmlspecialchars($email);
 
    $htmlBody = <<<HTML
    <!DOCTYPE html>
    <html lang="id">
    <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Pemulihan Kata Sandi — MedLog AI</title>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #f0f4f8; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    </style>
    </head>
    <body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0f4f8; padding: 40px 20px;">
    <tr>
        <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px;">
    
            <!-- LOGO HEADER -->
            <tr>
            <td align="center" style="padding-bottom: 24px;">
                <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="background: #003178; border-radius: 12px; padding: 10px 20px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                        <td style="padding-right: 10px; vertical-align: middle;">
                            <!-- Plus Icon SVG -->
                            <img src="https://img.icons8.com/ios-glyphs/24/ffffff/plus-math.png" width="18" height="18" alt="+" style="display:block;"/>
                        </td>
                        <td style="vertical-align: middle;">
                            <span style="font-size: 16px; font-weight: 700; color: #ffffff; letter-spacing: 0.04em; white-space: nowrap;">MEDLOG AI</span>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
                <p style="margin-top: 8px; font-size: 10px; color: #94a3b8; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;">Sistem Informasi Logbook Klinis</p>
            </td>
            </tr>
    
            <!-- MAIN CARD -->
            <tr>
            <td style="background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0;">
    
                <!-- Blue accent bar -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="background: linear-gradient(135deg, #003178 0%, #1a4db5 100%); height: 5px; line-height: 5px; font-size: 0;">&nbsp;</td>
                </tr>
                </table>
    
                <!-- Card Content -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 40px 44px;">
                <tr>
                    <td>
    
                    <!-- Icon Badge -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                        <tr>
                        <td style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 16px; width: 56px; height: 56px; text-align: center; vertical-align: middle;">
                            <img src="https://img.icons8.com/ios/28/003178/key.png" width="28" height="28" alt="Key" style="display:inline-block; margin-top: 2px;"/>
                        </td>
                        </tr>
                    </table>
    
                    <!-- Greeting -->
                    <p style="font-size: 13px; font-weight: 500; color: #94a3b8; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 6px;">Permintaan Pemulihan Sandi</p>
                    <h1 style="font-size: 26px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 16px;">Atur Ulang Kata<br/>Sandi Akun Anda</h1>
    
                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 22px;">
                        <tr><td style="height: 1px; background: #f1f5f9; font-size: 0; line-height: 0;">&nbsp;</td></tr>
                    </table>
    
                    <!-- Body Text -->
                    <p style="font-size: 14px; color: #475569; line-height: 1.7; margin-bottom: 12px;">
                        Halo, Rekan Sejawat.
                    </p>
                    <p style="font-size: 14px; color: #64748b; line-height: 1.75; margin-bottom: 28px;">
                        Kami menerima permintaan untuk melakukan pemulihan kata sandi pada akun MedLog AI yang terdaftar dengan email <strong style="color: #003178;">{$emailAddress}</strong>. Klik tombol di bawah ini untuk membuat kata sandi baru Anda.
                    </p>
    
                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                        <tr>
                        <td align="center" style="background: linear-gradient(135deg, #003178 0%, #1a4db5 100%); border-radius: 12px; box-shadow: 0 4px 16px rgba(0,49,120,0.25);">
                            <a href="{$resetLink}" style="display: inline-block; padding: 14px 40px; font-size: 13px; font-weight: 700; color: #ffffff; text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap;">
                            Atur Ulang Kata Sandi &rarr;
                            </a>
                        </td>
                        </tr>
                    </table>
    
                    <!-- Warning Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                        <tr>
                        <td style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 14px 18px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                                <td style="width: 20px; vertical-align: top; padding-top: 1px; padding-right: 10px;">
                                <img src="https://img.icons8.com/ios/16/b45309/warning--v1.png" width="16" height="16" alt="!" style="display:block;"/>
                                </td>
                                <td>
                                <p style="font-size: 12px; color: #92400e; line-height: 1.6; margin: 0;">
                                    <strong>Penting:</strong> Tautan ini hanya berlaku selama <strong>60 menit</strong> dan hanya dapat digunakan sekali. Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini dengan aman.
                                </p>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>
    
                    <!-- URL Fallback -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                        <td style="background: #f8fafc; border: 1px dashed #e2e8f0; border-radius: 10px; padding: 14px 16px;">
                            <p style="font-size: 11px; color: #94a3b8; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;">Atau salin tautan ini ke browser Anda:</p>
                            <p style="font-size: 11px; color: #475569; word-break: break-all; font-family: 'Courier New', monospace; line-height: 1.5;">{$resetLink}</p>
                        </td>
                        </tr>
                    </table>
    
                    </td>
                </tr>
                </table>
    
            </td>
            </tr>
    
            <!-- SECURITY BADGES ROW -->
            <tr>
            <td style="padding-top: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="50%" style="padding-right: 6px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                        <td style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; text-align: center;">
                            <p style="font-size: 11px; font-weight: 700; color: #003178; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 4px;">🔒 Terenkripsi SSL</p>
                            <p style="font-size: 10.5px; color: #94a3b8; line-height: 1.4;">Koneksi aman 256-bit</p>
                        </td>
                        </tr>
                    </table>
                    </td>
                    <td width="50%" style="padding-left: 6px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                        <td style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; text-align: center;">
                            <p style="font-size: 11px; font-weight: 700; color: #003178; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 4px;">✉️ Otomatis SMTP</p>
                            <p style="font-size: 10.5px; color: #94a3b8; line-height: 1.4;">Server Prodianestesi</p>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
            </td>
            </tr>
    
            <!-- FOOTER -->
            <tr>
            <td align="center" style="padding-top: 28px; padding-bottom: 8px;">
                <p style="font-size: 11px; color: #cbd5e1; font-weight: 500;">
                &copy; {$year} MedLog AI &bull; Fakultas Kedokteran UNRI
                </p>
                <p style="font-size: 10.5px; color: #e2e8f0; margin-top: 4px;">
                Email otomatis ini dikirim dari sistem — mohon tidak membalas.
                </p>
            </td>
            </tr>
    
        </table>
        </td>
    </tr>
    </table>
    </body>
    </html>
    HTML;
    
        $message->to($email)
            ->subject('🔑 Pemulihan Kata Sandi — MedLog AI')
            ->html($htmlBody);
    });
            
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token'    => 'required|string',
            'email'    => 'required|email|exists:users,email',
            'password' => 'required|string|min:8|confirmed', 
        ], [
            'password.confirmed' => 'Konfirmasi kata sandi baru tidak cocok.',
            'password.min' => 'Kata sandi baru minimal harus 8 karakter.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // 1. Validasi apakah token cocok dan ada di database
        $tokenData = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$tokenData) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token pemulihan tidak valid atau sudah kedaluwarsa.'
            ], 400);
        }

        // Optional: Cek kedaluwarsa token jika berumur lebih dari 60 menit
        if (now()->parse($tokenData->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'status' => 'error',
                'message' => 'Sesi tautan telah kedaluwarsa (Batas waktu 60 menit). Silakan ajukan kembali.'
            ], 400);
        }

        // 2. Update password user yang bersangkutan
        $user = User::where('email', $request->email)->first();
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // 3. Hapus token dari database agar tidak bisa digunakan ulang
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kata sandi Anda berhasil diperbarui. Silakan login kembali.'
        ], 200);
    }
}