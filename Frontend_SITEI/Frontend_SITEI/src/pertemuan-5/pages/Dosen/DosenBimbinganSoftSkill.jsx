import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Award, ChevronUp, ChevronDown, Check, RefreshCcw, Filter, Inbox, Loader2, Calendar, User, Eye, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatTanggal = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function DosenSoftSkillWrapper() {
    const [students, setStudents] = useState([]);
    const [historyGuidances, setHistoryGuidances] = useState([]);
    const [formOpen, setFormOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // State Manajemen Mode Operasi Komponen
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [selectedGuidance, setSelectedGuidance] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        user_id: '',
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: ''
    });

    const initData = useCallback(async () => {
        try {
            setIsPageLoading(true);
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
            
            const [resStudents, resHistory] = await Promise.all([
                axios.get('https://api.sigmaeducation.id/api/lecturer/my-softskill-students', { headers }),
                axios.get('https://api.sigmaeducation.id/api/lecturer/history-soft-skill-guidances', { headers })
            ]);

            setStudents(Array.isArray(resStudents.data) ? resStudents.data : []);
            setHistoryGuidances(Array.isArray(resHistory.data) ? resHistory.data : []);
        } catch (err) {
            console.error("Gagal sinkronisasi data pembinaan soft skill:", err);
        } finally {
            setIsPageLoading(false);
        }
    }, []);

    useEffect(() => {
        initData();
    }, [initData]);

    // Handler Kirim Data (Store Baru / Perbarui Data)
    const handleSubmit = async () => {
        if (!formData.user_id || !formData.tanggal || !formData.keterangan) {
            return Swal.fire("Data Tidak Lengkap", "Silakan tentukan nama residen dan isi catatan pembinaan.", "warning");
        }
        
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
            
            if (isEditMode) {
                // Method PUT untuk Update
                await axios.put(`https://api.sigmaeducation.id/api/lecturer/update-soft-skill-guidance/${editId}`, formData, { headers });
                Swal.fire("Berhasil Diubah", "Catatan evaluasi soft skill residen berhasil diperbarui.", "success");
                handleCancelEdit();
            } else {
                // Method POST untuk Create Mandiri
                await axios.post('https://api.sigmaeducation.id/api/lecturer/store-soft-skill-guidance', formData, { headers });
                Swal.fire("Berhasil Disimpan", "Catatan soft skill berhasil ditambahkan dan divalidasi.", "success");
                setFormData({
                    user_id: '',
                    tanggal: new Date().toISOString().split('T')[0],
                    keterangan: ''
                });
            }

            // Memuat ulang data riwayat logbook stase
            const resHistory = await axios.get('https://api.sigmaeducation.id/api/lecturer/history-soft-skill-guidances', { headers });
            setHistoryGuidances(Array.isArray(resHistory.data) ? resHistory.data : []);
        } catch (err) {
            Swal.fire("Error", "Gagal mengirim data ke server lokal.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Mengaktifkan Pengisian Form Mode Koreksi Data
    const handleEditClick = (guidance) => {
        setIsEditMode(true);
        setEditId(guidance.id);
        setFormData({
            user_id: guidance.user_id,
            tanggal: guidance.tanggal ? guidance.tanggal.substring(0, 10) : new Date().toISOString().split('T')[0],
            keterangan: guidance.keterangan
        });
        setFormOpen(true);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditId(null);
        setFormData({
            user_id: '',
            tanggal: new Date().toISOString().split('T')[0],
            keterangan: ''
        });
    };

    // Handler Eksekusi Hapus Data Berkas (DELETE)
    const handleDeleteClick = (id, studentName) => {
        Swal.fire({
            title: "Hapus Rekam Soft Skill?",
            text: `Apakah Anda yakin ingin menghapus arsip pembinaan soft skill dari residen ${studentName}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#EF4444",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
                    await axios.delete(`https://api.sigmaeducation.id/api/lecturer/delete-soft-skill-guidance/${id}`, { headers });
                    
                    Swal.fire("Terhapus", "Data pembinaan soft skill berhasil dibersihkan.", "success");
                    
                    if (isEditMode && editId === id) {
                        handleCancelEdit();
                    }

                    const resHistory = await axios.get('https://api.sigmaeducation.id/api/lecturer/history-soft-skill-guidances', { headers });
                    setHistoryGuidances(Array.isArray(resHistory.data) ? resHistory.data : []);
                } catch (err) {
                    Swal.fire("Error", "Gagal menghapus rekam logbook.", "error");
                }
            }
        });
    };

    const filteredHistory = historyGuidances.filter(g => 
        g.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.keterangan?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isPageLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 gap-2">
            <Loader2 className="animate-spin text-[#003178]" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Parameter Soft Skill...</p>
        </div>
    );

    return (
        <div className="p-6 bg-[#F8FAFC] min-h-screen font-['Manrope']">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
                        <Award className="text-blue-600" size={24} /> Penilaian & Pembinaan Soft Skill
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                        Pencatatan rekam jejak perilaku komponen soft skill, kedisiplinan, dan etika profesi residen bimbingan.
                    </p>
                </div>
                <button type="button" onClick={initData} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all outline-none">
                    <RefreshCcw size={14} /> Refresh Data
                </button>
            </div>

            {/* Panel Form Entri */}
            <div className={`bg-white rounded-[32px] shadow-sm border transition-all duration-300 ${isEditMode ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200/60'} mb-8 overflow-hidden`}>
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="flex items-center gap-2 font-black text-slate-800 uppercase text-xs tracking-wider">
                        <User size={18} className={isEditMode ? "text-amber-500" : "text-[#003178]"} /> 
                        {isEditMode ? `Koreksi Data / Pembaharuan Berkas` : `Lembar Catatan Soft Skill Baru`}
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
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Nama Dokter Residen</label>
                                    <select className="custom-input" value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})}>
                                        <option value="">-- Pilih Anggota Bimbingan --</option>
                                        {students.map(std => (
                                            <option key={std.id} value={std.id}>{std.name.toUpperCase()} ({std.identifier || 'Tanpa NIM'})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Tanggal Pembinaan</label>
                                    <input type="date" className="custom-input" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
                                </div>
                                <div className="md:col-span-3 pt-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Deskripsi Uraian Penilaian Komponen Soft Skill</label>
                                    <textarea rows="3" placeholder="Tuliskan evaluasi perilaku residen (misal: integritas, kerja sama tim, komunikasi terhadap pasien/sejawat, atau kedisiplinan stase)..." className="custom-input resize-none" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})}></textarea>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                                {isEditMode ? (
                                    <>
                                        <button type="button" onClick={handleCancelEdit} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-all border border-slate-200/60 hover:bg-slate-200">
                                            <X size={14} /> Batal
                                        </button>
                                        <button type="button" onClick={handleSubmit} disabled={loading} className="bg-amber-600 text-white px-8 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all outline-none border-none hover:bg-amber-700">
                                            {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Check size={14} />} Perbarui Data
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" onClick={() => setFormData({ user_id: '', tanggal: new Date().toISOString().split('T')[0], keterangan: '' })} className="px-6 py-2.5 text-xs font-black text-slate-400 uppercase tracking-widest outline-none">Reset</button>
                                        <button type="button" onClick={handleSubmit} disabled={loading} className="bg-[#003178] text-white px-8 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all outline-none border-none hover:bg-blue-800">
                                            {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Check size={14} />} Simpan & Validasi
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Data Hasil Pencatatan Logbook */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="font-black text-slate-800 uppercase tracking-tight text-xs flex items-center gap-2">
                        <Filter size={16} className="text-slate-400" /> Riwayat Penilaian Komponen Perilaku Profesional
                    </h2>
                    <input 
                        type="text" 
                        placeholder="Cari nama residen atau uraian penilaian..." 
                        className="bg-slate-50 border border-slate-200/60 text-xs font-bold rounded-xl px-4 py-2 outline-none w-full sm:w-64 focus:bg-white focus:border-blue-500 transition-all"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-none">
                        <thead className="bg-slate-50/60 text-slate-400 text-[10px] font-black uppercase border-b border-slate-100 tracking-wider">
                            <tr>
                                <th className="p-5 w-16">NO</th>
                                <th className="p-5 w-44">TANGGAL</th>
                                <th className="p-5 w-64">DOKTER RESIDEN</th>
                                <th className="p-5">URAIAN EVALUASI PERILAKU</th>
                                <th className="p-5 w-32 text-center">STATUS</th>
                                <th className="p-5 w-32 text-center">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/70 text-xs font-medium text-slate-700">
                            {filteredHistory.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-16 text-center text-slate-400 font-bold uppercase tracking-wider">
                                        <Inbox size={28} className="mx-auto mb-2 opacity-50" /> Belum ada rekam pembinaan soft skill yang tersimpan
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
                                        <td className="p-5 max-w-xs truncate font-bold text-slate-600 tracking-tight uppercase">{g.keterangan}</td>
                                        <td className="p-5 text-center">
                                            <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-[9px] font-black border tracking-widest bg-emerald-50 text-emerald-600 border-emerald-100">
                                                VERIFIED
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button type="button" onClick={() => { setSelectedGuidance(g); setShowModal(true); }} title="Lihat Uraian Detail" className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-[#003178] flex items-center justify-center border border-slate-100 transition-all outline-none">
                                                    <Eye size={13} />
                                                </button>
                                                <button type="button" onClick={() => handleEditClick(g)} title="Edit Catatan" className="w-7 h-7 rounded-lg bg-slate-50 text-amber-600 hover:bg-amber-50 flex items-center justify-center border border-slate-100 transition-all outline-none">
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

            {/* Modal Detail Berkas Pembinaan */}
            <AnimatePresence>
                {showModal && selectedGuidance && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100" onClick={e => e.stopPropagation()}>
                            <div className="bg-[#003178] p-6 text-white border-none">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-60 block mb-1">Arsip Logbook Komponen Soft Skill</span>
                                <h2 className="text-sm font-black uppercase tracking-tight flex items-center gap-1.5"><User size={16}/> {selectedGuidance.user?.name}</h2>
                                <p className="text-xs opacity-70 mt-1 flex items-center gap-1"><Calendar size={13}/> {formatTanggal(selectedGuidance.tanggal)}</p>
                            </div>
                            <div className="p-6 space-y-4 text-xs">
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Uraian Evaluasi Perilaku Profesional</div>
                                    <div className="text-xs font-bold text-slate-600 whitespace-pre-line leading-relaxed max-h-[180px] overflow-y-auto">{selectedGuidance.keterangan}</div>
                                </div>
                                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                    <div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Status Pengesahan</span>
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
            ` }} />
        </div>
    );
}