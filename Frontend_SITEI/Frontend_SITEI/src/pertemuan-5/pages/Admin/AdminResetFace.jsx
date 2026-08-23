import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../services/api";
import { FiRefreshCw, FiUser, FiCheckCircle, FiXCircle, FiSearch, FiTrash2, FiShield, FiCpu } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminResetFace() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Gagal mengambil data pengguna:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleResetFace = (userId, userName) => {
    Swal.fire({
      title: "Konfirmasi Reset Wajah",
      text: `Apakah Anda yakin ingin menghapus data biometrik wajah milik ${userName}? Pengguna harus melakukan registrasi ulang setelah ini.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus Data",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider mx-2 outline-none",
        cancelButton: "bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider mx-2 outline-none",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsResetting(userId);
        try {
          const res = await api.post(`/admin/reset-face/${userId}`);
          Swal.fire({
            icon: "success",
            title: "Berhasil Direset",
            text: res.data.message,
            confirmButtonColor: "#003178"
          });
          fetchUsers();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Gagal Mereset",
            text: err.response?.data?.message || "Terjadi kesalahan pada server.",
            confirmButtonColor: "#ef4444"
          });
        } finally {
          setIsResetting(null);
        }
      }
    });
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.identity_number?.includes(searchQuery)
  );

  const registeredCount = users.filter(u =>
    u.face_vector !== null && u.face_vector !== undefined &&
    (!Array.isArray(u.face_vector) || u.face_vector.length > 0)
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full min-h-screen bg-slate-100 p-5 md:p-10"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">

        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-blue-600 to-[#003178]" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-7 pt-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#003178] shrink-0">
              <FiCpu size={22} />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 tracking-tight">
                Manajemen Biometrik Wajah
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Halaman khusus administrator — reset kredensial Facenet pengguna
              </p>
            </div>
          </div>
          <button
            onClick={fetchUsers}
            className="self-start sm:self-center flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all whitespace-nowrap"
          >
            <FiRefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>

        {/* Search */}
        <div className="px-7 py-4 border-b border-slate-50">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
              <FiSearch size={15} />
            </span>
            <input
              type="text"
              placeholder="Cari nama dosen atau nomor identitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#003178] focus:bg-white transition-all duration-200 font-medium"
            />
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 px-7 py-4 border-b border-slate-50">
          {[
            { label: "Total Pengguna", value: users.length, color: "text-slate-800" },
            { label: "Sudah Terdaftar", value: registeredCount, color: "text-emerald-600" },
            { label: "Belum Terdaftar", value: users.length - registeredCount, color: "text-slate-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <FiRefreshCw className="animate-spin text-[#003178]" size={26} />
              <p className="text-xs font-medium">Memuat data autentikasi...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-slate-400 font-medium">Tidak ada data pengguna yang cocok.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse" style={{ tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "45%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "30%" }} />
              </colgroup>
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-3 px-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">Informasi Pengguna</th>
                  <th className="py-3 px-6 text-[10px] font-black tracking-widest text-slate-400 uppercase text-center">Status Biometrik</th>
                  <th className="py-3 px-6 text-[10px] font-black tracking-widest text-slate-400 uppercase text-right">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user, i) => {
                    const isRegistered = user.face_vector !== null && user.face_vector !== undefined &&
                      (!Array.isArray(user.face_vector) || user.face_vector.length > 0);

                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#003178] shrink-0">
                              <FiUser size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 text-sm truncate">{user.name}</p>
                              <p className="text-slate-400 text-xs mt-0.5 truncate">{user.identity_number || "Nomor identitas belum diset"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {isRegistered ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <FiCheckCircle size={12} /> Terdaftar
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200">
                              <FiXCircle size={12} /> Belum Set
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleResetFace(user.id, user.name)}
                            disabled={!isRegistered || isResetting === user.id}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border
                              ${isRegistered && isResetting !== user.id
                                ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200 cursor-pointer active:scale-95"
                                : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                              }`}
                          >
                            {isResetting === user.id ? (
                              <><FiRefreshCw className="animate-spin" size={12} /> Memproses...</>
                            ) : (
                              <><FiTrash2 size={12} /> Reset Wajah</>
                            )}
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-50 flex items-center gap-2">
          <FiShield size={12} className="text-slate-300 shrink-0" />
          <span className="text-[11px] text-slate-300">
            Aksi reset bersifat permanen &bull; Pengguna wajib registrasi ulang setelahnya
          </span>
        </div>

      </div>
    </motion.div>
  );
}