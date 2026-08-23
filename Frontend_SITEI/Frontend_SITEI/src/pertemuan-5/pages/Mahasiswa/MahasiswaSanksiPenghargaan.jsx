import React, { useState } from "react";
import { 
  FiAlertTriangle, FiAward, FiInfo, FiTrendingDown, 
  FiFileText, FiShield 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function PanduanSanksi() {
  const [activeTab, setActiveTab] = useState("umum");

  const sanksiKategori = [
    { nilai: "0 - 20", kat: "Kategori 1", sanksi: "Teguran lisan dari TPPM" },
    { nilai: "21 - 40", kat: "Kategori 2", sanksi: "Surat peringatan oleh KPS/SPS dengan usulan dari TPPM" },
    { nilai: "41 - 60", kat: "Kategori 3", sanksi: "Surat peringatan + sanksi dan tugas ilmiah oleh KPS/SPS" },
    { nilai: "61 - 80", kat: "Kategori 4", sanksi: "SP + Rapat pendidikan + tunda yudisium naik tingkat 1 bulan / skorsing 1 bulan" },
    { nilai: "81 - 99", kat: "Kategori 5", sanksi: "SP + Rapat pendidikan + skorsing 3 bulan" },
    { nilai: "≥ 100", kat: "Kategori 6", sanksi: "Dikeluarkan (Drop Out)" },
  ];

  const acuanPoin = [
    { jenis: "KOGNITIF", data: [
      { msg: "Kurang menguasai ilmu pada tingkat kompetensi", poin: 10 },
      { msg: "Terlambat menyelesaikan tugas akademik sesuai instruksi", poin: 20 },
      { msg: "Menjiplak karya / tulisan ilmiah orang lain (Plagiat)", poin: 40 },
    ]},
    { jenis: "PSIKOMOTOR", data: [
      { msg: "Kurang cakap melakukan tindakan pada tingkat kompetensi", poin: 5 },
      { msg: "Melakukan tindakan di luar kompetensi", poin: 20 },
      { msg: "Kelalaian menangani pasien sehingga kondisi memburuk", poin: 30 },
      { msg: "Menyebabkan kematian pasien tanpa konsultasi konsulen", poin: 50 },
    ]},
    { jenis: "AFEKTIF", data: [
      { msg: "Membocorkan rahasia jabatan kedokteran", poin: 20 },
      { msg: "Memberikan keterangan palsu terkait pelayanan", poin: 40 },
      { msg: "Memukul siapapun di tempat pendidikan", poin: 50 },
      { msg: "Pencurian, perjudian, atau penyalahgunaan narkotik", poin: 100 },
    ]}
  ];

  return (
    /* w-full dan min-h-screen memastikan konten memenuhi area tengah */
    <div className="w-full min-h-screen bg-slate-50 p-6 md:p-10 font-['Inter']">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-600 rounded-lg text-white shadow-lg shadow-red-200">
              <FiShield size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 font-['Manrope'] tracking-tight uppercase">
              Sanksi & Penghargaan
            </h1>
          </div>
          <p className="text-slate-500 font-medium">Sistem poin pelanggaran dan prestasi akademik Mahasiswa Anestesiologi.</p>
        </header>

        {/* Tab Navigasi */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
          {[
            { id: "umum", label: "Aturan Umum", icon: <FiInfo /> },
            { id: "sanksi", label: "Tabel Sanksi", icon: <FiTrendingDown /> },
            { id: "poin", label: "Acuan Poin", icon: <FiAlertTriangle /> },
            { id: "award", label: "Penghargaan", icon: <FiAward /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab.id ? "bg-[#003178] text-white shadow-md shadow-blue-200" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* BAGIAN: ATURAN UMUM */}
          {activeTab === "umum" && (
            <motion.div 
              key="umum"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <FiFileText className="text-blue-600" /> Prosedur & Ketentuan
                </h3>
                <ul className="space-y-5 text-sm text-slate-600 leading-relaxed font-medium">
                  <li className="flex gap-4">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">01</span>
                    Setiap mahasiswa memulai dengan nilai sanksi <span className="font-bold text-slate-900">0 (nol)</span> pada setiap awal tahap.
                  </li>
                  <li className="flex gap-4">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">02</span>
                    Kejadian morbiditas atau mortalitas wajib dilaporkan tertulis oleh Chief Residen ke Prodi.
                  </li>
                  <li className="flex gap-4">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">03</span>
                    Poin sanksi dievaluasi per tahap dan tidak diakumulasikan ke tahap selanjutnya.
                  </li>
                </ul>
              </div>

              <div className="bg-[#003178] p-8 rounded-[32px] text-white shadow-xl shadow-blue-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-black mb-4 uppercase tracking-widest text-blue-300 text-xs">Peringatan Kritis</h3>
                  <p className="text-2xl font-light leading-snug">
                    Jika akumulasi poin mencapai <span className="font-black text-blue-400">≥ 40</span>, mahasiswa wajib menghadap KPS/SPS untuk klarifikasi.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-blue-400/30 flex items-center gap-3">
                  <FiAlertTriangle className="text-yellow-400" />
                  <p className="text-xs font-medium opacity-80">Pelanggaran berat (100 poin) berakibat Drop Out.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* BAGIAN: TABEL SANKSI */}
          {activeTab === "sanksi" && (
            <motion.div 
              key="sanksi"
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Poin Akumulasi</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tindakan / Sanksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-['Inter']">
                    {sanksiKategori.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6 font-mono font-black text-red-500 text-lg group-hover:scale-110 transition-transform duration-300">{item.nilai}</td>
                        <td className="px-8 py-6 font-extrabold text-slate-700 text-sm italic">{item.kat}</td>
                        <td className="px-8 py-6 text-sm text-slate-600 font-semibold leading-relaxed">{item.sanksi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* BAGIAN: ACUAN POIN */}
          {activeTab === "poin" && (
            <motion.div key="poin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {acuanPoin.map((group, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#003178] mb-6 border-b border-slate-50 pb-4">{group.jenis}</h4>
                  <div className="space-y-6">
                    {group.data.map((row, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-4">
                        <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase">{row.msg}</p>
                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black ring-1 ring-red-100 shrink-0">{row.poin}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* BAGIAN: PENGHARGAAN */}
          {activeTab === "award" && (
            <motion.div 
              key="award"
              initial={{ opacity: 0, scale: 1.02 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-yellow-50 rounded-2xl text-yellow-500 border border-yellow-100">
                   <FiAward size={32} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">Poin Penghargaan (Reward)</h3>
                  <p className="text-sm text-slate-400 font-medium">Pengurangan nilai sanksi melalui prestasi akademik & non-akademik.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-slate-50 p-6 rounded-2xl">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6">Prestasi Ilmiah</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-600">Publikasi Internasional</span> <b className="text-[#003178] font-black">+15</b></div>
                    <div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-600">Lomba Ilmiah Nasional</span> <b className="text-[#003178] font-black">+10</b></div>
                    <div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-600">Oral Presentasi Int.</span> <b className="text-[#003178] font-black">+20</b></div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl">
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-6">Prestasi Umum</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-600">Juara Internasional</span> <b className="text-[#003178] font-black">+15</b></div>
                    <div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-600">Juara Nasional</span> <b className="text-[#003178] font-black">+10</b></div>
                    <div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-600">Juara Wilayah</span> <b className="text-[#003178] font-black">+5</b></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}