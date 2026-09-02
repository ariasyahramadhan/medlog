import { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarMahasiswa from "./SidebarMahasiswa";
import NavbarMahasiswa from "./NavbarMahasiswa";

export default function MainLayoutStudent() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Inter'] antialiased">
      {/* Sidebar — hidden di mobile (drawer), fixed di desktop */}
      <SidebarMahasiswa isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay backdrop untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Area Konten Utama */}
      <div className="flex-1 min-w-0 max-w-full flex flex-col min-h-screen lg:ml-64 overflow-x-hidden">
        {/* Navbar */}
        <NavbarMahasiswa user={user} onMenuClick={() => setSidebarOpen(true)} />

        {/* Isi Halaman */}
        <main className="flex-1 w-full min-w-0 max-w-full p-4 sm:p-6 lg:p-8 mt-16 lg:mt-20 bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}