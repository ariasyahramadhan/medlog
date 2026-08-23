import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    Search, Filter, Calendar, ChevronDown, ChevronUp,
    Trash2, Eye, Loader2, RefreshCcw, FileText,
    CheckCircle2, Clock, XCircle, TrendingUp, X, Award,
    Printer, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Import PDF utility ────────────────────────────────────────────
// Pastikan file useCetakKasus.js berada di folder yang sama
import { cetakKasusPDF } from './useCetakKasus';

// ── Helpers ───────────────────────────────────────────────────────

const API_BASE = 'https://api.sigmaeducation.id/api';

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
    verified: {
        label: 'VERIFIED',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-100',
        icon: <CheckCircle2 size={10} />,
    },
    pending: {
        label: 'PENDING',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-100',
        icon: <Clock size={10} />,
    },
    rejected: {
        label: 'REJECTED',
        bg: 'bg-red-50',
        text: 'text-red-500',
        border: 'border-red-100',
        icon: <XCircle size={10} />,
    },
};

// ── Sub-components ────────────────────────────────────────────────

const StatCard = ({ label, value, color = 'text-slate-800', icon }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4"
    >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color === 'text-emerald-600' ? 'bg-emerald-50' : color === 'text-amber-600' ? 'bg-amber-50' : color === 'text-red-500' ? 'bg-red-50' : 'bg-blue-50'}`}>
            <span className={color}>{icon}</span>
        </div>
        <div>
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
        </div>
    </motion.div>
);

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black border tracking-widest ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.icon} {cfg.label}
        </span>
    );
};

// ── Detail Modal ──────────────────────────────────────────────────

const DetailModal = ({ kasus, onClose }) => {
    if (!kasus) return null;
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-[500px] overflow-hidden"
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.92, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="bg-[#003178] p-6 text-white flex justify-between items-start">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Detail Kasus</div>
                            <div className="text-lg font-black uppercase leading-tight">{kasus.tindakan}</div>
                            <div className="text-xs opacity-70 mt-1">{formatTanggal(kasus.tanggal_tindakan)}</div>
                        </div>
                        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                            <StatusBadge status={kasus.status} />
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Informasi Pasien</div>
                            <Row label="Jenis Kelamin" value={kasus.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
                            <Row label="Umur" value={`${kasus.umur} Tahun`} />
                            <Row label="Jenis Kasus" value={kasus.jenis_kasus} />
                            {kasus.tindakan === "Memasang kateter vena central" && kasus.lokasi_insersi ? (
                                <Row label="Lokasi Insersi CVC" value={<span className="text-amber-600 font-extrabold uppercase">{kasus.lokasi_insersi}</span>} />
                            ) : kasus.regimen_analgesia && kasus.jenis_anestesi === "Nyeri Analgesia" ? (
                                <Row label="Regimen Analgesia" value={<span className="text-blue-600 font-extrabold uppercase">{kasus.regimen_analgesia}</span>} />
                            ) : kasus.teknik_intervensi && (kasus.jenis_anestesi === "Peripheral Nerve Block" || kasus.jenis_anestesi === "Nyeri Analgesia") ? (
                                <Row label="Teknik Intervensi" value={<span className="text-purple-600 font-extrabold uppercase">{kasus.teknik_intervensi}</span>} />
                            ) : (
                                <Row label="Jenis Anestesi" value={kasus.jenis_anestesi && kasus.jenis_anestesi !== "Intensive Care" && kasus.jenis_anestesi !== "CVC Procedure" ? kasus.jenis_anestesi : '—'} />
                            )}
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Diagnosis</div>
                            <div className="flex flex-wrap gap-1.5">
                                {kasus.diagnosis?.map(d => (
                                    <span key={d} className="bg-blue-50 text-blue-600 text-[9px] px-2.5 py-1 rounded-full border border-blue-100 font-bold uppercase">{d}</span>
                                ))}
                            </div>
                        </div>
                        <Row label="DPJP / Konsulen" value={kasus.dpjp_name} />
                        {kasus.catatan && (
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                                <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Catatan</div>
                                <p className="text-xs text-slate-600">{kasus.catatan}</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const Row = ({ label, value }) => (
    <div className="flex justify-between items-start gap-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{label}</span>
        <span className="text-xs font-bold text-slate-700 text-right">{value || '—'}</span>
    </div>
);

// ── Cetak Modal ───────────────────────────────────────────────────

const CetakModal = ({ cases, onClose }) => {
    const [tanggalDari, setTanggalDari]     = useState('');
    const [tanggalSampai, setTanggalSampai] = useState('');
    const [loading, setLoading]             = useState(false);

    // Ambil profil user dari localStorage / context
    const userRaw = localStorage.getItem('user');
    const user    = userRaw ? JSON.parse(userRaw) : {};

    // Ambil nama konsulen dari cases (ambil dpjp pertama yang ada)
    const firstConsulenName = cases.find(c => c.dpjp_name)?.dpjp_name || '—';

    const filteredCases = cases.filter(c => {
        if (c.status !== 'verified') return false;
        const tgl = new Date(c.tanggal_tindakan);
        if (tanggalDari  && tgl < new Date(tanggalDari))  return false;
        if (tanggalSampai && tgl > new Date(tanggalSampai + 'T23:59:59')) return false;
        return true;
    });

    const handleCetak = async () => {
        if (!tanggalDari || !tanggalSampai) {
            Swal.fire('Perhatian', 'Silakan isi rentang tanggal terlebih dahulu.', 'warning');
            return;
        }
        if (new Date(tanggalDari) > new Date(tanggalSampai)) {
            Swal.fire('Perhatian', 'Tanggal mulai tidak boleh lebih besar dari tanggal akhir.', 'warning');
            return;
        }
        if (filteredCases.length === 0) {
            Swal.fire('Tidak Ada Data', 'Tidak ada kasus terverifikasi pada rentang tanggal yang dipilih.', 'info');
            return;
        }

        setLoading(true);
        try {
            await cetakKasusPDF({
                cases:         filteredCases,
                resident:      { name: user.name, identifier: user.identifier, department: user.department },
                konsulen:      { name: firstConsulenName, identifier: '—' },
                tanggalDari,
                tanggalSampai,
            });
            onClose();
        } catch (err) {
            console.error(err);
            Swal.fire('Gagal', 'Terjadi kesalahan saat membuat PDF. Pastikan library jsPDF sudah diinstall.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                    initial={{ scale: 0.92, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-[#003178] p-6 text-white flex justify-between items-start">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Ekspor Dokumen</div>
                            <div className="text-lg font-black uppercase leading-tight flex items-center gap-2">
                                <Printer size={18} /> Cetak Kasus Logbook
                            </div>
                            <div className="text-xs opacity-70 mt-1">Hanya kasus berstatus VERIFIED yang akan dicetak</div>
                        </div>
                        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-5">
                        {/* Info Residen */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-1">
                            <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Informasi Residen</div>
                            <div className="text-sm font-black text-[#003178]">{user.name || '—'}</div>
                            <div className="text-xs text-slate-500">{user.identifier || '—'} · {user.department || 'Anestesiologi dan Terapi Intensif'}</div>
                        </div>

                        {/* Filter Tanggal */}
                        <div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Rentang Tanggal Cetak</div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Dari Tanggal</label>
                                    <input
                                        type="date"
                                        value={tanggalDari}
                                        onChange={e => setTanggalDari(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Sampai Tanggal</label>
                                    <input
                                        type="date"
                                        value={tanggalSampai}
                                        onChange={e => setTanggalSampai(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview jumlah kasus */}
                        {tanggalDari && tanggalSampai && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="overflow-hidden"
                            >
                                <div className={`rounded-2xl p-4 border flex items-center gap-3 ${filteredCases.length > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg ${filteredCases.length > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-400'}`}>
                                        {filteredCases.length}
                                    </div>
                                    <div>
                                        <div className={`text-xs font-black ${filteredCases.length > 0 ? 'text-emerald-700' : 'text-red-500'}`}>
                                            {filteredCases.length > 0
                                                ? `${filteredCases.length} kasus siap dicetak`
                                                : 'Tidak ada kasus di rentang ini'}
                                        </div>
                                        <div className="text-[10px] text-slate-400">
                                            {filteredCases.length > 0
                                                ? `Hanya kasus VERIFIED · ${formatTanggal(tanggalDari)} — ${formatTanggal(tanggalSampai)}`
                                                : 'Coba ubah rentang tanggal'}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Info PDF */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Format Output PDF</div>
                            {[
                                'Format A4 Landscape — dua halaman',
                                'Halaman 1: Cover ringkasan + QR TTD digital',
                                'Halaman 2+: Tabel detail seluruh kasus',
                                'QR Code berisi identitas residen & konsulen',
                            ].map((info, i) => (
                                <div key={i} className="flex items-center gap-2 text-[10px] text-slate-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#003178] flex-shrink-0" />
                                    {info}
                                </div>
                            ))}
                        </div>

                        {/* Tombol */}
                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleCetak}
                                disabled={loading || filteredCases.length === 0}
                                className="flex-[2] py-3 rounded-2xl bg-[#003178] text-white text-xs font-black uppercase tracking-widest hover:bg-[#1a4db5] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <><Loader2 size={14} className="animate-spin" /> Membuat PDF...</>
                                ) : (
                                    <><Download size={14} /> Cetak & Unduh PDF</>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ── Main Page ─────────────────────────────────────────────────────

export default function RiwayatKasus() {
    const [cases, setCases]           = useState([]);
    const [stats, setStats]           = useState({ total: 0, verified: 0, pending: 0, rejected: 0 });
    const [loading, setLoading]       = useState(true);
    const [selectedKasus, setSelectedKasus] = useState(null);
    const [showCetakModal, setShowCetakModal] = useState(false);

    // Filters
    const [search, setSearch]         = useState('');
    const [filterStatus, setFilterStatus]   = useState('all');
    const [filterJenis, setFilterJenis]     = useState('all');
    const [filterBulan, setFilterBulan]     = useState('');
    const [sortBy, setSortBy]         = useState('tanggal_tindakan');
    const [sortOrder, setSortOrder]   = useState('desc');
    const [showFilter, setShowFilter] = useState(false);

    const subTindakanAnestesiUtama = [
        "Anestesi Bedah Elektif", "Anestesi Bedah Darurat", "Anestesi Umum", "Anestesi / Analgesia Regional",
        "Teknik Anestesi / Analgesia Subarakhnoid", "Teknik Anestesi / Analgesia Epidural",
        "Teknik Anestesi / Analgesia Blok Saraf Tepi Basic", "Teknik Anestesi / Analgesia Kaudal"
    ];
    const subAnestesiBedahUmum = [
        "Teknik Anestesi / Analgesia Blok Saraf Tepi intermediate", "Anestesi Bedah Umum Digestif",
        "Anestesi Bedah Umum THT dan Bedah Mulut", "Anestesi Bedah Umum Mata", "Anestesi Bedah Umum Urologi",
        "Anestesi Bedah Umum Ortopedi", "Anestesi Bedah Umum Plastik", "Anestesi Bedah Umum Onkologi",
        "Anestesi Bedah Umum Minimal Invasif", "Anestesi / Analgesia Rawat Jalan",
        "Anestesi / Analgesia diluar kamar operasi", "Lain-lain (dapat berupa kompetensi diatas)"
    ];
    const groupKompetensiDasarUtama = [...subTindakanAnestesiUtama, ...subAnestesiBedahUmum];
    const subManajemenNyeri = ["Manajemen Nyeri akut", "Manajemen Nyeri kronik", "Manajemen Nyeri paliatif", "Interventional Pain Management"];
    const subObstetriGinekologi = ["Anestesi dan analgesia Obstetri dan Ginekologi Pre-eklamsi dan eklamsi", "Lain-lain (operasi selain eklamsi dan pre-eklamsi)"];
    const subBedahSaraf = ["Anestesi Bedah Saraf Trauma kepala", "Perdarahan intracranial non-trauma", "Tumor intrakranial", "Ventricular drainage (VP shunt, EVD)", "Medula spinalis"];
    const subKondisiKhususLanjut = [
        "Anestesi Bedah Thoraks Non Jantung dan Jantung Terbuka", "Anestesi pada Kondisi khusus Kelainan jantung pada operasi non jantung",
        "Anestesi pada Kondisi khusus COPD / asma", "Anestesi pada Kondisi khusus DM", "Anestesi pada Kondisi khusus Tiroid",
        "Anestesi pada Kondisi khusus Geriatri", "Anestesi pada Kondisi khusus Obesitas", "Mengelola pasien ICU (10 variasi kasus)",
        "Melakukan resusitasi di luar kamar bedah dan ICU", "Memasang kateter intra-arterial dan pungsi intra-arterial",
        "Memasang kateter vena central", "Melakukan intubasi sulit", "Anestesi Bedah Pediatri Neonatus", "Anestesi Bedah Pediatri Bayi", "Anestesi Bedah Pediatri Anak-anak"
    ];

    const getGroupedCasesCount = (arrFilter) =>
        cases.filter(c => c.status === 'verified' && arrFilter.includes(c.tindakan)).length;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                search:      search      || undefined,
                status:      filterStatus !== 'all' ? filterStatus : undefined,
                jenis_kasus: filterJenis !== 'all'  ? filterJenis  : undefined,
                bulan:       filterBulan || undefined,
                sort_by:     sortBy,
                sort_order:  sortOrder,
            };
            const res = await axios.get(`${API_BASE}/mahasiswa/riwayat`, {
                headers: authHeader(),
                params,
            });
            setCases(res.data.data || []);
            setStats(res.data.stats || { total: 0, verified: 0, pending: 0, rejected: 0 });
        } catch {
            setCases([]);
        } finally {
            setLoading(false);
        }
    }, [search, filterStatus, filterJenis, filterBulan, sortBy, sortOrder]);

    useEffect(() => {
        const timer = setTimeout(fetchData, 350);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Hapus Kasus?',
            text: 'Hanya kasus dengan status Pending yang dapat dihapus.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#003178',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        });
        if (!confirm.isConfirmed) return;
        try {
            await axios.delete(`${API_BASE}/mahasiswa/riwayat/${id}`, { headers: authHeader() });
            Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Kasus berhasil dihapus.', timer: 1500, showConfirmButton: false });
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal menghapus kasus.';
            Swal.fire('Gagal', msg, 'error');
        }
    };

    const toggleSort = (col) => {
        if (sortBy === col) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
        else { setSortBy(col); setSortOrder('desc'); }
    };

    const SortIcon = ({ col }) => (
        <span className="ml-1 opacity-40">
            {sortBy === col ? (sortOrder === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />) : <ChevronDown size={10} />}
        </span>
    );

    const resetFilters = () => {
        setSearch(''); setFilterStatus('all'); setFilterJenis('all');
        setFilterBulan(''); setSortBy('tanggal_tindakan'); setSortOrder('desc');
    };

    const activeFilterCount = [
        filterStatus !== 'all',
        filterJenis  !== 'all',
        filterBulan  !== '',
    ].filter(Boolean).length;

    const verifiedCount = cases.filter(c => c.status === 'verified').length;

    return (
        <div className="p-6 bg-[#F8FAFC] min-h-screen font-['Manrope']">

            {/* Page Title */}
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                        <FileText size={20} className="text-blue-600" /> Riwayat Kasus Saya
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Seluruh kasus yang telah Anda input ke dalam logbook.</p>
                </div>

                {/* ─── Tombol Cetak ─── */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCetakModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#003178] hover:bg-[#1a4db5] text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
                >
                    <Printer size={14} />
                    Cetak Kasus
                    {verifiedCount > 0 && (
                        <span className="bg-white/20 text-white text-[9px] font-black rounded-full px-2 py-0.5">
                            {verifiedCount}
                        </span>
                    )}
                </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Kasus"  value={stats.total}     icon={<TrendingUp size={18}    />} />
                <StatCard label="Verified"     value={stats.verified}  icon={<CheckCircle2 size={18} />} color="text-emerald-600" />
                <StatCard label="Pending"      value={stats.pending}   icon={<Clock size={18}         />} color="text-amber-600" />
                <StatCard label="Rejected"     value={stats.rejected}  icon={<XCircle size={18}       />} color="text-red-500" />
            </div>

            {/* Progres Kurikulum */}
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-3xl mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                    <Award size={14} className="text-[#003178]" /> Progres Jumlah Kasus Minimal Stase Kurikulum
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {[
                        { count: getGroupedCasesCount(groupKompetensiDasarUtama), target: 1015, label: 'Kompetensi Dasar' },
                        { count: getGroupedCasesCount(subAnestesiBedahUmum),       target: 620,  label: 'Anestesi Bedah Umum' },
                        { count: getGroupedCasesCount(subManajemenNyeri),          target: 130,  label: 'Manajemen Nyeri' },
                        { count: getGroupedCasesCount(subObstetriGinekologi),      target: 100,  label: 'Obstetri & Ginekologi' },
                        { count: getGroupedCasesCount(subBedahSaraf),              target: 35,   label: 'Anestesi Bedah Saraf' },
                        { count: getGroupedCasesCount(subKondisiKhususLanjut),     target: 35,   label: 'Kompetensi Lanjut' },
                    ].map((item, i) => (
                        <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                            <div className="text-lg font-black text-slate-800 font-mono">{item.count} / {item.target}</div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.label}</div>
                            {/* Progress bar mini */}
                            <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#003178] rounded-full transition-all"
                                    style={{ width: `${Math.min((item.count / item.target) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-4 p-4">
                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                    <div className="relative flex-1 w-full">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari tindakan, DPJP, atau catatan..."
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-400 focus:bg-white transition-all"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <X size={12} />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setShowFilter(f => !f)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black border transition-all ${showFilter ? 'bg-[#003178] text-white border-[#003178]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'}`}
                    >
                        <Filter size={13} />
                        Filter {activeFilterCount > 0 && <span className="bg-white text-[#003178] rounded-full w-4 h-4 flex items-center justify-center text-[9px]">{activeFilterCount}</span>}
                    </button>
                    <button onClick={fetchData} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:border-blue-300 transition-all">
                        <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                <AnimatePresence>
                    {showFilter && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Status</label>
                                    <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                        <option value="all">Semua Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="verified">Verified</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Jenis Kasus</label>
                                    <select className="filter-select" value={filterJenis} onChange={e => setFilterJenis(e.target.value)}>
                                        <option value="all">Semua Jenis</option>
                                        <option value="Elektif">Elektif</option>
                                        <option value="Non-Elektif">Non-Elektif</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Bulan</label>
                                    <input
                                        type="month"
                                        className="filter-select"
                                        value={filterBulan}
                                        onChange={e => setFilterBulan(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={resetFilters}
                                        className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                                    >
                                        Reset Filter
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <Loader2 size={28} className="animate-spin text-blue-500" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memuat data...</p>
                    </div>
                ) : cases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-300">
                        <FileText size={40} strokeWidth={1} />
                        <p className="text-xs font-black uppercase tracking-widest">Tidak ada data kasus</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/70 text-slate-400 text-[10px] font-black uppercase border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-4">#</th>
                                    <th className="px-5 py-4 cursor-pointer hover:text-slate-600 select-none" onClick={() => toggleSort('tanggal_tindakan')}>
                                        <span className="flex items-center">Tanggal <SortIcon col="tanggal_tindakan" /></span>
                                    </th>
                                    <th className="px-5 py-4">Pasien</th>
                                    <th className="px-5 py-4">Diagnosis</th>
                                    <th className="px-5 py-4 cursor-pointer hover:text-slate-600 select-none" onClick={() => toggleSort('tindakan')}>
                                        <span className="flex items-center">Tindakan <SortIcon col="tindakan" /></span>
                                    </th>
                                    <th className="px-5 py-4">Rincian Klinis Khusus</th>
                                    <th className="px-5 py-4">DPJP</th>
                                    <th className="px-5 py-4">Catatan</th>
                                    <th className="px-5 py-4 cursor-pointer hover:text-slate-600 select-none text-center" onClick={() => toggleSort('status')}>
                                        <span className="flex items-center justify-center">Status <SortIcon col="status" /></span>
                                    </th>
                                    <th className="px-5 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {cases.map((c, idx) => {
                                    let labelAdaptifAnestesi = <span className="text-slate-300 italic">—</span>;
                                    if (c.tindakan === "Memasang kateter vena central" && c.lokasi_insersi) {
                                        labelAdaptifAnestesi = <div><span className="font-black text-slate-400 block text-[8px]">LOKASI INSERSI:</span> <span className="font-bold text-amber-600 uppercase text-[10px]">{c.lokasi_insersi}</span></div>;
                                    } else if (subManajemenNyeri.includes(c.tindakan) && c.regimen_analgesia) {
                                        labelAdaptifAnestesi = <div><span className="font-black text-slate-400 block text-[8px]">REGIMEN / TEKNIK:</span> <span className="font-bold text-blue-600 uppercase text-[10px]">{c.regimen_analgesia}</span></div>;
                                    } else if ((c.tindakan === "Teknik Anestesi / Analgesia Blok Saraf Tepi Basic" || c.tindakan === "Teknik Anestesi / Analgesia Blok Saraf Tepi intermediate") && c.teknik_intervensi) {
                                        labelAdaptifAnestesi = <div><span className="font-black text-slate-400 block text-[8px]">TEKNIK INTERVENSI:</span> <span className="font-bold text-purple-600 uppercase text-[10px]">{c.teknik_intervensi}</span></div>;
                                    } else if (c.jenis_anestesi && c.jenis_anestesi !== "Nyeri Analgesia" && c.jenis_anestesi !== "CVC Procedure" && c.jenis_anestesi !== "Intensive Care" && c.jenis_anestesi !== "Peripheral Nerve Block") {
                                        labelAdaptifAnestesi = <span className="text-[11px] font-medium text-slate-600">{c.jenis_anestesi}</span>;
                                    }

                                    return (
                                        <motion.tr
                                            key={c.id}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="px-5 py-4 text-[10px] font-black text-slate-300">{idx + 1}</td>
                                            <td className="px-5 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">{formatTanggal(c.tanggal_tindakan)}</td>
                                            <td className="px-5 py-4 text-[11px] font-bold text-slate-600 whitespace-nowrap">
                                                {c.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}<br />
                                                <span className="text-slate-400 font-medium">{c.umur} Tahun · {c.jenis_kasus}</span>
                                            </td>
                                            <td className="px-5 py-4 max-w-[200px]">
                                                <div className="flex flex-wrap gap-1">
                                                    {Array.isArray(c.diagnosis) && c.diagnosis.slice(0, 2).map(d => (
                                                        <span key={d} className="bg-blue-50 text-blue-600 text-[9px] px-2.5 py-0.5 rounded-full border border-blue-100 uppercase font-bold">{d}</span>
                                                    ))}
                                                    {c.diagnosis?.length > 2 && (
                                                        <span className="bg-slate-100 text-slate-400 text-[9px] px-2 py-0.5 rounded-full font-black">+{c.diagnosis.length - 2}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-[11px] font-black text-[#003178] uppercase max-w-[180px]">{c.tindakan}</td>
                                            <td className="px-5 py-4">{labelAdaptifAnestesi}</td>
                                            <td className="px-5 py-4 text-[11px] font-bold text-slate-600 whitespace-nowrap">{c.dpjp_name}</td>
                                            <td className="px-5 py-4 text-[11px] text-slate-500 max-w-[150px]">
                                                {c.catatan ? <span className="line-clamp-2">{c.catatan}</span> : <span className="text-slate-300 italic">—</span>}
                                            </td>
                                            <td className="px-5 py-4 text-center"><StatusBadge status={c.status} /></td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedKasus(c)}
                                                        className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-all"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye size={13} />
                                                    </button>
                                                    {c.status === 'pending' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(c.id)}
                                                            className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-all"
                                                            title="Hapus Kasus"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Menampilkan {cases.length} dari {stats.total} kasus
                            </span>
                            {activeFilterCount > 0 && (
                                <button onClick={resetFilters} className="text-[10px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1">
                                    <X size={10} /> Hapus Filter
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedKasus && <DetailModal kasus={selectedKasus} onClose={() => setSelectedKasus(null)} />}
            {showCetakModal && <CetakModal cases={cases} onClose={() => setShowCetakModal(false)} />}

            <style dangerouslySetInnerHTML={{ __html: `
                .filter-select {
                    width: 100%;
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 12px;
                    padding: 9px 14px;
                    font-size: 11px;
                    font-weight: 700;
                    outline: none;
                    color: #475569;
                    font-family: 'Manrope', sans-serif;
                }
                .filter-select:focus { border-color: #3B82F6; background: white; }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            ` }} />
        </div>
    );
}