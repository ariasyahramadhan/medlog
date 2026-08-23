import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { PlusCircle, FilePlus, ChevronUp, ChevronDown, Check, RefreshCcw, Filter, Inbox, Loader2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIAG_DB } from './diagnosisDB';

// ── DEKLARASI FUNGSI FORMAT TANGGAL ──
const formatTanggal = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};
export default function InputKasus() {
    const [cases, setCases] = useState([]);
    const [formOpen, setFormOpen] = useState(true);
    const [diagInput, setDiagInput] = useState("");
    const [selectedDiag, setSelectedDiag] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [konsulen, setKonsulen] = useState("");

    const [formTemplate, setFormTemplate] = useState("ANESTESI_STANDAR"); 

    const [formData, setFormData] = useState({
        tanggal_tindakan: new Date().toISOString().split('T')[0],
        jenis_kelamin: '', umur: '', tindakan: '', 
        jenis_kasus: 'Kompetensi Dasar', 
        urgensi: 'E', 
        jenis_anestesi: 'General Anestesi — ETT', 
        regimen_analgesia: '', lokasi_insersi: '', teknik_intervensi: '', 
        dpjp_name: '', catatan: ''
    });

    // ── CONFIG ARRAY PEMETAAN TINDAKAN (SINKRON GAMBAR KAMPUS UNRI) ──
    const subTindakanAnestesiUtama = [
        "Anestesi Bedah Elektif", "Anestesi Bedah Darurat", "Anestesi Umum", "Anestesi / Analgesia Regional", 
        "Teknik Anestesi / Analgesia Subarakhnoid", "Teknik Anestesi / Analgesia Epidural", 
        "Teknik Anestesi / Analgesia Blok Saraf Tepi Basic", "Teknik Anestesi / Analgesia Kaudal"
    ];

    const subAnestesiBedahUmum = [
        "Teknik Anestesi / Analgesia Blok Saraf Tepi intermediate", "Anestesi Bedah Umum Digestif", 
        "Anestesi Bedah Umum THT dan Bedah Mulut", "Anestesi Bedah Umum Mata", "Anestesi Bedah Umum Urologi", 
        "Anestesi Bedah Umum Ortopedi", "Anestesi Bedah Umum Plastik", "Anestesi Bedah Umum Onkologi", 
        "Anestesi Bedah Umum Minimal Invasif", "Anestesi / Analgesia Rawat Jalan", 
        "Anestesi / Analgesia diluar kamar operasi", "Lain-lain (dapat berupa kompetensi diatas)"
    ];

    const groupKompetensiDasarUtama = [...subTindakanAnestesiUtama, ...subAnestesiBedahUmum];
    const subManajemenNyeri = ["Manajemen Nyeri akut", "Manajemen Nyeri kronik", "Manajemen Nyeri paliatif", "Interventional Pain Management"];
    const subObstetriGinekologi = ["Anestesi dan analgesia Obstetri dan Ginekologi Pre-eklamsi dan eklamsi", "Lain-lain (operasi selain eklamsi dan pre-eklamsi)"];
    const subBedahSaraf = ["Anestesi Bedah Saraf Trauma kepala", "Perdarahan intracranial non-trauma", "Tumor intrakranial", "Ventricular drainage (VP shunt, EVD)", "Medula spinalis"];
    
    const subKondisiKhususLanjut = [
        "Anestesi Bedah Thoraks Non Jantung dan Jantung Terbuka", "Anestesi pada Kondisi khusus Kelainan jantung pada operasi non jantung", 
        "Anestesi pada Kondisi khusus COPD / asma", "Anestesi pada Kondisi khusus DM", "Anestesi pada Kondisi khusus Tiroid", 
        "Anestesi pada Kondisi khusus Geriatri", "Anestesi pada Kondisi khusus Obesitas", "Mengelola pasien ICU (10 variasi kasus)", 
        "Melakukan resusitasi di luar kamar bedah dan ICU", "Memasang kateter intra-arterial dan pungsi intra-arterial", 
        "Memasang kateter vena central", "Melakukan intubasi sulit", "Anestesi Bedah Pediatri Neonatus", "Anestesi Bedah Pediatri Bayi", "Anestesi Bedah Pediatri Anak-anak"
    ];

    useEffect(() => { 
        const initData = async () => {
            setIsPageLoading(true);
            await Promise.all([fetchCases(), fetchKonsulen()]);
            setIsPageLoading(false);
        };
        initData();
    }, []);

    const fetchCases = async () => {
        try {
            const res = await axios.get('https://api.sigmaeducation.id/api/mahasiswa/cases', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCases(Array.isArray(res.data) ? res.data : []);
        } catch (err) { setCases([]); }
    };

    const fetchKonsulen = async () => {
        try {
            const res = await axios.get('https://api.sigmaeducation.id/api/mahasiswa/konsulen', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.data.konsulen_name) {
                setKonsulen(res.data.konsulen_name);
                setFormData(prev => ({ ...prev, dpjp_name: res.data.konsulen_name }));
            }
        } catch (err) { console.error(err); }
    };

    const handleTindakanChange = (val) => {
        let template = "ANESTESI_STANDAR"; 
        let groupStase = "Kompetensi Dasar";
        let defaultAnestesi = "General Anestesi — ETT";

        if (subManajemenNyeri.includes(val)) {
            template = "MANAJEMEN_NYERI"; 
            groupStase = "Manajemen Nyeri";
            defaultAnestesi = "Nyeri Analgesia"; 
        } else if (val === "Memasang kateter vena central") {
            template = "PEMASANGAN_CVC"; 
            groupStase = "Kompetensi Lanjut";
            defaultAnestesi = "CVC Procedure"; 
        } else if (val === "Mengelola pasien ICU (10 variasi kasus)" || val === "Melakukan resusitasi di luar kamar bedah dan ICU") {
            template = "TERAPI_INTENSIF"; 
            groupStase = "Kompetensi Lanjut";
            defaultAnestesi = "Intensive Care"; 
        } else if (val === "Teknik Anestesi / Analgesia Blok Saraf Tepi Basic" || val === "Teknik Anestesi / Analgesia Blok Saraf Tepi intermediate") {
            template = "PERIPHERAL_BLOCK"; 
            groupStase = subAnestesiBedahUmum.includes(val) ? "Anestesi Bedah Umum" : "Kompetensi Dasar";
            defaultAnestesi = "Peripheral Nerve Block"; 
        } else {
            if (subAnestesiBedahUmum.includes(val)) groupStase = "Anestesi Bedah Umum";
            else if (subObstetriGinekologi.includes(val)) groupStase = "Obstetri & Ginekologi";
            else if (subBedahSaraf.includes(val)) groupStase = "Anestesi Bedah Saraf";
            else if (subKondisiKhususLanjut.includes(val)) groupStase = "Kompetensi Lanjut";
        }

        setFormTemplate(template);
        setFormData(prev => ({ 
            ...prev, 
            tindakan: val,
            jenis_kasus: groupStase, 
            jenis_anestesi: defaultAnestesi 
        }));
    };

    const handleAddDiag = (label) => {
        if (!selectedDiag.includes(label)) setSelectedDiag([...selectedDiag, label]);
        setDiagInput("");
    };

    const handleSubmit = async () => {
        if (selectedDiag.length === 0 || !formData.tindakan || !formData.dpjp_name) {
            return Swal.fire("Data Tidak Lengkap", "Silakan lengkapi diagnosis dan data wajib lainnya.", "warning");
        }
        
        setLoading(true);
        const payload = { ...formData, diagnosis: selectedDiag };
        
        console.log("============= DEBUG MEDLOG AI =============");
        console.log("Menembak API POST ke: https://api.sigmaeducation.id/api/mahasiswa/cases");
        console.log("Isi Payload Form Yang Dikirim:", JSON.stringify(payload, null, 2));

        try {
            const res = await axios.post('https://api.sigmaeducation.id/api/mahasiswa/cases', payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log("Respon Sukses Server (201):", res.data);
            Swal.fire("Berhasil", "Data kasus klinis telah disimpan ke logbook.", "success");
            resetForm();
            fetchCases();
        } catch (err) {
            console.error("❌ PENYEBAB EROR POST TIMBUL:");
            if (err.response) {
                console.error("Status Code Eror:", err.response.status);
                console.error("Pesan Eror Server:", err.response.data);
                
                let detailPesan = err.response.data.message || "Terjadi kesalahan pada struktur database server.";
                if (err.response.data.errors) {
                    console.error("Detail Validasi Kolom Gagal (422):", err.response.data.errors);
                    detailPesan = Object.values(err.response.data.errors).flat().join("<br/>");
                }
                
                Swal.fire({
                    icon: 'error',
                    title: `Server Error ${err.response.status}`,
                    html: `<div style="text-align:left; font-family:monospace; font-size:11px; background:#fff1f2; padding:10px; border-radius:8px; border:1px solid #fecaca; color:#991b1b;">${detailPesan}</div>`,
                    footer: '<span style="color:#2563eb; font-weight:bold;">Tekan F12 -> Buka tab Console untuk melihat detail payload</span>'
                });
            } else {
                console.error("Eror Jaringan / CORS Timbul:", err.message);
                Swal.fire("Koneksi Gagal", "Tidak dapat terhubung ke server API backend Laravel.", "error");
            }
        } finally { 
            setLoading(false); 
            console.log("===========================================");
        }
    };

    const resetForm = () => {
        setFormData({
            tanggal_tindakan: new Date().toISOString().split('T')[0],
            jenis_kelamin: '', umur: '', tindakan: '', jenis_kasus: 'Kompetensi Dasar',
            urgensi: 'E', jenis_anestesi: 'General Anestesi — ETT', regimen_analgesia: '',
            lokasi_insersi: '', teknik_intervensi: '', dpjp_name: konsulen || '', catatan: ''
        });
        setSelectedDiag([]);
        setFormTemplate("ANESTESI_STANDAR");
    };

    const getGroupedCasesCount = (arrFilter) => {
        return cases.filter(c => c.status === 'verified' && arrFilter.includes(c.tindakan)).length;
    };

    if (isPageLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Data...</p>
        </div>
    );

    return (
        <div className="p-6 bg-[#F8FAFC] min-h-screen font-['Inter']">
            {/* Row Statistik Atas (LAYOUT REVISI: PAS 3 KOLOM) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard label="Total Pengajuan" value={cases.length} />
                <StatCard label="Verified Case" value={cases.filter(c => c.status === 'verified').length} color="text-emerald-600" />
                <StatCard label="Pending Approval" value={cases.filter(c => c.status === 'pending').length} color="text-blue-600" />
            </div>

            {/* Sub-Panel Akumulasi Jumlah Kasus */}
            <div className="bg-white border border-slate-200/70 p-5 rounded-[24px] shadow-sm mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                    <Award size={14} className="text-[#003178]" /> Progres Jumlah Kasus Minimal Stase Kurikulum
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="text-xs font-black text-slate-800">{getGroupedCasesCount(groupKompetensiDasarUtama)} / 1015</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5 leading-tight">Kompetensi Dasar</div>
                    </div>
                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="text-xs font-black text-slate-800">{getGroupedCasesCount(subAnestesiBedahUmum)} / 620</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5 leading-tight">Anestesi Bedah Umum</div>
                    </div>
                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="text-xs font-black text-slate-800">{getGroupedCasesCount(subManajemenNyeri)} / 130</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5 leading-tight">Manajemen Nyeri</div>
                    </div>
                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="text-xs font-black text-slate-800">{getGroupedCasesCount(subObstetriGinekologi)} / 100</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5 opacity-100 leading-tight">Obstetri & Ginekologi</div>
                    </div>
                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="text-xs font-black text-slate-800">{getGroupedCasesCount(subBedahSaraf)} / 35</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5 leading-tight">Anestesi Bedah Saraf</div>
                    </div>
                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="text-xs font-black text-slate-800">{getGroupedCasesCount(subKondisiKhususLanjut)} / 35</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5 leading-tight">Kompetensi Lanjut</div>
                    </div>
                </div>
            </div>

            {/* Form Input Kasus */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 mb-8 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="flex items-center gap-2 font-black text-slate-800 uppercase text-xs tracking-wider font-['Manrope']">
                        <FilePlus size={18} className="text-[#003178]" /> Input Kasus Logbook
                    </h2>
                    <button type="button" onClick={() => setFormOpen(!formOpen)} className="text-slate-400 hover:text-slate-600">
                        {formOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>

                <AnimatePresence>
                    {formOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormGroup label="Informasi Pasien">
                                    <input type="date" className="custom-input" value={formData.tanggal_tindakan} onChange={e => setFormData({...formData, tanggal_tindakan: e.target.value})} />
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <select className="custom-input" value={formData.jenis_kelamin} onChange={e => setFormData({...formData, jenis_kelamin: e.target.value})}>
                                            <option value="">JK</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                        <input type="number" placeholder="Umur" className="custom-input" value={formData.umur} onChange={e => setFormData({...formData, umur: e.target.value})} />
                                    </div>
                                </FormGroup>

                                <FormGroup label="Diagnosis">
                                    <div className="relative min-h-[45px] border border-slate-200 rounded-2xl p-2 bg-slate-50/50">
                                        <div className="flex flex-wrap gap-1 mb-1">
                                            {selectedDiag.map(d => (
                                                <span key={d} className="bg-[#003178] text-white text-[10px] px-3 py-1 rounded-full flex items-center gap-1 shadow-sm font-bold">
                                                    {d} <span className="cursor-pointer font-black ml-1 text-blue-200" onClick={() => setSelectedDiag(selectedDiag.filter(x => x !== d))}>×</span>
                                                </span>
                                            ))}
                                        </div>
                                        <input type="text" placeholder="Cari diagnosis..." className="w-full bg-transparent border-none outline-none text-xs p-1 font-bold text-slate-700" value={diagInput} onChange={e => setDiagInput(e.target.value)} />
                                    </div>
                                    {diagInput && (
                                        <div className="absolute z-20 mt-1 bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-[300px] overflow-hidden">
                                            {DIAG_DB.filter(d => d.label.toLowerCase().includes(diagInput.toLowerCase())).map(d => (
                                                <div key={d.label} onClick={() => handleAddDiag(d.label)} className="p-3 text-xs hover:bg-blue-50 cursor-pointer border-b last:border-0">{d.label}</div>
                                            ))}
                                        </div>
                                    )}
                                </FormGroup>

                                <FormGroup label="Tindakan Medis ">
                                    <select className="custom-input border-blue-200 text-[#003178]" value={formData.tindakan} onChange={e => handleTindakanChange(e.target.value)}>
                                        <option value="">Pilih Tindakan</option>
                                        <optgroup label="KOMPETENSI DASAR">
                                            <option disabled className="text-slate-400 font-bold bg-slate-100/50">── Tindakan Anestesi Utama ──</option>
                                            <option value="Anestesi Bedah Elektif">Anestesi Bedah Elektif</option>
                                            <option value="Anestesi Bedah Darurat">Anestesi Bedah Darurat</option>
                                            <option value="Anestesi Umum">Anestesi Umum</option>
                                            <option value="Anestesi / Analgesia Regional">Anestesi / Analgesia Regional</option>
                                            <option value="Teknik Anestesi / Analgesia Subarakhnoid">Teknik Anestesi / Analgesia Subarakhnoid</option>
                                            <option value="Teknik Anestesi / Analgesia Epidural">Teknik Anestesi / Analgesia Epidural</option>
                                            <option value="Teknik Anestesi / Analgesia Blok Saraf Tepi Basic">Teknik Anestesi / Analgesia Blok Saraf Tepi Basic</option>
                                            <option value="Teknik Anestesi / Analgesia Kaudal">Teknik Anestesi / Analgesia Kaudal</option>

                                            <option disabled className="text-slate-400 font-bold bg-slate-100/50">── Stase Anestesi Bedah Umum ──</option>
                                            <option value="Teknik Anestesi / Analgesia Blok Saraf Tepi intermediate">Teknik Anestesi / Analgesia Blok Saraf Tepi intermediate</option>
                                            <option value="Anestesi Bedah Umum Digestif">Anestesi Bedah Umum Digestif</option>
                                            <option value="Anestesi Bedah Umum THT dan Bedah Mulut">Anestesi Bedah Umum THT dan Bedah Mulut</option>
                                            <option value="Anestesi Bedah Umum Mata">Anestesi Bedah Umum Mata</option>
                                            <option value="Anestesi Bedah Umum Urologi">Anestesi Bedah Umum Urologi</option>
                                            <option value="Anestesi Bedah Umum Ortopedi">Anestesi Bedah Umum Ortopedi</option>
                                            <option value="Anestesi Bedah Umum Plastik">Anestesi Bedah Umum Plastik</option>
                                            <option value="Anestesi Bedah Umum Onkologi">Anestesi Bedah Umum Onkologi</option>
                                            <option value="Anestesi Bedah Umum Minimal Invasif">Anestesi Bedah Umum Minimal Invasif</option>
                                            <option value="Anestesi / Analgesia Rawat Jalan">Anestesi / Analgesia Rawat Jalan</option>
                                            <option value="Anestesi / Analgesia diluar kamar operasi">Anestesi / Analgesia diluar kamar operasi</option>
                                            <option value="Lain-lain (dapat berupa kompetensi diatas)">Lain-lain / Kompetensi Tambahan Bedah Umum</option>

                                            <option disabled className="text-slate-400 font-bold bg-slate-100/50">── Manajemen Nyeri & Obstetri ──</option>
                                            <option value="Manajemen Nyeri akut">Manajemen Nyeri akut</option>
                                            <option value="Manajemen Nyeri kronik">Manajemen Nyeri kronik</option>
                                            <option value="Manajemen Nyeri paliatif">Manajemen Nyeri paliatif</option>
                                            <option value="Interventional Pain Management">Interventional Pain Management</option>
                                            <option value="Anestesi dan analgesia Obstetri dan Ginekologi Pre-eklamsi dan eklamsi">Anestesi & Analgesia Obstetri Pre-eklamsi & Eklamsi</option>
                                            <option value="Lain-lain (operasi selain eklamsi dan pre-eklamsi)">Lain-lain / Operasi Selain Eklamsi & Pre-eklamsi</option>
                                        </optgroup>
                                        <optgroup label="KOMPETENSI LANJUT">
                                            <option disabled className="text-slate-400 font-bold bg-slate-100/50">── Anestesi Bedah Saraf ──</option>
                                            <option value="Anestesi Bedah Saraf Trauma kepala">Anestesi Bedah Saraf Trauma kepala</option>
                                            <option value="Perdarahan intracranial non-trauma">Perdarahan intracranial non-trauma</option>
                                            <option value="Tumor intrakranial">Tumor intrakranial</option>
                                            <option value="Ventricular drainage (VP shunt, EVD)">Ventricular drainage (VP shunt, EVD)</option>
                                            <option value="Medula spinalis">Medula spinalis</option>

                                            <option disabled className="text-slate-400 font-bold bg-slate-100/50">── Stase Kondisi Khusus & Prosedur Lanjut ──</option>
                                            <option value="Anestesi Bedah Pediatri Neonatus">Anestesi Bedah Pediatri Neonatus</option>
                                            <option value="Anestesi Bedah Pediatri Bayi">Anestesi Bedah Pediatri Bayi</option>
                                            <option value="Anestesi Bedah Pediatri Anak-anak">Anestesi Bedah Pediatri Anak-anak</option>
                                            <option value="Anestesi Bedah Thoraks Non Jantung dan Jantung Terbuka">Anestesi Bedah Thoraks Non Jantung & Jantung Terbuka</option>
                                            <option value="Anestesi pada Kondisi khusus Kelainan jantung pada operasi non jantung">Anestesi Kondisi Khusus: Kelainan Jantung</option>
                                            <option value="Anestesi pada Kondisi khusus COPD / asma">Anestesi Kondisi Khusus: COPD / Asma</option>
                                            <option value="Anestesi pada Kondisi khusus DM">Anestesi Kondisi Khusus: DM</option>
                                            <option value="Anestesi pada Kondisi khusus Tiroid">Anestesi Kondisi Khusus: Tiroid</option>
                                            <option value="Anestesi pada Kondisi khusus Geriatri">Anestesi Kondisi Khusus: Geriatri</option>
                                            <option value="Anestesi pada Kondisi khusus Obesitas">Anestesi Kondisi Khusus: Obesitas</option>
                                            <option value="Mengelola pasien ICU (10 variasi kasus)">Mengelola pasien ICU / 10 Variasi Kasus</option>
                                            <option value="Melakukan resusitasi di luar kamar bedah dan ICU">Melakukan resusitasi di luar kamar bedah & ICU</option>
                                            <option value="Memasang kateter intra-arterial dan pungsi intra-arterial">Memasang kateter & pungsi intra-arterial</option>
                                            <option value="Memasang kateter vena central">Memasang kateter vena central / CVC</option>
                                            <option value="Melakukan intubasi sulit">Melakukan intubasi sulit</option>
                                        </optgroup>
                                    </select>
                                </FormGroup>

                                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    {formTemplate === "ANESTESI_STANDAR" && (
                                        <FormGroup label="Urgensi Kasus ($E / N$)">
                                            <select 
                                                className="custom-input" 
                                                value={formData.urgensi} 
                                                onChange={e => setFormData({...formData, urgensi: e.target.value})}
                                            >
                                                <option value="E">E (Elektif)</option>
                                                <option value="N">N (Non-Elektif / Darurat)</option>
                                            </select>
                                        </FormGroup>
                                    )}

                                    {formTemplate === "MANAJEMEN_NYERI" && (
                                        <FormGroup label="Regimen Analgesia / Teknik Intervensi">
                                            <input type="text" className="custom-input" placeholder="Masukkan regimen analgesia / teknik intervensi nyeri..." value={formData.regimen_analgesia || ''} onChange={e => setFormData({...formData, regimen_analgesia: e.target.value, teknik_intervensi: e.target.value})} />
                                        </FormGroup>
                                    )}

                                    {formTemplate === "PEMASANGAN_CVC" && (
                                        <FormGroup label="Lokasi Insersi Kateter Vena Central">
                                            <select className="custom-input" value={formData.lokasi_insersi} onChange={e => setFormData({...formData, lokasi_insersi: e.target.value})}>
                                                <option value="">Pilih Lokasi Insersi</option>
                                                <option value="Vena Jugularis Interna">Vena Jugularis Interna</option>
                                                <option value="Vena Subklavia">Vena Subklavia</option>
                                                <option value="Vena Femoralis">Vena Femoralis</option>
                                            </select>
                                        </FormGroup>
                                    )}

                                    {formTemplate === "PERIPHERAL_BLOCK" && (
                                        <FormGroup label="Teknik Intervensi Blok Saraf Tepi">
                                            <input type="text" className="custom-input" placeholder="Contoh: Femoral Nerve Block / Axillary Block..." value={formData.teknik_intervensi || ''} onChange={e => setFormData({...formData, teknik_intervensi: e.target.value})} />
                                        </FormGroup>
                                    )}

                                    {formTemplate === "TERAPI_INTENSIF" && (
                                        <div className="md:col-span-2 text-xs font-bold text-slate-400 bg-slate-50 border p-4 rounded-xl border-dashed">
                                            💡 Berdasarkan Format Hal. 29-30, stase ICU/Resusitasi tidak memerlukan pengisian kolom Tindakan Klinis Tambahan atau Metode Anestesi khusus.
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                    <FormGroup label="DPJP Pembimbing (Konsulen)">
                                        <select className="custom-input bg-blue-50/30 border-blue-100 text-[#003178]" value={formData.dpjp_name} onChange={e => setFormData({...formData, dpjp_name: e.target.value})}>
                                            {konsulen && <option value={konsulen}>{konsulen} (Konsulen Anda)</option>}
                                        </select>
                                    </FormGroup>
                                    <FormGroup label="Catatan Tambahan">
                                        <input type="text" className="custom-input" placeholder="Opsional..." value={formData.catatan} onChange={e => setFormData({...formData, catatan: e.target.value})} />
                                    </FormGroup>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                                <button type="button" onClick={resetForm} className="px-6 py-2.5 text-xs font-black text-slate-400 uppercase tracking-widest">Reset Form</button>
                                <button type="button" onClick={handleSubmit} disabled={loading} className="bg-[#003178] text-white px-8 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all">
                                    {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Check size={14} />} Simpan Kasus
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Riwayat */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#003178] flex items-center justify-center"><Filter size={16}/></div>
                    <h2 className="font-black text-slate-800 uppercase tracking-tight text-xs bg-white font-['Manrope']">Riwayat Logbook Kasus</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/60 text-slate-400 text-[10px] font-black uppercase border-b tracking-wider">
                            <tr>
                                <th className="p-5">Tanggal</th>
                                <th className="p-5">Pasien</th>
                                <th className="p-5">Diagnosis & Tindakan Utama</th>
                                <th className="p-5">Rincian Klinis Khusus</th>
                                <th className="p-5">DPJP & Catatan</th>
                                <th className="p-5 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/70 text-xs">
                            {cases.map((c) => {
                                let labelKhusus = <span className="text-slate-400 italic">—</span>;
                                
                                if (c.tindakan === "Memasang kateter vena central" && c.lokasi_insersi) {
                                    labelKhusus = <div><span className="font-black text-slate-400 block text-[9px]">LOKASI INSERSI:</span> <span className="font-bold text-amber-600 uppercase">{c.lokasi_insersi}</span></div>;
                                } else if (subManajemenNyeri.includes(c.tindakan) && c.regimen_analgesia) {
                                    labelKhusus = <div><span className="font-black text-slate-400 block text-[9px]">REGIMEN / TEKNIK:</span> <span className="font-bold text-blue-600 uppercase">{c.regimen_analgesia}</span></div>;
                                } else if ((c.tindakan === "Teknik Anestesi / Analgesia Blok Saraf Tepi Basic" || c.tindakan === "Teknik Anestesi / Analgesia Blok Saraf Tepi intermediate") && c.teknik_intervensi) {
                                    labelKhusus = <div><span className="font-black text-slate-400 block text-[9px]">TEKNIK INTERVENSI:</span> <span className="font-bold text-purple-600 uppercase">{c.teknik_intervensi}</span></div>;
                                } else if (c.jenis_anestesi && c.jenis_anestesi !== "Nyeri Analgesia" && c.jenis_anestesi !== "CVC Procedure" && c.jenis_anestesi !== "Intensive Care" && c.jenis_anestesi !== "Peripheral Nerve Block") {
                                    labelKhusus = (
                                        <div className="space-y-1">
                                            {c.urgensi && <div><span className="text-slate-400 font-bold">$E/N$:</span> <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-black">{c.urgensi}</span></div>}
                                            {c.jenis_anestesi && <div><span className="text-slate-400 font-bold">Anestesi:</span> <span className="text-slate-600 font-medium">{c.jenis_anestesi}</span></div>}
                                        </div>
                                    );
                                }

                                return (
                                    <tr key={c.id} className="hover:bg-slate-50/30 transition-all group">
                                        <td className="p-5 font-bold text-slate-700 whitespace-nowrap">{formatTanggal(c.tanggal_tindakan)}</td>
                                        <td className="p-5 font-medium text-slate-500 whitespace-nowrap">{c.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}, {c.umur} Th</td>
                                        <td className="p-5">
                                            <div className="flex flex-wrap gap-1 mb-1.5">
                                                {Array.isArray(c.diagnosis) && c.diagnosis.map(d => (
                                                    <span key={d} className="bg-blue-50/80 text-[#003178] text-[9px] px-2 py-0.5 rounded-md border border-blue-100 font-bold uppercase">
                                                        {d}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="text-[11px] font-black text-[#003178] uppercase group-hover:text-blue-900 transition-colors">{c.tindakan}</div>
                                        </td>
                                        <td className="p-5">{labelKhusus}</td>
                                        <td className="p-5">
                                            <div className="font-bold text-slate-700 mb-0.5">{c.dpjp_name}</div>
                                            <div className="text-slate-400 truncate max-w-[150px]">{c.catatan ? c.catatan : <span className="italic opacity-60">tidak ada catatan</span>}</div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-[9px] font-black border tracking-widest ${c.status === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-[#003178] border-blue-100'}`}>
                                                {c.status === 'verified' ? 'VERIFIED' : 'PENDING'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-input { width: 100%; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 12px 16px; font-size: 12px; font-weight: 700; outline: none; transition: all 0.2s; color: #334155; }
                .custom-input:focus { border-color: #003178; background: white; box-shadow: 0 0 0 4px rgba(0, 49, 120, 0.04); }
            ` }} />
        </div>
    );
}

const StatCard = ({ label, value, color = "text-slate-800" }) => (
    <div className="p-6 rounded-[24px] border border-slate-200/60 shadow-sm transition-all bg-white">
        <div className={`text-2xl font-black font-mono ${color}`}>{value}</div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{label}</div>
    </div>
);

const FormGroup = ({ label, children }) => (
    <div className="relative">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 block">{label}</label>
        {children}
    </div>
);