import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CheckCircle2, XCircle, ShieldCheck, Loader2, Inbox, Calendar, User, Search, RotateCcw, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function DosenRiwayatValidasi() {
    const [cases, setCases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedKasus, setSelectedKasus] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all_history"); 
    const [staseFilter, setStaseFilter] = useState("all");

    const subManajemenNyeri = ["Manajemen Nyeri akut", "Manajemen Nyeri kronik", "Manajemen Nyeri paliatif", "Interventional Pain Management"];

    const fetchValidationHistory = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('https://api.sigmaeducation.id/api/lecturer/validation-history', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCases(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Gagal memuat riwayat:", err);
            setCases([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchValidationHistory();
    }, [fetchValidationHistory]);

    const filteredCases = cases.filter(c => {
        const matchesSearch = 
            c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.user?.identifier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.tindakan?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === "all_history" 
            ? (c.status === 'verified' || c.status === 'rejected')
            : c.status === statusFilter;
            
        const matchesStase = staseFilter === "all" || c.jenis_kasus === staseFilter;

        return matchesSearch && matchesStatus && matchesStase;
    });

    const handleOpenDetail = (kasus) => {
        setSelectedKasus(kasus);
        setShowModal(true);
    };

    if (isLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
            <Loader2 className="animate-spin text-[#003178]" size={40} />
            <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Memuat Riwayat Validasi...</p>
        </div>
    );

    return (
        <div className="p-6 bg-[#F8FAFC] min-h-screen font-['Manrope']">
            {/* Header Panel */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
                        <ShieldCheck className="text-emerald-600" size={24} /> Riwayat Validasi Konsulen
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                        Rekam data reviu logbook, penolakan, serta persetujuan stase tindakan klinis residen bimbingan.
                    </p>
                </div>
                <button onClick={fetchValidationHistory} className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all">
                    <RotateCcw size={14} /> Sinkronisasi Ulang
                </button>
            </div>

            {/* Statistik Ringkas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003178] flex items-center justify-center font-black"><ShieldCheck size={18}/></div>
                    <div>
                        <div className="text-2xl font-black text-slate-800">{cases.filter(c => c.status === 'verified' || c.status === 'rejected').length}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Selesai Reviu</div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black"><CheckCircle2 size={18}/></div>
                    <div>
                        <div className="text-2xl font-black text-emerald-600">{cases.filter(c => c.status === 'verified').length}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kasus Terverifikasi</div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center font-black"><XCircle size={18}/></div>
                    <div>
                        <div className="text-2xl font-black text-red-500">{cases.filter(c => c.status === 'rejected').length}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kasus Ditolak</div>
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-6 space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Cari berdasarkan nama residen atau tindakan kurikulum..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Keputusan Dosen:</span>
                            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                                {[
                                    { id: "all_history", name: "SEMUA" },
                                    { id: "verified", name: "VERIFIED" },
                                    { id: "rejected", name: "REJECTED" }
                                ].map(st => (
                                    <button 
                                        key={st.id} type="button" onClick={() => setStatusFilter(st.id)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${statusFilter === st.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                    >
                                        {st.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bab Stase:</span>
                            <select 
                                className="px-3 py-1.5 bg-slate-100 border-none text-[10px] font-black uppercase rounded-xl text-slate-600 outline-none cursor-pointer"
                                value={staseFilter}
                                onChange={e => setStaseFilter(e.target.value)}
                            >
                                <option value="all">Semua Kompetensi</option>
                                <option value="Kompetensi Dasar">Kompetensi Dasar</option>
                                <option value="Anestesi Bedah Umum">Anestesi Bedah Umum</option>
                                <option value="Manajemen Nyeri">Manajemen Nyeri</option>
                                <option value="Obstetri & Ginekologi">Obstetri & Ginekologi</option>
                                <option value="Anestesi Bedah Saraf">Anestesi Bedah Saraf</option>
                                <option value="Kompetensi Lanjut">Kompetensi Lanjut</option>
                            </select>
                        </div>
                    </div>
                    <div className="text-[11px] font-bold text-slate-400">
                        Ditemukan <span className="text-blue-600 font-black">{filteredCases.length}</span> rekam berkas lama
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredCases.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-2 text-slate-400">
                        <Inbox size={36} className="text-slate-300" />
                        <p className="text-xs font-black tracking-widest uppercase">Belum ada riwayat validasi klinis stase</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/70 text-slate-400 text-[10px] font-black uppercase border-b border-slate-100 tracking-wider">
                                <tr>
                                    <th className="p-5">Tanggal</th>
                                    <th className="p-5">Residen</th>
                                    <th className="p-5">Tindakan Medis Utama</th>
                                    <th className="p-5">Detail Prosedur Stase</th>
                                    <th className="p-5 text-center">Keputusan</th>
                                    <th className="p-5 text-center">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-xs">
                                {filteredCases.map((c) => {
                                    let labelAdaptifAnestesi = <span className="text-slate-300 italic">—</span>;
                                    
                                    if (c.tindakan === "Memasang kateter vena central" && c.lokasi_insersi) {
                                        labelAdaptifAnestesi = <div><span className="font-black text-slate-400 block text-[8px]">LOKASI INSERSI:</span> <span className="font-bold text-amber-600 uppercase text-[10px]">{c.lokasi_insersi}</span></div>;
                                    } else if (subManajemenNyeri.includes(c.tindakan) && c.regimen_analgesia) {
                                        labelAdaptifAnestesi = <div><span className="font-black text-slate-400 block text-[8px]">REGIMEN:</span> <span className="font-bold text-blue-600 uppercase text-[10px]">{c.regimen_analgesia}</span></div>;
                                    } else if (c.teknik_intervensi) {
                                        labelAdaptifAnestesi = <div><span className="font-black text-slate-400 block text-[8px]">TEKNIK:</span> <span className="font-bold text-purple-600 uppercase text-[10px]">{c.teknik_intervensi}</span></div>;
                                    } else if (c.jenis_anestesi && !c.jenis_anestesi.includes("Procedure") && !c.jenis_anestesi.includes("Care")) {
                                        labelAdaptifAnestesi = <span className="text-slate-600 font-bold">{c.jenis_anestesi}</span>;
                                    }

                                    return (
                                        <tr key={c.id} className="hover:bg-slate-50/40 transition-colors group">
                                            <td className="p-5 font-bold text-slate-700 whitespace-nowrap">{formatTanggal(c.tanggal_tindakan)}</td>
                                            <td className="p-5">
                                                <div className="font-black text-slate-800 uppercase tracking-tight">{c.user?.name || "Residen Dokter"}</div>
                                                <div className="text-[10px] font-bold text-slate-400">NIM: {c.user?.identifier || '—'}</div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-wrap gap-1 mb-1">
                                                    {parseDiagnosis(c.diagnosis).map(d => <span key={d} className="bg-blue-50/70 text-[#003178] text-[9px] px-2 py-0.5 rounded-md border border-blue-100 font-bold uppercase">{d}</span>)}
                                                </div>
                                                <div className="text-[11px] font-black text-[#003178] uppercase">{c.tindakan}</div>
                                            </td>
                                            <td className="p-5">{labelAdaptifAnestesi}</td>
                                            <td className="p-5 text-center">
                                                <span className={`inline-flex items-center gap-1 px-4 py-1 rounded-full text-[9px] font-black border tracking-widest ${c.status === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                    {c.status === 'verified' ? 'VERIFIED' : 'REJECTED'}
                                                </span>
                                            </td>
                                            <td className="p-5 text-center">
                                                <button 
                                                    type="button" onClick={() => handleOpenDetail(c)}
                                                    className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-[#003178] flex items-center justify-center mx-auto border transition-all"
                                                >
                                                    <Eye size={13} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Detail Komprehensif */}
            <AnimatePresence>
                {showModal && selectedKasus && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}
                        >
                            <div className="bg-[#003178] p-6 text-white">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-60 block mb-1">Arsip Logbook Valid</span>
                                <h2 className="text-base font-black uppercase leading-tight">{selectedKasus.tindakan}</h2>
                                <p className="text-xs opacity-70 mt-1 flex items-center gap-1"><Calendar size={13}/> {formatTanggal(selectedKasus.tanggal_tindakan)}</p>
                            </div>
                            
                            <div className="p-6 space-y-4 text-xs">
                                <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 border">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Identitas Residen & Pasien</div>
                                    <ModalRow label="Nama Residen" value={selectedKasus.user?.name} isUpper={true} />
                                    <ModalRow label="NIM / Identifier" value={selectedKasus.user?.identifier} />
                                    <ModalRow label="Profil Pasien" value={`${selectedKasus.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}, ${selectedKasus.umur} Tahun`} />
                                </div>

                                <div className="bg-blue-50/30 rounded-2xl p-4 space-y-2.5 border border-blue-100/40">
                                    <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Rincian Prosedur Klinis</div>
                                    <ModalRow label="Stase Target" value={selectedKasus.jenis_kasus} />
                                    {selectedKasus.lokasi_insersi && <ModalRow label="Lokasi Insersi CVC" value={selectedKasus.lokasi_insersi} isUpper={true} />}
                                    {selectedKasus.regimen_analgesia && <ModalRow label="Regimen Analgesia" value={selectedKasus.regimen_analgesia} isUpper={true} />}
                                    {selectedKasus.teknik_intervensi && <ModalRow label="Teknik Intervensi" value={selectedKasus.teknik_intervensi} isUpper={true} />}
                                    {!selectedKasus.lokasi_insersi && !selectedKasus.regimen_analgesia && (
                                        <ModalRow label="Metode Anestesi" value={selectedKasus.jenis_anestesi} />
                                    )}
                                </div>

                                <div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Diagnosis Kode Klinis</div>
                                    <div className="flex flex-wrap gap-1">
                                        {parseDiagnosis(selectedKasus.diagnosis).map(d => (
                                            <span key={d} className="bg-slate-100 text-slate-700 text-[10px] px-3 py-1 border border-slate-200 rounded-full font-bold uppercase">{d}</span>
                                        ))}
                                    </div>
                                </div>

                                {selectedKasus.catatan && (
                                    <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
                                        <div className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Catatan Residen</div>
                                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedKasus.catatan}</p>
                                    </div>
                                )}

                                <div className="pt-3 border-t flex justify-between items-center">
                                    <span className={`text-[10px] font-black tracking-widest uppercase ${selectedKasus.status === 'verified' ? 'text-emerald-600' : 'text-red-500'}`}>{selectedKasus.status}</span>
                                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest transition-all">Tutup</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

const ModalRow = ({ label, value, isUpper }) => (
    <div className="flex justify-between items-start gap-4">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{label}</span>
        <span className={`text-xs text-slate-700 font-bold ${isUpper ? 'uppercase' : ''}`}>{value || '—'}</span>
    </div>
);