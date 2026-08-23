import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiUsers, FiAward, FiShield, FiGrid,
  FiLoader, FiAlertTriangle, FiRefreshCw,
  FiActivity, FiCheckCircle, FiClock,
  FiUserCheck, FiUserX, FiDatabase,
  FiTrendingUp, FiBook, FiEye
} from 'react-icons/fi';

const API_URL = 'https://api.sigmaeducation.id/api';

const timeAgo = (dateStr) => {
  if (!dateStr) return '—';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return `${diff}d lalu`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
};

const roleBadge = (role) => {
  const map = {
    Mahasiswa: { bg: 'bg-blue-50',   text: 'text-[#003178]', border: 'border-blue-100'   },
    Dosen:     { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
    Admin:     { bg: 'bg-slate-100', text: 'text-slate-600',  border: 'border-slate-200'  },
  };
  const s = map[role] || map.Admin;
  return (
    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${s.bg} ${s.text} ${s.border}`}>
      {role}
    </span>
  );
};

const colorBar = {
  blue:   'bg-[#003178]',
  purple: 'bg-purple-500',
  amber:  'bg-amber-400',
  teal:   'bg-teal-500',
  green:  'bg-emerald-500',
};

const colorDot = {
  blue:   'bg-[#003178]',
  purple: 'bg-purple-500',
  amber:  'bg-amber-400',
  teal:   'bg-teal-500',
  green:  'bg-emerald-500',
};

export default function DashboardAdmin() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [stats, setStats]       = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}/admin/dashboard-stats`, {
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
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Memuat Data Sistem...</p>
    </div>
  );

  // ─── Error ────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-lg bg-white border border-red-100 rounded-3xl p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <FiAlertTriangle className="text-red-500" size={20} />
          <h2 className="font-black text-red-600 uppercase tracking-wide text-sm">Gagal Memuat Dasbor Admin</h2>
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
    total_mahasiswa, total_dosen, mahasiswa_aktif, dosen_aktif,
    mahasiswa_bulan_ini, dosen_bulan_ini,
    total_kasus, kasus_verified, kasus_pending, kasus_rejected,
    total_pending_system, total_mentorship, mahasiswa_belum_dibimbing,
    dosen_terdaftar_wajah, dosen_belum_daftar_wajah,
    logbook_breakdown, pengguna_terbaru, kasus_terbaru,
  } = stats;

  const kasusRate = total_kasus > 0 ? Math.round((kasus_verified / total_kasus) * 100) : 0;
  const wajahRate = total_dosen  > 0 ? Math.round((dosen_terdaftar_wajah / total_dosen) * 100) : 0;
  const mentorRate = total_mahasiswa > 0 ? Math.round((total_mentorship / total_mahasiswa) * 100) : 0;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 font-['Inter'] w-full select-none pb-10">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div className="font-['Manrope']">
          <h1 className="text-3xl font-extrabold text-[#003178] mb-1.5 tracking-tight">
            {getSalam()}, {user?.name || 'Administrator'}!
          </h1>
          <p className="font-['Inter'] text-sm font-medium text-slate-500">
            Kelola sistem logbook dan pantau aktivitas{' '}
            <span className="text-[#003178] font-bold">{total_mahasiswa} mahasiswa</span> secara menyeluruh.
            {total_pending_system > 0 && (
              <> Terdapat <span className="text-amber-600 font-bold">{total_pending_system} logbook</span> menunggu validasi di sistem.</>
            )}
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm shrink-0"
        >
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 w-full">

        {/* Total Mahasiswa */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003178] text-xl">
              <FiUsers />
            </div>
            {mahasiswa_bulan_ini > 0 && (
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                +{mahasiswa_bulan_ini} bulan ini
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Mahasiswa</p>
            <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[36px] leading-none mb-2">
              {total_mahasiswa.toLocaleString('id-ID')}
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-emerald-600">{mahasiswa_aktif} aktif</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[10px] font-bold text-red-400">{total_mahasiswa - mahasiswa_aktif} tidak aktif</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${total_mahasiswa > 0 ? Math.round((mahasiswa_aktif / total_mahasiswa) * 100) : 0}%` }}
                className="bg-[#003178] h-full rounded-full transition-all duration-700"
              />
            </div>
          </div>
        </div>

        {/* Total Dosen */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-11 h-11 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 text-xl">
              <FiAward />
            </div>
            {dosen_bulan_ini > 0 && (
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                +{dosen_bulan_ini} bulan ini
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Dosen / Konsulen</p>
            <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[36px] leading-none mb-2">
              {total_dosen.toLocaleString('id-ID')}
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-purple-600">{dosen_aktif} aktif</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[10px] font-bold text-slate-400">{dosen_terdaftar_wajah} daftar biometrik</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${wajahRate}%` }}
                className="bg-purple-500 h-full rounded-full transition-all duration-700"
              />
            </div>
          </div>
        </div>

        {/* Pending Sistem */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 text-xl">
              <FiClock />
            </div>
            {total_pending_system > 0 && (
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 animate-pulse">
                Perlu Aksi
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Seluruh Sistem</p>
            <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[36px] leading-none mb-2">
              {total_pending_system}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {kasus_pending > 0    && <span className="text-[9px] font-black text-[#003178] bg-blue-50 px-2 py-1 rounded-full border border-blue-100">Kasus ({kasus_pending})</span>}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[#003178] text-white p-7 rounded-[24px] shadow-xl flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 min-h-[170px]">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          <div className="relative z-10">
            <p className="text-[10px] font-black text-blue-200/70 uppercase tracking-widest mb-2">System Status</p>
            <h3 className="font-['Manrope'] font-bold text-white leading-tight text-lg mb-2">
              All Modules<br />Operational
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <p className="text-[10px] font-medium text-blue-100/60">Database Integrity: 100%</p>
            </div>
          </div>
          <div className="relative z-10 mt-4">
            <div className="flex justify-between text-[9px] font-black text-blue-200/50 uppercase tracking-widest mb-1.5">
              <span>Verifikasi Logbook</span>
              <span>{kasusRate}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                style={{ width: `${kasusRate}%` }}
                className="h-full bg-white/60 rounded-full transition-all duration-1000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">

        {/* Kiri: Breakdown + Pengguna Terbaru */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Breakdown Logbook Sistem */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="mb-7">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide leading-none mb-1">
                Overview Logbook Seluruh Sistem
              </h3>
              <p className="text-xs font-medium text-slate-400">
                Distribusi dan status validasi semua jenis logbook
              </p>
            </div>
            <div className="space-y-5">
              {logbook_breakdown.map((item, i) => {
                const rate = item.total > 0 ? Math.round((item.verified / item.total) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${colorDot[item.color]}`} />
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold">
                          <span className="text-emerald-600">{item.verified} ✓</span>
                          {item.pending > 0 && <span className="text-amber-500">{item.pending} ⏳</span>}
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500">{item.total} total</span>
                        </div>
                        <span className={`text-[11px] font-black min-w-[36px] text-right ${
                          rate >= 80 ? 'text-emerald-600' :
                          rate >= 50 ? 'text-[#003178]'   : 'text-amber-500'
                        }`}>{rate}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${rate}%` }}
                        className={`h-full rounded-full transition-all duration-700 ${colorBar[item.color]}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pengguna Terbaru Terdaftar */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex justify-between items-center mb-7">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide leading-none mb-1">
                  Pengguna Terbaru Terdaftar
                </h3>
                <p className="text-xs font-medium text-slate-400">6 akun terakhir didaftarkan ke sistem</p>
              </div>
            </div>
            {pengguna_terbaru.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Belum Ada Pengguna</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pengguna_terbaru.map((u, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black font-['Manrope'] text-sm shrink-0 group-hover/item:scale-105 transition-transform ${
                        u.role === 'Dosen' ? 'bg-purple-50 border border-purple-100 text-purple-600' :
                        u.role === 'Admin' ? 'bg-slate-100 border border-slate-200 text-slate-600' :
                        'bg-blue-50 border border-blue-100 text-[#003178]'
                      }`}>
                        {u.initials}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-tight leading-none">{u.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">ID: {u.identifier}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {roleBadge(u.role)}
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">
                        {timeAgo(u.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kasus Klinis Pending Terbaru */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex justify-between items-center mb-7">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide leading-none mb-1">
                  Kasus Klinis Pending Terbaru
                </h3>
                <p className="text-xs font-medium text-slate-400">Kasus belum terverifikasi di seluruh sistem</p>
              </div>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-2 rounded-full border border-amber-100">
                {kasus_pending} pending
              </span>
            </div>
            {kasus_terbaru.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-emerald-500 text-xl" />
                </div>
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Tidak Ada Kasus Pending</p>
              </div>
            ) : (
              <div className="space-y-2">
                {kasus_terbaru.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-[#003178] font-['Manrope'] text-sm shrink-0 group-hover/item:scale-105 transition-transform">
                        {item.residen_initials}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-tight leading-none">
                          dr. {item.residen_name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-slate-500 max-w-[160px] truncate">{item.tindakan}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[9px] font-black text-[#003178] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-widest">
                            {item.jenis_kasus}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 uppercase tracking-widest">
                        Pending
                      </span>
                      <span className="text-[10px] font-black text-slate-300 hidden sm:block">
                        {timeAgo(item.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kanan: Panel Ringkasan */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          {/* Statistik Pengguna */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <h3 className="font-['Manrope'] font-black text-slate-800 text-sm uppercase tracking-wide leading-none mb-6 flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                <FiUsers className="text-[#003178] text-sm" />
              </div>
              Ringkasan Pengguna
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Total Mahasiswa',  value: total_mahasiswa, color: 'text-[#003178]'  },
                { label: 'Total Dosen',      value: total_dosen,     color: 'text-purple-600' },
                { label: 'Mahasiswa Aktif',  value: mahasiswa_aktif, color: 'text-emerald-600'},
                { label: 'Dosen Aktif',      value: dosen_aktif,     color: 'text-emerald-600'},
                { label: 'Belum Dibimbing',  value: mahasiswa_belum_dibimbing, color: 'text-amber-500' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{r.label}</span>
                  <span className={`font-extrabold text-sm ${r.color}`}>{r.value}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cakupan Mentorship</span>
                  <span className="text-sm font-extrabold text-[#003178]">{mentorRate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${mentorRate}%` }} className="bg-[#003178] h-full rounded-full transition-all duration-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Statistik Logbook */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <h3 className="font-['Manrope'] font-black text-slate-800 text-sm uppercase tracking-wide leading-none mb-6 flex items-center gap-2.5">
              <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                <FiActivity className="text-emerald-600 text-sm" />
              </div>
              Ringkasan Logbook
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Total Kasus Klinis',  value: total_kasus,     color: 'text-slate-800'   },
                { label: 'Terverifikasi',        value: kasus_verified,  color: 'text-emerald-600' },
                { label: 'Pending',              value: kasus_pending,   color: 'text-amber-500'   },
                { label: 'Ditolak',              value: kasus_rejected,  color: 'text-red-500'     },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{r.label}</span>
                  <span className={`font-extrabold text-sm ${r.color}`}>{r.value}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tingkat Verifikasi</span>
                  <span className="text-sm font-extrabold text-emerald-600">{kasusRate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${kasusRate}%` }} className="bg-emerald-500 h-full rounded-full transition-all duration-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Biometrik */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-200/60 p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <h3 className="font-['Manrope'] font-black text-slate-800 text-sm uppercase tracking-wide leading-none mb-6 flex items-center gap-2.5">
              <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                <FiShield className="text-purple-600 text-sm" />
              </div>
              Biometrik Dosen
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Total Dosen',         value: total_dosen,              color: 'text-slate-800'   },
                { label: 'Terdaftar Wajah',      value: dosen_terdaftar_wajah,    color: 'text-emerald-600' },
                { label: 'Belum Daftar',         value: dosen_belum_daftar_wajah, color: 'text-amber-500'   },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{r.label}</span>
                  <span className={`font-extrabold text-sm ${r.color}`}>{r.value}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cakupan Biometrik</span>
                  <span className="text-sm font-extrabold text-purple-600">{wajahRate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${wajahRate}%` }} className="bg-purple-500 h-full rounded-full transition-all duration-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Banner Sistem */}
          <div className="bg-slate-900 text-white rounded-[28px] p-7 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/5 rounded-full blur-2xl opacity-50" />
            <h3 className="font-['Manrope'] font-black text-sm uppercase tracking-wider leading-none relative z-10 flex items-center gap-2">
              <FiDatabase className="text-blue-400" /> Info Sistem
            </h3>
            <ul className="space-y-2.5 relative z-10">
              {[
                { tag: 'Mentorship',  msg: `${mahasiswa_belum_dibimbing} mahasiswa belum memiliki dosen pembimbing. Segera assign di menu Mentorship.` },
                { tag: 'Biometrik',   msg: `${dosen_belum_daftar_wajah} dosen belum mendaftarkan wajah untuk login biometrik.` },
              ].filter(item =>
                (item.tag === 'Mentorship' && mahasiswa_belum_dibimbing > 0) ||
                (item.tag === 'Biometrik'  && dosen_belum_daftar_wajah  > 0)
              ).concat(
                mahasiswa_belum_dibimbing === 0 && dosen_belum_daftar_wajah === 0
                  ? [{ tag: 'Status', msg: 'Semua mahasiswa sudah dibimbing dan semua dosen sudah daftar biometrik.' }]
                  : []
              ).map((item, i) => (
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