import { Outlet } from "react-router-dom";
import SidebarDosen from "./SidebarDosen";
import NavbarDosen from "./NavbarDosen";

export default function MainLayoutDosen() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Inter'] antialiased">
      {/* Sidebar Navigation */}
      <SidebarDosen />

      {/* Main Framework View - Edge to Edge */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <NavbarDosen user={user} />

        {/* Content Panel Area */}
        <main className="flex-1 p-10 mt-20 bg-[#F8FAFC] w-full h-full">
          <div className="max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}