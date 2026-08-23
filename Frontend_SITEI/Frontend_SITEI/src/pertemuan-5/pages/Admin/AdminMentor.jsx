import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  FiUserCheck, FiSearch, FiUsers, 
  FiUserPlus, FiFilter, FiCheckCircle, FiChevronRight 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMentor() {
  const [data, setData] = useState({ students: [], lecturers: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveTab] = useState("Semua");

  const API_URL = "https://api.sigmaeducation.id/api";

  const fetchContent = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/mentorship`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContent(); }, []);

  const handleUpdateMentor = async (studentId, lecturerId) => {
    if (!lecturerId) return;
    try {
      await axios.post(`${API_URL}/admin/update-mentor`, 
        { student_id: studentId, lecturer_id: lecturerId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
      );
      Swal.fire({
        title: "Berhasil!",
        text: "Relasi bimbingan diperbarui.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        confirmButtonColor: "#003178",
      });
      fetchContent();
    } catch (err) {
      Swal.fire("Gagal", "Tidak dapat menyimpan perubahan", "error");
    }
  };

  const filteredStudents = data.students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.identifier.includes(search);
    const hasMentor = !!s.mentorship?.dosen;
    
    if (activeFilter === "Terplot") return matchesSearch && hasMentor;
    if (activeFilter === "Belum") return matchesSearch && !hasMentor;
    return matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-white p-6 md:p-10 font-['Inter']"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-10">
          <div>
            <h1 className="text-3xl font-black text-[#003178] font-['Manrope'] tracking-tight uppercase">
              Plotting Konsulen
            </h1>
            <p className="text-slate-400 font-medium mt-2 text-sm">
              Distribusi Mahasiswa Residen kepada Dosen Pembimbing Akademik.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003178] transition-colors" />
              <input 
                type="text" 
                placeholder="Cari Residen..." 
                className="pl-12 pr-6 py-3 w-full sm:w-80 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#003178]/10 transition-all"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Minimalist Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex bg-slate-50 p-1.5 rounded-2xl w-fit">
            {["Semua", "Terplot", "Belum"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === tab 
                    ? "bg-white text-[#003178] shadow-sm shadow-[#003178]/5" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "Belum" ? "Belum Terplot" : tab}
              </button>
            ))}
          </div>
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            Total: {filteredStudents.length} Mahasiswa
          </div>
        </div>

        {/* Clean List Design */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="py-20 text-center text-slate-300 font-black uppercase tracking-widest animate-pulse text-xs">
                Syncing Database...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-20 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Data Tidak Ditemukan</p>
              </div>
            ) : filteredStudents.map((std) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                key={std.id}
                className="group flex flex-col md:flex-row items-center justify-between p-5 bg-white border border-slate-100 rounded-[24px] hover:border-[#003178]/20 hover:bg-blue-50/30 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {/* Info Mahasiswa */}
                <div className="flex items-center gap-5 flex-1 w-full">
                  <div className="w-12 h-12 rounded-2xl bg-[#003178] flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-blue-900/10">
                    {std.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-[#003178] transition-colors">
                      {std.name}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      NIM: {std.identifier}
                    </p>
                  </div>
                </div>

                {/* Info Pembimbing (Visible on MD+) */}
                <div className="hidden lg:flex items-center gap-3 flex-1 justify-center">
                  {std.mentorship?.dosen ? (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#003178] rounded-full border border-blue-100">
                      <FiCheckCircle className="text-xs" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        {std.mentorship.dosen.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 text-slate-300 rounded-full border border-slate-100">
                      <span className="text-[10px] font-black uppercase tracking-tighter italic">
                        Belum Terhubung
                      </span>
                    </div>
                  )}
                </div>

                {/* Selector */}
                <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                  <div className="relative w-full md:w-72 group">
                    <select 
                      className={`w-full py-2.5 px-4 rounded-xl text-[11px] font-black uppercase tracking-wider outline-none border-2 transition-all cursor-pointer appearance-none
                        ${std.mentorship?.dosen 
                          ? "bg-white border-slate-100 text-slate-600 focus:border-[#003178]" 
                          : "bg-blue-50 border-blue-200 text-[#003178] focus:bg-white focus:border-[#003178] animate-none"}
                      `}
                      value={std.mentorship?.lecturer_id || ""}
                      onChange={(e) => handleUpdateMentor(std.id, e.target.value)}
                    >
                      <option value="" disabled>Pilih Konsulen</option>
                      {data.lecturers.map(lec => (
                        <option key={lec.id} value={lec.id}>{lec.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                       <FiChevronRight className="group-hover:rotate-90 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}