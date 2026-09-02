import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    CalendarClock, Send, Loader2, Inbox, Paperclip, X, Trash2,
    CheckCircle2, Clock, XCircle, FileText, RefreshCcw
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

const JENIS_OPTIONS = ['Izin', 'Cuti', 'Sakit'];

const STATUS_CONFIG = {
    pending: {
        label: 'MENUNGGU PERSETUJUAN',
        bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100',
        icon: <Clock size={10} />,
    },
    approved: {
        label: 'DISETUJUI',
        bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100',
        icon: <CheckCircle2 size={10} />,
    },
    rejected: {
        label: 'DITOLAK',
        bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-100',
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

export default function ResidenPengajuanIzin() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        jenis: 'Izin',
        tanggal_mulai: new Date().toISOString().split('T')[0],
        tanggal_selesai: new Date().toISOString().split('T')[0],
        alasan: '',
    });
    const [lampiranFile, setLampiranFile] = useState(null);

    const fetchRequests = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${API_BASE}/mahasiswa/leave-requests`, { headers: authHeader() });
            setRequests(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Gagal memuat riwayat pengajuan:', err);
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const resetForm = () => {
        setFormData({
            jenis: 'Izin',
            tanggal_mulai: new Date().toISOString().split('T')[0],
            tanggal_selesai: new Date().toISOString().split('T')[0],
            alasan: '',
        });
        setLampiranFile(null);
    };

    const handleSubmit = async () => {
        if (!formData.tanggal_mulai || !formData.tanggal_selesai || !formData.alasan.trim()) {
            return Swal.fire('Data Tidak Lengkap', 'Silakan lengkapi tanggal dan alasan pengajuan.', 'warning');
        }
        if (new Date(formData.tanggal_selesai) < new Date(formData.tanggal_mulai)) {
            return Swal.fire('Tanggal Tidak Valid', 'Tanggal selesai tidak boleh sebelum tanggal mulai.', 'warning');
        }

        setSubmitting(true);
        try {
            const payload = new FormData();
            payload.append('jenis', formData.jenis);
            payload.append('tanggal_mulai', formData.tanggal_mulai);
            payload.append('tanggal_selesai', formData.tanggal_selesai);
            payload.append('alasan', formData.alasan);
            if (lampiranFile) payload.append('lampiran', lampiranFile);

            const res = await axios.post(`${API_BASE}/mahasiswa/leave-requests`, payload, {
                headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
            });

            Swal.fire('Berhasil Diajukan', res.data.message, 'success');
            resetForm();
            fetchRequests();
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal mengirim pengajuan.';
            Swal.fire('Gagal', msg, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (id) => {
        const confirm = await Swal.fire({
            title: 'Batalkan Pengajuan?',
            text: 'Pengajuan yang dibatalkan tidak dapat dikembalikan.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Ya, Batalkan',
            cancelButtonText: 'Tutup',
        });
        if (!confirm.isConfirmed) return;

        try {
            await axios.delete(`${API_BASE}/mahasiswa/leave-requests/${id}`, { headers: authHeader() });
            Swal.fire({ icon: 'success', title: 'Dibatalkan', timer: 1400, showConfirmButton: false });
            fetchRequests();
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal membatalkan pengajuan.';
            Swal.fire('Gagal', msg, 'error');
        }
    };

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
    };

    return (
        <div className="w-full font-['Manrope'] select-none">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
                        <CalendarClock className="text-blue-600" size={24} /> Pengajuan Izin / Cuti / Sakit
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                        Ajukan permohonan izin, cuti, atau sakit untuk disetujui konsulen pembimbing Anda.
                    </p>
                </div>
                <button onClick={fetchRequests} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all">
                    <RefreshCcw size={14} className={isLoading ? 'animate-spin' : ''} /> Sinkronisasi
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Pengajuan" value={stats.total} />
                <StatCard label="Menunggu" value={stats.pending} color="text-amber-600" />
                <StatCard label="Disetujui" value={stats.approved} color="text-emerald-600" />
                <StatCard label="Ditolak" value={stats.rejected} color="text-red-500" />
            </div>

            {/* Form Pengajuan */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 mb-8 overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                    <h2 className="flex items-center gap-2 font-black text-slate-800 uppercase text-xs tracking-wider">
                        <Send size={16} className="text-[#003178]" /> Formulir Pengajuan Baru
                    </h2>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Jenis Pengajuan</label>
                        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                            {JENIS_OPTIONS.map(j => (
                                <button
                                    key={j}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, jenis: j })}
                                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.jenis === j ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    {j}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Tanggal Mulai</label>
                        <input type="date" className="custom-input" value={formData.tanggal_mulai} onChange={e => setFormData({ ...formData, tanggal_mulai: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Tanggal Selesai</label>
                        <input type="date" className="custom-input" value={formData.tanggal_selesai} onChange={e => setFormData({ ...formData, tanggal_selesai: e.target.value })} />
                    </div>

                    <div className="md:col-span-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Alasan</label>
                        <textarea
                            rows="3"
                            placeholder="Jelaskan alasan pengajuan izin/cuti/sakit Anda secara singkat dan jelas..."
                            className="custom-input resize-none"
                            value={formData.alasan}
                            onChange={e => setFormData({ ...formData, alasan: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">
                            Lampiran Pendukung {formData.jenis === 'Sakit' && <span className="text-amber-500 normal-case font-bold tracking-normal">(disarankan lampirkan surat dokter)</span>}
                        </label>
                        {lampiranFile ? (
                            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                                    <Paperclip size={14} /> {lampiranFile.name}
                                </div>
                                <button type="button" onClick={() => setLampiranFile(null)} className="text-blue-400 hover:text-blue-700">
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-2xl px-4 py-4 text-xs font-bold text-slate-400 cursor-pointer hover:border-blue-300 hover:text-blue-500 transition-all">
                                <Paperclip size={14} /> Klik untuk unggah file (PDF/JPG/PNG, maks 2MB)
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={e => setLampiranFile(e.target.files?.[0] || null)}
                                />
                            </label>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={resetForm} className="px-6 py-2.5 text-xs font-black text-slate-400 uppercase tracking-widest">Reset</button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-[#003178] text-white px-8 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all hover:bg-blue-800 disabled:opacity-60"
                    >
                        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Kirim Pengajuan
                    </button>
                </div>
            </div>

            {/* Riwayat Pengajuan */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                    <h2 className="font-black text-slate-800 uppercase tracking-tight text-xs flex items-center gap-2">
                        <FileText size={16} className="text-slate-400" /> Riwayat Pengajuan Saya
                    </h2>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 size={26} className="animate-spin text-blue-500" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memuat data...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-300">
                        <Inbox size={36} strokeWidth={1} />
                        <p className="text-xs font-black uppercase tracking-widest">Belum ada pengajuan</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        <AnimatePresence>
                            {requests.map(r => (
                                <motion.div
                                    key={r.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/40 transition-all"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">{r.jenis}</span>
                                            <StatusBadge status={r.status} />
                                            {r.lampiran && (
                                                <a
                                                    href={`${STORAGE_BASE}/${r.lampiran}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-1"
                                                >
                                                    <Paperclip size={11} /> Lampiran
                                                </a>
                                            )}
                                        </div>
                                        <div className="text-xs font-bold text-slate-700">
                                            {formatTanggal(r.tanggal_mulai)} — {formatTanggal(r.tanggal_selesai)}
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-1 max-w-xl">{r.alasan}</p>
                                        {r.catatan_konsulen && (
                                            <div className={`mt-2 text-[11px] rounded-xl px-3 py-2 border ${r.status === 'rejected' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                                                <span className="font-black uppercase tracking-wider text-[9px] block mb-0.5">Catatan Konsulen</span>
                                                {r.catatan_konsulen}
                                            </div>
                                        )}
                                    </div>
                                    {r.status === 'pending' && (
                                        <button
                                            onClick={() => handleCancel(r.id)}
                                            className="self-start md:self-center px-4 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all flex-shrink-0"
                                        >
                                            <Trash2 size={12} /> Batalkan
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-input { width: 100%; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 12px 16px; font-size: 12px; font-weight: 700; outline: none; transition: all 0.2s; color: #334155; }
                .custom-input:focus { border-color: #003178; background: white; box-shadow: 0 0 0 4px rgba(0, 49, 120, 0.04); }
            ` }} />
        </div>
    );
}