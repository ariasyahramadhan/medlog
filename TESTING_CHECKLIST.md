# 📋 Master Interactive Testing Checklist — Sistem MEDLOG (Logbook & Presensi FK)

Dokumen ini berisi panduan dan checklist pengujian menyeluruh (*End-to-End User Acceptance Testing*) untuk sistem **MEDLOG**.

---

## 📌 Ringkasan Pengujian

- **Aplikasi**: Sistem Logbook & Presensi Terpadu PPDS Anestesiologi & Reanimasi (MEDLOG)
- **Komponen**:
  - **Backend API**: Laravel 11 / PHP 8.2+ / MySQL / Sanctum
  - **Frontend App**: React + Vite + Tailwind CSS + Lucide Icons + jsPDF
  - **AI Biometric Service**: FastAPI + Python + OpenCV + Haarcascades
- **Tanggal Mulai**: `2026-09-02`
- **Tester / QA**: `____________________`
- **Hasil Akhir**: [ ] **LULUS (PASSED)** / [ ] **PERLU PERBAIKAN (NEEDS REVISION)**

---

## 🚀 Persiapan & Menjalankan Server

Pastikan ketiga service berjalan sebelum memulai pengujian:

```powershell
# 1. Menjalankan Backend Laravel API (Port 8000)
cd c:\nom\nomproject\medlog\API_SITEI\API_SITEI
php artisan serve

# 2. Menjalankan AI Biometric Microservice (Port 8001)
cd c:\nom\nomproject\medlog\medlog_ai_service
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload

# 3. Menjalankan Frontend Web App (Port 5173)
cd c:\nom\nomproject\medlog\Frontend_SITEI\Frontend_SITEI
npm run dev
```

---

## 🗂️ Daftar Modul yang Diuji

- [Tahap 1: Kesiapan Lingkungan & Integrasi Service](#tahap-1-kesiapan-lingkungan--integrasi-service)
- [Tahap 2: Autentikasi, Otorisasi (RBAC) & Biometrik Wajah](#tahap-2-autentikasi-otorisasi-rbac--biometrik-wajah)
- [Tahap 3: Modul Mahasiswa (Residen PPDS)](#tahap-3-modul-mahasiswa-residen-ppds)
- [Tahap 4: Modul Dosen (Konsulen / DPJP)](#tahap-4-modul-dosen-konsulen--dpjp)
- [Tahap 5: Modul Administrator](#tahap-5-modul-administrator)
- [Tahap 6: Modul Presensi (Geofencing & AI Face Detection)](#tahap-6-modul-presensi-geofencing--ai-face-detection)
- [Tahap 7: Fitur Cetak Dokumen & Generator PDF](#tahap-7-fitur-cetak-dokumen--generator-pdf)
- [Tahap 8: Pengujian Non-Fungsional & Keamanan](#tahap-8-pengujian-non-fungsional--keamanan)

---

### Tahap 1: Kesiapan Lingkungan & Integrasi Service

- [ ] **1.1 Database Migration & Seed**: Semua tabel database berhasil termigrasi (`php artisan migrate:status`) tanpa error.
- [ ] **1.2 Storage Symlink**: Folder storage terhubung (`php artisan storage:link`) sehingga foto profil & bukti berkas dapat diakses melalui browser.
- [ ] **1.3 Health Check AI Biometric Service**: Endpoint `GET http://127.0.0.1:8001/` mengembalikan respon JSON `{"status": "ok", "biometric_auth": "active"}`.
- [ ] **1.4 Frontend Build Check**: Menjalankan `npm run build` berhasil tanpa error kompilasi JSX/CSS.

---

### Tahap 2: Autentikasi, Otorisasi (RBAC) & Biometrik Wajah

#### A. Registrasi & Manajemen Password
- [ ] **2.1 Registrasi Residen Baru**: Form `/register` dengan data valid & NIM berhasil membuat akun dengan role `Mahasiswa`.
- [ ] **2.2 Validasi Form Register**: Validasi gagal jika format email salah, email sudah terdaftar, atau password kurang dari 8 karakter.
- [ ] **2.3 Login Standar**: Login menggunakan Email/NIP/NIM dan Password untuk masing-masing role (Admin, Dosen, Mahasiswa) berhasil diarahkan ke dashboard masing-masing.
- [ ] **2.4 Lupa Password**: Form `/lupa-password` berhasil mengirimkan token reset ke email / menghasilkan token valid.
- [ ] **2.5 Reset Password**: Form `/reset-password` dengan token valid berhasil mengubah password dan dapat digunakan untuk login kembali.
- [ ] **2.6 Ganti Password In-App**: Menu ganti password (`/change-password` atau via Profil) memvalidasi password lama sebelum mengupdate password baru.

#### B. Biometrik Wajah & Keamanan Sesi
- [ ] **2.7 Registrasi Wajah Konsulen**: Dosen membuka `/dosen/register-face`, mengambil foto via webcam, dan sistem berhasil mengekstrak vektor wajah 128 dimensi (`face_vector`).
- [ ] **2.8 Login Biometrik Dosen**: Dosen melakukan login biometrik pada halaman login dengan menghadapkan wajah ke webcam, sistem mencocokkan wajah (Cosine Similarity ≥ 0.70) dan otomatis masuk.
- [ ] **2.9 Proteksi Rute (Guards)**: User dengan role `Mahasiswa` tidak bisa mengakses URL `/admin/*` atau `/dosen/*` (di-redirect ke `/401` Unauthorized atau dashboard).
- [ ] **2.10 Sesi Expired & Logout**: Tombol Keluar menghapus token Sanctum dari localStorage dan mengembalikan pengguna ke halaman `/login`.

---

### Tahap 3: Modul Mahasiswa (Residen PPDS)

#### A. Dashboard & Profil
- [ ] **3.1 Dashboard Analytics**: Grafik pencapaian target kasus (100 kasus), antrian verifikasi, logbook ilmiah/pengabdian, dan feed aktivitas tampil akurat.
- [ ] **3.2 Edit Profil & Foto**: Mahasiswa dapat mengupdate nomor kontak dan mengunggah foto avatar di `/mahasiswa/pengaturan`.

#### B. Logbook Kasus Klinis
- [ ] **3.3 Input Kasus Klinis**: Form `/mahasiswa/input-kasus` berhasil menyimpan data (Identitas pasien, DPJP, Diagnosa ICD, Tindakan, ASA score, dll.) dengan status `pending`.
- [ ] **3.4 Autocomplete Diagnosa**: Fitur pencarian diagnosa ICD (`diagnosisDB.js`) berfungsi lancar saat mengetik kata kunci.
- [ ] **3.5 Filter & Pencarian Riwayat Kasus**: Tabel riwayat kasus di `/mahasiswa/riwayat-kasus` dapat difilter berdasarkan status (*Semua, Pending, Verified, Rejected*) dan rentang tanggal.
- [ ] **3.6 Detail Kasus**: Modal detail menampilkan rincian data klinis lengkap beserta catatan/skor dari dosen pembimbing.
- [ ] **3.7 Batalkan / Hapus Kasus Pending**: Mahasiswa dapat menghapus kasus yang masih berstatus `pending`. Kasus yang sudah `verified` terkunci dari penghapusan.

#### C. Logbook Kegiatan Ilmiah & Pengabdian Masyarakat
- [ ] **3.8 Input Pengabdian Masyarakat**: Mahasiswa dapat mencatat kegiatan pengabdian di `/mahasiswa/pengabdian-masyarakat` dan mengunggah dokumen bukti/foto.
- [ ] **3.9 Input Kegiatan Ilmiah**: Mahasiswa dapat mencatat Journal Reading, Sari Pustaka, atau Laporan Kasus di `/mahasiswa/kegiatan-ilmiah`.

#### D. Bimbingan, DOPS, Tesis & Perizinan
- [ ] **3.10 Riwayat Bimbingan & Konseling**: Residen dapat melihat riwayat catatan konsultasi di `/mahasiswa/bimbingan-konseling`.
- [ ] **3.11 Riwayat Evaluasi Soft Skill**: Residen dapat melihat rekap skor soft skill di `/mahasiswa/soft-skill`.
- [ ] **3.12 Riwayat DOPS (Direct Observation of Procedural Skills)**: Residen dapat memantau hasil evaluasi prosedur klinis di `/mahasiswa/dops`.
- [ ] **3.13 Bimbingan Tesis**: Residen dapat memantau progres bab tesis dan arahan revisi di `/mahasiswa/bimbingan-tesis`.
- [ ] **3.14 Pengajuan Izin / Cuti**: Mahasiswa dapat mengajukan izin sakit/cuti di `/mahasiswa/pengajuan-izin` dengan upload surat izin (status awal: `Menunggu Persetujuan`).
- [ ] **3.15 Halaman Panduan & Tata Tertib**: Halaman panduan logbook, etika, tata tertib, sanksi/penghargaan, dan matriks kompetensi dapat diakses dan terbaca jelas.

---

### Tahap 4: Modul Dosen (Konsulen / DPJP)

#### A. Verifikasi Kasus & Logbook
- [ ] **4.1 Dashboard Konsulen**: Menampilkan ringkasan total antrian validasi dan rata-rata pencapaian target residen bimbingan.
- [ ] **4.2 Validasi Kasus Klinis (Approve)**: Dosen menyetujui kasus pending di `/dosen/verifikasi-kasus`, memberikan skor/catatan $\rightarrow$ status kasus berubah menjadi `verified`.
- [ ] **4.3 Penolakan Kasus Klinis (Reject)**: Dosen menolak kasus dengan catatan perbaikan $\rightarrow$ status kasus berubah menjadi `rejected`.
- [ ] **4.4 Riwayat Validasi Kasus**: Halaman `/dosen/riwayat-kasus` menampilkan seluruh arsip kasus yang pernah dinilai oleh dosen.
- [ ] **4.5 Monitoring Progres Residen**: Halaman `/dosen/progres-resident` menampilkan daftar residen bimbingan dengan persentase ketercapaian target kurikulum.
- [ ] **4.6 Validasi Pengabdian Masyarakat**: Dosen memverifikasi berkas pengabdian di `/dosen/pengabdian-masyarakat`.
- [ ] **4.7 Penilaian Kegiatan Ilmiah**: Dosen memberikan penilaian pada rubrik ilmiah dan menandai kehadiran di `/dosen/kegiatan-ilmiah`.

#### B. Bimbingan & Evaluasi Keterampilan
- [ ] **4.8 Input Bimbingan & Konseling**: Dosen mencatat hasil sesi konseling residen di `/dosen/bimbingan-konseling`.
- [ ] **4.9 Input Evaluasi Soft Skill**: Dosen mengisi rubrik penilaian kepribadian, komunikasi, dan etika residen di `/dosen/soft-skill`.
- [ ] **4.10 Input Penilaian DOPS**: Dosen mengisi formulir observasi tindakan klinis langsung beserta nilai skala di `/dosen/dops`.
- [ ] **4.11 Input Bimbingan Tesis**: Dosen mencatat hasil bimbingan bab tesis di `/dosen/bimbingan-skripsi`.
- [ ] **4.12 Persetujuan Izin Residen**: Dosen menyetujui/menolak pengajuan cuti/izin residen di `/dosen/pengajuan-izin`.

---

### Tahap 5: Modul Administrator

#### A. Dashboard & Data Master
- [ ] **5.1 Dashboard Admin**: Statistik global sistem (total residen, konsulen, kasus terdaftar, dan logbook pending) tampil tepat.
- [ ] **5.2 CRUD Mahasiswa**: Tambah residen baru, edit data/NIM, aktifkan/nonaktifkan akun di `/admin/mahasiswa`.
- [ ] **5.3 CRUD Dosen**: Tambah konsulen baru (NIP, gelar), edit data, dan kelola status di `/admin/dosen`.
- [ ] **5.4 Penugasan Mentor (Mentorship)**: Menghubungkan residen dengan konsulen pembimbing di `/admin/mentor`.
- [ ] **5.5 Reset Biometrik Wajah**: Admin dapat mereset data `face_vector` user yang bermasalah di `/admin/reset-face`.

#### B. Konfigurasi Presensi & Master Lokasi
- [ ] **5.6 Kelola Jadwal Shift**: Admin membuat/mengedit jadwal shift kerja (Jam Masuk, Toleransi, Jam Pulang) dan menugaskan user terkait di `/admin/presensi/jadwal`.
- [ ] **5.7 Kelola Area Lokasi (Geofencing)**: Admin menentukan titik koordinat GPS (Latitude, Longitude) dan radius toleransi (meter) di `/admin/presensi/lokasi`.
- [ ] **5.8 Approval Lokasi Khusus**: Admin menyetujui lokasi presensi dinas luar / WFH jika diaktifkan.

---

### Tahap 6: Modul Presensi (Geofencing & AI Face Detection)

- [ ] **6.1 Check-In Tepat Waktu**: Mahasiswa melakukan presensi masuk di `/mahasiswa/presensi` di dalam radius GPS dan wajah terverifikasi $\rightarrow$ Tercatat `Hadir Tepat Waktu`.
- [ ] **6.2 Check-In Terlambat**: Mahasiswa melakukan presensi melebihi batas jam toleransi $\rightarrow$ Tercatat `Terlambat`.
- [ ] **6.3 Uji Geofencing (Luar Radius)**: Presensi gagal / ditolak jika koordinat GPS pengguna berada di luar radius area lokasi yang ditentukan.
- [ ] **6.4 Uji Anti-Spoofing / Non-Wajah**: Presensi ditolak jika kamera tidak mendeteksi wajah manusia yang jelas.
- [ ] **6.5 Check-Out**: Mahasiswa melakukan presensi pulang setelah shift selesai $\rightarrow$ Tercatat jam keluar pada `attendance_logs`.
- [ ] **6.6 Riwayat Presensi Mahasiswa**: Riwayat presensi bulanan beserta status kehadiran tampil di `/mahasiswa/presensi/riwayat`.
- [ ] **6.7 Rekap & Export Presensi (Admin)**: Admin dapat memfilter laporan presensi di `/admin/presensi/rekap` dan mengunduh berkas format **CSV / Excel**.

---

### Tahap 7: Fitur Cetak Dokumen & Generator PDF

- [ ] **7.1 Cetak Lembar Kasus Klinis**: Tombol cetak di riwayat kasus menghasilkan template PDF slip tindakan medis lengkap dengan data pasien & DPJP.
- [ ] **7.2 Cetak Form Nilai & Absensi Ilmiah**: Tombol cetak menghasilkan lembar penilaian seminar ilmiah dan daftar hadir peserta.
- [ ] **7.3 Cetak Bukti Pengabdian**: Tombol cetak menghasilkan lembar laporan kegiatan pengabdian masyarakat.
- [ ] **7.4 Cetak Rekap Bimbingan & Konseling**: Export PDF lembar bimbingan konseling berkala.
- [ ] **7.5 Cetak Lembar Evaluasi DOPS**: Export PDF lembar penilaian prosedur tindakan klinis (DOPS).
- [ ] **7.6 Cetak Kartu Kendali Tesis**: Export PDF lembar riwayat konsultasi bab tesis.
- [ ] **7.7 Cetak Evaluasi Soft Skill**: Export PDF laporan capaian sikap dan profesionalisme.

---

### Tahap 8: Pengujian Non-Fungsional & Keamanan

- [ ] **8.1 Responsivitas Mobile**: Tampilan navigasi, form modal, dan kamera presensi bekerja dengan baik pada layar smartphone.
- [ ] **8.2 Penanganan Izin Perangkat**: Menampilkan pesan peringatan yang informatif jika pengguna menolak izin Kamera atau GPS.
- [ ] **8.3 Validasi Ukuran Berkas Upload**: Sistem menolak upload dokumen/foto dengan ukuran melebihi batas maksimal (2MB / 5MB).
- [ ] **8.4 Penanganan AI Service Offline**: Jika service AI di port 8001 mati, aplikasi menampilkan pesan error yang ramah (tidak crash / white screen).
- [ ] **8.5 Proteksi SQL Injection & XSS**: Form input kebal terhadap injeksi tag HTML/skrip berbahaya.

---

## 📝 Catatan Temuan & Bug Tracker (Issue Log)

| No | Modul / Halaman | Deskripsi Kendala / Bug | Severity (Low/Med/High) | Status Perbaikan |
|---|---|---|:---:|:---:|
| 1 | *Contoh: Input Kasus* | *Autocomplete diagnosa lambat saat input kata kunci panjang* | *Medium* | [ ] Open / [ ] Resolved |
| 2 | | | | [ ] Open / [ ] Resolved |
| 3 | | | | [ ] Open / [ ] Resolved |
| 4 | | | | [ ] Open / [ ] Resolved |
| 5 | | | | [ ] Open / [ ] Resolved |

---

## ✍️ Tanda Tangan & Persetujuan

| Penguji (Tester) | Penanggung Jawab / Lead Developer |
|---|---|
| **Nama:** _______________________ | **Nama:** _______________________ |
| **Tanggal:** ____________________ | **Tanggal:** ____________________ |
| **Tanda Tangan:** | **Tanda Tangan:** |
| <br><br>_________________________ | <br><br>_________________________ |
