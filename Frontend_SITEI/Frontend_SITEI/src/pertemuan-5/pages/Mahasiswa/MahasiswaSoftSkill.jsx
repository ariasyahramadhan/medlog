import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    Award, Calendar, Inbox, Loader2, Filter,
    Info, ShieldCheck, Printer, Download, X, RefreshCcw
} from 'lucide-react';
// ShieldCheck masih dipakai di badge VERIFIED pada baris tabel
import { motion, AnimatePresence } from 'framer-motion';

// ── Import PDF utility ────────────────────────────────────────────
import { cetakSoftSkillPDF } from './useCetakSoftSkill';

// ─── Helper ───────────────────────────────────────────────────────

const formatTanggal = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
};

const fmtLong = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
};

// ─── Cetak Modal ──────────────────────────────────────────────────

const CetakModal = ({ softSkills, cases = [], onClose }) => {
    const [tanggalDari,    setTanggalDari]    = useState('');
    const [tanggalSampai,  setTanggalSampai]  = useState('');
    const [loading,        setLoading]        = useState(false);

    const userRaw  = localStorage.getItem('user');
    const user     = userRaw ? JSON.parse(userRaw) : {};

    // Ambil nama konsulen/DPJP:
    // Prioritas 1 — field konsulen_name di data soft skill (jika backend mengisi)
    // Prioritas 2 — dpjp_name dari prop cases yang dikirim (sama dengan logbook kasus)
    // Prioritas 3 — fallback '—'
    const firstKonsulen =
        softSkills.find(s => s.konsulen_name)?.konsulen_name ||
        cases?.find(c => c.dpjp_name)?.dpjp_name             ||
        '—';

    const filteredData = softSkills.filter(s => {
        const tgl = new Date(s.tanggal);
        if (tanggalDari   && tgl < new Date(tanggalDari))                     return false;
        if (tanggalSampai && tgl > new Date(tanggalSampai + 'T23:59:59'))     return false;
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
        if (filteredData.length === 0) {
            Swal.fire('Tidak Ada Data', 'Tidak ada catatan soft skill pada rentang tanggal yang dipilih.', 'info');
            return;
        }

        setLoading(true);
        try {
            await cetakSoftSkillPDF({
                softSkills:    filteredData,
                resident:      { name: user.name, identifier: user.identifier, department: user.department, batch: user.batch },
                konsulen:      { name: firstKonsulen, identifier: '—' },
                tanggalDari,
                tanggalSampai,
            });
            onClose();
        } catch (err) {
            console.error(err);
            Swal.fire('Gagal', 'Terjadi kesalahan saat membuat PDF. Pastikan library jsPDF sudah terinstall.', 'error');
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
                    {/* Header Modal */}
                    <div className="bg-[#003178] p-6 text-white flex justify-between items-start">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Ekspor Dokumen</div>
                            <div className="text-lg font-black uppercase flex items-center gap-2">
                                <Printer size={18} /> Cetak Logbook Soft Skill
                            </div>
                            <div className="text-xs opacity-70 mt-1">Hanya catatan VERIFIED yang akan dicetak</div>
                        </div>
                        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity mt-1">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body Modal */}
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

                        {/* Preview jumlah */}
                        {tanggalDari && tanggalSampai && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="overflow-hidden"
                            >
                                <div className={`rounded-2xl p-4 border flex items-center gap-3 ${filteredData.length > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg ${filteredData.length > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-400'}`}>
                                        {filteredData.length}
                                    </div>
                                    <div>
                                        <div className={`text-xs font-black ${filteredData.length > 0 ? 'text-emerald-700' : 'text-red-500'}`}>
                                            {filteredData.length > 0
                                                ? `${filteredData.length} catatan soft skill siap dicetak`
                                                : 'Tidak ada catatan di rentang ini'}
                                        </div>
                                        <div className="text-[10px] text-slate-400">
                                            {filteredData.length > 0
                                                ? `${fmtLong(tanggalDari)} — ${fmtLong(tanggalSampai)}`
                                                : 'Coba ubah rentang tanggal'}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Info format PDF */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Format Output PDF</div>
                            {[
                                'Format A4 Portrait — dokumen resmi institusi',
                                'Halaman 1: Kop FK UNRI + identitas residen + statistik + QR TTD',
                                'Halaman 2+: Tabel detail seluruh catatan soft skill',
                                'QR Code berisi identitas digital residen & konsulen',
                                'Statistik otomatis: Kedisiplinan, Etika Profesi, Komunikasi',
                            ].map((info, i) => (
                                <div key={i} className="flex items-center gap-2 text-[10px] text-slate-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#003178] flex-shrink-0" />
                                    {info}
                                </div>
                            ))}
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleCetak}
                                disabled={loading || filteredData.length === 0}
                                className="flex-[2] py-3 rounded-2xl bg-[#003178] text-white text-xs font-black uppercase tracking-widest hover:bg-[#1a4db5] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? <><Loader2 size={14} className="animate-spin" /> Membuat PDF...</>
                                    : <><Download size={14} /> Cetak & Unduh PDF</>
                                }
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ─────────────────────────────────────────────────────────────────
//  HALAMAN UTAMA
// ─────────────────────────────────────────────────────────────────

export default function MahasiswaSoftSkillView() {
    const [softSkills,     setSoftSkills]     = useState([]);
    const [cases,          setCases]          = useState([]);
    const [isLoading,      setIsLoading]      = useState(true);
    const [searchQuery,    setSearchQuery]    = useState('');
    const [showCetakModal, setShowCetakModal] = useState(false);

    const fetchStudentSoftSkills = useCallback(async () => {
        try {
            setIsLoading(true);

            const res = await axios.get('https://api.sigmaeducation.id/api/mahasiswa/soft-skill-guidances', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSoftSkills(Array.isArray(res.data) ? res.data : []);

            try {
                const resKasus = await axios.get('https://api.sigmaeducation.id/api/mahasiswa/riwayat', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setCases(resKasus.data?.data || resKasus.data || []);
            } catch {
                // Tidak fatal jika gagal — konsulen akan fallback ke '—'
            }
        } catch (err) {
            console.error('Gagal memuat logbook soft skill:', err);
            setSoftSkills([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudentSoftSkills();
    }, [fetchStudentSoftSkills]);

    const filteredSoftSkills = softSkills.filter(s =>
        s.keterangan?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ── Loading State ─────────────────────────────────────────────
    if (isLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 gap-2">
            <Loader2 className="animate-spin text-[#003178]" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Parameter Soft Skill...</p>
        </div>
    );

    return (
        <div className="w-full font-['Manrope'] select-none">

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
                        <Award className="text-blue-600" size={24} /> Penilaian Komponen Soft Skill
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tight">
                        Evaluasi Kedisiplinan, Etika Profesi, Komunikasi, dan Perilaku Profesional Residen
                    </p>
                </div>

                {/* ─── Tombol Cetak ─── */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCetakModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#003178] hover:bg-[#1a4db5] text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 whitespace-nowrap"
                >
                    <Printer size={14} />
                    Cetak Logbook
                    {softSkills.length > 0 && (
                        <span className="bg-white/20 text-white text-[9px] font-black rounded-full px-2 py-0.5">
                            {softSkills.length} catatan
                        </span>
                    )}
                </motion.button>
            </div>

            {/* ── Info Panel Read-Only ──────────────────────────────── */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs font-medium text-blue-700 leading-relaxed">
                    <span className="font-black uppercase block mb-0.5">Mode Pratinjau Lembar Resmi</span>
                    Halaman ini bersifat <span className="font-extrabold">Read-Only</span>. Seluruh catatan evaluasi moral, etika medis, serta kedisiplinan stase klinis diisi dan diverifikasi penuh secara langsung oleh Konsulen Penanggung Jawab stase Anda.
                </div>
            </div>

            {/* ── Toolbar Pencarian ─────────────────────────────────── */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm mb-6">
                <div className="flex gap-3 items-center">
                    <div className="relative flex-1">
                        <Filter className="absolute left-4 top-3.5 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Saring berdasarkan uraian catatan perilaku klinis profesional..."
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={fetchStudentSoftSkills}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 hover:border-blue-300 transition-all"
                        title="Refresh"
                    >
                        <RefreshCcw size={15} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* ── Tabel Logbook ─────────────────────────────────────── */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-none">
                        <thead className="bg-slate-50/70 text-slate-400 text-[10px] font-black uppercase border-b border-slate-100 tracking-wider">
                            <tr>
                                <th className="p-5 w-16">NO</th>
                                <th className="p-5 w-48">TANGGAL EVALUASI</th>
                                <th className="p-5">URAIAN CATATAN EVALUASI PERILAKU PROFESIONAL</th>
                                <th className="p-5 w-40 text-center">STATUS SAH</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/70 text-xs font-medium text-slate-700">
                            {filteredSoftSkills.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-16 text-center text-slate-400 font-bold uppercase tracking-wider">
                                        <Inbox size={28} className="mx-auto mb-2 opacity-50" />
                                        Belum ada rekam catatan soft skill dari konsulen
                                    </td>
                                </tr>
                            ) : (
                                filteredSoftSkills.map((s, idx) => (
                                    <motion.tr
                                        key={s.id}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-slate-50/30 transition-all"
                                    >
                                        <td className="p-5 font-bold text-slate-400">{idx + 1}</td>
                                        <td className="p-5 font-bold text-slate-800 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-slate-400" />
                                                {formatTanggal(s.tanggal)}
                                            </div>
                                        </td>
                                        <td className="p-5 text-slate-600 leading-relaxed whitespace-pre-line text-justify font-bold uppercase tracking-tight">
                                            {s.keterangan}
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-[9px] font-black border tracking-widest bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm">
                                                <ShieldCheck size={12} /> VERIFIED
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer tabel */}
                {filteredSoftSkills.length > 0 && (
                    <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Menampilkan {filteredSoftSkills.length} dari {softSkills.length} catatan
                        </span>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-[10px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1"
                            >
                                <X size={10} /> Hapus Filter
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ── Cetak Modal ──────────────────────────────────────── */}
            {showCetakModal && (
                <CetakModal
                    softSkills={softSkills}
                    cases={cases}
                    onClose={() => setShowCetakModal(false)}
                />
            )}
        </div>
    );
}