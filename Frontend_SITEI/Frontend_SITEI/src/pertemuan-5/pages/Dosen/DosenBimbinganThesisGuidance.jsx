import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { GraduationCap, ChevronUp, ChevronDown, Check, RefreshCcw, Filter, Inbox, Loader2, Calendar, User, Eye, Edit2, Trash2, X, BookMarked } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'https://api.sigmaeducation.id/api';

const formatTanggal = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

const TAHAP_OPTIONS = [
    'Penyusunan Proposal',
    'Seminar Proposal',
    'Penelitian & Pengambilan Data',
    'Seminar Hasil',
    'Ujian Akhir Tesis',
    'Revisi Naskah',
    'Lainnya',
];

const TAHAP_COLOR = {
    'Penyusunan Proposal':            { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100' },
    'Seminar Proposal':                { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-100' },
    'Penelitian & Pengambilan Data':   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100' },
    'Seminar Hasil':                   { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-100' },
    'Ujian Akhir Tesis':               { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    'Revisi Naskah':                   { bg: 'bg-red-50',     text: 'text-red-500',     border: 'border-red-100' },
    'Lainnya':                         { bg: 'bg-slate-50',   text: 'text-slate-500',   border: 'border-slate-200' },
};

const TahapBadge = ({ tahap }) => {
    const cfg = TAHAP_COLOR[tahap] || TAHAP_COLOR['Lainnya'];
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black border tracking-widest uppercase whitespace-nowrap ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {tahap}
        </span>
    );
};

export default function DosenBimbinganTesisWrapper() {
    const [students, setStudents] = useState([]);
    const [historyGuidances, setHistoryGuidances] = useState([]);
    const [formOpen, setFormOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [tahapFilter, setTahapFilter] = useState("all");

    // State Tambahan untuk Mengelola Mode Operasi Edit & View Modal
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [selectedGuidance, setSelectedGuidance] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        user_id: '',
        judul_tesis: '',
        tahap: TAHAP_OPTIONS[0],
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: ''
    });

    const initData = useCallback(async () => {
        try {
            setIsPageLoading(true);
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

            const [resStudents, resHistory] = await Promise.all([
                axios.get(`${API_BASE}/lecturer/my-students-thesis`, { headers }),
                axios.get(`${API_BASE}/lecturer/history-thesis-guidances`, { headers })
            ]);

            setStudents(Array.isArray(resStudents.data) ? resStudents.data : []);
            setHistoryGuidances(Array.isArray(resHistory.data) ? resHistory.data : []);
        } catch (err) {
            console.error("Gagal memuat data bimbingan tesis:", err);
        } finally {
            setIsPageLoading(false);
        }
    }, []);

    useEffect(() => {
        initData();
    }, [initData]);

    const resetForm = () => setFormData({
        user_id: '',
        judul_tesis: '',
        tahap: TAHAP_OPTIONS[0],
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: ''
    });

    // Handler Submit untuk Simpan Baru (POST) dan Perbarui (PUT)
    const handleSubmit = async () => {
        if (!formData.user_id || !formData.tanggal || !formData.tahap || !formData.keterangan) {
            return Swal.fire("Data Tidak Lengkap", "Silakan pilih nama residen, tahap, tanggal, dan isi keterangan bimbingan.", "warning");
        }

        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

            if (isEditMode) {
                // Eksekusi API Update (PUT)
                await axios.put(`${API_BASE}/lecturer/update-thesis-guidance/${editId}`, formData, { headers });
                Swal.fire("Berhasil Diperbarui", "Data bimbingan tesis residen telah berhasil diubah.", "success");
                handleCancelEdit();
            } else {
                // Eksekusi API Simpan Baru (POST)
                await axios.post(`${API_BASE}/lecturer/store-thesis-guidance`, formData, { headers });
                Swal.fire("Berhasil Disimpan", "Aktivitas bimbingan tesis residen telah dicatat & diparaf otomatis.", "success");
                resetForm();
            }

            // Refresh tabel riwayat setelah operasi database selesai
            const resHistory = await axios.get(`${API_BASE}/lecturer/history-thesis-guidances`, { headers });
            setHistoryGuidances(Array.isArray(resHistory.data) ? resHistory.data : []);
        } catch (err) {
            Swal.fire("Error", "Gagal memproses data ke database server.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Memicu Perpindahan Form Menjadi Mode Edit Data
    const handleEditClick = (guidance) => {
        setIsEditMode(true);
        setEditId(guidance.id);
        setFormData({
            user_id: guidance.user_id,
            judul_tesis: guidance.judul_tesis || '',
            tahap: guidance.tahap || TAHAP_OPTIONS[0],
            tanggal: guidance.tanggal ? guidance.tanggal.substring(0, 10) : new Date().toISOString().split('T')[0],
            keterangan: guidance.keterangan
        });
        setFormOpen(true);

        // Scroll otomatis ke panel form atas secara halus agar interaktif
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditId(null);
        resetForm();
    };

    // Handler Penghapusan Logbook (DELETE) dengan Proteksi Swal Dialog
    const handleDeleteClick = (id, studentName) => {
        Swal.fire({
            title: "Hapus Rekam Bimbingan Tesis?",
            text: `Apakah Anda yakin ingin menghapus data rekam bimbingan tesis dari dokter residen ${studentName}? Tindakan ini permanen.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#EF4444", // Merah
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
                    await axios.delete(`${API_BASE}/lecturer/delete-thesis-guidance/${id}`, { headers });

                    Swal.fire("Dihapus", "Data rekam bimbingan tesis berhasil dihapus dari logbook.", "success");

                    // Jika data yang sedang diedit ternyata dihapus dari tabel, batalkan mode edit
                    if (isEditMode && editId === id) {
                        handleCancelEdit();
                    }

                    // Sinkronisasi data ulang di tabel
                    const resHistory = await axios.get(`${API_BASE}/lecturer/history-thesis-guidances`, { headers });
                    setHistoryGuidances(Array.isArray(resHistory.data) ? resHistory.data : []);
                } catch (err) {
                    Swal.fire("Error", "Gagal menghapus data dari database.", "error");
                }
            }
        });
    };

    const filteredHistory = historyGuidances.filter(g => {
        const matchesSearch =
            g.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.judul_tesis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.keterangan?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTahap = tahapFilter === "all" || g.tahap === tahapFilter;

        return matchesSearch && matchesTahap;
    });

    if (isPageLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 gap-2">
            <Loader2 className="animate-spin text-[#003178]" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Lembar Bimbingan Tesis...</p>
        </div>
    );

    return (
        <div className="w-full font-['Manrope'] select-none">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
                        <GraduationCap className="text-blue-600" size={24} /> Pencatatan Bimbingan Tesis
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                        Input mandiri progres bimbingan penyusunan tesis/karya ilmiah akhir Residen bimbingan Anda.
                    </p>
                </div>
                <button type="button" onClick={initData} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all outline-none">
                    <RefreshCcw size={14} /> Sinkronisasi
                </button>
            </div>

            {/* Form Input Mandiri Konsulen */}
            <div className={`bg-white rounded-[32px] shadow-sm border transition-all duration-300 ${isEditMode ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200/60'} mb-8 overflow-hidden`}>
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="flex items-center gap-2 font-black text-slate-800 uppercase text-xs tracking-wider">
                        <BookMarked size={18} className={isEditMode ? "text-amber-500" : "text-[#003178]"} />
                        {isEditMode ? `Mode Edit: Koreksi Logbook Tesis` : `Formulir Input Logbook Bimbingan Tesis`}
                    </h2>
                    <button type="button" onClick={() => setFormOpen(!formOpen)} className="text-slate-400 hover:text-slate-600 outline-none">
                        {formOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>

                <AnimatePresence>
                    {formOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Pilih Residen Bimbingan</label>
                                    <select className="custom-input" value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})}>
                                        <option value="">-- Pilih Dokter Residen --</option>
                                        {students.map(std => (
                                            <option key={std.id} value={std.id}>{std.name.toUpperCase()} ({std.identifier || 'Tanpa NIM'})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Tahap Bimbingan</label>
                                    <select className="custom-input" value={formData.tahap} onChange={e => setFormData({...formData, tahap: e.target.value})}>
                                        {TAHAP_OPTIONS.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Tanggal Kegiatan</label>
                                    <input type="date" className="custom-input" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Judul Tesis (Opsional, isi/perbarui jika sudah ditentukan)</label>
                                    <input type="text" placeholder="Contoh: Perbandingan Efektivitas Blok Saraf Perifer pada..." className="custom-input" value={formData.judul_tesis} onChange={e => setFormData({...formData, judul_tesis: e.target.value})} />
                                </div>
                                <div className="md:col-span-3 pt-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Keterangan Progres Bimbingan</label>
                                    <textarea rows="3" placeholder="Tuliskan catatan diskusi, arahan, atau progres bimbingan tesis hasil pertemuan dengan residen di sini..." className="custom-input resize-none" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})}></textarea>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                                {isEditMode ? (
                                    <>
                                        <button type="button" onClick={handleCancelEdit} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-all border border-slate-200/60 hover:bg-slate-200">
                                            <X size={14} /> Batal Edit
                                        </button>
                                        <button type="button" onClick={handleSubmit} disabled={loading} className="bg-amber-600 text-white px-8 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all outline-none border-none hover:bg-amber-700">
                                            {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Check size={14} />} Perbarui & Paraf Logbook
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" onClick={resetForm} className="px-6 py-2.5 text-xs font-black text-slate-400 uppercase tracking-widest outline-none">Reset</button>
                                        <button type="button" onClick={handleSubmit} disabled={loading} className="bg-[#003178] text-white px-8 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all outline-none border-none hover:bg-blue-800">
                                            {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Check size={14} />} Simpan & Paraf Logbook
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Tabel Logbook Cetak */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="font-black text-slate-800 uppercase tracking-tight text-xs flex items-center gap-2">
                        <Filter size={16} className="text-slate-400" /> Lembar Logbook Riwayat Bimbingan Tesis
                    </h2>
                    <div className="flex items-center gap-3 flex-wrap">
                        <select
                            className="bg-slate-50 border border-slate-200/60 text-[10px] font-black uppercase tracking-wider rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-blue-500 transition-all"
                            value={tahapFilter}
                            onChange={e => setTahapFilter(e.target.value)}
                        >
                            <option value="all">Semua Tahap</option>
                            {TAHAP_OPTIONS.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Cari nama residen, judul, atau keterangan..."
                            className="bg-slate-50 border border-slate-200/60 text-xs font-bold rounded-xl px-4 py-2 outline-none w-full sm:w-64 focus:bg-white focus:border-blue-500 transition-all"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-none">
                        <thead className="bg-slate-50/60 text-slate-400 text-[10px] font-black uppercase border-b border-slate-100 tracking-wider">
                            <tr>
                                <th className="p-5 w-16">NO</th>
                                <th className="p-5 w-40">TANGGAL</th>
                                <th className="p-5 w-56">RESIDEN</th>
                                <th className="p-5 w-56">JUDUL TESIS</th>
                                <th className="p-5 w-48">TAHAP</th>
                                <th className="p-5">KETERANGAN</th>
                                <th className="p-5 w-32 text-center">PARAF</th>
                                <th className="p-5 w-32 text-center">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/70 text-xs font-medium text-slate-700">
                            {filteredHistory.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-16 text-center text-slate-400 font-bold uppercase tracking-wider">
                                        <Inbox size={28} className="mx-auto mb-2 opacity-50" /> Belum ada rekam bimbingan tesis yang dicatat
                                    </td>
                                </tr>
                            ) : (
                                filteredHistory.map((g, idx) => (
                                    <tr key={g.id} className={`transition-all ${editId === g.id ? 'bg-amber-50/30' : 'hover:bg-slate-50/30'}`}>
                                        <td className="p-5 font-bold text-slate-400">{idx + 1}</td>
                                        <td className="p-5 font-bold text-slate-800 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" /> {formatTanggal(g.tanggal)}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-black text-slate-800 uppercase tracking-tight">{g.user?.name}</div>
                                            <div className="text-[10px] font-bold text-slate-400">NIM: {g.user?.identifier || '—'}</div>
                                        </td>
                                        <td className="p-5 max-w-[220px]">
                                            <span className="font-bold text-slate-600 tracking-tight line-clamp-2">{g.judul_tesis || <span className="text-slate-300 italic font-medium">Belum ditentukan</span>}</span>
                                        </td>
                                        <td className="p-5"><TahapBadge tahap={g.tahap} /></td>
                                        <td className="p-5 max-w-xs truncate font-bold text-slate-600 tracking-tight">{g.keterangan}</td>
                                        <td className="p-5 text-center">
                                            <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-[9px] font-black border tracking-widest bg-emerald-50 text-emerald-600 border-emerald-100">
                                                VERIFIED
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button type="button" onClick={() => { setSelectedGuidance(g); setShowModal(true); }} title="Lihat Detail" className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-[#003178] flex items-center justify-center border border-slate-100 transition-all outline-none">
                                                    <Eye size={13} />
                                                </button>
                                                <button type="button" onClick={() => handleEditClick(g)} title="Edit Berkas" className="w-7 h-7 rounded-lg bg-slate-50 text-amber-600 hover:bg-amber-50 flex items-center justify-center border border-slate-100 transition-all outline-none">
                                                    <Edit2 size={12} />
                                                </button>
                                                <button type="button" onClick={() => handleDeleteClick(g.id, g.user?.name)} title="Hapus Berkas" className="w-7 h-7 rounded-lg bg-slate-50 text-red-500 hover:bg-red-50 flex items-center justify-center border border-slate-100 transition-all outline-none">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Detail Lembar Bimbingan */}
            <AnimatePresence>
                {showModal && selectedGuidance && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100" onClick={e => e.stopPropagation()}>
                            <div className="bg-[#003178] p-6 text-white border-none">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-60 block mb-1">Logbook Bimbingan Tesis</span>
                                <h2 className="text-sm font-black uppercase tracking-tight flex items-center gap-1.5"><User size={16}/> {selectedGuidance.user?.name}</h2>
                                <p className="text-xs opacity-70 mt-1 flex items-center gap-1"><Calendar size={13}/> {formatTanggal(selectedGuidance.tanggal)}</p>
                            </div>
                            <div className="p-6 space-y-4 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tahap Bimbingan</span>
                                    <TahapBadge tahap={selectedGuidance.tahap} />
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Judul Tesis</div>
                                    <div className="text-xs font-black text-slate-700">{selectedGuidance.judul_tesis || <span className="text-slate-300 italic font-medium">Belum ditentukan</span>}</div>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Keterangan Isi Pertemuan</div>
                                    <div className="text-xs font-bold text-slate-600 whitespace-pre-line leading-relaxed max-h-[180px] overflow-y-auto">{selectedGuidance.keterangan}</div>
                                </div>
                                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                    <div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Status Keputusan</span>
                                        <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600">VERIFIED (DIPARAF)</span>
                                    </div>
                                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 rounded-xl bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest outline-none border border-slate-200/60 hover:bg-slate-200">Tutup</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-input { width: 100%; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 12px 16px; font-size: 12px; font-weight: 700; outline: none; transition: all 0.2s; color: #334155; }
                .custom-input:focus { border-color: #003178; background: white; box-shadow: 0 0 0 4px rgba(0, 49, 120, 0.04); }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            ` }} />
        </div>
    );
}