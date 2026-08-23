import { Outlet } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";
import NavbarAdmin from "./NavbarAdmin";

export default function MainLayoutAdmin() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Inter'] antialiased">
      {/* Sidebar tetap di kiri */}
      <SidebarAdmin />

      {/* Area Konten Utama - Memenuhi sisa lebar layar secara dinamis */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <NavbarAdmin user={user} />

        {/* Isi Halaman Dashboard Admin yang Memenuhi Layar */}
        <main className="flex-1 p-8 mt-20 bg-[#F8FAFC] w-full h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}