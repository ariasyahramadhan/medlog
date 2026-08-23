import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiClock, FiCheckSquare, FiUsers, FiShield,
  FiLoader, FiAlertTriangle, FiCheckCircle,
  FiActivity, FiBook, FiAward, FiTrendingUp,
  FiXCircle, FiFileText, FiRefreshCw
} from 'react-icons/fi';

const API_URL = 'https://api.sigmaeducation.id/api';

const timeAgo = (dateStr) => {
  if (!dateStr) return '—';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return `${diff}d lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}j lalu`;
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
};

const formatTgl = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const colorMap = {
  blue:   { bg: 'bg-blue-50',   text: 'text-[#003178]', border: 'border-blue-100',   dot: 'bg-[#003178]'   },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', dot: 'bg-purple-500'  },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-100',  dot: 'bg-amber-500'   },
};

export default function DashboardDosen() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [stats, setStats]       = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}/lecturer/dashboard-stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStats(res.data);
    } catch (err) {
      setError({
        status:    err?.response?.status,
        message:   err?.response?.data?.message   || 'Koneksi ke server gagal.',
        exception: err?.response?.data?.debug_exception || null,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const getSalam = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat Pagi';
    if (h < 17) return 'Selamat Siang';
    return 'Selamat Malam';
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
      <FiLoader className="animate-spin text-[#003178]" size={30} />
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Menyusun Dasbor Konsulen...</p>
    </div>
  );

  // ─── Error ────────────────────────────────────────────────────────────────
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

  const { 
    total_antrian, validasi_hari_ini, total_verified, total_rejected,
    total_residen, avg_pencapaian, antrian_breakdown,
    antrian_terbaru, residen_progress
  } = stats;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 font-['Inter'] w-full select-none pb-10">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div className="font-['Manrope']">
          <h1 className="text-3xl font-extrabold text-[#003178] mb-1.5 tracking-tight">
            {getSalam()}, {user?.name || 'Dr. Konsulen'}
          </h1>
          <p className="font-['Inter'] text-sm font-medium text-slate-500">
            {total_antrian > 0
              ? <>Anda memiliki <span className="text-[#003178] font-bold">{total_antrian} entri logbook</span> yang menunggu validasi.</>
              : 'Semua logbook residen bimbingan sudah tervalidasi.'}
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm"
        >
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 w-full">

        {/* Antrian Validasi */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003178] text-xl">
              <FiClock />
            </div>
            {total_antrian > 0 && (
              <span className="text-[10px] font-black text-[#003178] bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 uppercase animate-pulse">
                Action Required
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Antrian Validasi</p>
            <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[36px] leading-none">
              {String(total_antrian).padStart(2, '0')}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {antrian_breakdown.map((b, i) => b.count > 0 && (
                <span key={i} className={`text-[9px] font-black px-2 py-1 rounded-full border ${colorMap[b.color].bg} ${colorMap[b.color].text} ${colorMap[b.color].border}`}>
                  {b.label} ({b.count})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divalidasi Hari Ini */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 text-xl">
              <FiCheckSquare />
            </div>
            {validasi_hari_ini > 0 && (
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                +{validasi_hari_ini} Today
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Divalidasi Hari Ini</p>
            <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[36px] leading-none">
              {String(validasi_hari_ini).padStart(2, '0')}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-2">
              Total all-time: <span className="text-emerald-600">{total_verified}</span>
              {total_rejected > 0 && <> · Ditolak: <span className="text-red-500">{total_rejected}</span></>}
            </p>
          </div>
        </div>

        {/* Residen Dibimbing */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-11 h-11 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 text-xl">
              <FiUsers />
            </div>
            <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
              Active
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Residen Dibimbing</p>
            <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[36px] leading-none">
              {String(total_residen).padStart(2, '0')}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-2">dokter residen aktif</p>
          </div>
        </div>

        {/* Rata-Rata Pencapaian */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 text-xl">
              <FiTrendingUp />
            </div>
            <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border ${
              avg_pencapaian >= 70 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
              avg_pencapaian >= 40 ? 'text-amber-600 bg-amber-50 border-amber-100' :
              'text-red-500 bg-red-50 border-red-100'
            }`}>
              {avg_pencapaian >= 70 ? 'On Track' : avg_pencapaian >= 40 ? 'Perlu Kejar' : 'Perhatian'}
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rata-Rata Pencapaian</p>
            <div className="flex items-end gap-2 mb-2">
              <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[36px] leading-none">{avg_pencapaian}%</h2>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${avg_pencapaian}%` }}
                className={`h-full rounded-full transition-all duration-700 ${
                  avg_pencapaian >= 70 ? 'bg-emerald-500' :
                  avg_pencapaian >= 40 ? 'bg-amber-400' : 'bg-red-400'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">

        {/* Kiri: Antrian Terbaru + Banner */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Antrian Terbaru */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex justify-between items-center mb-7">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide leading-none mb-1">
                  Antrian Kasus Terbaru
                </h3>
                <p className="text-xs font-medium text-slate-400">
                  Kasus klinis pending dari residen bimbingan Anda
                </p>
              </div>
              <span className="text-[10px] font-black text-[#003178] bg-blue-50 px-3 py-2 rounded-full border border-blue-100">
                {antrian_terbaru.length} ditampilkan
              </span>
            </div>

            {antrian_terbaru.length === 0 ? (
              <div className="py-14 flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-emerald-500 text-2xl" />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Tidak Ada Antrian — Semua Sudah Divalidasi
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {antrian_terbaru.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar inisial */}
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-[#003178] font-['Manrope'] text-sm shrink-0 group-hover/item:scale-105 transition-transform">
                        {item.residen_initials}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-tight leading-none">
                          dr. {item.residen_name}
                        </h4>
                        <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
                          <span className="text-[10px] font-bold text-slate-500 max-w-[160px] truncate">
                            {item.tindakan}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[9px] font-black text-[#003178] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-widest">
                            {item.jenis_kasus}
                          </span>
                          {item.jenis_anestesi && (
                            <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              {item.jenis_anestesi}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">
                        {timeAgo(item.created_at)}
                      </span>
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 uppercase tracking-widest">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Banner Progress Bimbingan */}
          <div className="bg-[#003178] text-white rounded-[28px] p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500">
            <div className="absolute -right-10 -top-10 w-52 h-52 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="relative z-10 flex flex-col gap-5">
              <div>
                <h3 className="font-['Manrope'] font-bold text-xl mb-1.5">Progres Bimbingan Residen</h3>
                <p className="text-blue-200/70 text-sm">
                  Rata-rata pencapaian target prosedur klinis seluruh residen di bawah supervisi Anda.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Kasus',    value: total_verified + total_rejected + antrian_terbaru.filter(a => a.status === 'pending').length },
                  { label: 'Terverifikasi',  value: total_verified  },
                  { label: 'Avg Pencapaian', value: `${avg_pencapaian}%` },
                ].map((s, i) => (
                  <div key={i} className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <p className="text-[9px] font-black text-blue-200/60 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="font-['Manrope'] font-extrabold text-white text-2xl leading-none">{s.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-blue-200/60 uppercase tracking-widest">Pencapaian Target Keseluruhan</span>
                  <span className="text-sm font-bold">{avg_pencapaian}%</span>
                </div>
                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${avg_pencapaian}%` }}
                    className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Kanan: Progress Residen + Info */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          {/* Progress Per Residen */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <h3 className="font-['Manrope'] font-black text-slate-800 text-sm uppercase tracking-wide leading-none mb-6 flex items-center gap-2.5">
              <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                <FiActivity className="text-purple-600 text-sm" />
              </div>
              Progress Per Residen
            </h3>

            {residen_progress.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                  Belum Ada Residen Bimbingan
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {residen_progress.map((r, idx) => (
                  <div key={idx} className="group/res">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-[#003178] text-[10px] font-['Manrope'] shrink-0">
                        {r.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate leading-none">
                          dr. {r.name}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                          {r.verified} verified · {r.pending} pending
                        </p>
                      </div>
                      <span className={`text-[10px] font-extrabold shrink-0 ${
                        r.percentage >= 70 ? 'text-emerald-600' :
                        r.percentage >= 40 ? 'text-amber-600'   : 'text-red-500'
                      }`}>
                        {r.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${r.percentage}%` }}
                        className={`h-full rounded-full transition-all duration-700 ${
                          r.percentage >= 70 ? 'bg-emerald-500' :
                          r.percentage >= 40 ? 'bg-amber-400'   : 'bg-red-400'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ringkasan Validasi */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <h3 className="font-['Manrope'] font-black text-slate-800 text-sm uppercase tracking-wide leading-none mb-6 flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#003178]/5 rounded-lg flex items-center justify-center">
                <FiShield className="text-[#003178] text-sm" />
              </div>
              Ringkasan Validasi
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Total Antrian',     value: total_antrian,      color: 'text-amber-600'   },
                { label: 'Terverifikasi',      value: total_verified,     color: 'text-emerald-600' },
                { label: 'Ditolak',            value: total_rejected,     color: 'text-red-500'     },
                { label: 'Validasi Hari Ini',  value: validasi_hari_ini,  color: 'text-[#003178]'   },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{r.label}</span>
                  <span className={`font-extrabold text-sm ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-slate-900 text-white rounded-[28px] p-7 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/5 rounded-full blur-2xl opacity-50" />
            <h3 className="font-['Manrope'] font-black text-sm uppercase tracking-wider leading-none relative z-10 flex items-center gap-2">
              <FiAward className="text-blue-400" /> Tips Validasi
            </h3>
            <ul className="space-y-2.5 relative z-10">
              {[
                { tag: 'Efisiensi',  msg: 'Validasi kasus dalam batch di halaman Kasus Pending untuk menghemat waktu.' },
                { tag: 'Prioritas',  msg: 'Utamakan kasus yang sudah menunggu lebih dari 3 hari agar residen tidak terhambat.' },
              ].map((item, i) => (
                <li key={i} className="bg-white/5 p-3.5 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">{item.tag}</p>
                  <p className="text-[11px] font-bold leading-snug text-white/80">{item.msg}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}