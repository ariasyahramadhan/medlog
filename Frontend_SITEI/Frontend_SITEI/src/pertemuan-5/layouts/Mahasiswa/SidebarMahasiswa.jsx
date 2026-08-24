import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome, FiBookOpen, FiUsers, FiClock,
  FiBarChart2, FiFileText, FiPlusCircle,
  FiSettings, FiLogOut, FiPlus, FiInfo, FiShield,
  FiCheck, FiCheckSquare, FiChevronDown, FiTarget,
  FiGlobe, FiAward, FiClipboard, FiUserCheck, FiX
} from "react-icons/fi";

export default function SidebarMahasiswa({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isKegiatanOpen, setIsKegiatanOpen] = useState(false);
  const [isPanduanOpen, setIsPanduanOpen] = useState(false);

  const menuItems = [
    { name: "Beranda", icon: <FiHome />, path: "/mahasiswa/dashboard" },
    { name: "Presensi", icon: <FiUserCheck />, path: "/mahasiswa/presensi" },
    { name: "Riwayat", icon: <FiClock />, path: "/mahasiswa/riwayat-kasus" },
    { name: "Bim & Bina", icon: <FiUsers />, path: "/mahasiswa/bimbingan-konseling" },
    { name: "Soft Skill", icon: <FiFileText />, path: "/mahasiswa/soft-skill" },
  ];

  const kegiatanSubs = [
    { name: "Pengabdian Masyarakat", icon: <FiGlobe />, path: "/mahasiswa/pengabdian-masyarakat" },
    { name: "Kegiatan Ilmiah", icon: <FiAward />, path: "/mahasiswa/kegiatan-ilmiah" },
    { name: "Evaluasi DOPS", icon: <FiClipboard />, path: "/mahasiswa/dops" },
  ];

  const panduanSubs = [
    { name: "Buku Log", icon: <FiInfo />, path: "/mahasiswa/panduan" },
    { name: "Sanksi & Reward", icon: <FiShield />, path: "/mahasiswa/sanksi" },
    { name: "Etika Peserta", icon: <FiCheck />, path: "/mahasiswa/etika" },
    { name: "Tata Tertib", icon: <FiCheckSquare />, path: "/mahasiswa/tata-tertib" },
    { name: "Target Kompetensi", icon: <FiTarget />, path: "/mahasiswa/kompetensi" },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Keluar",
      text: "Apakah Anda yakin ingin keluar?",
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
    if (onClose) onClose();
  };

  const sidebarContent = (
    <aside className="h-full flex flex-col w-64 border-r border-slate-200 bg-white font-['Manrope'] shadow-sm select-none">
      {/* Brand Header */}
      <div className="p-6 lg:p-8 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#003178] rounded-xl flex items-center justify-center text-white shadow-md">
            <FiPlus className="text-2xl font-black" />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">Logbook</div>
            <div className="text-[10px] text-[#003178] uppercase tracking-widest font-bold mt-1">Anestesiologi</div>
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

      {/* Navigation Links */}
      <nav className="flex-1 px-4 mt-2 space-y-1 overflow-y-auto scrollbar-none">

        {/* 1. Beranda & Presensi */}
        {menuItems.slice(0, 2).map((item, index) => {
          const isActive = location.pathname === item.path || (item.path === "/mahasiswa/presensi" && location.pathname.startsWith("/mahasiswa/presensi"));
          return (
            <button
              key={index}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                isActive ? "bg-blue-50/80 text-[#003178]" : "text-slate-500 hover:bg-slate-50/80 hover:text-[#003178]"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </button>
          );
        })}

        {/* 2. DROPDOWN: Kegiatan Pendidikan */}
        <div className="relative">
          <button
            onClick={() => setIsKegiatanOpen(!isKegiatanOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
              isKegiatanOpen || kegiatanSubs.some(sub => location.pathname === sub.path)
                ? "text-[#003178]"
                : "text-slate-500 hover:bg-slate-50/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl"><FiBookOpen /></span>
              <span className="text-sm">Kegiatan Pendidikan</span>
            </div>
            <motion.span animate={{ rotate: isKegiatanOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <FiChevronDown />
            </motion.span>
          </button>

          <AnimatePresence>
            {isKegiatanOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden ml-4 mt-1 space-y-1 border-l-2 border-slate-100"
              >
                {kegiatanSubs.map((sub, idx) => {
                  const isSubActive = location.pathname === sub.path;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleNavigate(sub.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        isSubActive ? "text-[#003178] bg-blue-50/50" : "text-slate-400 hover:text-[#003178] hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-lg">{sub.icon}</span>
                      {sub.name}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Menu Utama Lainnya */}
        {menuItems.slice(2).map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                isActive ? "bg-blue-50/80 text-[#003178]" : "text-slate-500 hover:bg-slate-50/80 hover:text-[#003178]"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </button>
          );
        })}

        {/* 4. DROPDOWN: Panduan & Aturan */}
        <div className="relative">
          <button
            onClick={() => setIsPanduanOpen(!isPanduanOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
              isPanduanOpen || panduanSubs.some(sub => location.pathname === sub.path)
                ? "text-[#003178]"
                : "text-slate-500 hover:bg-slate-50/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl"><FiInfo /></span>
              <span className="text-sm">Panduan & Aturan</span>
            </div>
            <motion.span animate={{ rotate: isPanduanOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <FiChevronDown />
            </motion.span>
          </button>

          <AnimatePresence>
            {isPanduanOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden ml-4 mt-1 space-y-1 border-l-2 border-slate-100"
              >
                {panduanSubs.map((sub, idx) => {
                  const isSubActive = location.pathname === sub.path;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleNavigate(sub.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        isSubActive ? "text-[#003178] bg-blue-50/50" : "text-slate-400 hover:text-[#003178] hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-lg">{sub.icon}</span>
                      {sub.name}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Action Button */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => handleNavigate("/mahasiswa/input-kasus")}
          className="w-full bg-[#003178] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-95"
        >
          <FiPlusCircle className="text-lg" />
          <span className="text-sm tracking-wide">Entri Kasus Baru</span>
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="px-4 py-4 space-y-1 border-t border-slate-50 mb-2">
        <button
          onClick={() => handleNavigate("/mahasiswa/pengaturan")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-[#003178] transition-all font-semibold italic"
        >
          <FiSettings className="text-lg" />
          <span className="text-sm">Pengaturan Akun</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all font-semibold italic"
        >
          <FiLogOut className="text-lg" />
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