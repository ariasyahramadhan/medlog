import { 
  FiActivity, FiArrowRight, FiCheckCircle, FiClock, 
  FiFileText, FiMail, FiShield, FiTrendingUp 
} from "react-icons/fi";

export default function DashboardMahasiswa() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="space-y-8 font-['Inter'] w-full select-none pb-6">
      {/* Header Profile Title */}
      <div className="font-['Manrope']">
        <h1 className="text-3xl font-extrabold text-[#003178] mb-1.5 tracking-tight">
          Selamat Pagi, {user?.name || "Ariful Fikri"}
        </h1>
        <p className="font-['Inter'] text-sm font-medium text-slate-500">
          Lacak kemajuan rotasi klinis dan verifikasi logbook harian Anda
        </p>
      </div>

      {/* Bento Stats Grid - Stretch Full Width */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
        {/* Total Kasus */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between w-full">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003178] text-2xl">
              <FiFileText />
            </div>
            <span className="text-[11px] font-extrabold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              +12 Hari ini
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Kasus</p>
            <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[32px] leading-none">1,015</h2>
          </div>
        </div>

        {/* Progres */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between w-full">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 text-2xl">
              <FiActivity />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-bold text-slate-600 uppercase">On Track</span>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Progres Kompetensi</p>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[32px] leading-none">90%</h2>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[90%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between w-full">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 text-2xl">
              <FiClock />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Menunggu Verifikasi</p>
            <div className="flex items-baseline gap-2">
              <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[32px] leading-none">26</h2>
              <span className="text-xs font-bold text-amber-600">Entri baru</span>
            </div>
          </div>
        </div>

        {/* Informasi Akademik */}
        <div className="bg-[#003178] text-white p-7 rounded-[24px] shadow-xl shadow-blue-900/10 flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 w-full min-h-[170px]">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-blue-200/80 uppercase tracking-widest mb-2">Informasi Akademik</p>
            <h3 className="font-['Manrope'] font-bold text-white mb-2 leading-tight text-xl">Semester 7 - Clinical Rotation</h3>
            <p className="text-[11px] font-medium text-blue-100/70">Dept: Cardiology & Internal Medicine</p>
          </div>
          <button className="relative z-10 mt-4 text-xs font-extrabold flex items-center gap-2 text-white group/btn">
            Detail Akademik 
            <FiArrowRight className="transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Dashboard Split Sections - Edge-to-Edge Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
        
        {/* Main Analytical Data Section (2/3 width) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full flex flex-col justify-between min-h-[420px]">
            <div className="flex justify-between items-start mb-8">
              <div className="font-['Manrope']">
                <h3 className="text-lg font-bold text-slate-900 mb-1 leading-none uppercase tracking-wide">Statistik Kompetensi</h3>
                <p className="text-sm font-medium font-['Inter'] text-slate-400">Pencapaian kompetensi per departemen (Target 100% cascades)</p>
              </div>
              <select className="bg-slate-50 border-slate-200 rounded-xl text-[11px] font-extrabold text-slate-600 py-2 px-4 focus:ring-[#003178]/20 focus:border-[#003178] transition-all cursor-pointer outline-none">
                <option>Semester Ini</option>
                <option>Bulan Ini</option>
              </select>
            </div>

            {/* Simulated Analytical Graph */}
            <div className="flex-1 flex items-end justify-between h-[300px] px-6 border-b border-slate-50">
              {[
                { label: "Bedah", height: "h-[65%]" },
                { label: "Interna", height: "h-[85%]" },
                { label: "Anak", height: "h-[40%]" },
                { label: "Obgyn", height: "h-[95%]" },
                { label: "THT", height: "h-[55%]" },
                { label: "Mata", height: "h-[75%]" }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-5 w-16 group/bar">
                  <div className="w-10 bg-slate-100 rounded-full h-full relative overflow-hidden cursor-pointer">
                    <div className={`absolute bottom-0 left-0 w-full bg-[#003178] rounded-full transition-all duration-700 ${item.height} group-hover/bar:bg-blue-600`}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Bottom Meta Content */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#003178] shadow-sm shadow-[#003178]/20"></div>
                  <span className="text-xs font-bold text-slate-600">Tervalidasi</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200"></div>
                  <span className="text-xs font-bold text-slate-400">Target Belum Tercapai</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 px-4 py-2 rounded-full">
                <FiClock className="text-sm" /> Update: 2 jam yang lalu
              </div>
            </div>
          </div>

          {/* Activity Feeds */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full">
            <div className="flex justify-between items-center mb-6 font-['Manrope']">
              <h3 className="text-lg font-bold text-slate-900 leading-none">Aktivitas Terakhir</h3>
              <button className="text-sm font-extrabold text-[#003178] hover:text-blue-800 transition-colors flex items-center gap-1 group uppercase tracking-wider">
                Lihat Semua <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { title: "Appendectomy Case Entry", subtitle: "RS Pendidikan Utama • 10:24 AM", icon: <FiCheckCircle />, bg: "bg-green-50 text-green-600 border-green-100", status: "Validated", badge: "bg-green-100/50 text-green-700 border-green-200" },
                { title: "Cardiology Consultation", subtitle: "Poli Jantung • 08:15 AM", icon: <FiClock />, bg: "bg-amber-50 text-amber-600 border-amber-100", status: "Pending", badge: "bg-amber-100/50 text-amber-700 border-amber-200" },
                { title: "Daily Ward Rounds", subtitle: "Instalasi Rawat Inap • Kemarin", icon: <FiFileText />, bg: "bg-blue-50 text-[#003178] border-blue-100", status: "Validated", badge: "bg-green-100/50 text-green-700 border-green-200" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 cursor-pointer group/item">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center border shadow-sm transition-transform group-hover/item:scale-105 text-2xl`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-none">{item.title}</h4>
                      <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-tight">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`px-4 py-1.5 rounded-full ${item.badge} text-[10px] font-extrabold uppercase tracking-widest border`}>
                      {item.status}
                    </span>
                    <FiArrowRight className="text-slate-300 text-lg group-hover/item:text-[#003178] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Structural Info Panel (1/3 width) */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          
          {/* Status Box */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-auto">
            <h3 className="font-['Manrope'] font-bold text-slate-800 mb-6 flex items-center gap-3 text-lg leading-none">
              <div className="w-8 h-8 bg-[#003178]/5 rounded-lg flex items-center justify-center">
                <FiShield className="text-[#003178] text-base" />
              </div>
              Status Verifikasi
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-400">Logbook Dikirim</span>
                <span className="font-extrabold text-slate-800">124</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-400">Sudah Diverifikasi</span>
                <span className="font-extrabold text-green-600">98</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-400">Menunggu Respon</span>
                <span className="font-extrabold text-amber-600">26</span>
              </div>
              <div className="pt-6 border-t border-slate-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Rate Verifikasi</span>
                  <span className="text-sm font-extrabold text-[#003178]">79%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#003178] h-full w-[79%] rounded-full"></div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-4 text-center italic">Performa verifikasi stabil bulan ini</p>
              </div>
            </div>
          </div>

          {/* Dynamic Reminders Timeline (Fix Terpotong) */}
          <div className="bg-slate-900 text-white rounded-[32px] shadow-2xl p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group h-auto flex flex-col justify-between gap-6">
            <div className="absolute -right-8 -top-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <FiClock className="text-9xl" />
            </div>
            <div>
              <h3 className="font-['Manrope'] font-bold text-lg mb-4 relative z-10 uppercase tracking-wider leading-none">Tenggat Waktu</h3>
              <ul className="space-y-3 relative z-10">
                <li className="bg-white/10 p-3.5 rounded-2xl border border-white/5 hover:bg-white/15 transition-all duration-200 cursor-pointer group/task">
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="text-[10px] font-extrabold text-blue-300 uppercase tracking-widest">2 Hari Lagi</p>
                    <FiClock className="text-xs text-white/40 group-hover/task:text-white transition-colors" />
                  </div>
                  <p className="text-sm font-bold leading-snug">Laporan Refleksi Kasus Bedah Digestif</p>
                </li>
                <li className="bg-white/10 p-3.5 rounded-2xl border border-white/5 hover:bg-white/15 transition-all duration-200 cursor-pointer group/task">
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="text-[10px] font-extrabold text-blue-300 uppercase tracking-widest">5 Hari Lagi</p>
                    <FiClock className="text-xs text-white/40 group-hover/task:text-white transition-colors" />
                  </div>
                  <p className="text-sm font-bold leading-snug">Validasi Buku Saku Semester 7</p>
                </li>
              </ul>
            </div>
            <button className="w-full py-3.5 bg-white hover:bg-blue-50 text-slate-900 text-xs font-extrabold rounded-xl active:scale-95 transition-all shadow-lg uppercase tracking-wider relative z-10">
              Buka Kalender
            </button>
          </div>

          {/* Quick Support Contact */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-auto flex flex-col justify-between">
            <h3 className="font-['Manrope'] font-bold text-slate-800 mb-4 text-lg uppercase tracking-wide leading-none">Pembimbing Akademik</h3>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="w-14 h-14 bg-slate-200 border border-slate-300 text-[#003178] rounded-xl flex items-center justify-center font-extrabold text-lg shadow-sm font-['Manrope']">
                SW
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-extrabold text-slate-900 leading-tight">Dr. dr. Sarah Wijaya, Sp.B</h4>
                <p className="text-[11px] font-bold text-slate-400 mt-1">Spesialis Bedah Umum</p>
              </div>
            </div>
            <button className="w-full mt-5 flex items-center justify-center gap-2 py-3.5 border-2 border-slate-100 rounded-xl text-xs font-extrabold text-slate-600 hover:bg-slate-50 hover:border-slate-200 active:scale-95 transition-all group uppercase tracking-widest">
              <FiMail className="text-base group-hover:text-[#003178]" /> Kirim Pesan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}