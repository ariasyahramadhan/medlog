import { useState, useEffect } from "react";
import { FiSearch, FiMenu } from "react-icons/fi";
import api from "../../../services/api";

const PLACEHOLDER_AVATAR = (name) =>
  `https://ui-avatars.com/api/?background=003178&color=fff&size=128&name=${encodeURIComponent(name || "User")}`;

const resolveAvatarUrl = (avatarPath, name) => {
  if (!avatarPath) return PLACEHOLDER_AVATAR(name);
  if (avatarPath.startsWith("http")) return avatarPath;
  const baseUrl = (import.meta.env.VITE_API_URL || "https://api.sigmaeducation.id").replace(/\/+$/, "");
  return `${baseUrl}${avatarPath}`;
};

export default function NavbarMahasiswa({ onMenuClick }) {
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/mahasiswa/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("Gagal memuat profil mahasiswa di navbar:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    window.addEventListener("storage", fetchProfile);
    return () => window.removeEventListener("storage", fetchProfile);
  }, []);

  const getInitials = (name) => {
    if (!name) return "AF";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 lg:h-20 bg-white/70 backdrop-blur-xl flex justify-between items-center px-4 lg:px-10 z-30 border-b border-slate-200/60 font-['Manrope'] select-none">
      {/* Left: Hamburger (mobile) + Search */}
      <div className="flex items-center gap-3 flex-1">
        {/* Hamburger button — hanya di mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Buka menu"
        >
          <FiMenu size={20} />
        </button>

        {/* Search — tampil di sm ke atas */}
        <div className="hidden sm:flex items-center bg-slate-100/60 px-4 py-2.5 rounded-2xl w-full max-w-xs lg:max-w-[400px] border border-slate-200/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#003178]/10 transition-all duration-300">
          <FiSearch className="text-slate-400 mr-3 text-lg shrink-0" />
          <input
            className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full placeholder-slate-400 font-['Inter'] font-medium"
            placeholder="Cari entri, kompetensi, atau pembimbing..."
            type="text"
          />
        </div>
      </div>

      {/* Right: Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 lg:gap-3 bg-white p-1.5 pr-3 lg:pr-4 rounded-2xl border border-slate-200/60 cursor-pointer hover:shadow-sm hover:border-slate-300/80 transition-all duration-300">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center font-extrabold text-[#003178] text-sm font-['Manrope'] shadow-sm shrink-0">
            {profile?.avatar || profile?.avatar_url ? (
              <img
                src={resolveAvatarUrl(profile.avatar_url || profile.avatar, profile.name)}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_AVATAR(profile?.name);
                }}
              />
            ) : (
              <span className="tracking-wider">{getInitials(profile?.name)}</span>
            )}
          </div>
          <div className="hidden sm:flex flex-col font-['Inter'] text-right select-none">
            <span className="text-xs font-extrabold text-slate-800 leading-none">
              {profile?.name || "Mahasiswa"}
            </span>
            <span className="text-[10px] text-slate-400 font-bold mt-1">
              {profile?.department || "Resident"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}