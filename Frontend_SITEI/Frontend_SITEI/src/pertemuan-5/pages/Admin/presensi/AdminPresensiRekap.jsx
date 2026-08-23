import React, { useState, useEffect, useMemo } from "react";
import {
  FiClock, FiSearch, FiDownload, FiTrash2,
  FiCheckCircle, FiAlertTriangle, FiRefreshCw, FiMapPin,
  FiFilter, FiEye, FiX, FiCheck, FiXCircle
} from "react-icons/fi";
import Swal from "sweetalert2";
import {
  getAdminAttendanceHistory,
  deleteAttendanceLog,
  resetAttendanceFlag,
  exportAttendanceCsv
} from "../../../../services/adminAttendanceService";

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function AdminPresensiRekap() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "flagged", "valid"
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = { month, year };
      if (statusFilter === "flagged") params.is_flagged = true;
      if (statusFilter === "valid") params.is_flagged = false;
      const res = await getAdminAttendanceHistory(params);
      setLogs(Array.isArray(res.data) ? res.data : (res.data?.data ?? []));
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Gagal memuat rekap presensi", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [month, year, statusFilter]);

  // Filtered by search client-side
  const filteredLogs = useMemo(() => {
    if (!search.trim()) return logs;
    const q = search.toLowerCase();
    return logs.filter(
      (l) =>
        l.user?.name?.toLowerCase().includes(q) ||
        l.user?.identifier?.toLowerCase().includes(q) ||
        l.location_area?.name?.toLowerCase().includes(q)
    );
  }, [logs, search]);

  const handleResetFlag = async (id) => {
    const result = await Swal.fire({
      title: "Setujui Presensi Ini?",
      text: "Flag tanda peringatan akan dihilangkan dan presensi dinyatakan valid.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#003178",
      confirmButtonText: "Ya, Setujui",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        await resetAttendanceFlag(id);
        Swal.fire("Berhasil", "Status presensi telah disetujui.", "success");
        fetchLogs();
      } catch (err) {
        Swal.fire("Gagal", "Gagal mereset status flag.", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Catatan Presensi?",
      text: "Data yang dihapus tidak dapat dikembalikan lagi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        await deleteAttendanceLog(id);
        Swal.fire("Dihapus", "Catatan presensi berhasil dihapus.", "success");
        fetchLogs();
      } catch (err) {
        Swal.fire("Gagal", "Gagal menghapus catatan presensi.", "error");
      }
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = { month, year };
      const res = await exportAttendanceCsv(params);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `rekap_presensi_${year}_${month}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      Swal.fire("Berhasil", "File CSV rekap presensi berhasil diunduh.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Gagal mengekspor data ke CSV.", "error");
    } finally {
      setExporting(false);
    }
  };

  const checkIns = logs.filter((l) => l.type === "check_in").length;
  const checkOuts = logs.filter((l) => l.type === "check_out").length;
  const flaggedCount = logs.filter((l) => l.is_flagged).length;

  return (
    <div className="space-y-7 font-['Inter'] pb-12 select-none">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-['Manrope']">
        <div>
          <h1 className="text-3xl font-extrabold text-[#003178] tracking-tight mb-1">
            Rekap Presensi Mahasiswa
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Monitoring kehadiran harian residen, verifikasi kepatuhan lokasi, dan ekspor data
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || logs.length === 0}
          className="flex items-center gap-2 bg-[#003178] hover:bg-blue-900 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-md shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer shrink-0"
        >
          <FiDownload size={15} />
          <span>{exporting ? "Mengekspor..." : "Export CSV"}</span>
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003178] flex items-center justify-center text-xl shrink-0">
            <FiClock />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Presensi</p>
            <p className="text-2xl font-extrabold text-slate-800">{logs.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <FiCheckCircle />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-In</p>
            <p className="text-2xl font-extrabold text-emerald-600">{checkIns}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0">
            <FiXCircle />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-Out</p>
            <p className="text-2xl font-extrabold text-indigo-600">{checkOuts}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <FiAlertTriangle />
          </div>
          <div>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Perlu Ditinjau</p>
            <p className="text-2xl font-extrabold text-amber-700">{flaggedCount}</p>
          </div>
        </div>
      </div>

      {/* ── Filters & Search Bar ── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        <div className="flex flex-wrap items-center gap-3">
          {/* Month */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500">Bulan:</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#003178]"
            >
              {BULAN.map((b, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500">Tahun:</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#003178]"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#003178]"
            >
              <option value="all">Semua Status</option>
              <option value="valid">Hanya Valid</option>
              <option value="flagged">Perlu Ditinjau (Flagged)</option>
            </select>
          </div>

          <button
            onClick={fetchLogs}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau NIM..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#003178] transition-all"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-5">Mahasiswa</th>
                <th className="py-4 px-4">Tipe</th>
                <th className="py-4 px-4">Waktu Presensi</th>
                <th className="py-4 px-4">Lokasi / Area</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-center">Foto</th>
                <th className="py-4 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                    <FiRefreshCw className="animate-spin inline-block mr-2" size={16} />
                    Memuat log presensi...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                    Tidak ada catatan presensi ditemukan.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const dateStr = log.attended_at
                    ? new Date(log.attended_at).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";

                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        log.is_flagged ? "bg-amber-50/30" : ""
                      }`}
                    >
                      {/* Mahasiswa Info */}
                      <td className="py-4 px-5">
                        <p className="font-extrabold text-slate-800 text-sm">
                          {log.user?.name || "Mahasiswa"}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {log.user?.identifier || "-"}
                        </p>
                      </td>

                      {/* Tipe Presensi */}
                      <td className="py-4 px-4">
                        {log.type === "check_in" ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                            <FiCheckCircle size={11} /> Masuk
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                            <FiXCircle size={11} /> Pulang
                          </span>
                        )}
                      </td>

                      {/* Waktu */}
                      <td className="py-4 px-4 font-bold text-slate-700">{dateStr}</td>

                      {/* Lokasi */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                          <FiMapPin className="text-[#003178] shrink-0" size={13} />
                          <span>{log.location_area?.name || "Di Luar Area"}</span>
                        </div>
                        {log.latitude && (
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {parseFloat(log.latitude).toFixed(5)}, {parseFloat(log.longitude).toFixed(5)}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {log.is_flagged ? (
                          <div>
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full text-[10px] font-black">
                              <FiAlertTriangle size={11} /> Ditinjau
                            </span>
                            {log.flag_reason && (
                              <p className="text-[10px] text-amber-700 font-semibold mt-1 max-w-[180px] leading-tight">
                                {log.flag_reason}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            <FiCheck size={11} className="text-emerald-600" /> Valid
                          </span>
                        )}
                      </td>

                      {/* Foto Thumbnail */}
                      <td className="py-4 px-4 text-center">
                        {log.photo_path ? (
                          <button
                            onClick={() =>
                              setSelectedPhoto(`https://api.sigmaeducation.id/storage/${log.photo_path}`)
                            }
                            className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:scale-105 transition-transform inline-block cursor-pointer"
                            title="Lihat Foto"
                          >
                            <img
                              src={`https://api.sigmaeducation.id/storage/${log.photo_path}`}
                              alt="Foto presensi"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </button>
                        ) : (
                          <span className="text-slate-300 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-5 text-right space-x-2">
                        {log.is_flagged && (
                          <button
                            onClick={() => handleResetFlag(log.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold shadow-xs cursor-pointer transition-all"
                            title="Setujui dan hilangkan flag peringatan"
                          >
                            Setujui
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer inline-block"
                          title="Hapus log"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Photo Preview Modal ── */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-extrabold text-[#003178]">Foto Presensi Mahasiswa</h3>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
              <img src={selectedPhoto} alt="Zoom foto" className="w-full h-auto object-contain max-h-[380px]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
