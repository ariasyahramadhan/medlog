import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FiUser, FiLock, FiCamera, FiInfo,
} from "react-icons/fi";

const API_BASE = "https://api.sigmaeducation.id/api";
const PLACEHOLDER = "https://ui-avatars.com/api/?background=003178&color=fff&size=128&name=User";

const resolveAvatarUrl = (avatarPath) => {
  if (!avatarPath) return PLACEHOLDER;
  if (avatarPath.startsWith("http")) return avatarPath;
  return `https://api.sigmaeducation.id${avatarPath}`;
};

export default function DosenPengaturan() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // State form profil
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Anestesiologi");
  const [avatarPreview, setAvatarPreview] = useState(PLACEHOLDER);
  const [avatarFile, setAvatarFile] = useState(null);

  // State form password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const customSwal = Swal.mixin({
    customClass: {
      confirmButton:
        "bg-[#003178] hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider mx-2 outline-none border-none",
    },
    buttonsStyling: false,
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/lecturer/profile`, {
        headers: getAuthHeader(),
      });

      const data = res.data;
      setProfile(data);
      setName(data.name || "");
      setEmail(data.email || "");
      setDepartment(data.department || "Anestesiologi");
      setAvatarPreview(resolveAvatarUrl(data.avatar_url || data.avatar));
    } catch (err) {
      console.error("Gagal memuat profil:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("department", department);
    if (avatarFile) data.append("avatar", avatarFile);

    try {
      const res = await axios.post(`${API_BASE}/lecturer/profile`, data, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = res.data.user;
      setProfile(updatedUser);

      const freshAvatar = updatedUser.avatar_url || updatedUser.avatar;
      setAvatarPreview(resolveAvatarUrl(freshAvatar));
      setAvatarFile(null);

      customSwal.fire({
        title: "Sukses!",
        text: "Informasi profil telah berhasil diperbarui.",
        icon: "success",
      });
    } catch (err) {
      customSwal.fire({
        title: "Gagal!",
        text: err.response?.data?.message || "Gagal memperbarui profil.",
        icon: "error",
      });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      customSwal.fire("Gagal!", "Konfirmasi password baru tidak cocok.", "error");
      return;
    }

    try {
      await axios.put(
        `${API_BASE}/lecturer/password`,
        { current_password: currentPassword, new_password: newPassword },
        { headers: getAuthHeader() }
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      customSwal.fire("Berhasil!", "Password Anda telah diganti.", "success");
    } catch (err) {
      customSwal.fire(
        "Gagal!",
        err.response?.data?.message || "Gagal mengubah password.",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] w-full bg-slate-50/50">
        <div className="text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
          Memuat data pengaturan akun...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-slate-50/50 p-6 md:p-10 font-['Inter'] select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ── Kolom Kiri: Profile Card ── */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center">

            {/* Avatar + tombol ganti foto */}
            <div className="relative group select-none">
              <img
                alt="Profile Avatar"
                src={avatarPreview}
                onError={(e) => { e.target.src = PLACEHOLDER; }}
                className="w-36 h-36 rounded-full border-4 border-slate-50 object-cover shadow-md transition-all duration-300 group-hover:brightness-95"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-1 right-1 bg-[#003178] hover:bg-blue-800 text-white p-3 rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <FiCamera className="text-lg" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Info singkat */}
            <h3 className="mt-5 font-extrabold text-xl font-['Manrope'] text-[#003178] leading-tight">
              {profile?.name}
            </h3>
            <p className="text-xs font-mono font-bold text-slate-400 mt-1">
              NIP. {profile?.identifier}
            </p>

            <div className="mt-8 w-full pt-5 border-t border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wide">Status Akun</span>
                <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full font-bold uppercase text-[10px]">
                  {profile?.status || "Aktif"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wide">Spesialisasi</span>
                <span className="font-extrabold text-[#003178]">{profile?.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Kolom Kanan: Form ── */}
        <div className="xl:col-span-2 space-y-8">

          {/* Form Informasi Profil */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/40 flex items-center gap-3">
              <FiUser className="text-xl text-[#003178]" />
              <h3 className="font-['Manrope'] font-extrabold text-base text-slate-800 uppercase tracking-wide">
                Informasi Profil
              </h3>
            </div>
            <form onSubmit={handleSaveProfile} className="p-8 space-y-6">

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Nama Lengkap
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:bg-white outline-none focus:ring-1 focus:ring-[#003178] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    NIP / Identitas Pegawai
                  </label>
                  <input
                    readOnly
                    type="text"
                    value={profile?.identifier || ""}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-400 outline-none select-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Spesialisasi
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 cursor-pointer focus:bg-white outline-none focus:ring-1 focus:ring-[#003178] transition-all"
                  >
                    <option>Anestesiologi</option>
                    <option>Kardiologi</option>
                    <option>Pediatri</option>
                    <option>Bedah</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Email Institusi
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:bg-white outline-none focus:ring-1 focus:ring-[#003178] transition-all"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#003178] hover:bg-blue-800 text-white px-8 py-3.5 rounded-xl font-bold text-xs transition-all uppercase tracking-widest shadow-md hover:shadow-lg active:scale-95 duration-200"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>

          {/* Form Keamanan & Password */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/40 flex items-center gap-3">
              <FiLock className="text-xl text-[#003178]" />
              <h3 className="font-['Manrope'] font-extrabold text-base text-slate-800 uppercase tracking-wide">
                Keamanan & Password
              </h3>
            </div>
            <form onSubmit={handleUpdatePassword} className="p-8 space-y-6">

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Password Saat Ini
                </label>
                <input
                  required
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password saat ini"
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:bg-white outline-none focus:ring-1 focus:ring-[#003178] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Password Baru
                  </label>
                  <input
                    required
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:bg-white outline-none focus:ring-1 focus:ring-[#003178] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Ulangi Password Baru
                  </label>
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:bg-white outline-none focus:ring-1 focus:ring-[#003178] transition-all"
                  />
                </div>
              </div>

              <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                <FiInfo className="text-xl text-[#003178] shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-[#003178]">Persyaratan Keamanan Password:</strong>
                  <ul className="list-disc ml-4 mt-1 space-y-0.5">
                    <li>Minimal 8 karakter alfanumerik.</li>
                    <li>Harus mengandung minimal satu huruf kapital dan satu angka.</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#003178] hover:bg-blue-800 text-white px-8 py-3.5 rounded-xl font-bold text-xs transition-all uppercase tracking-widest shadow-md hover:shadow-lg active:scale-95 duration-200"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}