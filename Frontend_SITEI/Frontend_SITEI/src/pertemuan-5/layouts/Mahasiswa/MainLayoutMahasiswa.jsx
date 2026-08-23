import { Outlet } from "react-router-dom";
import SidebarMahasiswa from "./SidebarMahasiswa";
import NavbarMahasiswa from "./NavbarMahasiswa";

export default function MainLayoutStudent() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Inter'] antialiased">
      {/* Sidebar tetap di kiri */}
      <SidebarMahasiswa />

      {/* Area Konten Utama - Memenuhi sisa lebar layar secara dinamis */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <NavbarMahasiswa user={user} />

        {/* Isi Halaman Dashboard yang Memenuhi Layar */}
        <main className="flex-1 p-8 mt-20 bg-[#F8FAFC] w-full h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}