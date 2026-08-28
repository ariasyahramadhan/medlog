import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Check, X, ShieldAlert, Loader2, Inbox, Calendar, User, Search, RotateCcw, CheckSquare, Square, ListChecks } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── DEKLARASI FUNGSI HELPER GLOBAL ──
const formatTanggal = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
};

const parseDiagnosis = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try { 
        return JSON.parse(data); 
    } catch (e) { 
        return [data]; 
    }
};

export default function DosenVerifyKasus() {
    const [cases, setCases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(null);
    
    // State Filter & Pencarian
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); 
    const [typeFilter, setTypeFilter] = useState("all"); 

    // ── NEW — State Seleksi Massal (Bulk Selection) ──
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkLoading, setBulkLoading] = useState(false);

    const fetchLecturerCases = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('https://api.sigmaeducation.id/api/lecturer/pending-cases', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCases(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Gagal memuat kasus:", err);
            setCases([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLecturerCases();
    }, [fetchLecturerCases]);

    const handleVerification = (id, studentName, action) => {
        let actionText = "Memverifikasi";
        let confirmButtonColor = "#10B981";
        if (action === 'reject') { actionText = "Menolak"; confirmButtonColor = "#EF4444"; }
        if (action === 'pending') { actionText = "Pembatalan Status"; confirmButtonColor = "#64748B"; }

        Swal.fire({
            title: `Konfirmasi ${actionText}`,
            text: action === 'pending' 
                ? `Apakah Anda yakin ingin membatalkan status kasus milik ${studentName}? Kasus akan kembali berstatus PENDING.`
                : `Apakah Anda yakin ingin mengeksekusi tindakan ini pada logbook milik ${studentName}?`,
            icon: action === 'pending' ? 'info' : 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Eksekusi',
            cancelButtonText: 'Batal',
            confirmButtonColor: confirmButtonColor,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setBtnLoading(id);
                try {
                    const res = await axios.post(`https://api.sigmaeducation.id/api/lecturer/verify-case/${id}`, { action }, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire("Berhasil", res.data.message, "success");
                    fetchLecturerCases();
                } catch (err) {
                    Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan.", "error");
                } finally {
                    setBtnLoading(null);
                }
            }
        });
    };

    const filteredCases = cases.filter(c => {
        const matchesSearch = 
            c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.tindakan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.catatan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.diagnosis?.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesStatus = statusFilter === "all" || c.status === statusFilter;
        const matchesType = typeFilter === "all" || c.jenis_kasus === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    // ── NEW — Helper Seleksi Massal ──
    // Hanya kasus berstatus 'pending' yang bisa diverifikasi/ditolak secara massal
    const selectablePendingCases = filteredCases.filter(c => c.status === 'pending');
    const selectableIds = selectablePendingCases.map(c => c.id);
    const isAllSelected = selectableIds.length > 0 && selectableIds.every(id => selectedIds.includes(id));
    const isSomeSelected = selectedIds.length > 0;

    const toggleSelectOne = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (isAllSelected) {
            // Batalkan seleksi hanya untuk yang sedang tampil (filtered)
            setSelectedIds(prev => prev.filter(id => !selectableIds.includes(id)));
        } else {
            setSelectedIds(prev => Array.from(new Set([...prev, ...selectableIds])));
        }
    };

    const clearSelection = () => setSelectedIds([]);

    // ── NEW — Eksekusi Verifikasi / Penolakan Massal ──
    const handleBulkVerification = (action) => {
        if (selectedIds.length === 0) return;

        const actionText = action === 'approve' ? 'Memverifikasi' : 'Menolak';
        const confirmButtonColor = action === 'approve' ? '#10B981' : '#EF4444';

        Swal.fire({
            title: `Konfirmasi ${actionText} ${selectedIds.length} Kasus`,
            text: `Apakah Anda yakin ingin ${action === 'approve' ? 'memverifikasi' : 'menolak'} ${selectedIds.length} kasus terpilih sekaligus? Tindakan ini tidak dapat dibatalkan secara massal.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Ya, ${actionText} Semua`,
            cancelButtonText: 'Batal',
            confirmButtonColor,
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            setBulkLoading(true);
            let successCount = 0;
            let failCount = 0;

            for (const id of selectedIds) {
                try {
                    await axios.post(`https://api.sigmaeducation.id/api/lecturer/verify-case/${id}`, { action }, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    successCount += 1;
                } catch (err) {
                    failCount += 1;
                }
            }

            setBulkLoading(false);
            setSelectedIds([]);
            fetchLecturerCases();

            if (failCount === 0) {
                Swal.fire("Berhasil", `${successCount} kasus berhasil di${action === 'approve' ? 'verifikasi' : 'tolak'}.`, "success");
            } else {
                Swal.fire("Selesai Dengan Catatan", `${successCount} berhasil, ${failCount} gagal diproses. Silakan periksa kembali.`, "warning");
            }
        });
    };

    if (isLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
            <Loader2 className="animate-spin text-[#003178]" size={40} />
            <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Sinkronisasi Data Kasus...</p>
        </div>
    );

    return (
        <div className="p-6 bg-[#F8FAFC] min-h-screen font-['Manrope']">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
                        <ShieldAlert className="text-blue-600" size={22} /> Validasi Komprehensif Logbook
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                        Kelola verifikasi, penolakan, serta peninjauan kembali berkas tindakan residen bimbingan.
                    </p>
                </div>
                <button onClick={fetchLecturerCases} className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all">
                    <RotateCcw size={14} /> Refresh Data
                </button>
            </div>

            {/* Statistik Adaptif */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Berkas" value={cases.length} />
                <StatCard label="Pending" value={cases.filter(c => c.status === 'pending').length} color="text-amber-600" />
                <StatCard label="Verified" value={cases.filter(c => c.status === 'verified').length} color="text-emerald-600" />
                <StatCard label="Rejected" value={cases.filter(c => c.status === 'rejected').length} color="text-red-600" />
            </div>

            {/* Panel Pencarian & Filter Utility */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-6 space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Cari berdasarkan nama residen, tindakan, atau diagnosis..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status:</span>
                            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                                {["all", "pending", "verified", "rejected"].map(st => (
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
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kategori:</span>
                            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                                {["all", "Elektif", "Non-Elektif"].map(tp => (
                                    <button 
                                        key={tp} onClick={() => setTypeFilter(tp)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${typeFilter === tp ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                    >
                                        {tp === 'all' ? 'SEMUA KASUS' : tp}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                        Menampilkan <span className="text-blue-600 font-black">{filteredCases.length}</span> hasil filter
                    </div>
                </div>

                {/* ── NEW — Baris Kontrol Seleksi Massal ── */}
                {selectableIds.length > 0 && (
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        <button
                            onClick={toggleSelectAll}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-700 transition-all"
                        >
                            {isAllSelected ? <CheckSquare size={15} className="text-blue-600" /> : <Square size={15} />}
                            {isAllSelected ? 'Batalkan Pilih Semua' : `Pilih Semua Pending (${selectableIds.length})`}
                        </button>
                        {isSomeSelected && (
                            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">
                                {selectedIds.length} kasus terpilih
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* ── NEW — Bulk Action Bar (muncul jika ada seleksi) ── */}
            <AnimatePresence>
                {isSomeSelected && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="sticky top-4 z-30 mb-6 overflow-hidden"
                    >
                        <div className="bg-[#003178] rounded-2xl shadow-lg shadow-blue-900/20 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 text-white">
                                <ListChecks size={18} />
                                <span className="text-xs font-black uppercase tracking-widest">
                                    {selectedIds.length} Kasus Dipilih
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={clearSelection}
                                    disabled={bulkLoading}
                                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40"
                                >
                                    Batal Pilih
                                </button>
                                <button
                                    onClick={() => handleBulkVerification('reject')}
                                    disabled={bulkLoading}
                                    className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/90 text-white hover:bg-red-500 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    {bulkLoading ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />} Tolak Terpilih
                                </button>
                                <button
                                    onClick={() => handleBulkVerification('approve')}
                                    disabled={bulkLoading}
                                    className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    {bulkLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Verifikasi Terpilih
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List Item Rendering */}
            <div className="space-y-4">
                <AnimatePresence>
                    {filteredCases.map((c) => {
                        const isSelected = selectedIds.includes(c.id);
                        const isSelectable = c.status === 'pending';

                        return (
                        <motion.div 
                            key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={`bg-white rounded-3xl border shadow-sm overflow-hidden transition-all group ${isSelected ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-200/80'}`}
                        >
                            {/* Card Header */}
                            <div className="p-4 bg-slate-50/40 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                <div className="flex items-center gap-2.5">
                                    {/* ── NEW — Checkbox Seleksi (hanya untuk kasus pending) ── */}
                                    {isSelectable ? (
                                        <button
                                            type="button"
                                            onClick={() => toggleSelectOne(c.id)}
                                            className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center hover:border-blue-300 transition-all flex-shrink-0"
                                            title={isSelected ? 'Batalkan pilih' : 'Pilih kasus ini'}
                                        >
                                            {isSelected ? <CheckSquare size={16} /> : <Square size={16} className="text-slate-300" />}
                                        </button>
                                    ) : (
                                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0"><User size={15} /></div>
                                    )}
                                    <div>
                                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">{c.user?.name || "Residen Dokter"}</h3>
                                        <p className="text-[10px] font-bold text-slate-400">NIM: {c.user?.identifier || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-[10px] font-black px-3 py-1 bg-white border rounded-lg text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        <Calendar size={12} /> {formatTanggal(c.tanggal_tindakan)}
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest border ${
                                        c.status === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        c.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                        {c.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body dengan Tambahan Penyesuaian Kolom Adaptif Khas PDF */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Diagnosis Pasien</label>
                                    <div className="flex flex-wrap gap-1">
                                        {parseDiagnosis(c.diagnosis).map((d) => (
                                            <span key={d} className="bg-slate-50 text-slate-700 text-[10px] px-2.5 py-1 rounded-full border border-slate-200/60 font-bold uppercase tracking-tight">{d}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Tindakan Medis & Pembiusan</label>
                                    <div className="text-xs font-black text-[#003178] uppercase">{c.tindakan}</div>
                                    
                                    {/* Filter Render Kolom Khas Sesuai Spesifikasi Halaman PDF */}
                                    {c.tindakan === "Memasang kateter vena central" && c.lokasi_insersi && (
                                        <div className="text-[10px] font-bold text-amber-700 mt-1.5 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1 inline-block uppercase">Insersi: {c.lokasi_insersi}</div>
                                    )}
                                    {c.regimen_analgesia && c.jenis_anestesi === "Nyeri Analgesia" && (
                                        <div className="text-[10px] font-bold text-blue-700 mt-1.5 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1 inline-block uppercase">Regimen: {c.regimen_analgesia}</div>
                                    )}
                                    {c.teknik_intervensi && (c.jenis_anestesi === "Peripheral Nerve Block" || c.jenis_anestesi === "Nyeri Analgesia") && c.tindakan !== "Memasang kateter vena central" && (
                                        <div className="text-[10px] font-bold text-purple-700 mt-1.5 bg-purple-50 border border-purple-100 rounded-lg px-2 py-1 inline-block uppercase">Teknik: {c.teknik_intervensi}</div>
                                    )}
                                    {c.jenis_anestesi && c.jenis_anestesi !== "Nyeri Analgesia" && c.jenis_anestesi !== "CVC Procedure" && c.jenis_anestesi !== "Intensive Care" && c.jenis_anestesi !== "Peripheral Nerve Block" && (
                                        <div className="text-[11px] font-bold text-slate-400 mt-1">Anestesi: <span className="text-slate-600 font-extrabold">{c.jenis_anestesi}</span></div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Klasifikasi & Profil</label>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border ${c.jenis_kasus === 'Elektif' ? 'bg-blue-50/40 text-blue-600 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                            {c.jenis_kasus.toUpperCase()}
                                        </span>
                                        {/* Tag Penanda Stase Induk Besar */}
                                        <span className="text-[9px] font-black bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-tight">
                                            {c.urgensi && c.urgensi !== 'E' && c.urgensi !== 'N' ? c.urgensi : "STASE KLINIS"}
                                        </span>
                                    </div>
                                    <div className="text-[11px] font-bold text-slate-500 mt-1.5">Pasien: {c.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}, {c.umur} Tahun</div>
                                </div>
                            </div>

                            {/* Menampilkan Catatan Tambahan Mahasiswa */}
                            {c.catatan && (
                                <div className="px-6 pb-5">
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Catatan Tambahan Residen</label>
                                        <p className="text-xs font-medium text-slate-600 leading-relaxed">{c.catatan}</p>
                                    </div>
                                </div>
                            )}

                            {/* Card Actions */}
                            <div className="p-4 bg-slate-50/20 border-t border-slate-100 flex justify-end gap-2">
                                {c.status === 'pending' ? (
                                    <>
                                        <button 
                                            disabled={btnLoading !== null || bulkLoading} onClick={() => handleVerification(c.id, c.user?.name, 'reject')}
                                            className="px-5 py-2 rounded-xl text-[10px] font-black border border-red-200 text-red-600 hover:bg-red-50 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-1 disabled:opacity-50"
                                        >
                                            Tolak
                                        </button>
                                        <button 
                                            disabled={btnLoading !== null || bulkLoading} onClick={() => handleVerification(c.id, c.user?.name, 'approve')}
                                            className="px-6 py-2 rounded-xl text-[10px] font-black bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-1 disabled:opacity-50"
                                        >
                                            {btnLoading === c.id ? <Loader2 size={12} className="animate-spin" /> : null} Verifikasi Kasus
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        disabled={btnLoading !== null || bulkLoading} onClick={() => handleVerification(c.id, c.user?.name, 'pending')}
                                        className="px-5 py-2 rounded-xl text-[10px] font-black border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        <RotateCcw size={12} /> Batalkan Aksi (Revoke)
                                    </button>
                                )}
                            </div>
                        </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filteredCases.length === 0 && (
                    <div className="bg-white rounded-3xl border border-slate-200 p-20 flex flex-col items-center justify-center gap-2 text-slate-400 shadow-sm">
                        <Inbox size={36} className="text-slate-300" />
                        <p className="text-xs font-black tracking-widest uppercase">Tidak ada logbook bimbingan yang cocok</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Reusable Components
const StatCard = ({ label, value, color = "text-slate-800" }) => (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm cursor-default">
        <div className={`text-2xl font-black ${color}`}>{value}</div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1"><label>{label}</label></div>
    </div>
);