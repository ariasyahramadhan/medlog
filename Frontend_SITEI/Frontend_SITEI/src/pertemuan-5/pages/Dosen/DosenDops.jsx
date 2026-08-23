import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    ShieldAlert, FileText, Check, Trash2, RefreshCcw,
    Clipboard, Layers, Calendar, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Definisi Parameter DOPS ─────────────────────────────────────
//
// mode: 'cvc'      → kolom Dilakukan(1)/Tidak Dilakukan(0) + Keterangan per item
// mode: 'anestesi' → kolom Skor (0-maxScore) + Nilai per item
//
const PARAMETERS_DOPS = {
    cvc_femoral: {
        title:    "Insersi CVC Dewasa/Anak (Femoral / Jugular)",
        mode:     'cvc',      // Dilakukan / Tidak Dilakukan + Keterangan
        maxScore: 1,
        items: [
            "Penjelasan kepada Pasien tindakan yang akan dilakukan (jika pasien sadar)",
            "Pemasangan monitor tanda vital",
            "Persiapan alat dan posisi pasien",
            "Mencuci tangan dengan antiseptic",
            "Menggunakan gaun dan sarung tangan steril",
            "Melakukan asepsis dan antisepsis lapangan prosedur",
            "Sekali lagi memberitahu pasien prosedur akan dimulai",
            "Memberikan anestetika local",
            "Kanulasi secara tepat lokasi, tepat cara, tepat alat",
            "Konfirmasi posisi kanul telah tepat",
            "Fiksasi kanul",
            "Dressing",
            "Trouble Shooting (Fast flush test, kinking, deairing)",
        ],
    },
    anestesi_umum: {
        title:    "Ujian DOPS Anestesi Umum",
        mode:     'anestesi', // Skor 0-3 + Nilai
        maxScore: 3,
        items: [
            "Penjelasan rinci tentang 4 Aman (Obat, Alat/STATICS, Pasien, Anestesiologist)",
            "Penjelasan rinci 3 macam obat (Sedasi/Hipnotik, Muscle Relaksan, Analgesia) beserta dosis",
            "Kemampuan menjelaskan tentang S T A T I C S",
            "Kemampuan menjelaskan kriteria ekstubasi (Sadar penuh, reflek batuk/menelan baik, pernapasan adekuat)",
        ],
    },
    anestesi_regional: {
        title:    "Ujian DOPS Anestesi Regional (Spinal)",
        mode:     'anestesi', // Skor 0-2 + Nilai
        maxScore: 2,
        items: [
            "Memperkenalkan diri kepada pasien",
            "Informed Consent tindakan anestesi spinal",
            "Mempersiapkan alat untuk tindakan anestesi spinal",
            "Mempersiapkan alat untuk tindakan general anestesi jika tindakan spinal gagal",
            "Melakukan marker tempat penusukan jarum spinal di L4-L5 atau L3-L4 posisi duduk",
            "Melakukan tindakan aseptic dan antiseptic sebelum penusukan",
            "Melakukan penusukan jarum spinal sesuai marker (Pastikan LCS keluar)",
            "Masukkan obat anestesi dengan posisi tangan yang baik & lakukan aspirasi",
            "Jarum Spinal ditarik setelah obat masuk, tempat penyuntikan di plester",
            "Pasien ditidurkan kembali",
        ],
    },
    cvc_subclavia: {
        title:    "Insersi CVC Dewasa/Anak (Subclavia / HD Cath)",
        mode:     'cvc',      // Dilakukan / Tidak Dilakukan + Keterangan
        maxScore: 1,
        items: [
            "Penjelasan kepada Pasien tindakan yang akan dilakukan (jika pasien sadar)",
            "Pemasangan monitor tanda vital",
            "Persiapan alat dan posisi pasien",
            "Mencuci tangan dengan antiseptic",
            "Menggunakan gaun dan sarung tangan steril",
            "Melakukan asepsis dan antisepsis lapangan prosedur",
            "Sekali lagi memberitahu pasien prosedur akan dimulai",
            "Memberikan anestetika local (pada pasien sadar)",
            "Kanulasi secara tepat lokasi, tepat cara, tepat alat",
            "Konfirmasi posisi kanul telah tepat",
            "Fiksasi kanul",
            "Dressing",
            "Trouble Shooting (Fast flush test, kinking, deairing)",
        ],
    },
};

// ─── Helper label skor anestesi ──────────────────────────────────

const SKOR_LABEL_UMUM     = { 0: 'Tidak tahu / salah', 1: '1-2 jawaban benar', 2: '>2 jawaban benar', 3: 'Semua benar' };
const SKOR_LABEL_REGIONAL = { 0: 'Tidak dilakukan', 1: 'Dilakukan, kurang benar', 2: 'Dilakukan dengan benar' };

const getSkorLabel = (dopsType, val) => {
    if (dopsType === 'anestesi_umum')     return SKOR_LABEL_UMUM[val]     || val;
    if (dopsType === 'anestesi_regional') return SKOR_LABEL_REGIONAL[val] || val;
    return val;
};

// ─── Inisialisasi state form ─────────────────────────────────────

const buildInitialState = (dopsType) => {
    const param = PARAMETERS_DOPS[dopsType];
    const scores     = {};
    const keterangan = {};
    const nilai      = {};
    param.items.forEach((_, idx) => {
        scores[idx]     = 0;
        keterangan[idx] = '';
        nilai[idx]      = '';
    });
    return { scores, keterangan, nilai };
};

// ─────────────────────────────────────────────────────────────────
//  KOMPONEN UTAMA
// ─────────────────────────────────────────────────────────────────

export default function DosenDopsWrapper() {
    const [students,         setStudents]         = useState([]);
    const [history,          setHistory]          = useState([]);
    const [isPageLoading,    setIsPageLoading]    = useState(true);
    const [submitLoading,    setSubmitLoading]    = useState(false);
    const [selectedDopsType, setSelectedDopsType] = useState('cvc_femoral');

    const [formData, setFormData] = useState({
        user_id:           '',
        tanggal:           new Date().toISOString().split('T')[0],
        scores:            {},
        keterangan:        {},
        nilai:             {},
        status_kelayakan:  'TIDAK LAYAK',
    });

    // ── Reset skor/keterangan/nilai saat tipe DOPS berganti ──────
    useEffect(() => {
        const init = buildInitialState(selectedDopsType);
        setFormData(prev => ({
            ...prev,
            scores:           init.scores,
            keterangan:       init.keterangan,
            nilai:            init.nilai,
            status_kelayakan: 'TIDAK LAYAK',
        }));
    }, [selectedDopsType]);

    // ── Fetch data ───────────────────────────────────────────────
    const initData = useCallback(async () => {
        try {
            setIsPageLoading(true);
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
            const [resStudents, resHistory] = await Promise.all([
                axios.get('https://api.sigmaeducation.id/api/lecturer/my-students',  { headers }),
                axios.get('https://api.sigmaeducation.id/api/lecturer/dops-history', { headers }),
            ]);
            setStudents(Array.isArray(resStudents.data) ? resStudents.data : []);
            setHistory(Array.isArray(resHistory.data)   ? resHistory.data  : []);
        } catch (err) {
            console.error('Gagal memuat repositori ujian DOPS:', err);
        } finally {
            setIsPageLoading(false);
        }
    }, []);

    useEffect(() => { initData(); }, [initData]);

    // ── Handler skor ─────────────────────────────────────────────
    const handleScoreChange = (idx, val) => {
        setFormData(prev => ({
            ...prev,
            scores: { ...prev.scores, [idx]: parseInt(val) },
        }));
    };

    // ── Handler keterangan (CVC) ─────────────────────────────────
    const handleKeteranganChange = (idx, val) => {
        setFormData(prev => ({
            ...prev,
            keterangan: { ...prev.keterangan, [idx]: val },
        }));
    };

    // ── Handler nilai (Anestesi) ─────────────────────────────────
    const handleNilaiChange = (idx, val) => {
        setFormData(prev => ({
            ...prev,
            nilai: { ...prev.nilai, [idx]: val },
        }));
    };

    // ── Total skor ───────────────────────────────────────────────
    const hitungTotalSkor = () =>
        Object.values(formData.scores).reduce((acc, curr) => acc + (curr || 0), 0);

    // ── Submit ───────────────────────────────────────────────────
    const handleSubmitPenilaian = async () => {
        if (!formData.user_id || !formData.tanggal) {
            return Swal.fire('Data Belum Lengkap', 'Silakan tentukan dokter residen bimbingan dan tanggal ujian.', 'warning');
        }

        const mode = PARAMETERS_DOPS[selectedDopsType].mode;

        setSubmitLoading(true);
        try {
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
            const payload = {
                user_id:          formData.user_id,
                tanggal:          formData.tanggal,
                jenis_dops:       selectedDopsType,
                scores:           formData.scores,
                total_skor:       hitungTotalSkor(),
                status_kelayakan: formData.status_kelayakan,
                // Kirim keterangan hanya untuk CVC, nilai hanya untuk Anestesi
                keterangan: mode === 'cvc'      ? formData.keterangan : null,
                nilai:      mode === 'anestesi' ? formData.nilai      : null,
            };

            await axios.post('https://api.sigmaeducation.id/api/lecturer/store-dops', payload, { headers });
            Swal.fire('Evaluasi Disimpan', 'Lembar ujian DOPS berkas residen resmi diterbitkan.', 'success');

            // Reset form
            const init = buildInitialState(selectedDopsType);
            setFormData(prev => ({
                ...prev,
                user_id:          '',
                tanggal:          new Date().toISOString().split('T')[0],
                scores:           init.scores,
                keterangan:       init.keterangan,
                nilai:            init.nilai,
                status_kelayakan: 'TIDAK LAYAK',
            }));

            const resHistory = await axios.get('https://api.sigmaeducation.id/api/lecturer/dops-history', { headers });
            setHistory(Array.isArray(resHistory.data) ? resHistory.data : []);
        } catch (err) {
            Swal.fire('Error', 'Gagal menyimpan lembar penilaian kompetensi klinis.', 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    // ── Delete ───────────────────────────────────────────────────
    const handleDelete = (id, residenName) => {
        Swal.fire({
            title: 'Hapus Nilai Ujian DOPS?',
            text:  `Apakah Anda yakin ingin menghapus lembar evaluasi milik residen ${residenName}?`,
            icon:  'warning',
            showCancelButton:    true,
            confirmButtonColor:  '#EF4444',
            confirmButtonText:   'Ya, Hapus permanen',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
                    await axios.delete(`https://api.sigmaeducation.id/api/lecturer/delete-dops/${id}`, { headers });
                    Swal.fire('Terhapus', 'Berkas penilaian DOPS berhasil dibersihkan.', 'success');
                    initData();
                } catch {
                    Swal.fire('Gagal', 'Sistem gagal menghapus berkas.', 'error');
                }
            }
        });
    };

    // ── Shorthand ────────────────────────────────────────────────
    const currentParam = PARAMETERS_DOPS[selectedDopsType];
    const isCVC        = currentParam.mode === 'cvc';
    const isAnestesi   = currentParam.mode === 'anestesi';

    if (isPageLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 gap-2">
            <Loader2 className="animate-spin text-[#003178]" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Matriks DOPS...</p>
        </div>
    );

    return (
        <div className="p-6 bg-[#F8FAFC] min-h-screen font-['Manrope']">

            {/* ── Header ──────────────────────────────────────────── */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
                        <ShieldAlert className="text-blue-600" size={24} /> Penilaian Ujian DOPS Klinis Residen
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                        Formulir evaluasi ketrampilan prosedural klinis langsung dokter residen bimbingan aktif stase Anestesiologi.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={initData}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all outline-none"
                >
                    <RefreshCcw size={14} /> Refresh
                </button>
            </div>

            {/* ── Konfigurasi Input Utama ──────────────────────────── */}
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/60 p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">1. Pilih Dokter Residen</label>
                    <select
                        className="custom-dops-input"
                        value={formData.user_id}
                        onChange={e => setFormData({ ...formData, user_id: e.target.value })}
                    >
                        <option value="">-- Pilih Dokter Residen Bimbingan --</option>
                        {students.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.name.toUpperCase()} ({s.identifier || 'Tanpa NIM'})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">2. Pilih Jenis Instrumen DOPS</label>
                    <select
                        className="custom-dops-input"
                        value={selectedDopsType}
                        onChange={e => setSelectedDopsType(e.target.value)}
                    >
                        <option value="cvc_femoral">Insersi CVC Femoral / Jugular</option>
                        <option value="anestesi_umum">Penilaian Ujian Anestesi Umum</option>
                        <option value="anestesi_regional">Penilaian Ujian Anestesi Regional (Spinal)</option>
                        <option value="cvc_subclavia">Insersi CVC Subclavia / HD Cath</option>
                    </select>
                </div>
                <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">3. Tanggal Pelaksanaan Ujian</label>
                    <input
                        type="date"
                        className="custom-dops-input"
                        value={formData.tanggal}
                        onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
                    />
                </div>
            </div>

            {/* ── Badge info mode penilaian ────────────────────────── */}
            <div className={`mb-4 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${isCVC ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-violet-50 text-violet-700 border border-violet-100'}`}>
                <Clipboard size={13} />
                {isCVC
                    ? 'Mode CVC — Penilaian: Dilakukan / Tidak Dilakukan + Kolom Keterangan per item'
                    : `Mode Anestesi — Penilaian: Skor 0–${currentParam.maxScore} + Kolom Nilai per item`}
            </div>

            {/* ── Lembar Parameter Tilik ───────────────────────────── */}
            <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm mb-8 overflow-hidden">
                <div className="p-5 bg-slate-50/70 border-b border-slate-100 font-black text-[#003178] uppercase text-xs tracking-wider flex items-center gap-2">
                    <Clipboard size={16} /> Lembar Parameter Tilik: {currentParam.title}
                </div>

                {/* ── Header kolom tabel ── */}
                <div className={`grid gap-0 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50 ${isCVC ? 'grid-cols-[2rem_1fr_auto_auto_1fr]' : 'grid-cols-[2rem_1fr_auto_1fr]'}`}>
                    <div className="p-3 text-center">#</div>
                    <div className="p-3">Prosedur / Kegiatan</div>
                    {isCVC ? (
                        <>
                            <div className="p-3 text-center w-40">Dilakukan</div>
                            <div className="p-3 text-center w-40">Tidak Dilakukan</div>
                            <div className="p-3">Keterangan</div>
                        </>
                    ) : (
                        <>
                            <div className="p-3 text-center w-52">
                                Skor (0–{currentParam.maxScore})
                            </div>
                            <div className="p-3">Nilai</div>
                        </>
                    )}
                </div>

                <div className="divide-y divide-slate-100">
                    {currentParam.items.map((itemText, idx) => (
                        <motion.div
                            key={`${selectedDopsType}-${idx}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.02 }}
                            className={`grid gap-0 items-center hover:bg-slate-50/40 transition-colors ${isCVC ? 'grid-cols-[2rem_1fr_auto_auto_1fr]' : 'grid-cols-[2rem_1fr_auto_1fr]'}`}
                        >
                            {/* Nomor */}
                            <div className="p-4 text-center">
                                <span className="w-5 h-5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold flex items-center justify-center mx-auto">
                                    {idx + 1}
                                </span>
                            </div>

                            {/* Teks prosedur */}
                            <div className="p-4">
                                <p className="text-xs font-bold text-slate-700 leading-relaxed uppercase tracking-tight">
                                    {itemText}
                                </p>
                            </div>

                            {/* ── Mode CVC: Dilakukan / Tidak Dilakukan / Keterangan ── */}
                            {isCVC && (
                                <>
                                    {/* Dilakukan */}
                                    <div className="p-4 w-40 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => handleScoreChange(idx, 1)}
                                            className={`w-9 h-8 rounded-lg text-xs font-black transition-all outline-none border ${
                                                formData.scores[idx] === 1
                                                    ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                                                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
                                            }`}
                                        >
                                            ✓
                                        </button>
                                    </div>

                                    {/* Tidak Dilakukan */}
                                    <div className="p-4 w-40 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => handleScoreChange(idx, 0)}
                                            className={`w-9 h-8 rounded-lg text-xs font-black transition-all outline-none border ${
                                                formData.scores[idx] === 0
                                                    ? 'bg-red-500 text-white border-transparent shadow-sm'
                                                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                                            }`}
                                        >
                                            ✗
                                        </button>
                                    </div>

                                    {/* Keterangan */}
                                    <div className="p-3 pr-5">
                                        <input
                                            type="text"
                                            placeholder="Keterangan (opsional)..."
                                            value={formData.keterangan[idx] || ''}
                                            onChange={e => handleKeteranganChange(idx, e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all"
                                        />
                                    </div>
                                </>
                            )}

                            {/* ── Mode Anestesi: Skor tombol + Nilai input ── */}
                            {isAnestesi && (
                                <>
                                    {/* Skor tombol 0 s/d maxScore */}
                                    <div className="p-4 w-52">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {Array.from({ length: currentParam.maxScore + 1 }).map((_, val) => (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => handleScoreChange(idx, val)}
                                                    title={getSkorLabel(selectedDopsType, val)}
                                                    className={`min-w-[32px] h-8 px-2 text-xs font-black rounded-lg transition-all outline-none ${
                                                        formData.scores[idx] === val
                                                            ? 'bg-[#003178] text-white shadow-sm'
                                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200/70'
                                                    }`}
                                                >
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                        {/* Label keterangan skor yang dipilih */}
                                        <p className="text-[9px] text-slate-400 font-bold mt-1.5 leading-tight">
                                            {getSkorLabel(selectedDopsType, formData.scores[idx])}
                                        </p>
                                    </div>

                                    {/* Nilai */}
                                    <div className="p-3 pr-5">
                                        <input
                                            type="text"
                                            placeholder="Nilai / catatan penguji..."
                                            value={formData.nilai[idx] || ''}
                                            onChange={e => handleNilaiChange(idx, e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-violet-400 focus:bg-white transition-all"
                                        />
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* ── Footer submit ────────────────────────────────── */}
                <div className="p-6 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-6 text-xs font-bold">
                        <div>
                            <span className="text-[10px] font-black text-slate-400 block uppercase">Akumulasi Total Skor</span>
                            <span className="text-xl font-black text-[#003178]">
                                {hitungTotalSkor()} <span className="text-xs text-slate-400 font-medium">Poin</span>
                            </span>
                        </div>
                        <div className="border-l pl-6">
                            <span className="text-[10px] font-black text-slate-400 block uppercase">Pernyataan Kelayakan Klinis</span>
                            <div className="flex gap-2 mt-1">
                                {['LAYAK', 'TIDAK LAYAK'].map(status => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status_kelayakan: status })}
                                        className={`px-3 py-1 text-[9px] font-black tracking-wider rounded-md border transition-all ${
                                            formData.status_kelayakan === status
                                                ? status === 'LAYAK'
                                                    ? 'bg-emerald-600 text-white border-transparent'
                                                    : 'bg-red-600 text-white border-transparent'
                                                : 'bg-white text-slate-500 border-slate-200'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmitPenilaian}
                        disabled={submitLoading}
                        className="w-full sm:w-auto px-8 py-3 bg-[#003178] text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 border-none outline-none shadow-sm hover:bg-blue-800 transition-all disabled:opacity-50"
                    >
                        {submitLoading
                            ? <><RefreshCcw size={14} className="animate-spin" /> Menyimpan...</>
                            : <><Check size={14} /> Sahkan & Tanda Tangani DOPS</>
                        }
                    </button>
                </div>
            </div>

            {/* ── Tabel Riwayat ────────────────────────────────────── */}
            <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 font-black text-slate-800 uppercase text-xs tracking-wider flex items-center gap-2">
                    <Layers size={16} className="text-slate-400" /> Riwayat Arsip Pengesahan Nilai DOPS
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-none">
                        <thead className="bg-slate-50/70 text-slate-400 text-[10px] font-black uppercase border-b border-slate-100 tracking-wider">
                            <tr>
                                <th className="p-5">Tanggal</th>
                                <th className="p-5">Dokter Residen</th>
                                <th className="p-5">Instrumen Ujian DOPS</th>
                                <th className="p-5 text-center">Total Skor</th>
                                <th className="p-5 text-center">Keputusan</th>
                                <th className="p-5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/70 text-xs font-medium text-slate-700">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-16 text-center text-slate-400 font-bold uppercase tracking-wider">
                                        <FileText size={32} className="mx-auto mb-2 opacity-40" />
                                        Belum ada berkas pengesahan ujian DOPS yang tersimpan
                                    </td>
                                </tr>
                            ) : (
                                history.map(h => (
                                    <tr key={h.id} className="hover:bg-slate-50/40 transition-colors">
                                        <td className="p-5 font-bold text-slate-800 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(h.tanggal).toLocaleDateString('id-ID', {
                                                    day: '2-digit', month: 'long', year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-black text-slate-800 uppercase tracking-tight">{h.user?.name}</div>
                                            <div className="text-[10px] font-bold text-slate-400">NIM: {h.user?.identifier || '—'}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-black text-[#003178] uppercase text-[11px]">
                                                {PARAMETERS_DOPS[h.jenis_dops]?.title || h.jenis_dops}
                                            </div>
                                            <div className={`text-[9px] font-black mt-0.5 ${
                                                PARAMETERS_DOPS[h.jenis_dops]?.mode === 'cvc'
                                                    ? 'text-blue-500'
                                                    : 'text-violet-500'
                                            }`}>
                                                {PARAMETERS_DOPS[h.jenis_dops]?.mode === 'cvc' ? 'Mode CVC' : 'Mode Anestesi'}
                                            </div>
                                        </td>
                                        <td className="p-5 text-center font-extrabold text-slate-800">
                                            {h.total_skor} Poin
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`inline-flex items-center gap-1 px-4 py-1 rounded-full text-[9px] font-black border tracking-widest ${
                                                h.status_kelayakan === 'LAYAK'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-red-50 text-red-600 border-red-100'
                                            }`}>
                                                {h.status_kelayakan}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(h.id, h.user?.name)}
                                                title="Hapus Berkas Ujian"
                                                className="w-7 h-7 rounded-lg bg-slate-50 text-red-500 hover:bg-red-50 flex items-center justify-center mx-auto border border-slate-100 transition-all outline-none"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-dops-input { width: 100%; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 10px 14px; font-size: 12px; font-weight: 700; outline: none; transition: all 0.2s; color: #334155; }
                .custom-dops-input:focus { border-color: #003178; background: white; box-shadow: 0 0 0 4px rgba(0, 49, 120, 0.04); }
            ` }} />
        </div>
    );
}