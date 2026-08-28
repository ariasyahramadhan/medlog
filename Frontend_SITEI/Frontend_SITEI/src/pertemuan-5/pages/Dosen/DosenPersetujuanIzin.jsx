import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    CalendarClock, Loader2, Inbox, Paperclip, RefreshCcw, Search,
    CheckCircle2, Clock, XCircle, Check, X, User, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// const API_BASE = 'http://localhost:8000/api';
const API_BASE = 'https://api.sigmaeducation.id/api';
const STORAGE_BASE = API_BASE.replace('/api', '/storage');

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

const formatTanggal = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
};

const STATUS_CONFIG = {
    pending: {
        label: 'MENUNGGU', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100',
        icon: <Clock size={10} />,
    },
    approved: {
        label: 'DISETUJUI', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100',
        icon: <CheckCircle2 size={10} />,
    },
    rejected: {
        label: 'DITOLAK', bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-100',
        icon: <XCircle size={10} />,
    },
};

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black border tracking-widest ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.icon} {cfg.label}
        </span>
    );
};

const StatCard = ({ label, value, color = 'text-slate-800' }) => (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div className={`text-2xl font-black ${color}`}>{value}</div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
);

export default function DosenPersetujuanIzin() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [jenisFilter, setJenisFilter] = useState('all');

    const fetchRequests = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${API_BASE}/lecturer/leave-requests`, { headers: authHeader() });
            setRequests(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Gagal memuat data pengajuan izin:', err);
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleApprove = (r) => {
        Swal.fire({
            title: 'Setujui Pengajuan?',
            html: `Setujui pengajuan <b>${r.jenis}</b> dari <b>${r.user?.name || 'residen ini'}</b>?`,
            input: 'textarea',
            inputLabel: 'Catatan (opsional)',
            inputPlaceholder: 'Tulis catatan persetujuan jika perlu...',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Setujui',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#10B981',
        }).then(async (result) => {
            if (!result.isConfirmed) return;
            setActionLoading(r.id);
            try {
                const res = await axios.post(`${API_BASE}/lecturer/leave-requests/${r.id}/approve`, {
                    catatan_konsulen: result.value || 'Disetujui oleh konsulen.'
                }, { headers: authHeader() });
                Swal.fire('Berhasil', res.data.message, 'success');
                fetchRequests();
            } catch (err) {
                Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan.', 'error');
            } finally {
                setActionLoading(null);
            }
        });
    };

    const handleReject = (r) => {
        Swal.fire({
            title: 'Tolak Pengajuan?',
            html: `Tolak pengajuan <b>${r.jenis}</b> dari <b>${r.user?.name || 'residen ini'}</b>?`,
            input: 'textarea',
            inputLabel: 'Alasan Penolakan (wajib diisi)',
            inputPlaceholder: 'Jelaskan alasan penolakan...',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Tolak',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#EF4444',
            inputValidator: (value) => {
                if (!value || !value.trim()) return 'Alasan penolakan wajib diisi.';
            }
        }).then(async (result) => {
            if (!result.isConfirmed) return;
            setActionLoading(r.id);
            try {
                const res = await axios.post(`${API_BASE}/lecturer/leave-requests/${r.id}/reject`, {
                    catatan_konsulen: result.value
                }, { headers: authHeader() });
                Swal.fire('Berhasil', res.data.message, 'success');
                fetchRequests();
            } catch (err) {
                Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan.', 'error');
            } finally {
                setActionLoading(null);
            }
        });
    };

    const filteredRequests = requests.filter(r => {
        const matchesSearch =
            r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.alasan?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
        const matchesJenis = jenisFilter === 'all' || r.jenis === jenisFilter;
        return matchesSearch && matchesStatus && matchesJenis;
    });

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
    };

    if (isLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
            <Loader2 className="animate-spin text-[#003178]" size={40} />
            <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Sinkronisasi Data Pengajuan...</p>
        </div>
    );

    return (
        <div className="p-6 bg-[#F8FAFC] min-h-screen font-['Manrope']">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
                        <CalendarClock className="text-blue-600" size={22} /> Persetujuan Izin / Cuti / Sakit
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                        Tinjau dan proses pengajuan izin, cuti, dan sakit dari residen bimbingan Anda.
                    </p>
                </div>
                <button onClick={fetchRequests} className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all">
                    <RefreshCcw size={14} /> Refresh Data
                </button>
            </div>

            {/* Statistik */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Pengajuan" value={stats.total} />
                <StatCard label="Menunggu" value={stats.pending} color="text-amber-600" />
                <StatCard label="Disetujui" value={stats.approved} color="text-emerald-600" />
                <StatCard label="Ditolak" value={stats.rejected} color="text-red-600" />
            </div>

            {/* Panel Filter */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-6 space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama residen atau alasan..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status:</span>
                        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                            {['all', 'pending', 'approved', 'rejected'].map(st => (
                                <button
                                    key={st} onClick={() => setStatusFilter(st)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${statusFilter === st ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Jenis:</span>
                        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                            {['all', 'Izin', 'Cuti', 'Sakit'].map(j => (
                                <button
                                    key={j} onClick={() => setJenisFilter(j)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${jenisFilter === j ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    {j === 'all' ? 'SEMUA' : j}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {filteredRequests.map((r) => (
                        <motion.div
                            key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-blue-200/80 transition-all"
                        >
                            <div className="p-4 bg-slate-50/40 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold"><User size={15} /></div>
                                    <div>
                                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">{r.user?.name || 'Residen Dokter'}</h3>
                                        <p className="text-[10px] font-bold text-slate-400">NIM: {r.user?.identifier || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{r.jenis}</span>
                                    <StatusBadge status={r.status} />
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Rentang Tanggal</label>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                        <Calendar size={13} className="text-slate-400" /> {formatTanggal(r.tanggal_mulai)} — {formatTanggal(r.tanggal_selesai)}
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Alasan</label>
                                    <p className="text-xs font-medium text-slate-600 leading-relaxed">{r.alasan}</p>
                                </div>
                            </div>

                            {(r.lampiran || r.catatan_konsulen) && (
                                <div className="px-6 pb-5 flex flex-col gap-3">
                                    {r.lampiran && (
                                        <a
                                            href={`${STORAGE_BASE}/${r.lampiran}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 w-fit text-[11px] font-black uppercase tracking-widest text-blue-600 hover:underline bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl"
                                        >
                                            <Paperclip size={12} /> Lihat Lampiran
                                        </a>
                                    )}
                                    {r.catatan_konsulen && (
                                        <div className={`rounded-2xl p-4 border ${r.status === 'rejected' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                            <label className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${r.status === 'rejected' ? 'text-red-500' : 'text-emerald-500'}`}>Catatan Konsulen</label>
                                            <p className="text-xs font-medium text-slate-600">{r.catatan_konsulen}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {r.status === 'pending' && (
                                <div className="p-4 bg-slate-50/20 border-t border-slate-100 flex justify-end gap-2">
                                    <button
                                        disabled={actionLoading !== null} onClick={() => handleReject(r)}
                                        className="px-5 py-2 rounded-xl text-[10px] font-black border border-red-200 text-red-600 hover:bg-red-50 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        {actionLoading === r.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />} Tolak
                                    </button>
                                    <button
                                        disabled={actionLoading !== null} onClick={() => handleApprove(r)}
                                        className="px-6 py-2 rounded-xl text-[10px] font-black bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        {actionLoading === r.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Setujui
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredRequests.length === 0 && (
                    <div className="bg-white rounded-3xl border border-slate-200 p-20 flex flex-col items-center justify-center gap-2 text-slate-400 shadow-sm">
                        <Inbox size={36} className="text-slate-300" />
                        <p className="text-xs font-black tracking-widest uppercase">Tidak ada pengajuan yang cocok</p>
                    </div>
                )}
            </div>
        </div>
    );
}