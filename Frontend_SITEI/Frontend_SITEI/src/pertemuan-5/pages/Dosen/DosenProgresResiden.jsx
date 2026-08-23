import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Users, Search, RotateCcw, ChevronDown, ChevronUp, Award, Loader2, Inbox, AlertOctagon, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DosenProgresResiden() {
    const [residents, setResidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedResident, setExpandedResident] = useState(null);
    
    // ── STATE BARU UNTUK DEEP DEBUGGING ──
    const [debugError, setDebugError] = useState(null);

    const fetchResidentsProgress = useCallback(async () => {
        try {
            setIsLoading(true);
            setDebugError(null); // Reset debug eror setiap kali memuat ulang

            const res = await axios.get('https://api.sigmaeducation.id/api/lecturer/residents-progress', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            setResidents(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("============= LOG EROR AXIOS DOSEN PROGRES =============");
            console.error("Gagal memuat progres bimbingan:", err);
            
            // Tangkap payload respons eror internal 500 dari Laravel
            if (err.response) {
                console.error("Status Server:", err.response.status);
                console.error("Payload Data Eror:", err.response.data);
                setDebugError({
                    status: err.response.status,
                    message: err.response.data.message || "Eror internal pada server Laravel.",
                    exception: err.response.data.debug_exception || "N/A (Nyalakan APP_DEBUG=true di file .env backend)",
                    file: err.response.data.file || "Unknown File",
                    line: err.response.data.line || "Unknown Line"
                });
            } else {
                setDebugError({
                    status: "Koneksi Gagal",
                    message: err.message,
                    exception: "Gagal terhubung ke https://api.sigmaeducation.id/. Pastikan php artisan serve aktif."
                });
            }
            console.error("========================================================");
            setResidents([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResidentsProgress();
    }, [fetchResidentsProgress]);

    const toggleExpand = (id) => {
        setExpandedResident(expandedResident === id ? null : id);
    };

    const filteredResidents = residents.filter(r => 
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.identifier?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
            <Loader2 className="animate-spin text-[#003178]" size={40} />
            <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Menganalisis Progres Kurikulum...</p>
        </div>
    );

    return (
        <div className="p-6 bg-[#F8FAFC] min-h-screen font-['Manrope']">
            {/* Header Panel */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
                        <Users className="text-blue-600" size={24} /> Monitoring Progres Residen
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                        Pantau kuantitas pencapaian target minimal stase klinis kurikulum untuk seluruh dokter residen bimbingan Anda.
                    </p>
                </div>
                <button onClick={fetchResidentsProgress} className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all">
                    <RotateCcw size={14} /> Refresh Progres
                </button>
            </div>

            {/* ── LIVE DEBUGGING SCREEN MODUL (AKAN MUNCUL JIKA SERVER EROR 500) ── */}
            {debugError && (
                <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-3xl shadow-md">
                    <div className="flex items-center gap-2 text-red-700 font-black text-xs uppercase mb-3 tracking-wider">
                        <AlertOctagon size={18} className="animate-pulse" /> 
                        Console Debugger: Terjadi Crash Server ({debugError.status})
                    </div>
                    <div className="bg-slate-950 text-emerald-400 font-mono text-[11px] p-4 rounded-xl overflow-x-auto shadow-inner space-y-1.5 border border-slate-800">
                        <div><span className="text-rose-400">Pesan Eror:</span> "{debugError.message}"</div>
                        <div><span className="text-rose-400">Penyebab PHP:</span> {debugError.exception}</div>
                        <div><span className="text-rose-400">Lokasi File:</span> <span className="text-blue-400 underline">{debugError.file}</span></div>
                        <div><span className="text-rose-400">Baris Kode:</span> <span className="text-amber-400 font-bold">Line {debugError.line}</span></div>
                    </div>
                    <p className="text-[10px] text-red-500 font-bold mt-2">💡 Tips: Masalah ini biasanya karena query memanggil kolom database yang belum ada, atau relasi bimbingan di table mentorships merujuk ke id user yang sudah dihapus.</p>
                </div>
            )}

            {/* Utility Pencarian */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Cari berdasarkan nama dokter residen atau NIM bimbingan..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Daftar Residen Cards Container */}
            <div className="space-y-4">
                {filteredResidents.length === 0 && !debugError ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-20 flex flex-col items-center justify-center gap-2 text-slate-400">
                        <Inbox size={36} className="text-slate-300" />
                        <p className="text-xs font-black tracking-widest uppercase">Dokter residen bimbingan tidak ditemukan</p>
                    </div>
                ) : (
                    filteredResidents.map((residen) => {
                        const isExpanded = expandedResident === residen.id;
                        return (
                            <div key={residen.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-blue-200 transition-all">
                                <div className="p-5 flex items-center justify-between cursor-pointer select-none" onClick={() => toggleExpand(residen.id)}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#003178] flex items-center justify-center font-black text-sm uppercase">
                                            {residen.name?.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{residen.name}</h3>
                                            <p className="text-[11px] font-bold text-slate-400">NIM: {residen.identifier || '—'} · Total <span className="text-emerald-600 font-extrabold">{residen.total_verified_cases} Cases</span> Sukses Diverifikasi</p>
                                        </div>
                                    </div>
                                    <div className="text-slate-400">
                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-slate-50/50 border-t border-slate-100">
                                            <div className="p-6 space-y-4">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                                    <Award size={14} className="text-[#003178]" /> Distribusi Capaian Stase Logbook Resmi
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <ProgressBar staseName="Kompetensi Dasar" current={residen.progress.kompetensi_dasar} target={1015} color="bg-blue-600" />
                                                    <ProgressBar staseName="Anestesi Bedah Umum" current={residen.progress.bedah_umum} target={620} color="bg-indigo-600" />
                                                    <ProgressBar staseName="Manajemen Nyeri" current={residen.progress.manajemen_nyeri} target={130} color="bg-amber-600" />
                                                    <ProgressBar staseName="Obstetri & Ginekologi" current={residen.progress.obstetri_ginekologi} target={100} color="bg-rose-600" />
                                                    <ProgressBar staseName="Anestesi Bedah Saraf" current={residen.progress.bedah_saraf} target={35} color="bg-purple-600" />
                                                    <ProgressBar staseName="Kompetensi Lanjut / Khusus" current={residen.progress.kompetensi_lanjut} target={35} color="bg-teal-600" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

const ProgressBar = ({ staseName, current, target, color }) => {
    const persentase = Math.min(Math.round((current / target) * 100), 100);
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-black text-slate-700">{staseName}</span>
                <span className="text-[11px] font-bold text-slate-500 font-mono">
                    {current} / <span className="text-slate-400">{target}</span> ({persentase}%)
                </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${persentase}%` }}></div>
            </div>
        </div>
    );
};