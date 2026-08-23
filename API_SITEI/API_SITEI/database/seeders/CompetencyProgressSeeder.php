<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompetencyProgressSeeder extends Seeder
{
    public function run(): void
    {
        $residenUserId = 3; 

        DB::table('competency_progresses')->insert([
            [
                'user_id' => $residenUserId,
                'nama_kompetensi' => 'Seksio Sesarea Mandiri',
                'stase_klinis' => 'Obgyn',
                'target_total' => 50,
                'capaian_saat_ini' => 38,
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'user_id' => $residenUserId,
                'nama_kompetensi' => 'Intubasi Endotrakeal & Manajemen Airway',
                'stase_klinis' => 'Anestesi',
                'target_total' => 40,
                'capaian_saat_ini' => 22,
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'user_id' => $residenUserId,
                'nama_kompetensi' => 'Appendectomy Kasus Mandiri',
                'stase_klinis' => 'Bedah',
                'target_total' => 30,
                'capaian_saat_ini' => 15,
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'user_id' => $residenUserId,
                'nama_kompetensi' => 'Pemasangan IV Catheter Neonatus',
                'stase_klinis' => 'Anak',
                'target_total' => 20,
                'capaian_saat_ini' => 20, 
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'user_id' => $residenUserId,
                'nama_kompetensi' => 'Pemeriksaan Visus & Refraksi Mata',
                'stase_klinis' => 'Mata',
                'target_total' => 25,
                'capaian_saat_ini' => 18,
                'created_at' => now(), 'updated_at' => now()
            ]
        ]);
    }
}