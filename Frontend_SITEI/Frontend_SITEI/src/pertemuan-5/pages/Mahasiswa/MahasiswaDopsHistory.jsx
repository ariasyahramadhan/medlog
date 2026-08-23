import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
    Inbox, Loader2, Calendar, User, Search, RotateCcw, 
    ClipboardCheck, MessageSquare, Eye, Printer 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Impor helper cetak individual transaksional tunggal
import { cetakDopsIndividualPDF } from './useCetakDopsHistory';

const formatTanggal = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function MahasiswaDopsHistory() {
    const [dopsRecords, setDopsRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [printLoadingId, setPrintLoadingId] = useState(null); // Loader per baris tombol cetak
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDops, setSelectedDops] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchDopsData = useCallback(async () => {
        try {
            setIsLoading(true);
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
            const res = await axios.get('https://api.sigmaeducation.id/api/mahasiswa/dops-evaluations', { headers });
            setDopsRecords(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Gagal memuat rekam evaluasi DOPS:", err);
            setDopsRecords([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Intersepsi Typo Fixer: Mengubah kata foldering dari sisa kompilasi menjadi finally secara aman
    useEffect(() => {
        fetchDopsData();
    }, [fetchDopsData]);

    // Handler Pemicu Cetak Lembar Form Penilaian Tunggal
    const handleCetakFormIndividual = async (dopsItem) => {
        setPrintLoadingId(dopsItem.id);
        try {
            await cetakDopsIndividualPDF({
                dopsItem,
                resident: {
                    name: user.name,
                    identifier: user.identifier,
                    department: user.department || 'Anestesiologi dan Terapi Intensif'
                }
            });
        } catch (err) {
            console.error(err);
            Swal.fire("Gagal", "Terjadi kesalahan kompilasi modul cetak PDF.", "error");
        } finally {
            setPrintLoadingId(null);
        }
    };

    const filteredDops = dopsRecords.filter(d => 
        d.jenis_dops?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.lecturer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
            <Loader2 className="animate-spin text-[#003178]" size={40} />
            <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Sinkronisasi Nilai DOPS Kurikulum...</p>
        </div>
    );

    return (
        <div className="p-6 bg-[#F8FAFC] min-h-screen font-['Manrope']">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
                        <ClipboardCheck className="text-blue-600" size={24} /> Hasil Evaluasi DOPS Anda
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                        Daftar penilaian lembar kerja kelayakan Direct Observation of Procedural Skills dari Konsulen bimbingan.
                    </p>
                </div>
                <button onClick={fetchDopsData} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all outline-none">
                    <RotateCcw size={14} /> Sinkronisasi
                </button>
            </div>

            {/* Pencarian */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm mb-8">
                <input type="text" placeholder="Cari berdasarkan jenis tindakan dops atau dosen konsulen..." className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs font-bold text-slate-700 outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            {/* Tabel Utama */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-none">
                        <thead className="bg-slate-50/70 text-slate-400 text-[10px] font-black uppercase tracking-wider border-b">
                            <tr>
                                <th className="p-5">Tanggal Ujian</th>
                                <th className="p-5">Jenis Prosedur DOPS</th>
                                <th className="p-5">Dosen Konsulen Penguji</th>
                                <th className="p-5 text-center">Total Skor</th>
                                <th className="p-5 text-center">Cetak Lembar Form</th>
                                <th className="p-5 text-center">Pratinjau</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-xs font-medium text-slate-700">
                            {filteredDops.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-16 text-center text-slate-400 font-bold uppercase">
                                        <Inbox size={32} className="mx-auto mb-2 text-slate-300" />
                                        Belum ada rekaman lembar evaluasi DOPS yang diterbitkan
                                    </td>
                                </tr>
                            ) : (
                                filteredDops.map((d) => (
                                    <tr key={d.id} className="hover:bg-slate-50/40 transition-colors">
                                        <td className="p-5 font-bold whitespace-nowrap">{formatTanggal(d.tanggal)}</td>
                                        <td className="p-5 font-black text-[#003178] uppercase">{d.jenis_dops}</td>
                                        <td className="p-5 font-bold text-slate-600 uppercase">{d.lecturer?.name || '—'}</td>
                                        <td className="p-5 text-center font-extrabold text-slate-800 text-sm">{d.total_skor || 0} Poin</td>
                                        
                                        {/* CETAK PDF FORM INDIVIDUAL PER BARIS KUALIFIKASI */}
                                        <td className="p-5 text-center">
                                            <button
                                                type="button"
                                                disabled={printLoadingId !== null}
                                                onClick={() => handleCetakFormIndividual(d)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100 uppercase transition-all disabled:opacity-50"
                                            >
                                                {printLoadingId === d.id ? (
                                                    <Loader2 size={12} className="animate-spin"/>
                                                ) : (
                                                    <Printer size={12} />
                                                )}
                                                {d.status_kelayakkan === 'LAYAK' ? 'Unduh Layak' : 'Unduh Form'}
                                            </button>
                                        </td>

                                        <td className="p-5 text-center">
                                            <button type="button" onClick={() => { setSelectedDops(d); setShowModal(true); }} className="w-8 h-8 rounded-xl bg-slate-50 border flex items-center justify-center mx-auto text-slate-500 hover:bg-blue-50"><Eye size={14} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL PREVIEW DETAIL */}
            <AnimatePresence>
                {showModal && selectedDops && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden text-xs" onClick={e => e.stopPropagation()}>
                            <div className="bg-[#003178] p-6 text-white flex justify-between items-center">
                                <div><span className="text-[9px] font-black uppercase opacity-60 block mb-0.5">Lembar Evaluasi DOPS Resmi Residen</span><h2 className="text-base font-black uppercase leading-tight">{selectedDops.jenis_dops}</h2></div>
                                <div className="text-right"><span className="text-[9px] font-black block opacity-60 uppercase mb-0.5">Total Skor Akumulatif</span><span className="text-2xl font-black">{selectedDops.total_skor || 0} Poin</span></div>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border">
                                    <div><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Dosen Penguji / Konsulen</span><span className="font-black text-slate-800 uppercase text-xs block">{selectedDops.lecturer?.name || '—'}</span></div>
                                    <div className="text-right"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Tanggal Ujian</span><span className="font-bold text-slate-700 text-xs block">{formatTanggal(selectedDops.tanggal)}</span></div>
                                </div>
                                <div className="bg-blue-50/30 border p-4 rounded-2xl space-y-1.5">
                                    <span className="text-[9px] font-black text-blue-500 uppercase block flex items-center gap-1"><MessageSquare size={13}/> Catatan / Keterangan Umpan Balik Konsulen</span>
                                    <p className="text-slate-700 font-bold italic text-[11px]">"{selectedDops.keterangan || 'Tidak ada catatan umpan balik khusus.'}"</p>
                                </div>
                            </div>
                            <div className="p-5 bg-slate-50 border-t flex justify-between items-center">
                                <span className={`px-4 py-1 border rounded-full font-black text-[9px] tracking-widest uppercase ${selectedDops.status_kelayakkan === 'LAYAK' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{selectedDops.status_kelayakkan}</span>
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 bg-[#003178] text-white font-black text-[10px] uppercase rounded-xl">Tutup</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}