import React from "react";
import { 
  FiInfo, FiCheckCircle, FiFileText, FiActivity, FiUser, 
  FiAlertCircle, FiClipboard, FiBook, FiAward, FiFilePlus, FiShield
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function PanduanLogbook() {
  const sections = [
    {
      title: "I. Evaluasi & Kegiatan Ilmiah",
      color: "bg-blue-500",
      icon: <FiFileText />,
      content: [
        { label: "Lembar Evaluasi", desc: "Prasyarat ujian dicek list oleh sekretariat IPDS & diverifikasi TPPM. Nilai diisi sekretariat setelah ujian." },
        { label: "Kegiatan Ilmiah", desc: "Poster, Proposal, Tesis, dan Publikasi diisi sejak masa bimbingan hingga presentasi selesai." }
      ]
    },
    {
      title: "II. Rekapitulasi Kasus & CBD",
      color: "bg-emerald-500",
      icon: <FiActivity />,
      content: [
        { label: "Rekapitulasi", desc: "Diisi pada tiap kenaikan tahap mengacu pada standar kompetensi buku kurikulum." },
        { label: "CBD", desc: "Case Based Discussion diisi segera oleh konsulen mulai persiapan preoperative hingga pasca operative." }
      ]
    },
    {
      title: "III. Procedural Skill (Klinis)",
      color: "bg-purple-500",
      icon: <FiCheckCircle />,
      content: [
        { label: "Ketentuan", desc: "Dibimbing minimal 3 kali secara langsung oleh konsulen. Dilengkapi peserta sebelum bimbingan." },
        { label: "Semester 1", desc: "GA-IV, GA-FM, GA-LMA, GA-OTT Mallampati 1-2, Cormack I-II, GA-NTT." },
        { label: "Semester 3", desc: "GA OTT RSI, RA-BSA (non-complicated), RA-Blok Perifer basic, Pain Management PCA." },
        { label: "Semester 5+", desc: "RA BSA Laparotomi, GA FM Neonatus, CVC Jugularis (USG Guide), Arteri Line, TIVA manual." }
      ]
    },
    {
      title: "IV. Evaluasi Kerja (DOPS/MSF)",
      color: "bg-orange-500",
      icon: <FiAward />,
      content: [
        { label: "DOPS & A-Cex", desc: "Wajib diisi segera setelah evaluasi selesai oleh konsulen yang bersangkutan." },
        { label: "MSF", desc: "Multi Source Feedback diisi minggu terakhir stase oleh tim medis (Anestesi, Perawat, Bedah)." }
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="w-full min-h-full bg-slate-50 p-6 md:p-10 font-['Inter']"
    >
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#003178] rounded-lg text-white">
            <FiBook size={24} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-['Manrope'] tracking-tight">
            Panduan Pengisian Logbook
          </h1>
        </div>
        <p className="text-slate-500 font-medium">
          Standar Operasional Prosedur pengisian data akademik dan klinis Anestesiologi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className={`p-6 ${section.color} text-white flex items-center gap-4`}>
              <span className="text-2xl">{section.icon}</span>
              <h3 className="font-extrabold text-lg uppercase tracking-wider">{section.title}</h3>
            </div>
            <div className="p-8 space-y-6 flex-1">
              {section.content.map((item, i) => (
                <div key={i} className="group">
                  <h4 className="text-[#003178] font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:scale-150 transition-transform"></span>
                    {item.label}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer Info / Legend Card */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[32px] p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <FiShield className="text-blue-400 text-2xl" />
            <h3 className="font-bold text-xl font-['Manrope']">Legenda & Kode Penilaian</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2 border-l-2 border-blue-500 pl-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Jenis Pelanggaran</p>
              <p className="text-sm"><b>K</b> (Kognitif), <b>P</b> (Psikomotor), <b>A</b> (Afektif)</p>
            </div>
            <div className="space-y-2 border-l-2 border-emerald-500 pl-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Status Pasien</p>
              <p className="text-sm"><b>E</b> (Emergency), <b>N</b> (Non-Emergency)</p>
            </div>
            <div className="space-y-2 border-l-2 border-orange-500 pl-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Ketidakhadiran</p>
              <p className="text-sm">Mulai diperbolehkan Semester 3 dengan ijin KPS/SPS.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}