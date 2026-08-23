import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
    ShieldAlert, CheckCircle2, XCircle, Loader2, Inbox, Calendar, 
    User, Search, RotateCcw, Award, UserCheck, Eye, Clipboard, 
    Users, Plus, Trash2, Edit3 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatTanggal = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function DosenKegiatanIlmiahWrapper() {
    const [pendingActivities, setPendingActivities] = useState([]);
    const [historyActivities, setHistoryActivities] = useState([]);
    const [myStudents, setMyStudents] = useState([]); // State baru penampung residen bimbingan
    const [isLoading, setIsLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    
    const [showAssessModal, setShowAssessModal] = useState(false);
    const [activeAssessItem, setActiveAssessItem] = useState(null);
    
    // State Form Sinkronisasi Tabel AcademicActivityScore & AcademicActivityAttendance
    const [assessmentForm, setAssessmentForm] = useState({
        tahap_semester: "Semester Ganjil 2025/2026",
        judul_resmi: "",
        persiapan_bahan: 80,
        persiapan_narsum: 80,
        makalah_judul: 80,
        makalah_isi: 80,
        makalah_pembahasan: 80,
        penampilan_cara: 80,
        penampilan_kuasa: 80,
        diskusi_teori: 80,
        diskusi_kemampuan: 80,
        nilai_akhir: 80,
        kesimpulan: "Lulus",
        attendances: [] 
    });
    const [selectedStudentToAbsen, setSelectedStudentToAbsen] = useState(""); // Nilai Dropdown Terpilih

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
            const [resPending, resHistory, resStudents] = await Promise.all([
                axios.get('https://api.sigmaeducation.id/api/lecturer/pending-academic-activities', { headers }),
                axios.get('https://api.sigmaeducation.id/api/lecturer/history-academic-activities', { headers }),
                axios.get('https://api.sigmaeducation.id/api/lecturer/my-mentorship-students', { headers }) // Ambil Anak Bimbingan
            ]);
            setPendingActivities(Array.isArray(resPending.data) ? resPending.data : []);
            setHistoryActivities(Array.isArray(resHistory.data) ? resHistory.data : []);
            setMyStudents(Array.isArray(resStudents.data) ? resStudents.data : []);
        } catch (err) {
            console.error("Gagal menyinkronkan repositori data ilmiah:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Hitung Otomatis Nilai Akhir Rubrik (9 Komponen Penilaian Rata-Rata)
    useEffect(() => {
        const f = assessmentForm;
        const totalPoin = f.persiapan_bahan + f.persiapan_narsum + f.makalah_judul + f.makalah_isi + 
                          f.makalah_pembahasan + f.penampilan_cara + f.penampilan_kuasa + f.diskusi_teori + f.diskusi_kemampuan;
        const hitungRata = Math.round(totalPoin / 9) || 0;
        
        setAssessmentForm(prev => ({
            ...prev,
            nilai_akhir: hitungRata,
            kesimpulan: hitungRata >= 70 ? "Lulus" : "Gagal"
        }));
    }, [
        assessmentForm.persiapan_bahan, assessmentForm.persiapan_narsum, assessmentForm.makalah_judul,
        assessmentForm.makalah_isi, assessmentForm.makalah_pembahasan, assessmentForm.penampilan_cara,
        assessmentForm.penampilan_kuasa, assessmentForm.diskusi_teori, assessmentForm.diskusi_kemampuan
    ]);

    const openAssessmentModal = (activity) => {
        setActiveAssessItem(activity);
        setAssessmentForm({
            tahap_semester: "Semester Ganjil 2025/2026",
            judul_resmi: activity.kegiatan_ilmiah || "",
            persiapan_bahan: 80, persiapan_narsum: 80,
            makalah_judul: 80, makalah_isi: 80, makalah_pembahasan: 80,
            penampilan_cara: 80, penampilan_kuasa: 80,
            diskusi_teori: 80, diskusi_kemampuan: 80,
            nilai_akhir: 80,
            kesimpulan: "Lulus",
            attendances: [] // Diinisialisasi kosong agar konsulen bisa memilih via dropdown mentorship
        });
        setSelectedStudentToAbsen("");
        setShowAssessModal(true);
    };

    const handleOpenEditModal = (activity) => {
        setActiveAssessItem(activity);
        setAssessmentForm({
            tahap_semester: activity.score?.tahap_semester || "Semester Ganjil 2025/2026",
            judul_resmi: activity.score?.judul_resmi || activity.kegiatan_ilmiah || "",
            persiapan_bahan: activity.score?.persiapan_bahan ?? 80,
            persiapan_narsum: activity.score?.persiapan_narsum ?? 80,
            makalah_judul: activity.score?.makalah_judul ?? 80,
            makalah_isi: activity.score?.makalah_isi ?? 80,
            makalah_pembahasan: activity.score?.makalah_pembahasan ?? 80,
            penampilan_cara: activity.score?.penampilan_cara ?? 80,
            penampilan_kuasa: activity.score?.penampilan_kuasa ?? 80,
            diskusi_teori: activity.score?.diskusi_teori ?? 80,
            diskusi_kemampuan: activity.score?.diskusi_kemampuan ?? 80,
            nilai_akhir: activity.score?.nilai_akhir ?? 80,
            kesimpulan: activity.score?.kesimpulan || "Lulus",
            attendances: Array.isArray(activity.attendances) 
                ? activity.attendances.map(att => ({ nama_peserta: att.nama_peserta, keterangan: att.keterangan || "Hadir" }))
                : []
        });
        setSelectedStudentToAbsen("");
        setShowAssessModal(true);
    };

    const submitAssessmentACC = async () => {
        setBtnLoading(true);
        try {
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
            const payload = { action: 'approve', ...assessmentForm };
            await axios.post(`https://api.sigmaeducation.id/api/lecturer/verify-academic-activity/${activeAssessItem.id}`, payload, { headers });
            Swal.fire("Berhasil ACC", "Kertas nilai rubrik relasional & daftar hadir absensi berhasil disahkan.", "success");
            setShowAssessModal(false);
            fetchData();
        } catch (err) {
            Swal.fire("Gagal", "Terjadi kesalahan kueri validasi database.", "error");
        } finally {
            setBtnLoading(false);
        }
    };

    const handleReject = (id, studentName) => {
        Swal.fire({
            title: "Tolak Logbook Ilmiah?",
            text: `Apakah Anda yakin ingin menolak berkas presentasi ilmiah milik ${studentName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Tolak',
            confirmButtonColor: '#EF4444'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
                    await axios.post(`https://api.sigmaeducation.id/api/lecturer/verify-academic-activity/${id}`, { action: 'reject' }, { headers });
                    Swal.fire("Ditolak", "Berkas telah ditandai ditolak.", "success");
                    fetchData();
                } catch (err) { console.error(err); }
            }
        });
    };

    // Fungsi Menambah Absen via Seleksi Dropdown Mentorship (Mencegah Duplikasi)
    const addAttendeeFromMentorship = () => {
        if (!selectedStudentToAbsen) return;
        
        // Cek apakah nama tersebut sudah dimasukkan ke tabel absensi sebelumnya
        const isExist = assessmentForm.attendances.some(att => att.nama_peserta === selectedStudentToAbsen);
        if (isExist) {
            Swal.fire("Sudah Ada", "Residen bimbingan tersebut sudah masuk daftar hadir.", "warning");
            return;
        }

        setAssessmentForm(prev => ({
            ...prev,
            attendances: [...prev.attendances, { nama_peserta: selectedStudentToAbsen, keterangan: "Hadir" }]
        }));
    };

    const removeAttendee = (idx) => {
        setAssessmentForm(prev => ({
            ...prev,
            attendances: prev.attendances.filter((_, i) => i !== idx)
        }));
    };

    const getGradeBadge = (score) => {
        if (score >= 85) return { text: "A (Baik Sekali)", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
        if (score >= 75) return { text: "B (Baik)", color: "text-blue-600 bg-blue-50 border-blue-100" };
        if (score >= 70) return { text: "C (Cukup)", color: "text-amber-600 bg-amber-50 border-amber-100" };
        if (score >= 50) return { text: "D (Kurang)", color: "text-orange-600 bg-orange-50 border-orange-100" };
        return { text: "E (Kurang Sekali)", color: "text-red-600 bg-red-50 border-red-100" };
    };

    // Logika Filter Pencarian Global Dashboard
    const filteredPending = pendingActivities.filter(a => 
        a.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.kegiatan_ilmiah?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredHistory = historyActivities.filter(a => 
        a.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.score?.judul_resmi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.kegiatan_ilmiah?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
            <Loader2 className="animate-spin text-[#003178]" size={40} />
            <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Sinkronisasi Data Ilmiah...</p>
        </div>
    );

    return (
        <div className="p-6 bg-[#F8FAFC] min-h-screen font-['Manrope']">
            {/* Header Content */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
                        <ShieldAlert className="text-blue-600" size={22} /> Validasi & Kertas Nilai Ilmiah Residen
                    </h1>
                </div>
                <button onClick={fetchData} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all outline-none">
                    <RotateCcw size={14} /> Sinkronisasi Ulang
                </button>
            </div>

            {/* Pencarian Global */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm mb-8">
                <input type="text" placeholder="Cari nama residen atau judul kegiatan ilmiah..." className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            {/* ANTRIAN EVALUASI LOGBOOK PENDING */}
            <div className="mb-8">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4 px-1">⚠️ Butuh Evaluasi Nilai ({filteredPending.length})</h2>
                <div className="space-y-4">
                    {filteredPending.map((a) => (
                        <div key={a.id} className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden hover:border-blue-300 transition-colors">
                            <div className="p-4 bg-slate-50/40 border-b border-slate-100 flex justify-between items-center">
                                <span className="font-black text-slate-800 text-xs uppercase">{a.user?.name ? a.user.name.toUpperCase() : '—'}</span>
                                <span className="text-[10px] font-bold text-slate-400">{formatTanggal(a.tanggal)}</span>
                            </div>
                            <div className="p-6">
                                <p className="text-xs font-black text-[#003178] uppercase">{a.kegiatan_ilmiah}</p>
                            </div>
                            <div className="p-4 bg-slate-50/20 border-t border-slate-100 flex justify-end gap-2">
                                <button type="button" onClick={() => handleReject(a.id, a.user?.name)} className="px-5 py-2 rounded-xl text-[10px] font-black text-red-600 hover:bg-red-50 transition-colors">Tolak</button>
                                <button type="button" onClick={() => openAssessmentModal(a)} className="px-6 py-2 rounded-xl text-[10px] font-black bg-[#003178] text-white hover:bg-blue-800 transition-colors">Input Nilai & ACC</button>
                            </div>
                        </div>
                    ))}
                    {filteredPending.length === 0 && (
                        <div className="bg-white rounded-3xl border border-slate-200/60 p-12 flex flex-col items-center justify-center gap-2 text-slate-400 shadow-sm">
                            <Inbox size={28} className="text-slate-300" />
                            <p className="text-[11px] font-black tracking-widest uppercase">Tidak ada antrean kegiatan ilmiah</p>
                        </div>
                    )}
                </div>
            </div>

            {/* TABEL RIWAYAT ARSIP EVALUASI HISTORIS LAMPAU */}
            <div>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4 px-1">📋 Riwayat Evaluasi Lampau ({filteredHistory.length})</h2>
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-none">
                            <thead className="bg-slate-50/70 text-slate-400 text-[10px] font-black uppercase tracking-wider border-b">
                                <tr>
                                    <th className="p-5">Tanggal</th>
                                    <th className="p-5">Residen</th>
                                    <th className="p-5">Agenda Ilmiah</th>
                                    <th className="p-5 text-center">Nilai Akhir</th>
                                    <th className="p-5 text-center">Kesimpulan</th>
                                    <th className="p-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-xs font-medium text-slate-700">
                                {filteredHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-slate-400 font-bold uppercase tracking-wider">
                                            Belum ada berkas pengesahan logbook ilmiah lampau
                                        </td>
                                    </tr>
                                ) : (
                                    filteredHistory.map((s) => (
                                        <tr key={s.id} className="hover:bg-slate-50/40 transition-colors">
                                            <td className="p-5 font-bold">{formatTanggal(s.tanggal)}</td>
                                            <td className="p-5 uppercase font-black">{s.user?.name || '—'}</td>
                                            <td className="p-5 font-black text-[#003178] uppercase">{s.score?.judul_resmi || s.kegiatan_ilmiah}</td>
                                            <td className="p-5 text-center font-extrabold">
                                                {s.score?.nilai_akhir ? (
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span>{s.score.nilai_akhir} Poin</span>
                                                        <span className={`block text-[8px] font-black border px-1.5 py-0.5 rounded mt-0.5 ${getGradeBadge(s.score.nilai_akhir).color}`}>{getGradeBadge(s.score.nilai_akhir).text}</span>
                                                    </div>
                                                ) : "—"}
                                            </td>
                                            <td className="p-5 text-center">
                                                <span className={`px-4 py-1 rounded-full text-[9px] font-black border tracking-widest ${s.score?.kesimpulan === 'Lulus' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{s.score?.kesimpulan || s.status.toUpperCase()}</span>
                                            </td>
                                            <td className="p-5 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button type="button" onClick={() => { setSelectedActivity(s); setShowDetailModal(true); }} className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-blue-50 transition-all outline-none" title="Pratinjau Hasil">
                                                        <Eye size={13} />
                                                    </button>
                                                    {s.status === 'verified' && (
                                                        <button type="button" onClick={() => handleOpenEditModal(s)} className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 hover:bg-amber-100 transition-all outline-none" title="Edit Hasil Evaluasi">
                                                            <Edit3 size={13} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL PENILAIAN RUBRIK & SELEKSI ABSENSI DROPDOWN BIMBINGAN */}
            <AnimatePresence>
                {showAssessModal && activeAssessItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border text-xs">
                            <div className="bg-[#003178] p-6 text-white sticky top-0 z-10 flex justify-between items-center">
                                <div>
                                    <span className="text-[9px] font-black uppercase opacity-60 block mb-0.5">Form Kertas Nilai Rubrik Relasional & Absensi</span>
                                    <h2 className="text-base font-black uppercase tracking-tight">{activeAssessItem.user?.name}</h2>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] font-black block opacity-60 uppercase mb-0.5">Nilai Akhir Rata-Rata</span>
                                    <span className="text-2xl font-black">{assessmentForm.nilai_akhir} / 100</span>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border">
                                    <div><label className="text-[9px] font-black text-slate-400 block uppercase mb-1">Tahap / Semester</label><input type="text" className="w-full bg-white border p-2.5 rounded-xl font-bold" value={assessmentForm.tahap_semester} onChange={e => setAssessmentForm({...assessmentForm, tahap_semester: e.target.value})} /></div>
                                    <div className="md:col-span-2"><label className="text-[9px] font-black text-slate-400 block uppercase mb-1">Judul Resmi Makalah Ilmiah (`judul_resmi`)</label><input type="text" className="w-full bg-white border p-2.5 rounded-xl font-bold uppercase" value={assessmentForm.judul_resmi} onChange={e => setAssessmentForm({...assessmentForm, judul_resmi: e.target.value})} /></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border rounded-2xl space-y-3 shadow-sm">
                                        <span className="text-[10px] font-black block text-slate-800 uppercase tracking-tight">I. Kategori Persiapan</span>
                                        <div><label className="text-slate-500 block mb-1">Bahan Presentasi (0 - 100)</label><input type="number" className="w-full bg-slate-50 p-2 border rounded-lg font-bold" value={assessmentForm.persiapan_bahan} onChange={e => setAssessmentForm({...assessmentForm, persiapan_bahan: parseInt(e.target.value) || 0})} /></div>
                                        <div><label className="text-slate-500 block mb-1">Kehadiran Narasumber (0 - 100)</label><input type="number" className="w-full bg-slate-50 p-2 border rounded-lg font-bold" value={assessmentForm.persiapan_narsum} onChange={e => setAssessmentForm({...assessmentForm, persiapan_narsum: parseInt(e.target.value) || 0})} /></div>
                                    </div>
                                    <div className="p-4 border rounded-2xl space-y-3 shadow-sm">
                                        <span className="text-[10px] font-black block text-slate-800 uppercase tracking-tight">II. Kategori Makalah</span>
                                        <div><label className="text-slate-500 block mb-1">Kesesuaian Judul</label><input type="number" className="w-full bg-slate-50 p-2 border rounded-lg font-bold" value={assessmentForm.makalah_judul} onChange={e => setAssessmentForm({...assessmentForm, makalah_judul: parseInt(e.target.value) || 0})} /></div>
                                        <div><label className="text-slate-500 block mb-1">Isi Kedalaman Makalah</label><input type="number" className="w-full bg-slate-50 p-2 border rounded-lg font-bold" value={assessmentForm.makalah_isi} onChange={e => setAssessmentForm({...assessmentForm, makalah_isi: parseInt(e.target.value) || 0})} /></div>
                                        <div><label className="text-slate-500 block mb-1">Pembahasan Kasus / Referensi</label><input type="number" className="w-full bg-slate-50 p-2 border rounded-lg font-bold" value={assessmentForm.makalah_pembahasan} onChange={e => setAssessmentForm({...assessmentForm, makalah_pembahasan: parseInt(e.target.value) || 0})} /></div>
                                    </div>
                                    <div className="p-4 border rounded-2xl space-y-3 shadow-sm">
                                        <span className="text-[10px] font-black block text-slate-800 uppercase tracking-tight">III. Kategori Penampilan</span>
                                        <div><label className="text-slate-500 block mb-1">Cara Penyampaian / Presentasi</label><input type="number" className="w-full bg-slate-50 p-2 border rounded-lg font-bold" value={assessmentForm.penampilan_cara} onChange={e => setAssessmentForm({...assessmentForm, penampilan_cara: parseInt(e.target.value) || 0})} /></div>
                                        <div><label className="text-slate-500 block mb-1">Penguasaan Materi Kasus Klinis</label><input type="number" className="w-full bg-slate-50 p-2 border rounded-lg font-bold" value={assessmentForm.penampilan_kuasa} onChange={e => setAssessmentForm({...assessmentForm, penampilan_kuasa: parseInt(e.target.value) || 0})} /></div>
                                    </div>
                                    <div className="p-4 border rounded-2xl space-y-3 shadow-sm">
                                        <span className="text-[10px] font-black block text-slate-800 uppercase tracking-tight">IV. Kategori Diskusi</span>
                                        <div><label className="text-slate-500 block mb-1">Penguasaan Landasan Teori</label><input type="number" className="w-full bg-slate-50 p-2 border rounded-lg font-bold" value={assessmentForm.diskusi_teori} onChange={e => setAssessmentForm({...assessmentForm, diskusi_teori: parseInt(e.target.value) || 0})} /></div>
                                        <div><label className="text-slate-500 block mb-1">Kemampuan Berdiskusi / Jawab</label><input type="number" className="w-full bg-slate-50 p-2 border rounded-lg font-bold" value={assessmentForm.diskusi_kemampuan} onChange={e => setAssessmentForm({...assessmentForm, diskusi_kemampuan: parseInt(e.target.value) || 0})} /></div>
                                    </div>
                                </div>

                                {}
                                <div className="border-t pt-5">
                                    <div className="font-black text-[#003178] mb-3 uppercase flex items-center gap-1.5"><Users size={14}/> Tabel Absensi Daftar Hadir</div>
                                    <div className="flex gap-2 mb-4">
                                        <select 
                                            className="flex-1 bg-slate-50 border p-2.5 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                                            value={selectedStudentToAbsen}
                                            onChange={e => setSelectedStudentToAbsen(e.target.value)}
                                        >
                                            <option value="">-- Pilih Dokter Residen Bimbingan Anda yang Hadir --</option>
                                            {myStudents.map(student => (
                                                <option key={student.id} value={student.name}>
                                                    {student.name.toUpperCase()} (NIM: {student.identifier})
                                                </option>
                                            ))}
                                        </select>
                                        <button type="button" onClick={addAttendeeFromMentorship} className="px-5 bg-[#003178] text-white rounded-xl font-black flex items-center gap-1 transition-colors hover:bg-blue-800">
                                            <Plus size={14}/> Tambah Absen
                                        </button>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-3 border max-h-40 overflow-y-auto font-bold text-slate-700 divide-y divide-slate-200/50">
                                        {assessmentForm.attendances.map((att, idx) => (
                                            <div key={idx} className="py-2 flex justify-between items-center">
                                                <span>{idx + 1}. {att.nama_peserta.toUpperCase()}</span>
                                                <button type="button" onClick={() => removeAttendee(idx)} className="text-red-500 transition-colors hover:text-red-700"><Trash2 size={13}/></button>
                                            </div>
                                        ))}
                                        {assessmentForm.attendances.length === 0 && (
                                            <div className="text-center py-4 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                                Belum ada peserta bimbingan yang dimasukkan ke daftar hadir
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t flex justify-between items-center sticky bottom-0 z-10">
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-slate-400 uppercase">Kesimpulan Evaluasi:</span>
                                    <span className={`px-4 py-1 border rounded-full font-black text-[10px] tracking-widest uppercase ${assessmentForm.kesimpulan === 'Lulus' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{assessmentForm.kesimpulan}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setShowAssessModal(false)} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-black uppercase text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
                                    <button type="button" disabled={btnLoading} onClick={submitAssessmentACC} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-black uppercase flex items-center gap-1 transition-colors hover:bg-emerald-700">{btnLoading ? <Loader2 size={13} className="animate-spin" /> : null} Validasi & ACC</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL PRATINJAU ARSIP EVALUASI */}
            <AnimatePresence>
                {showDetailModal && selectedActivity && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setShowDetailModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden text-xs" onClick={e => e.stopPropagation()}>
                            <div className="bg-[#003178] p-6 text-white">
                                <span className="text-[9px] font-black uppercase opacity-60 block mb-0.5">Arsip Lembar Hasil Ujian Ilmiah Relasional</span>
                                <h2 className="text-base font-black uppercase">{selectedActivity.score?.judul_resmi || selectedActivity.kegiatan_ilmiah}</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border">
                                    <div className="flex justify-between items-center"><span>Nama Dokter Residen</span><span className="font-black uppercase text-slate-800">{selectedActivity.user?.name || '—'}</span></div>
                                    <div className="flex justify-between items-center"><span>Tahap Semester Terdaftar</span><span className="font-bold text-slate-700">{selectedActivity.score?.tahap_semester || "—"}</span></div>
                                </div>

                                {selectedActivity.score?.nilai_akhir && (
                                    <div className="p-4 border rounded-2xl shadow-sm space-y-2">
                                        <div className="flex justify-between items-center"><span>Akumulasi Nilai Akhir</span><span className="text-sm font-black text-[#003178]">{selectedActivity.score.nilai_akhir} Poin</span></div>
                                        <div className="flex justify-between items-center"><span>Predikat Kategori Matriks</span><span className={`px-2 py-0.5 rounded text-[8px] font-black border ${getGradeBadge(selectedActivity.score.nilai_akhir).color}`}>{getGradeBadge(selectedActivity.score.nilai_akhir).text}</span></div>
                                    </div>
                                )}

                                {selectedActivity.attendances && selectedActivity.attendances.length > 0 && (
                                    <div className="p-4 border rounded-2xl shadow-sm">
                                        <div className="text-[9px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1"><Users size={12}/> Daftar Hadir Absensi ({selectedActivity.attendances.length} Orang)</div>
                                        <div className="max-h-28 overflow-y-auto divide-y font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                                            {selectedActivity.attendances.map((att, i) => (
                                                <div key={i} className="py-1.5 uppercase text-[11px] flex justify-between items-center">
                                                    <span>{i + 1}. {att.nama_peserta}</span>
                                                    <span className="text-[9px] text-slate-400 font-normal italic">({att.keterangan || 'Hadir'})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-3 border-t flex justify-between items-center">
                                    <span className={`text-[10px] font-black tracking-widest uppercase ${selectedActivity.score?.kesimpulan === 'Lulus' ? 'text-emerald-600' : 'text-red-500'}`}>{selectedActivity.score?.kesimpulan || selectedActivity.status}</span>
                                    <button type="button" onClick={() => setShowDetailModal(false)} className="px-5 py-2 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-colors">Tutup</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}