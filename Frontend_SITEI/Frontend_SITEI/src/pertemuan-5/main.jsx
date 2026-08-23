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
import DosenPengaturan from "./pages/Dosen/DosenPengaturan.jsx";
import MahasiswaPengaturan from "./pages/Mahasiswa/MahasiswaPengaturan.jsx";
import ChangePassword from "./pages/auth/ChangePassword.jsx";
import MahasiswaPanduanLogbook from "./pages/Mahasiswa/MahasiswaPanduanLogbook.jsx"
import MahasiswaSanksiPenghargaan from "./pages/Mahasiswa/MahasiswaSanksiPenghargaan.jsx"
import MahasiswaPanduanEtika from "./pages/Mahasiswa/MahasiswaPanduanEtika.jsx"
import MahasiswaPanduanTataTertib from "./pages/Mahasiswa/MahasiswaPanduanTataTertib.jsx"

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
          {/* Tambahkan rute mahasiswa lainnya di sini */}
        </Route>
      </Route>

      {/* ================= DOSEN (PROTECTED) ================= */}
      <Route element={<ProtectedRoute allowedRoles={["Dosen"]} />}>
        <Route element={<MainLayoutDosen />}>
          <Route path="/dosen/dashboard" element={<DosenDashboard />} />
          <Route path="/dosen/pengaturan" element={<DosenPengaturan />} />
          {/* Tambahkan rute dosen lainnya di sini */}
        </Route>
      </Route>

      {/* ================= ADMIN (PROTECTED) ================= */}
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route element={<MainLayoutAdmin />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/mahasiswa" element={<AdminMahasiswa/>} />
          <Route path="/admin/dosen" element={<AdminDosen/>} />
          {/* Tambahkan rute admin lainnya di sini */}
        </Route>
      </Route>

      {/* ================= UTILITY PAGES ================= */}
      <Route path="/401" element={<Unauthorized />} />
      <Route path="*" element={<Error />} />

    </Routes>
  </Router>
);