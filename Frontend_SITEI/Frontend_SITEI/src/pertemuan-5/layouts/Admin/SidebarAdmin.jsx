import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FiHome, FiUsers, FiUser, FiActivity, FiCheckSquare, FiLogOut, FiPlus,
  FiUserPlus, FiRefreshCw, FiCalendar, FiMapPin, FiClock, FiChevronDown, FiUserCheck, FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function SidebarAdmin({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isPresensiOpen, setIsPresensiOpen] = useState(
    location.pathname.startsWith("/admin/presensi")
  );

  const menuItems = [
    { name: "Beranda", icon: <FiHome />, path: "/admin/dashboard" },
    { name: "Mahasiswa", icon: <FiUsers />, path: "/admin/mahasiswa" },
    { name: "Dosen", icon: <FiUser />, path: "/admin/dosen" },
    { name: "Plotting Pembimbing", icon: <FiUserPlus />, path: "/admin/mentor" },
    { name: "Reset Face Recognition", icon: <FiRefreshCw />, path: "/admin/reset-face" },
  ];

  const presensiItems = [
    { name: "Rekap Presensi", icon: <FiClock />, path: "/admin/presensi/rekap" },
    { name: "Jadwal Rotasi", icon: <FiCalendar />, path: "/admin/presensi/jadwal" },
    { name: "Area Lokasi", icon: <FiMapPin />, path: "/admin/presensi/lokasi" },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Keluar",
      text: "Apakah Anda yakin ingin keluar dari sistem admin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider mx-2 outline-none border-none",
        cancelButton: "bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider mx-2 outline-none border-none",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose(); // tutup sidebar di mobile setelah navigasi
  };

  const NavButton = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <button
        onClick={() => handleNavigate(item.path)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold cursor-pointer transition-all duration-300 ease-in-out group relative overflow-hidden ${
          isActive
            ? "bg-blue-50/80 text-[#003178] shadow-sm translate-x-1"
            : "text-slate-500 hover:bg-slate-50/80 hover:text-[#003178] hover:translate-x-1"
        }`}
      >
        <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#003178] rounded-r-lg transition-all duration-300 ease-in-out ${
          isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        }`}></span>
        <span className={`text-xl flex items-center transition-all duration-300 ease-in-out ${
          isActive ? "scale-110 rotate-0" : "group-hover:scale-110 group-hover:rotate-3"
        }`}>
          {item.icon}
        </span>
        <span className={`text-sm transition-all duration-300 ${
          isActive ? "font-extrabold" : "font-semibold"
        }`}>
          {item.name}
        </span>
      </button>
    );
  };

  const sidebarContent = (
    <aside className="h-full flex flex-col w-64 border-r border-slate-200 bg-white font-['Manrope'] shadow-sm select-none">
      {/* Brand Header */}
      <div className="p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#003178] rounded-xl flex items-center justify-center text-white shadow-md transform transition-transform duration-300 hover:rotate-90">
            <FiPlus className="text-2xl font-black" />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">Logbook</div>
            <div className="text-[10px] text-[#003178] uppercase tracking-widest font-bold mt-1">Sistem Admin</div>
          </div>
        </div>
        {/* Close button — hanya di mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-2 space-y-1 overflow-y-auto scrollbar-none">
        {/* 1. Beranda */}
        <NavButton item={menuItems[0]} />

        {/* 2. DROPDOWN: Presensi Mahasiswa */}
        <div className="relative">
          <button
            onClick={() => setIsPresensiOpen(!isPresensiOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all duration-300 cursor-pointer ${
              isPresensiOpen || presensiItems.some(sub => location.pathname === sub.path)
                ? "text-[#003178] bg-blue-50/40"
                : "text-slate-500 hover:bg-slate-50/80 hover:text-[#003178]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl"><FiUserCheck /></span>
              <span className="text-sm">Presensi</span>
            </div>
            <motion.span
              animate={{ rotate: isPresensiOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FiChevronDown />
            </motion.span>
          </button>

          <AnimatePresence>
            {isPresensiOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden ml-4 mt-1 space-y-1 border-l-2 border-slate-100"
              >
                {presensiItems.map((sub, idx) => {
                  const isSubActive = location.pathname === sub.path;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleNavigate(sub.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSubActive
                          ? "text-[#003178] bg-blue-50/80 font-extrabold"
                          : "text-slate-400 hover:text-[#003178] hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base">{sub.icon}</span>
                      {sub.name}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Menu Admin Lainnya */}
        {menuItems.slice(1).map((item, index) => (
          <NavButton key={index} item={item} />
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="px-4 py-6 mb-2 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-in-out group font-semibold hover:translate-x-1"
        >
          <FiLogOut className="text-lg transition-transform duration-300 group-hover:scale-110" />
          <span className="text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-40">
        {sidebarContent}
      </div>

      {/* Mobile: slide-in drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.28 }}
            className="fixed left-0 top-0 h-screen z-40 lg:hidden"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}