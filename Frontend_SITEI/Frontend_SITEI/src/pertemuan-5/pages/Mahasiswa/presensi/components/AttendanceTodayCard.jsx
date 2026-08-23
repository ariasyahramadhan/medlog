import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiAlertTriangle, FiLoader, FiArrowRight, FiXCircle } from "react-icons/fi";

const formatTime = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Widget card presensi untuk dashboard mahasiswa.
 * Props:
 *  - hasCheckedIn, hasCheckedOut, checkInLog, checkOutLog, loading, schedule
 */
export default function AttendanceTodayCard({ hasCheckedIn, hasCheckedOut, checkInLog, checkOutLog, loading, schedule }) {
  const navigate = useNavigate();

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-200/60 flex items-center gap-4">
        <FiLoader className="animate-spin text-[#003178]" size={20} />
        <p className="text-xs font-bold text-slate-400">Memuat status presensi...</p>
      </div>
    );
  }

  // ─── Tidak ada jadwal ──────────────────────────────────────────────────────
  if (!schedule) {
    return (
      <div
        onClick={() => navigate("/mahasiswa/presensi")}
        className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-200/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xl">
            <FiClock />
          </div>
          <span className="text-[10px] font-extrabold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            Presensi
          </span>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Hari Ini</p>
        <p className="font-bold text-slate-500 text-sm">Tidak ada jadwal aktif</p>
        <p className="text-[10px] text-slate-400 mt-1">Hubungi admin jika ada kesalahan</p>
      </div>
    );
  }

  // ─── Selesai semua ────────────────────────────────────────────────────────
  if (hasCheckedIn && hasCheckedOut) {
    return (
      <div
        onClick={() => navigate("/mahasiswa/presensi")}
        className="bg-white p-6 rounded-[24px] shadow-sm border border-emerald-200/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 text-xl">
            <FiCheckCircle />
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            Selesai
          </span>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Presensi Hari Ini</p>
        <p className="font-extrabold text-emerald-700 text-lg">Sudah Hadir ✓</p>
        <div className="flex gap-4 mt-2">
          <p className="text-[11px] text-slate-500 font-bold">
            Masuk: <span className="text-slate-700">{formatTime(checkInLog?.attended_at)}</span>
          </p>
          <p className="text-[11px] text-slate-500 font-bold">
            Pulang: <span className="text-slate-700">{formatTime(checkOutLog?.attended_at)}</span>
          </p>
        </div>
      </div>
    );
  }

  // ─── Sudah check-in, belum check-out ─────────────────────────────────────
  if (hasCheckedIn && !hasCheckedOut) {
    return (
      <div
        onClick={() => navigate("/mahasiswa/presensi")}
        className="bg-white p-6 rounded-[24px] shadow-sm border border-amber-200/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 text-xl">
            <FiClock />
          </div>
          <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 animate-pulse">
            Dalam Rotasi
          </span>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Presensi Hari Ini</p>
        <p className="font-extrabold text-amber-600 text-lg">Belum Check-out</p>
        <p className="text-[11px] text-slate-500 font-bold mt-1">
          Masuk: <span className="text-slate-700">{formatTime(checkInLog?.attended_at)}</span>
        </p>
        <div className="flex items-center gap-1.5 mt-3 text-[#003178]">
          <span className="text-xs font-bold">Lakukan Check-out sekarang</span>
          <FiArrowRight size={13} />
        </div>
      </div>
    );
  }

  // ─── Belum absen sama sekali ──────────────────────────────────────────────
  return (
    <div
      onClick={() => navigate("/mahasiswa/presensi")}
      className="bg-white p-6 rounded-[24px] shadow-sm border border-blue-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003178] text-xl">
          <FiXCircle />
        </div>
        <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100 animate-pulse">
          Belum Hadir
        </span>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Presensi Hari Ini</p>
      <p className="font-extrabold text-slate-800 text-lg">Segera Check-in</p>
      {schedule && (
        <p className="text-[11px] text-slate-400 font-bold mt-1">
          Jadwal: {schedule.check_in_start?.slice(0, 5)} – {schedule.check_out_end?.slice(0, 5)}
        </p>
      )}
      <div className="flex items-center gap-1.5 mt-3 text-[#003178] group-hover:gap-3 transition-all">
        <span className="text-xs font-bold">Absen Sekarang</span>
        <FiArrowRight size={13} />
      </div>
    </div>
  );
}
