import { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";

const API_BASE = "https://api.sigmaeducation.id/api";
const PLACEHOLDER_AVATAR = (name) => 
  `https://ui-avatars.com/api/?background=003178&color=fff&size=128&name=${encodeURIComponent(name || "User")}`;

// Helper: Normalisasi URL avatar persis seperti di pengaturan
const resolveAvatarUrl = (avatarPath, name) => {
  if (!avatarPath) return PLACEHOLDER_AVATAR(name);
  if (avatarPath.startsWith("http")) return avatarPath;
  return `https://api.sigmaeducation.id${avatarPath}`;
};

export default function NavbarDosen() {
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE}/lecturer/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Gagal memuat profil di navbar:", err);
    }
  };

  useEffect(() => {
    fetchProfile();

    window.addEventListener("storage", fetchProfile);
    return () => window.removeEventListener("storage", fetchProfile);
  }, []);

  const getInitials = (name) => {
    if (!name) return "DH";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 right-0 left-64 h-20 bg-white/70 backdrop-blur-xl flex justify-between items-center px-10 z-30 border-b border-slate-200/60 font-['Manrope'] select-none">
      {/* Search Bar */}
      <div className="flex items-center bg-slate-100/60 px-5 py-2.5 rounded-2xl w-[400px] border border-slate-200/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#003178]/10 transition-all duration-300">
        <FiSearch className="text-slate-400 mr-3 text-lg" />
        <input 
          className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full placeholder-slate-400 font-['Inter'] font-medium" 
          placeholder="Cari antrian validasi..." 
          type="text"
        />
      </div>

      {/* Navigation Links and User Control */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
          <button className="text-[#003178] relative after:absolute after:bottom-[-22px] after:left-0 after:w-full after:h-[3px] after:bg-[#003178] after:rounded-full font-extrabold tracking-wide">
            Validation Queue
          </button>
          {/* Menu Notifications dan Reports telah dihapus */}
        </div>

        <div className="h-8 w-px bg-slate-200/60"></div>

        <div className="flex items-center gap-5">
          {/* Ikon Notifikasi telah dihapus */}

          {/* Profil User */}
          <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl border border-slate-200/60 cursor-pointer hover:shadow-sm hover:border-slate-300/80 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center font-extrabold text-[#003178] text-sm font-['Manrope'] shadow-sm shrink-0">
              {profile?.avatar || profile?.avatar_url ? (
                <img
                  src={resolveAvatarUrl(profile.avatar_url || profile.avatar, profile.name)}
                  alt="Avatar"
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PLACEHOLDER_AVATAR(profile?.name);
                  }}
                />
              ) : (
                <span className="tracking-wider">
                  {getInitials(profile?.name)}
                </span>
              )}
            </div>
            <div className="flex flex-col font-['Inter'] text-right select-none">
              <span className="text-xs font-extrabold text-slate-800 leading-none">
                {profile?.name || "Dr. Hendra K., Sp.An"}
              </span>
              <span className="text-[10px] text-slate-400 font-bold mt-1">
                {profile?.department || "Consultant"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}