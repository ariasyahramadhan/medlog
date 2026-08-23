import { NavLink, useLocation } from "react-router-dom";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaBookBookmark, FaNoteSticky } from "react-icons/fa6";
import { IoArchive, IoSettings } from "react-icons/io5";
import { AiFillSchedule } from "react-icons/ai";
import { motion } from "framer-motion"; // Pastikan framer-motion terinstal

export default function Sidebar() {
    const location = useLocation();
    
    const lastCourseId = localStorage.getItem("last_active_course") || "1";

    const baseClass =
        "flex items-center rounded-[20px] p-4 font-medium transition-all duration-300 w-[280px] h-[60px] relative overflow-hidden group";
    
    // Warna teks saat tidak aktif tetap abu-abu, saat aktif menjadi putih
    const getLinkStyle = (isActive) => 
        isActive ? "text-white shadow-lg shadow-[#0C2340]/20" : "text-gray-600 hover:bg-gray-50 hover:pl-6";

    const menuItems = [
        { to: "/mentor", end: true, icon: <TbLayoutDashboardFilled />, label: "Dashboard" },
        { to: "/kelas-saya", end: false, icon: <FaBookBookmark />, label: "Kelas Saya" },
        { 
            to: `/mentor/jadwal/${lastCourseId}`, 
            end: false, 
            icon: <AiFillSchedule />, 
            label: "Jadwal",
            // Logika khusus untuk "Jadwal" agar tetap aktif meski ID di URL berubah
            isActiveCustom: location.pathname.includes("/mentor/jadwal")
        },
        { to: "/kelas-arsip", end: false, icon: <IoArchive />, label: "Kelas Diarsipkan" },
        { to: "/catatan", end: false, icon: <FaNoteSticky />, label: "Catatan" },
        { to: "/accounts-settings", end: false, icon: <IoSettings />, label: "Pengaturan Akun" },
    ];

    return (
        <aside
            id="sidebar"
            className="flex min-h-screen flex-col bg-white pb-6 pt-6 pl-6 pr-6 shadow-[10px_0_40px_rgba(0,0,0,0.03)] sticky top-0 z-50 border-r border-gray-50"
        >
            {/* Logo Section */}
            <div id="sidebar-logo" className="flex flex-col items-start mb-8 px-2">
                <motion.img
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    src="/logoCC.png"
                    alt="Logo"
                    className="w-[230px] h-auto mb-4"
                />
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                    <h4 className="font-poppins text-gray-400 text-xs font-black uppercase tracking-[0.3em] opacity-70">
                        Instructor Panel
                    </h4>
                </div>
            </div>

            {/* Menu List */}
            <nav id="sidebar-menu" className="mt-2">
                <ul className="space-y-2 font-poppins">
                    {menuItems.map((item, index) => {
                        const isActiveRoute = item.isActiveCustom ?? false;
                        
                        return (
                            <li key={index}>
                                <NavLink 
                                    to={item.to} 
                                    end={item.end}
                                    className={({ isActive }) => 
                                        `${baseClass} ${getLinkStyle(isActive || isActiveRoute)}`
                                    }
                                >
                                    {({ isActive }) => {
                                        const active = isActive || isActiveRoute;
                                        return (
                                            <>
                                                {/* Animasi Pill Background yang Meluncur */}
                                                {active && (
                                                    <motion.div
                                                        layoutId="mentorActivePill"
                                                        className="absolute inset-0 bg-[#0C2340] z-0"
                                                        initial={{ borderRadius: 20 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                    />
                                                )}
                                                
                                                {/* Content: Icon & Label */}
                                                <div className="relative z-10 flex items-center">
                                                    <span className={`mr-4 text-xl transition-all duration-300 ${active ? "scale-110 rotate-[3deg]" : "group-hover:scale-110"}`}>
                                                        {item.icon}
                                                    </span>
                                                    <span className={`tracking-wide transition-all duration-300 ${active ? "translate-x-1 font-bold" : "group-hover:translate-x-1"}`}>
                                                        {item.label}
                                                    </span>
                                                </div>

                                                {/* Indikator Titik Oranye Glow */}
                                                {active && (
                                                    <motion.div 
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute right-4 w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316] z-10"
                                                    />
                                                )}
                                            </>
                                        );
                                    }}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            
            {/* Footer Sidebar */}
            <div className="mt-auto px-4 py-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-60">
                <p className="text-[10px] font-black text-center text-gray-400 uppercase tracking-widest">
                    v1.0.4 Premium System
                </p>
            </div>
        </aside>
    );
}