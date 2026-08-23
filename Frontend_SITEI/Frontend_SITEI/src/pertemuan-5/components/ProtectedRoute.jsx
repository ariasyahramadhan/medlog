import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    // 1. Jika pengguna belum login sama sekali
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Jika pengguna sudah login, tapi mencoba akses halaman yang bukan role-nya
    // Contoh: Mahasiswa mencoba akses /admin/dashboard
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/401" replace />;
    }

    // 3. Jika login valid dan role sesuai, tampilkan konten halaman
    return <Outlet />;
}