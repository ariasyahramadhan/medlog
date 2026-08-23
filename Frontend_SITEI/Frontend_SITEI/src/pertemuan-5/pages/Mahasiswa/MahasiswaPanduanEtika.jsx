import React from "react";
import { 
  FiInfo, FiBriefcase, FiHeart, 
  FiStar, FiTarget, FiAlertCircle, FiClipboard, FiCheck
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function PanduanEtika() {
  const hakPeserta = [
    "Mempergunakan seluruh fasilitas pendidikan sesuai mekanisme.",
    "Memberikan usul kepada KPS/SPS melalui wakil peserta didik.",
    "Cuti tahunan 12 hari kerja (mulai semester 3).",
    "Mendapat bimbingan & konseling akademik/non-akademik.",
    "Informasi transparansi nilai tes/ujian/tugas.",
    "Hak klarifikasi atas laporan pelanggaran (A-P-K).",
    "Layanan surat menyurat administratif.",
    "Menolak prosedur/pemeriksaan yang tidak sesuai etika.",
    "Melaporkan tindakan yang tidak sesuai standar/malpraktek."
  ];

  const kewajibanPeserta = [
    "Mengikuti seluruh program pendidikan sesuai aturan.",
    "Mengisi buku log residen dengan lengkap.",
    "Mengisi rekam medis sesuai aturan JCI dan KARS.",
    "Memelihara fasilitas pendidikan dan RS.",
    "Membayar biaya pendidikan tepat waktu.",
    "Melayani pasien secara profesional.",
    "Melakukan monitoring pasien periode perioperatif.",
    "Toleransi antar teman sejawat dan staf RS.",
    "Mengikuti arahan staf pengajar dan manajemen RS.",
    "Berperan aktif dalam kegiatan ekstra kurikuler."
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6 md:p-10 font-['Inter']">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#003178] rounded-lg text-white">
                <FiCheck size={24} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 font-['Manrope'] tracking-tight uppercase">
                Etika & Tata Tertib
              </h1>
            </div>
            <p className="text-slate-500 font-medium">Hak, Kewajiban, Fungsi, dan Tugas Peserta Didik Anestesiologi.</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex items-center gap-3">
             <FiInfo className="text-blue-600" />
             <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Update Kurikulum 2024</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* KOLOM HAK */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 bg-blue-600 text-white flex items-center gap-3">
              <FiStar className="text-xl" />
              <h3 className="font-black uppercase tracking-[0.2em] text-sm">Hak Peserta Didik</h3>
            </div>
            <div className="p-8 space-y-4">
              {hakPeserta.map((text, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0 group-hover:bg-[#003178] group-hover:text-white transition-colors">
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* KOLOM KEWAJIBAN */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 bg-slate-800 text-white flex items-center gap-3">
              <FiTarget className="text-xl" />
              <h3 className="font-black uppercase tracking-[0.2em] text-sm">Kewajiban & Tugas</h3>
            </div>
            <div className="p-8 space-y-4">
              {kewajibanPeserta.map((text, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-black shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <FiHeart size={10} />
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Kolom Fungsi (Full Width) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-[#003178] rounded-[32px] p-8 text-white relative overflow-hidden"
          >
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-black font-['Manrope'] mb-4 italic">"Melayani pasien dengan profesional dan integritas tinggi."</h3>
                <p className="text-blue-200 text-sm leading-relaxed max-w-xl">
                  Setiap residen wajib melengkapi seluruh syarat administrasi untuk dapat memberikan pelayanan di RSUD Arifin Achmad dan bekerja sama dengan penuh toleransi antar teman sejawat.
                </p>
              </div>
              <div className="flex justify-end">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full md:w-auto">
                   <div className="flex items-center gap-3 mb-2 text-blue-300">
                      <FiBriefcase size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Fungsi Utama</span>
                   </div>
                   <p className="text-xs font-medium text-blue-50 leading-relaxed">
                     Monitoring pasien perioperatif <br/>
                     pagi & luar jam kerja RS.
                   </p>
                </div>
              </div>
            </div>
            {/* Dekorasi Background */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}