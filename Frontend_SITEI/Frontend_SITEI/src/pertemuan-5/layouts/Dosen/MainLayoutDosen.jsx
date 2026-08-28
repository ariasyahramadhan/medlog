import { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarDosen from "./SidebarDosen";
import NavbarDosen from "./NavbarDosen";

export default function MainLayoutDosen() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Inter'] antialiased">
      {/* Sidebar Navigation */}
      <SidebarDosen isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay backdrop untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Framework View */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <NavbarDosen user={user} onMenuClick={() => setSidebarOpen(true)} />

        {/* Content Panel Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 mt-16 lg:mt-20 bg-[#F8FAFC] w-full h-full">
          <div className="max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}