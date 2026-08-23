import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    ChevronUp, ChevronDown, Check, RefreshCcw,
    Filter, Inbox, Loader2, Award, Calendar,
    UserCheck, Printer, Download, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Import PDF utility Terpisah Hasil Revisi ───────────────────────
import { cetakAbsensiIlmiahPDF } from './useCetakAbsensiIlmiah';
import { cetakFormNilaiIlmiahPDF } from './useCetakFormNilaiIlmiah';
import { cetakKegiatanIlmiahPDF } from './useCetakKegiatanIlmiah'; // Mempertahankan utilitas logbook rekap lama Anda

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

const CetakModal = ({ activities, dpjpKonsulen, onClose }) => {
    const [tanggalDari,   setTanggalDari]   = useState('');
    const [tanggalSampai, setTanggalSampai] = useState('');
    const [loading,       setLoading]       = useState(false);

    const userRaw = localStorage.getItem('user');
    const user    = userRaw ? JSON.parse(userRaw) : {};
    
    const namaKonsulen = dpjpKonsulen || '—';

    const filteredData = activities.filter(a => {
        const tgl = new Date(a.tanggal);
        if (tanggalDari   && tgl < new Date(tanggalDari))                 return false;
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
        if (filteredData.length === 0) {
            Swal.fire('Tidak Ada Data', 'Tidak ada catatan kegiatan ilmiah pada rentang tanggal yang dipilih.', 'info');
            return;
        }

        setLoading(true);
        try {
            await cetakKegiatanIlmiahPDF({
                activities:   filteredData,
                resident: {
                    name:       user.name,
                    identifier: user.identifier,
                    department: user.department,
                    batch:      user.batch,
                },
                konsulen: { name: namaKonsulen, identifier: '—' },
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
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                                Ekspor Dokumen
                            </div>
                            <div className="text-lg font-black uppercase flex items-center gap-2">
                                <Printer size={18} /> Cetak Logbook Kegiatan Ilmiah
                            </div>
                            <div className="text-xs opacity-70 mt-1">
                                Semua catatan kegiatan dalam rentang tanggal akan dicetak
                            </div>
                        </div>
                        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity mt-1">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body Modal */}
                    <div className="p-6 space-y-5">

                        {/* Info Residen */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-1">
                            <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">
                                Informasi Residen
                            </div>
                            <div className="text-sm font-black text-[#003178]">{user.name || '—'}</div>
                            <div className="text-xs text-slate-500">
                                {user.identifier || '—'} · {user.department || 'Anestesiologi dan Terapi Intensif'}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 pt-0.5">
                                <span className="text-[9px] font-black text-slate-400 uppercase">
                                    Konsulen / DPJP Pembimbing:
                                </span>
                                <span className="font-bold text-[#003178]">{namaKonsulen}</span>
                            </div>
                            <div className="text-[9px] text-slate-400 italic pt-0.5">
                                * Nama konsulen di atas adalah DPJP penanggung jawab residen,
                                bukan moderator kegiatan ilmiah.
                            </div>
                        </div>

                        {/* Filter Tanggal */}
                        <div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                Rentang Tanggal Cetak
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                                        Dari Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={tanggalDari}
                                        onChange={e => setTanggalDari(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                                        Sampai Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={tanggalSampai}
                                        onChange={e => setTanggalSampai(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview jumlah data */}
                        {tanggalDari && tanggalSampai && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="overflow-hidden"
                            >
                                <div className={`rounded-2xl p-4 border flex items-center gap-3 ${
                                    filteredData.length > 0
                                        ? 'bg-emerald-50 border-emerald-100'
                                        : 'bg-red-50 border-red-100'
                                }`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg ${
                                        filteredData.length > 0
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : 'bg-red-100 text-red-400'
                                    }`}>
                                        {filteredData.length}
                                    </div>
                                    <div>
                                        <div className={`text-xs font-black ${
                                            filteredData.length > 0 ? 'text-emerald-700' : 'text-red-500'
                                        }`}>
                                            {filteredData.length > 0
                                                ? `${filteredData.length} kegiatan ilmiah siap dicetak`
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
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                Format Output PDF
                            </div>
                            {[
                                'Format A4 Portrait — dokumen resmi institusi',
                                'Halaman 1: Kop FK UNRI + identitas residen + rekapitulasi + QR TTD',
                                'QR kiri: Residen · QR kanan: Konsulen / DPJP Pembimbing Residen',
                                'Halaman 2+: Tabel detail kegiatan ilmiah',
                                'Kolom tabel: Tanggal, Kegiatan, Moderator/PJ Kegiatan, Konsulen/DPJP, Status',
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
                                    : <><Download size={14} /> Cetak &amp; Unduh PDF</>
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

export default function MahasiswaKegiatanIlmiah() {
    const [activities,     setActivities]     = useState([]);
    const [formOpen,       setFormOpen]       = useState(true);
    const [loading,        setLoading]        = useState(false);
    const [isPageLoading,  setIsPageLoading]  = useState(true);
    const [showCetakModal, setShowCetakModal] = useState(false);
    const [printLoadingId, setPrintLoadingId] = useState(null); // State Baru Penjejak Loader Cetak Individual

    // dpjpKonsulen = DPJP penanggung jawab residen
    const [dpjpKonsulen, setDpjpKonsulen] = useState('—');

    const [formData, setFormData] = useState({
        tanggal:          new Date().toISOString().split('T')[0],
        kegiatan_ilmiah:  '',
        penanggung_jawab: '',
    });

    const fetchActivities = useCallback(async () => {
        try {
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

            const res = await axios.get('https://api.sigmaeducation.id/api/mahasiswa/academic-activities', { headers });
            setActivities(Array.isArray(res.data) ? res.data : []);

            let resolvedDpjp = '—';

            try {
                const konsulenRes = await axios.get('https://api.sigmaeducation.id/api/mahasiswa/konsulen', { headers });
                if (konsulenRes.data?.konsulen_name) {
                    resolvedDpjp = konsulenRes.data.konsulen_name;
                }
            } catch {
                try {
                    const kasusRes = await axios.get('https://api.sigmaeducation.id/api/mahasiswa/riwayat', { headers });
                    const kasusArr = kasusRes.data?.data || kasusRes.data || [];
                    const dpjpDariKasus = kasusArr.find(c => c.dpjp_name)?.dpjp_name;
                    if (dpjpDariKasus) resolvedDpjp = dpjpDariKasus;
                } catch {
                    // Tidak fatal
                }
            }

            setDpjpKonsulen(resolvedDpjp);

        } catch {
            setActivities([]);
        } finally {
            setIsPageLoading(false);
        }
    }, []);

    useEffect(() => {
        const initData = async () => {
            setIsPageLoading(true);
            await fetchActivities();
            setIsPageLoading(false);
        };
        initData();
    }, [fetchActivities]);

    const handleSubmit = async () => {
        if (!formData.tanggal || !formData.kegiatan_ilmiah || !formData.penanggung_jawab) {
            return Swal.fire('Data Tidak Lengkap', 'Silakan isi semua kolom yang tersedia sesuai lembar logbook.', 'warning');
        }

        setLoading(true);
        try {
            await axios.post('https://api.sigmaeducation.id/api/mahasiswa/academic-activities', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            Swal.fire('Berhasil', 'Kegiatan ilmiah telah dicatat ke logbook.', 'success');
            setFormData({
                tanggal:          new Date().toISOString().split('T')[0],
                kegiatan_ilmiah:  '',
                penanggung_jawab: '',
            });
            fetchActivities();
        } catch {
            Swal.fire('Error', 'Gagal menyimpan data ke database server.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ─── HANDLER AKSI CETAK LEMBAR TERPISAH INDIVIDUAL SESUAI ASLI WORD ───
    const handleTriggerCetakAbsen = async (activityItem) => {
        setPrintLoadingId(`absen-${activityItem.id}`);
        try {
            await cetakAbsensiIlmiahPDF({
                activity: activityItem,
                resident: { name: user.name, identifier: user.identifier }
            });
        } catch (err) {
            Swal.fire("Gagal Cetak", "Terjadi kesalahan kueri cetak absensi.", "error");
        } finally {
            setPrintLoadingId(null);
        }
    };

    const handleTriggerCetakKertasNilai = async (activityItem) => {
        setPrintLoadingId(`nilai-${activityItem.id}`);
        try {
            await cetakFormNilaiIlmiahPDF({
                activity: activityItem,
                resident: { name: user.name, identifier: user.identifier }
            });
        } catch (err) {
            Swal.fire("Gagal Cetak", "Terjadi kesalahan kueri cetak kertas nilai.", "error");
        } finally {
            setPrintLoadingId(null);
        }
    };

    if (isPageLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Lembar Kegiatan Ilmiah...</p>
        </div>
    );

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="p-6 bg-[#F8FAFC] min-h-screen font-['Inter']">

            {/* ── Header ───────────────────────────────────────────── */}
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase font-['Manrope']">
                        <Award className="text-blue-600" size={24} /> Kegiatan Ilmiah
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tight">
                        Logbook Kegiatan Ilmiah Residen Anestesiologi
                    </p>
                </div>

                {/* Tombol Cetak Rekap */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCetakModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#003178] hover:bg-[#1a4db5] text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 whitespace-nowrap"
                >
                    <Printer size={14} />
                    Cetak Rekap Logbook
                    {activities.length > 0 && (
                        <span className="bg-white/20 text-white text-[9px] font-black rounded-full px-2 py-0.5">
                            {activities.length} catatan
                        </span>
                    )}
                </motion.button>
            </div>

            {/* Kartu Statistik Ringkas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-6 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                    <div className="text-2xl font-black text-slate-800">{activities.length}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Total Kegiatan</div>
                </div>
                <div className="p-6 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                    <div className="text-2xl font-black text-emerald-600">{activities.filter(a => a.status === 'verified').length}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Disetujui / Paraf Dosen</div>
                </div>
                <div className="p-6 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                    <div className="text-2xl font-black text-amber-600">{activities.filter(a => a.status === 'pending').length}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Menunggu Review</div>
                </div>
            </div>

            {/* Form Input Logbook */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 mb-8 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="flex items-center gap-2 font-black text-slate-800 uppercase text-xs tracking-wider font-['Manrope']">
                        <Award size={18} className="text-[#003178]" /> Entri Kegiatan Ilmiah
                    </h2>
                    <button type="button" onClick={() => setFormOpen(!formOpen)} className="text-slate-400 hover:text-slate-600">
                        {formOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>

                <AnimatePresence>
                    {formOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Tanggal Kegiatan</label>
                                    <input
                                        type="date"
                                        className="custom-input"
                                        value={formData.tanggal}
                                        onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Jenis / Nama Kegiatan Ilmiah</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Presentasi Laporan Kasus / Journal Reading di Ruang Pertemuan Anestesi"
                                        className="custom-input"
                                        value={formData.kegiatan_ilmiah}
                                        onChange={e => setFormData({ ...formData, kegiatan_ilmiah: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-3 pt-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">Moderator / Dosen Penanggung Jawab Kegiatan</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Dr. dr. M. Yadi, Sp.An-TI, Subsp.An.R(K)"
                                        className="custom-input"
                                        value={formData.penanggung_jawab}
                                        onChange={e => setFormData({ ...formData, penanggung_jawab: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        tanggal:          new Date().toISOString().split('T')[0],
                                        kegiatan_ilmiah:  '',
                                        penanggung_jawab: '',
                                    })}
                                    className="px-6 py-2.5 text-xs font-black text-slate-400 uppercase tracking-widest"
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-[#003178] text-white px-8 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all"
                                >
                                    {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Check size={14} />} Simpan Logbook
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Tabel Riwayat */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#003178] flex items-center justify-center">
                            <Filter size={16} />
                        </div>
                        <h2 className="font-black text-slate-800 uppercase tracking-tight text-xs font-['Manrope']">
                            Lembar Logbook Kegiatan Ilmiah
                        </h2>
                    </div>
                    <button
                        onClick={fetchActivities}
                        className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:border-blue-300 transition-all"
                        title="Refresh data"
                    >
                        <RefreshCcw size={14} className={isPageLoading ? 'animate-spin' : ''} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/60 text-slate-400 text-[10px] font-black uppercase border-b tracking-wider">
                            <tr>
                                <th className="p-5 w-16">NO</th>
                                <th className="p-5 w-36">TGL</th>
                                <th className="p-5">KEGIATAN ILMIAH</th>
                                <th className="p-5 w-56">MODERATOR / PJ KEGIATAN</th>
                                <th className="p-5 w-32 text-center">STATUS</th>
                                <th className="p-5 w-48 text-center">CETAK DOKUMEN</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/70 text-xs">
                            {activities.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-slate-400 font-bold uppercase tracking-wider">
                                        <Inbox size={28} className="mx-auto mb-2 opacity-50" /> Belum ada rekam kegiatan ilmiah
                                    </td>
                                </tr>
                            ) : (
                                activities.map((a, idx) => (
                                    <motion.tr
                                        key={a.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-slate-50/30 transition-all group font-medium text-slate-700"
                                    >
                                        <td className="p-5 font-bold text-slate-400">{idx + 1}</td>
                                        <td className="p-5 font-bold text-slate-800 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-slate-400" /> {formatTanggal(a.tanggal)}
                                            </div>
                                        </td>
                                        <td className="p-5 uppercase font-bold tracking-tight text-[#003178]">
                                            {a.kegiatan_ilmiah}
                                        </td>
                                        <td className="p-5 font-bold text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <UserCheck size={14} className="text-slate-400" /> {a.penanggung_jawab}
                                            </div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-[9px] font-black border tracking-widest ${
                                                a.status === 'verified'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : a.status === 'rejected'
                                                    ? 'bg-red-50 text-red-600 border-red-100'
                                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                {a.status.toUpperCase()}
                                            </span>
                                        </td>

                                        {/* ── STRUKTUR BARU TOMBOL CETAK FORM FISIK INDIVIDUAL ── */}
                                        <td className="p-5 text-center">
                                            {a.status === 'verified' ? (
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        disabled={printLoadingId !== null}
                                                        onClick={() => handleTriggerCetakAbsen(a)}
                                                        className="px-2.5 py-1.5 rounded-lg text-[9px] font-black tracking-widest bg-blue-50 text-[#003178] border border-blue-200/50 hover:bg-blue-100 uppercase transition-all"
                                                        title="Cetak Daftar Hadir Acara"
                                                    >
                                                        {printLoadingId === `absen-${a.id}` ? <Loader2 size={11} className="animate-spin"/> : 'Absen'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={printLoadingId !== null}
                                                        onClick={() => handleTriggerCetakKertasNilai(a)}
                                                        className="px-2.5 py-1.5 rounded-lg text-[9px] font-black tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200/50 hover:bg-emerald-100 uppercase transition-all"
                                                        title="Cetak Kertas Nilai Rubrik Rahasia"
                                                    >
                                                        {printLoadingId === `nilai-${a.id}` ? <Loader2 size={11} className="animate-spin"/> : 'Nilai'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-400 italic">Menunggu Review Dosen</span>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Tabel */}
                {activities.length > 0 && (
                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Total {activities.length} catatan kegiatan ilmiah
                        </span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            {activities.filter(a => a.status === 'verified').length} Verified
                        </span>
                    </div>
                )}
            </div>

            {/* Cetak Modal */}
            {showCetakModal && (
                <CetakModal
                    activities={activities}
                    dpjpKonsulen={dpjpKonsulen}
                    onClose={() => setShowCetakModal(false)}
                />
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-input {
                    width: 100%;
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 16px;
                    padding: 12px 16px;
                    font-size: 12px;
                    font-weight: 700;
                    outline: none;
                    transition: all 0.2s;
                    color: #334155;
                }
                .custom-input:focus {
                    border-color: #003178;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(0, 49, 120, 0.04);
                }
            ` }} />
        </div>
    );
}