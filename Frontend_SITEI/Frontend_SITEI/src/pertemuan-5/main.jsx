import React from "react"; 
import { createRoot } from "react-dom/client";
import './assets/tailwind.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Layouts
import AuthLayout from "./layouts/AuthLayout.jsx";
import MainLayoutMahasiswa from "./layouts/Mahasiswa/MainLayoutMahasiswa.jsx";
import MainLayoutAdmin from "./layouts/Admin/MainLayoutAdmin.jsx";
import MainLayoutDosen from "./layouts/Dosen/DosenLayout.jsx";
import DosenLayout from "./layouts/Dosen/DosenLayout.jsx";
import AdminLayout from "./layouts/Admin/AdminLayout.jsx";

// Pages Auth
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import Error from "./pages/Error.jsx";

// Pages Role
import MahasiswaDashboard from "./pages/Mahasiswa/MahasiswaDashboard.jsx";
import DosenDashboard from "./pages/Dosen/DosenDashboard.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminMahasiswa from "./pages/Admin/AdminMahasiswa.jsx";
import AdminDosen from "./pages/Admin/AdminDosen.jsx";
import AdminMentor from "./pages/Admin/AdminMentor.jsx";
import AdminResetFace from "./pages/Admin/AdminResetFace.jsx";
import AdminPresensiRekap from "./pages/Admin/presensi/AdminPresensiRekap.jsx";
import AdminPresensiJadwal from "./pages/Admin/presensi/AdminPresensiJadwal.jsx";
import AdminPresensiLokasi from "./pages/Admin/presensi/AdminPresensiLokasi.jsx";

import DosenPengaturan from "./pages/Dosen/DosenPengaturan.jsx";
import DosenRegisterFace from "./pages/Dosen/DosenRegisterFace.jsx"
import DosenInputKasus from "./pages/Dosen/DosenInputKasus.jsx"
import DosenRiwayatValidasi from "./pages/Dosen/DosenRiwayatValidasi.jsx";
import DosenProgresResiden from "./pages/Dosen/DosenProgresResiden.jsx";
import DosenVerifyPengabdian from "./pages/Dosen/DosenVerifyPengabdian.jsx";
import DosenVerifyKegiatanIlmiah from "./pages/Dosen/DosenVerifyKegiatanIlmiah.jsx";
import DosenBimbinganKonseling from "./pages/Dosen/DosenBimbinganKonseling.jsx";
import DosenSoftSkill from "./pages/Dosen/DosenBimbinganSoftSkill.jsx";
import DosenDops from "./pages/Dosen/DosenDops.jsx";
import DosenThesisGuidance from "./pages/Dosen/DosenBimbinganThesisGuidance.jsx";
import DosenPersetujuanIzin from "./pages/Dosen/DosenPersetujuanIzin.jsx";

import MahasiswaPengaturan from "./pages/Mahasiswa/MahasiswaPengaturan.jsx";
import ChangePassword from "./pages/auth/ChangePassword.jsx";
import MahasiswaPanduanLogbook from "./pages/Mahasiswa/MahasiswaPanduanLogbook.jsx"
import MahasiswaSanksiPenghargaan from "./pages/Mahasiswa/MahasiswaSanksiPenghargaan.jsx"
import MahasiswaPanduanEtika from "./pages/Mahasiswa/MahasiswaPanduanEtika.jsx"
import MahasiswaPanduanTataTertib from "./pages/Mahasiswa/MahasiswaPanduanTataTertib.jsx"
import MahasiswaInputKasus from "./pages/Mahasiswa/MahasiswaInputKasus.jsx"
import MahasiswaKompetensi from "./pages/Mahasiswa/MahasiswaPanduanKompetesiDasardanLanjut.jsx";
import MahasiswaRiwayatKasus from "./pages/Mahasiswa/MahasiswaRiwayatKasus.jsx"
import MahasiswaKegiatanPengabdianMasyarakat from "./pages/Mahasiswa/MahasiswaKegiatanPengabdianMasyarakat.jsx";
import MahasiswaKegiatanIlmiah from "./pages/Mahasiswa/MahasiswaKegiatanIlmiah.jsx";
import MahasiswaBimbinganKonseling from "./pages/Mahasiswa/MahasiswaBimbinganKonseling.jsx";
import MahasiswaSoftSkill from "./pages/Mahasiswa/MahasiswaSoftSkill.jsx";
import MahasiswaDopsHistory from "./pages/Mahasiswa/MahasiswaDopsHistory.jsx";
import MahasiswaBimbinganThesis from "./pages/Mahasiswa/MahasiswaBimbinganThesis.jsx";
import MahasiswaPengajuanIzin from "./pages/Mahasiswa/MahasiswaPengajuanIzin.jsx";
import MahasiswaPresensi from "./pages/Mahasiswa/presensi/MahasiswaPresensi.jsx";
import MahasiswaRiwayatPresensi from "./pages/Mahasiswa/presensi/MahasiswaRiwayatPresensi.jsx";

import LupaPassword from "./pages/auth/ForgotPassword.jsx"
import ResetPassword from "./pages/auth/ResetPassword.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      {/* Redireksi Awal */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* ================= AUTH (PUBLIC) ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/lupa-password" element={<LupaPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
      </Route>

      {/* ================= MAHASISWA (PROTECTED) ================= */}
      <Route element={<ProtectedRoute allowedRoles={["Mahasiswa"]} />}>
        <Route element={<MainLayoutMahasiswa />}>
          <Route path="/mahasiswa/dashboard" element={<MahasiswaDashboard />} />
          <Route path="/mahasiswa/pengaturan" element={<MahasiswaPengaturan />} />
          <Route path="/mahasiswa/panduan" element={<MahasiswaPanduanLogbook/>}/>
          <Route path="/mahasiswa/sanksi" element={<MahasiswaSanksiPenghargaan/>}/>
          <Route path="/mahasiswa/etika" element={<MahasiswaPanduanEtika/>}/>
          <Route path="/mahasiswa/tata-tertib" element={<MahasiswaPanduanTataTertib />} />
          <Route path="/mahasiswa/input-kasus" element={<MahasiswaInputKasus />} />
          <Route path="/mahasiswa/kompetensi" element={<MahasiswaKompetensi />} />
          <Route path="/mahasiswa/riwayat-kasus" element={<MahasiswaRiwayatKasus />} />
          <Route path="/mahasiswa/pengabdian-masyarakat" element={<MahasiswaKegiatanPengabdianMasyarakat />} />
          <Route path="/mahasiswa/kegiatan-ilmiah" element={<MahasiswaKegiatanIlmiah />} />
          <Route path="/mahasiswa/bimbingan-konseling" element={<MahasiswaBimbinganKonseling />} />
          <Route path="/mahasiswa/soft-skill" element={<MahasiswaSoftSkill />} />
          <Route path="/mahasiswa/dops" element={<MahasiswaDopsHistory />} />
          <Route path="/mahasiswa/bimbingan-tesis" element={<MahasiswaBimbinganThesis />} />
          <Route path="/mahasiswa/pengajuan-izin" element={<MahasiswaPengajuanIzin />} />
          <Route path="/mahasiswa/presensi" element={<MahasiswaPresensi />} />
          <Route path="/mahasiswa/presensi/riwayat" element={<MahasiswaRiwayatPresensi />} />
          {/* Tambahkan rute mahasiswa lainnya di sini */}
        </Route>
      </Route>

      {/* ================= DOSEN (PROTECTED) ================= */}
      <Route element={<ProtectedRoute allowedRoles={["Dosen"]} />}>
        <Route element={<MainLayoutDosen />}>
          <Route path="/dosen/dashboard" element={<DosenDashboard />} />
          <Route path="/dosen/pengaturan" element={<DosenPengaturan />} />
          <Route path="/dosen/register-face" element={<DosenRegisterFace />} />
          <Route path="/dosen/verifikasi-kasus" element={<DosenInputKasus />} />
          <Route path="/dosen/riwayat-kasus" element={<DosenRiwayatValidasi />} />
          <Route path="/dosen/progres-resident" element={<DosenProgresResiden />} />
          <Route path="/dosen/pengabdian-masyarakat" element={<DosenVerifyPengabdian />} />
          <Route path="/dosen/kegiatan-ilmiah" element={<DosenVerifyKegiatanIlmiah />} />
          <Route path="/dosen/bimbingan-konseling" element={<DosenBimbinganKonseling />} />
          <Route path="/dosen/soft-skill" element={<DosenSoftSkill />} />
          <Route path="/dosen/dops" element={<DosenDops />} />
          <Route path="/dosen/bimbingan-skripsi" element={<DosenThesisGuidance />} />
          <Route path="/dosen/pengajuan-izin" element={<DosenPersetujuanIzin />} />
          {/* Tambahkan rute dosen lainnya di sini */}
        </Route>
      </Route>

      {/* ================= ADMIN (PROTECTED) ================= */}
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route element={<MainLayoutAdmin />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/mahasiswa" element={<AdminMahasiswa/>} />
          <Route path="/admin/dosen" element={<AdminDosen/>} />
          <Route path="/admin/mentor" element={<AdminMentor/>} />
          <Route path="/admin/reset-face" element={<AdminResetFace />} />
          <Route path="/admin/presensi/rekap" element={<AdminPresensiRekap />} />
          <Route path="/admin/presensi/jadwal" element={<AdminPresensiJadwal />} />
          <Route path="/admin/presensi/lokasi" element={<AdminPresensiLokasi />} />
          {/* Tambahkan rute admin lainnya di sini */}
        </Route>
      </Route>

      {/* ================= UTILITY PAGES ================= */}
      <Route path="/401" element={<Unauthorized />} />
      <Route path="*" element={<Error />} />

    </Routes>
  </Router>
);