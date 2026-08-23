import { useState } from "react";
import { FiActivity, FiSearch, FiLayers, FiCheckCircle, FiBook, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

export default function MahasiswaKompetensi() {
  const [searchTerm, setSearchTerm] = useState("");

  // Struktur Matriks Miller's Pyramid untuk Sidebar Kanan
  const levelsPedoman = [
    { lvl: "L1", name: "Knows", desc: "Mengetahui dan menjelaskan konsep teori secara klinis.", bg: "bg-slate-50 text-slate-700 border border-slate-200" },
    { lvl: "L2", name: "Knows How", desc: "Pernah melihat atau didemonstrasikan tindakan tersebut.", bg: "bg-slate-400 text-white" },
    { lvl: "L3", name: "Shows", desc: "Pernah melakukan atau menerapkan di bawah supervisi.", bg: "bg-blue-500 text-white" },
    { lvl: "L4", name: "Does", desc: "Mampu melakukan tindakan klinis secara mandiri penuh.", bg: "bg-emerald-500 text-white" }
  ];

  // Integrasi Data Komprehensif Kasus Anestesiologi (Gambar 1 sampai Gambar 4)
  const kompetensiData = [
    // GAMBAR 1 & 2: KOMPETENSI DASAR
    { name: "Anestesi Bedah Elektif", target: 860, level: 4, category: "Dasar" },
    { name: "Anestesi Bedah Darurat", target: 155, level: 4, category: "Dasar" },
    { name: "Anestesi Umum", target: 835, level: 4, category: "Dasar" },
    { name: "Anestesi / Analgesia Regional", target: 180, level: 4, category: "Dasar" },
    { name: "Teknik Anestesi / Analgesia Subarakhnoid", target: 90, level: 4, category: "Dasar" },
    { name: "Teknik Anestesi / Analgesia Epidural", target: 50, level: 4, category: "Dasar" },
    { name: "Teknik Anestesi / Analgesia Blok Saraf Tepi Basic", target: 15, level: 4, category: "Dasar" },
    { name: "Teknik Anestesi / Analgesia Kaudal", target: 5, level: 4, category: "Dasar" },
    { name: "Teknik Anestesi / Analgesia Blok Saraf Tepi Intermediate", target: 20, level: 4, category: "Dasar" },
    
    // GAMBAR 2: STASE ANESTESI BEDAH UMUM
    { name: "Digestif (Bedah Umum)", target: 150, level: 4, category: "Stase" },
    { name: "THT dan Bedah Mulut", target: 50, level: 4, category: "Stase" },
    { name: "Mata", target: 20, level: 4, category: "Stase" },
    { name: "Urologi", target: 25, level: 4, category: "Stase" },
    { name: "Ortopedi", target: 100, level: 4, category: "Stase" },
    { name: "Plastik", target: 15, level: 4, category: "Stase" },
    { name: "Onkologi", target: 25, level: 4, category: "Stase" },
    { name: "Minimal Invasif", target: 5, level: 4, category: "Stase" },
    { name: "Anestesi / Analgesia Rawat Jalan", target: 30, level: 4, category: "Stase" },
    { name: "Anestesi / Analgesia di luar Kamar Operasi", target: 50, level: 4, category: "Stase" },
    { name: "Lain-lain (Kompetensi Tambahan Stase)", target: 150, level: 4, category: "Stase" },
    
    // GAMBAR 2 & 3: NYERI & PEDIATRI
    { name: "Nyeri Akut", target: 100, level: 4, category: "Nyeri" },
    { name: "Nyeri Kronik", target: 10, level: 4, category: "Nyeri" },
    { name: "Nyeri Paliatif", target: 10, level: 4, category: "Nyeri" },
    { name: "Interventional Pain Management (IPM)", target: 10, level: 4, category: "Nyeri" },
    { name: "Pre-eklamsi dan Eklamsi (Obstetri)", target: 10, level: 4, category: "Obstetri" },
    { name: "Lain-lain (Operasi non-eklamsi)", target: 90, level: 4, category: "Obstetri" },
    { name: "Anestesi Bedah Pediatri: Neonatus", target: 10, level: 4, category: "Pediatri" },
    { name: "Anestesi Bedah Pediatri: Bayi", target: 15, level: 4, category: "Pediatri" },
    { name: "Anestesi Bedah Pediatri: Anak-anak", target: 50, level: 4, category: "Pediatri" },
    
    // GAMBAR 3 & 4: KOMPETENSI LANJUT
    { name: "Anestesi Bedah Saraf (Trauma Kepala)", target: 15, level: 4, category: "Lanjut" },
    { name: "Perdarahan Intracranial Non-Trauma", target: 5, level: 4, category: "Lanjut" },
    { name: "Tumor Intrakranial", target: 5, level: 4, category: "Lanjut" },
    { name: "Ventricular Drainage (VP Shunt, EVD)", target: 5, level: 4, category: "Lanjut" },
    { name: "Medula Spinalis", target: 5, level: 4, category: "Lanjut" },
    { name: "Anestesi Bedah Thoraks Non-Jantung", target: 10, level: 4, category: "Lanjut" },
    { name: "Kelainan Jantung pada Operasi Non-Jantung", target: 15, level: 4, category: "Lanjut" },
    { name: "COPD / Asma", target: 5, level: 4, category: "Lanjut" },
    { name: "Diabetes Melitus (DM)", target: 5, level: 4, category: "Lanjut" },
    { name: "Tiroid", target: 5, level: 4, category: "Lanjut" },
    { name: "Geriatri", target: 3, level: 4, category: "Lanjut" },
    { name: "Obesitas", target: 2, level: 4, category: "Lanjut" },
    { name: "Mengelola Pasien ICU (10 Variasi Kasus)", target: 50, level: 4, category: "Lanjut" },
    { name: "Melakukan Resusitasi di luar Kamar Bedah & ICU", target: 30, level: 4, category: "Lanjut" },
    { name: "Memasang Kateter & Pungsi Intra-arterial", target: 10, level: 4, category: "Lanjut" },
    { name: "Memasang Kateter Vena Central (CVC)", target: 20, level: 4, category: "Lanjut" },
    { name: "Melakukan Intubasi Sulit", target: 5, level: 4, category: "Lanjut" }
  ];

  const filteredData = kompetensiData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-slate-50/50 p-6 md:p-8 font-['Inter']"
    >
      <div className="max-w-[1400px] mx-auto">
        
        {/* Layout Split-Screen 2 Kolom */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          
          {/* KOLOM KIRI: MATRIKS STANDAR KOMPETENSI */}
          <div className="xl:col-span-3 bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
            
            {/* Header Tabel & Input Pencarian terpadu */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl text-[#003178]">
                  <FiBook size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 font-['Manrope'] tracking-tight">
                    Matriks Standar Kompetensi
                  </h1>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">Target minimum kasus klinis dan tingkat kemampuan residen.</p>
                </div>
              </div>

              <div className="relative group w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="Cari kompetensi..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-transparent rounded-xl text-xs font-medium text-slate-700 outline-none focus:bg-white focus:border-[#003178]/20 focus:ring-2 focus:ring-[#003178]/5 transition-all"
                />
              </div>
            </div>

            {/* Tabel Utama Kasus */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4 w-1/2">Kompetensi Dasar & Lanjut</th>
                    <th className="px-6 py-4 text-center">Pencapaian Kasus Minimum</th>
                    <th className="px-6 py-4 text-center">Tingkat Kompetensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 text-xs">
                  {filteredData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors group">
                      
                      {/* Kolom 1: Nama Tindakan Medis */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-600/30 group-hover:bg-[#003178] transition-colors shrink-0" />
                          <span className="font-bold text-slate-800 group-hover:text-[#003178] transition-colors leading-tight">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Kolom 2: Target Capaian Kasus Angka */}
                      <td className="px-6 py-4.5 text-center font-mono font-black text-slate-800 text-sm">
                        {item.target}
                      </td>

                      {/* Kolom 3: Indikator Level Kompetensi Sesuai Gambar */}
                      <td className="px-6 py-4.5">
                        <div className="flex justify-center items-center gap-1">
                          {[1, 2, 3, 4].map((lvl) => {
                            const isTargetLvl = item.level === lvl;
                            return (
                              <div 
                                key={lvl}
                                className={`w-6 h-6 rounded-md font-black text-[10px] flex items-center justify-center transition-all ${
                                  isTargetLvl 
                                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 scale-105" 
                                    : "bg-slate-50 text-slate-300 border border-slate-100"
                                }`}
                              >
                                {lvl}
                              </div>
                            );
                          })}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* KOLOM KANAN: PEDOMAN SIDEBAR (Sticky Layout) */}
          <div className="xl:col-span-1 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm xl:sticky xl:top-6">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
              <FiLayers className="text-[#003178]" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 font-['Manrope']">
                Pedoman Miller's Pyramid
              </h3>
            </div>

            {/* List Indikator Level Miller */}
            <div className="space-y-4">
              {levelsPedoman.map((m, idx) => (
                <div key={idx} className="flex gap-4 items-start group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-sm ${m.bg}`}>
                    {m.lvl}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 group-hover:text-[#003178] transition-colors">
                      {m.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium leading-normal mt-0.5">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Keterangan Kaki Deskripsi */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2 items-start text-[10px] font-medium text-slate-400 leading-normal">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <p>Indikator kotak hijau (<span className="text-emerald-600 font-bold">4</span>) merepresentasikan tingkat pemenuhan mandiri penuh (Does) yang wajib dikuasai residen pada akhir masa stase pendidikan.</p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}