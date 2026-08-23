import { Outlet } from "react-router-dom";
import SidebarDosen from "./SidebarDosen";
import NavbarDosen from "./NavbarDosen";

export default function MainLayoutDosen() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased">
      {/* Sidebar tetap di kiri */}
      <SidebarDosen />

      {/* Area Konten Utama */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <NavbarDosen user={user} />

        {/* Isi Halaman Dashboard Dosen */}
        <main className="flex-1 p-8 mt-20 bg-[#F8FAFC] w-full h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}