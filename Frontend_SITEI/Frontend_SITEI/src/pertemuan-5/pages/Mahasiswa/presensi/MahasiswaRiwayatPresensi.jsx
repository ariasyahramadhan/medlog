import React, { useState, useEffect } from "react";
import { FiClock, FiLoader, FiAlertTriangle, FiMapPin, FiFlag, FiCheckCircle, FiXCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getAttendanceHistory } from "../../../../services/attendanceService";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const formatDateTime = (str) => {
  if (!str) return "—";
  return new Date(str).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const TypeBadge = ({ type }) => {
  if (type === "check_in") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
        <FiCheckCircle size={10} /> Masuk
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
      <FiXCircle size={10} /> Pulang
    </span>
  );
};

const FlagBadge = ({ isFlagged, reason }) => {
  if (!isFlagged) return null;
  return (
    <span
      title={reason || "Presensi ditandai untuk ditinjau"}
      className="flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full cursor-help"
    >
      <FiFlag size={10} /> Ditinjau
    </span>
  );
};

// ─── Komponen Utama ───────────────────────────────────────────────────────────
export default function MahasiswaRiwayatPresensi() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async (m, y) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAttendanceHistory(m, y);
      setLogs(res.data?.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal memuat riwayat presensi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(month, year); }, [month, year]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    const nowM = now.getMonth() + 1;
    const nowY = now.getFullYear();
    if (year > nowY || (year === nowY && month >= nowM)) return;
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();

  // ─── Statistik ringkas ───────────────────────────────────────────────────
  const checkIns = logs.filter((l) => l.type === "check_in");
  const checkOuts = logs.filter((l) => l.type === "check_out");
  const flagged = logs.filter((l) => l.is_flagged);

  return (
    <div className="space-y-6 pb-10 font-['Inter'] max-w-3xl mx-auto">
      {/* ── Header ── */}
      <div className="font-['Manrope']">
        <h1 className="text-2xl font-extrabold text-[#003178] tracking-tight mb-1">
          Riwayat Presensi
        </h1>
        <p className="text-sm text-slate-400 font-medium">
          Lihat catatan kehadiran Anda per bulan
        </p>
      </div>

      {/* ── Navigasi Bulan ── */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-3">
        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <FiChevronLeft size={18} />
        </button>
        <span className="font-extrabold text-slate-700 text-sm">
          {BULAN[month - 1]} {year}
        </span>
        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <FiChevronRight size={18} />
        </button>
      </div>

      {/* ── Stat Cards ── */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
            <p className="text-2xl font-extrabold text-[#003178]">{checkIns.length}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Hari Masuk</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
            <p className="text-2xl font-extrabold text-emerald-600">{checkOuts.length}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Hari Pulang</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
            <p className="text-2xl font-extrabold text-amber-600">{flagged.length}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ditinjau</p>
          </div>
        </div>
      )}

      {/* ── Daftar Log ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <FiLoader className="animate-spin text-[#003178]" size={22} />
          <p className="text-xs font-bold text-slate-400">Memuat riwayat...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
          <FiAlertTriangle className="text-red-500 shrink-0" size={18} />
          <p className="text-sm font-bold text-red-600">{error}</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center">
          <FiClock className="text-slate-300 mx-auto mb-3" size={32} />
          <p className="font-bold text-slate-400 text-sm">Tidak ada catatan presensi di bulan ini.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`bg-white border rounded-2xl px-5 py-4 flex items-start gap-4 hover:shadow-sm transition-shadow ${
                log.is_flagged ? "border-amber-200" : "border-slate-200"
              }`}
            >
              {/* Ikon tipe */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg ${
                log.type === "check_in" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
              }`}>
                {log.type === "check_in" ? <FiCheckCircle /> : <FiXCircle />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <TypeBadge type={log.type} />
                  <FlagBadge isFlagged={log.is_flagged} reason={log.flag_reason} />
                </div>
                <p className="text-sm font-bold text-slate-700">{formatDateTime(log.attended_at)}</p>
                {log.location_area?.name && (
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5 flex items-center gap-1">
                    <FiMapPin size={10} /> {log.location_area.name}
                  </p>
                )}
                {log.is_flagged && log.flag_reason && (
                  <p className="text-[11px] text-amber-600 font-bold mt-1 bg-amber-50 rounded-lg px-2 py-1">
                    ⚠ {log.flag_reason}
                  </p>
                )}
              </div>

              {/* Koordinat */}
              {log.latitude && log.longitude && (
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-mono text-slate-400 leading-relaxed">
                    {parseFloat(log.latitude).toFixed(5)}<br />
                    {parseFloat(log.longitude).toFixed(5)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
