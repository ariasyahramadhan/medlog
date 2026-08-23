import React from "react";
import { 
  FiAlertCircle, FiClock, FiUser, FiCheckSquare, 
  FiBriefcase, FiSlash, FiInfo, FiMapPin 
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function PanduanTataTertib() {
  const tataTertibAkademik = [
    "Wajib mengikuti seluruh proses pendidikan sesuai kurikulum.",
    "Wajib mengikuti bimbingan oleh penasihat akademik yang telah ditentukan.",
    "Menyusun tugas ilmiah tepat waktu di bawah bimbingan konsulen.",
    "Wajib mengikuti ujian yang ditentukan apabila telah memenuhi syarat."
  ];

  const kehadiranRules = [
    { jam: "05.00 - 06.30 WIB", ket: "Absensi Datang (Sidik Jari di Sekretariat)" },
    { jam: "15.30 - 21.00 WIB", ket: "Absensi Pulang (Setelah selesai tugas)" },
    { jam: "Laporan Pagi", ket: "Wajib hadir & kembali ke tempat tugas setelahnya" }
  ];

  const larangan = [
    "Membuat kegaduhan atau berbicara keras di area diskusi/perpustakaan.",
    "Membantu peserta didik lain saat ujian.",
    "Menjiplak karya ilmiah orang lain (Plagiat).",
    "Merokok di tempat bertugas atau areal RS.",
    "Memukul siapapun dengan alasan apapun."
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6 md:p-10 font-['Inter']">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#003178] rounded-lg text-white shadow-lg shadow-blue-100">
              <FiCheckSquare size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 font-['Manrope'] tracking-tight uppercase">
              Tata Tertib Peserta Didik
            </h1>
          </div>
          <p className="text-slate-500 font-medium">Peraturan resmi akademik dan etika residen Anestesiologi UNRI.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. TATA TERTIB AKADEMIK */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 flex flex-col h-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiBriefcase className="text-blue-600 text-xl" />
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">1. Aturan Akademik</h3>
            </div>
            <ul className="space-y-5 flex-1">
              {tataTertibAkademik.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium leading-relaxed">
                  <span className="text-[#003178] font-black">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 2. KEHADIRAN & ABSENSI */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#003178] rounded-[32px] p-8 text-white h-full relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <FiClock className="text-blue-300 text-xl" />
                <h3 className="font-black text-xs uppercase tracking-widest text-blue-100">2. Kehadiran (Sidik Jari)</h3>
              </div>
              <div className="space-y-6">
                {kehadiranRules.map((item, i) => (
                  <div key={i} className="border-l-2 border-blue-400/30 pl-4 group">
                    <p className="text-lg font-black group-hover:text-blue-300 transition-colors">{item.jam}</p>
                    <p className="text-xs font-medium text-blue-200 uppercase tracking-tighter">{item.ket}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-[10px] leading-relaxed opacity-80 italic">
                  *Izin sakit wajib melampirkan surat keterangan dokter ke sekretariat Prodi.
                </p>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          </motion.div>

          {/* 3. ETIKA PENAMPILAN */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiUser className="text-blue-600 text-xl" />
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">3. Penampilan & Identitas</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-black text-[#003178] uppercase mb-2">Pakaian Dinas:</p>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Jas dokter lengan pendek (kecuali jaga), dilarang kaos, jeans, sandal, atau sepatu hak {">"} 5cm.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-black text-[#003178] uppercase mb-2">Pin Tahap (Dada Kiri):</p>
                <div className="grid grid-cols-4 gap-2">
                   {[1,2,3,4,5,6,7,8].map(n => (
                     <div key={n} className="flex flex-col items-center bg-white border border-slate-100 p-1 rounded-lg">
                        <span className="text-[10px] font-black">S{n}</span>
                        <div className={`w-2 h-2 rounded-full bg-blue-${n}00 shadow-sm`}></div>
                     </div>
                   ))}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-black text-[#003178] uppercase mb-2">Rambut:</p>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Rapi, tidak menutupi telinga/kerah, dilarang gondrong, jenggot/kumis berlebihan, & cat rambut.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 4. LARANGAN UTAMA (Full Width) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            className="lg:col-span-3 bg-red-50 border border-red-100 rounded-[32px] p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiSlash className="text-red-600 text-xl" />
              <h3 className="font-black text-xs uppercase tracking-widest text-red-800">Larangan & Pelanggaran</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {larangan.map((text, i) => (
                 <div key={i} className="flex gap-3 items-start">
                    <FiAlertCircle className="text-red-400 mt-1 shrink-0" />
                    <p className="text-sm text-red-900 font-medium leading-relaxed">{text}</p>
                 </div>
               ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}