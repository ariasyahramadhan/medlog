import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiActivity, FiCheckCircle, FiClock, FiFileText,
  FiShield, FiLoader, FiAlertTriangle, FiXCircle,
  FiTrendingUp, FiUsers, FiBook, FiAward
} from "react-icons/fi";

const API_URL = 'https://api.sigmaeducation.id/api';

const formatTanggal = (val) => {
  if (!val) return '—';
  // Epoch milidetik (dari backend)
  const d = typeof val === 'number' ? new Date(val) : new Date(val);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const statusBadge = (status) => {
  const map = {
    verified: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Terverifikasi' },
    pending:  { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'Pending'      },
    rejected: { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     label: 'Ditolak'      },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
};

const feedIcon = (type) => {
  if (type === 'softskill') return <FiUsers />;
  return <FiCheckCircle />;
};

export default function DashboardMahasiswa() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}/mahasiswa/dashboard-stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStats(res.data);
    } catch (err) {
      setError({
        status:    err?.response?.status,
        message:   err?.response?.data?.message || 'Koneksi ke server gagal.',
        exception: err?.response?.data?.debug_exception || null,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const getSalam = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat Pagi';
    if (h < 17) return 'Selamat Siang';
    return 'Selamat Malam';
  };

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
      <FiLoader className="animate-spin text-[#003178]" size={30} />
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Menyusun Dasbor Residen...</p>
    </div>
  );

  // ─── Error Panel ────────────────────────────────────────────────────────────
  if (error) return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-lg bg-white border border-red-100 rounded-3xl p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <FiAlertTriangle className="text-red-500" size={20} />
          <h2 className="font-black text-red-600 uppercase tracking-wide text-sm">Gagal Memuat Dasbor</h2>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-sm">
          <p className="text-slate-500 font-bold">HTTP {error.status}</p>
          <p className="text-slate-700 font-bold">{error.message}</p>
          {error.exception && (
            <p className="font-mono text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 break-all">
              {error.exception}
            </p>
          )}
        </div>
        <button
          onClick={fetchStats}
          className="w-full py-3 bg-[#003178] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-800 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );

  // ─── Kalkulasi turunan ──────────────────────────────────────────────────────
  const totalLogbook      = stats.approved_count + stats.pending_count;
  const verificationRate  = totalLogbook > 0 ? Math.round((stats.approved_count / totalLogbook) * 100) : 0;
  const kasusRate         = stats.total_kasus > 0
    ? Math.round((stats.verified_kasus / stats.total_kasus) * 100)
    : 0;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 font-['Inter'] w-full select-none pb-10">

      {/* ── Header ── */}
      <div className="font-['Manrope']">
        <h1 className="text-3xl font-extrabold text-[#003178] mb-1.5 tracking-tight">
          {getSalam()}, {user?.name || 'Dokter Residen'}
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Lacak kemajuan rotasi klinis dan verifikasi logbook harian Anda secara real-time
        </p>
      </div>

      {/* ── Stat Cards (4 kolom) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 w-full">

        {/* Total Kasus */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003178] text-xl">
              <FiFileText />
            </div>
            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              Logbook
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Kasus Diinput</p>
            <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[36px] leading-none">
              {stats.total_kasus.toLocaleString('id-ID')}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-2">
              <span className="text-emerald-600">{stats.verified_kasus} terverifikasi</span>
              {' · '}
              <span className="text-amber-500">{stats.pending_kasus} pending</span>
              {stats.rejected_kasus > 0 && <span className="text-red-500"> · {stats.rejected_kasus} ditolak</span>}
            </p>
          </div>
        </div>

        {/* Progres Kurikulum */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-11 h-11 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 text-xl">
              <FiActivity />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <div className={`w-1.5 h-1.5 rounded-full ${stats.progres_persen >= 50 ? 'bg-emerald-500' : 'bg-amber-400'} animate-pulse`}></div>
              <span className="text-[10px] font-black text-slate-600 uppercase">
                {stats.progres_persen >= 80 ? 'Excellent' : stats.progres_persen >= 50 ? 'On Track' : 'Perlu Kejar'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Progres Kurikulum</p>
            <div className="flex items-end justify-between gap-3 mb-3">
              <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[36px] leading-none">{stats.progres_persen}%</h2>
              <span className="text-[10px] text-slate-400 font-bold pb-1">{stats.verified_kasus}/{stats.target_total} kasus</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${stats.progres_persen}%` }}
                className="bg-purple-500 h-full rounded-full transition-all duration-700"
              />
            </div>
          </div>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 text-xl">
              <FiClock />
            </div>
            {stats.pending_kasus > 0 && (
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 animate-pulse">
                Butuh Aksi
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Menunggu Verifikasi</p>
            <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[36px] leading-none">
              {stats.pending_kasus}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-2">kasus logbook klinis</p>
          </div>
        </div>

        {/* Info Akademik */}
        <div className="bg-[#003178] text-white p-7 rounded-[24px] shadow-xl flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          <div className="relative z-10">
            <p className="text-[10px] font-black text-blue-200/70 uppercase tracking-widest mb-2">Informasi Akademik</p>
            <h3 className="font-['Manrope'] font-bold text-white leading-tight text-lg mb-2">
              Program Pendidikan<br />Dokter Spesialis
            </h3>
            <p className="text-[10px] font-medium text-blue-100/60">
              NIM / ID: {user?.identifier || '—'}
            </p>
          </div>
          <div className="relative z-10 mt-4 flex items-center gap-2">
            <FiAward size={12} className="text-blue-300/70" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
              Fakultas Kedokteran UNRI
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">

        {/* Kiri: Grafik + Feed */}
        <div className="lg:col-span-8 space-y-6">

          {/* Grafik Keterisian Per Jenis Kasus */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide leading-none mb-1">
                Keterisian Target Per Jenis Kasus
              </h3>
              <p className="text-xs font-medium text-slate-400">
                Rasio pencapaian kuota kasus terverifikasi dari kurikulum PPDS
              </p>
            </div>

            {stats.chart_data.length === 0 ? (
              <div className="h-56 flex items-center justify-center">
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">
                  Belum Ada Data Kasus Terverifikasi
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.chart_data.map((item, i) => (
                  <div key={i} className="group/row">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight max-w-[200px] truncate">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.capaian}/{item.target}
                        </span>
                        <span className="text-[11px] font-black text-[#003178] min-w-[36px] text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                      <div
                        style={{ width: `${item.percentage}%` }}
                        className={`h-full rounded-full transition-all duration-700 ${
                          item.percentage >= 80 ? 'bg-emerald-500' :
                          item.percentage >= 50 ? 'bg-[#003178]' :
                          item.percentage >= 20 ? 'bg-amber-400' : 'bg-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Legenda */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center flex-wrap gap-4">
              {[
                { color: 'bg-emerald-500', label: '≥80% Tercapai' },
                { color: 'bg-[#003178]',   label: '50–79% On Track' },
                { color: 'bg-amber-400',   label: '20–49% Perlu Kejar' },
                { color: 'bg-slate-300',   label: '<20% Belum Mulai' },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                  <span className="text-[10px] font-bold text-slate-500">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feed Aktivitas Bimbingan Terbaru */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide leading-none mb-6">
              Aktivitas Bimbingan Terbaru
            </h3>
            <div className="space-y-2">
              {stats.feeds.length === 0 ? (
                <div className="py-10 text-center text-xs font-black text-slate-300 uppercase tracking-widest">
                  Belum Ada Catatan Bimbingan
                </div>
              ) : (
                stats.feeds.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 border ${
                        item.type === 'softskill'
                          ? 'bg-purple-50 text-purple-600 border-purple-100'
                          : 'bg-blue-50 text-[#003178] border-blue-100'
                      }`}>
                        {feedIcon(item.type)}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-tight leading-none">
                          {item.title}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-tight">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {statusBadge(item.status)}
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">
                        {formatTanggal(item.tanggal)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Kasus Klinis Terbaru */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide leading-none mb-6">
              Kasus Klinis Terbaru
            </h3>
            <div className="space-y-2">
              {stats.recent_cases.length === 0 ? (
                <div className="py-10 text-center text-xs font-black text-slate-300 uppercase tracking-widest">
                  Belum Ada Kasus Diinput
                </div>
              ) : (
                stats.recent_cases.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg text-slate-500 shrink-0">
                        <FiBook />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-tight leading-none max-w-[220px] truncate">
                          {item.tindakan}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                          {item.jenis_kasus} · {item.dpjp_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {statusBadge(item.status)}
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">
                        {item.tanggal_tindakan
                          ? new Date(item.tanggal_tindakan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
                          : '—'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Kanan: Panel Info */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          {/* Status Pengesahan */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <h3 className="font-['Manrope'] font-black text-slate-800 text-sm uppercase tracking-wide leading-none mb-6 flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#003178]/5 rounded-lg flex items-center justify-center">
                <FiShield className="text-[#003178] text-sm" />
              </div>
              Status Pengesahan
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Total Kasus',       value: stats.total_kasus,    color: 'text-slate-800'  },
                { label: 'Terverifikasi',      value: stats.verified_kasus, color: 'text-emerald-600'},
                { label: 'Menunggu Verifikasi',value: stats.pending_kasus,  color: 'text-amber-600'  },
                { label: 'Ditolak',            value: stats.rejected_kasus, color: 'text-red-500'    },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{r.label}</span>
                  <span className={`font-extrabold text-sm ${r.color}`}>{r.value}</span>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tingkat Verifikasi Kasus</span>
                  <span className="text-sm font-extrabold text-[#003178]">{kasusRate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${kasusRate}%` }}
                    className="bg-[#003178] h-full rounded-full transition-all duration-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status Logbook Pengabdian & Ilmiah */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <h3 className="font-['Manrope'] font-black text-slate-800 text-sm uppercase tracking-wide leading-none mb-6 flex items-center gap-2.5">
              <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="text-purple-600 text-sm" />
              </div>
              Pengabdian & Ilmiah
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Total Logbook',  value: totalLogbook,          color: 'text-slate-800'   },
                { label: 'Disetujui',      value: stats.approved_count,  color: 'text-emerald-600' },
                { label: 'Menunggu',       value: stats.pending_count,   color: 'text-amber-600'   },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{r.label}</span>
                  <span className={`font-extrabold text-sm ${r.color}`}>{r.value}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rasio Paraf Konsulen</span>
                  <span className="text-sm font-extrabold text-purple-600">{verificationRate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${verificationRate}%` }}
                    className="bg-purple-500 h-full rounded-full transition-all duration-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pengingat */}
          <div className="bg-slate-900 text-white rounded-[28px] p-7 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/5 rounded-full blur-2xl" />
            <h3 className="font-['Manrope'] font-black text-sm uppercase tracking-wider leading-none relative z-10">
              Pengingat Logbook
            </h3>
            <ul className="space-y-2.5 relative z-10">
              {[
                { tag: 'Kasus Klinis',  msg: 'Input kasus segera setelah tindakan agar tidak lupa detail prosedur.' },
                { tag: 'Verifikasi',    msg: 'Pastikan konsulen sudah memaraf logbook sebelum akhir bulan.' },
              ].map((item, i) => (
                <li key={i} className="bg-white/5 p-3.5 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">{item.tag}</p>
                  <p className="text-[11px] font-bold leading-snug text-white/80">{item.msg}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Pusat Layanan */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <h3 className="font-['Manrope'] font-black text-slate-800 text-sm uppercase tracking-wide leading-none mb-4">
              Pusat Layanan
            </h3>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="w-11 h-11 bg-slate-100 border border-slate-200 text-[#003178] rounded-xl flex items-center justify-center font-extrabold text-sm font-['Manrope']">
                FK
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight">
                  Sekretariat Prodi PPDS
                </h4>
                <p className="text-[10px] font-bold text-slate-400 mt-1">
                  Sistem Informasi Logbook Terpadu
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}