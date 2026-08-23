import { 
  FiClock, FiCheckSquare, FiAward, FiUsers, 
  FiArrowRight, FiCheckCircle, FiShield, FiAlertCircle, FiMail 
} from "react-icons/fi";

export default function DashboardDosen() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="space-y-8 font-['Inter'] w-full select-none pb-6">
      
      {/* 1. Header Profile Title */}
      <div className="font-['Manrope']">
        <h1 className="text-3xl font-extrabold text-[#003178] mb-1.5 tracking-tight">
          Selamat Pagi, {user?.name || "Dr. Hendra Kurniawan, Sp.An"}
        </h1>
        <p className="font-['Inter'] text-base font-medium text-slate-500">
          Anda memiliki <span className="text-[#003178] font-bold">14 entri logbook baru</span> yang menunggu validasi hari ini.
        </p>
      </div>

      {/* 2. Bento Grid Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
        {/* Antrian Validasi */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between w-full">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003178] text-2xl">
              <FiClock />
            </div>
            <span className="text-[11px] font-extrabold text-[#003178] bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100/60 uppercase">
              Action Required
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Antrian Validasi</p>
            <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[32px] leading-none">24</h2>
          </div>
        </div>

        {/* Divalidasi Hari Ini */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between w-full">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 text-2xl">
              <FiCheckSquare />
            </div>
            <span className="text-[11px] font-extrabold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">+12 Today</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Divalidasi hari ini</p>
            <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[32px] leading-none">12</h2>
          </div>
        </div>

        {/* MSF Belum Diisi */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between w-full">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 text-2xl">
              <FiAlertCircle />
            </div>
            <span className="text-[11px] font-extrabold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">High Priority</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">MSF Belum diisi</p>
            <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[32px] leading-none">08</h2>
          </div>
        </div>

        {/* Residen Dibimbing */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between w-full">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 text-2xl">
              <FiUsers />
            </div>
            <span className="text-[11px] font-extrabold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">Active</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Residen dibimbing</p>
            <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[32px] leading-none">05</h2>
          </div>
        </div>
      </div>

      {/* 3. Operational Grid Split Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full items-stretch">
        
        {/* Antrian Terbaru Section (2/3 width) */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-6">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full min-h-[460px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-8 px-2 select-none font-['Manrope']">
              <h3 className="text-xl font-bold text-slate-900 leading-none">Antrian Terbaru</h3>
              <button className="text-sm font-extrabold text-[#003178] hover:text-blue-800 transition-colors flex items-center gap-1 group uppercase tracking-widest">
                Lihat Semua <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {/* Case Entry 1 */}
              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-100 group/item">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-white shadow-sm group-hover/item:scale-105 transition-transform flex items-center justify-center font-bold text-[#003178] font-['Manrope'] text-lg">
                    AS
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-none">dr. Andi Saputra</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-medium text-slate-500">Appendectomy • General Anesthesia</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">Procedure</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-medium text-slate-400 mr-2">12m ago</span>
                  <button className="px-4 py-2 rounded-xl border border-[#003178] text-[#003178] text-xs font-extrabold hover:bg-[#003178]/5 transition-colors uppercase tracking-widest">Review</button>
                  <button className="px-4 py-2 rounded-xl bg-[#003178] text-white text-xs font-extrabold shadow-md hover:bg-blue-800 transition-all uppercase tracking-widest">Validate</button>
                </div>
              </div>

              {/* Case Entry 2 */}
              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-100 group/item">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-white shadow-sm group-hover/item:scale-105 transition-transform flex items-center justify-center font-bold text-[#003178] font-['Manrope'] text-lg">
                    SR
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-none">dr. Siti Rahma</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-medium text-slate-500">Epidural Block for Labor</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-widest">Case Report</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-medium text-slate-400 mr-2 font-['Inter']">45m ago</span>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2 rounded-xl bg-orange-50 text-orange-700 text-[10px] font-black flex items-center gap-1 border border-orange-200 uppercase tracking-widest">
                      <FiClock /> Returned
                    </span>
                    <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 text-xs font-extrabold hover:bg-slate-100 transition-colors uppercase tracking-widest">Details</button>
                  </div>
                </div>
              </div>

              {/* Case Entry 3 */}
              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-100 group/item">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-white shadow-sm group-hover/item:scale-105 transition-transform flex items-center justify-center font-bold text-[#003178] font-['Manrope'] text-lg">
                    BW
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-none">dr. Budi Wijaya</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-medium text-slate-500">Intravenous Cannulation</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-[10px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase tracking-widest">Validated</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-medium text-slate-400 mr-2 font-['Inter']">2h ago</span>
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 border border-green-200 shadow-sm">
                    <FiCheckCircle className="text-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extended Progress Mentorship */}
          <div className="bg-[#003178] text-white rounded-[32px] p-8 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group select-none flex-1 min-h-[170px] flex flex-col justify-between">
            <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col justify-between h-full gap-4">
              <div>
                <h3 className="font-['Manrope'] font-bold text-xl mb-2">Bimbingan Residen</h3>
                <p className="text-blue-200 text-sm max-w-md">Total pencapaian target prosedur residen di bawah supervisi Anda bulan ini.</p>
              </div>
              <div className="space-y-4 max-w-lg">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-100/70">Pencapaian Target</span>
                    <span className="text-sm font-bold">72%</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-all duration-1000 w-[72%] shadow-[0_0_12px_rgba(255,255,255,0.4)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Urgent Alert Panel Section (1/3 Width Column) */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full justify-between">
          
          {/* Action Alerts Card (Height Responsive) */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-auto flex flex-col justify-between gap-6">
            <h3 className="font-['Manrope'] font-bold text-slate-800 flex items-center gap-3 text-lg leading-none select-none">
              <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                <FiAlertCircle className="text-red-500 text-base" />
              </div>
              Alert Penting
            </h3>

            <div className="space-y-4">
              {/* Alert 1 */}
              <div className="bg-red-50/40 p-4.5 rounded-2xl border-l-4 border-red-500 hover:bg-red-50 transition-colors">
                <div className="flex justify-between items-start mb-1.5">
                  <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight">MSF Belum Diisi</h5>
                  <span className="text-[9px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded tracking-widest select-none">URGENT</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">Penilaian 360 derajat untuk <strong className="text-slate-700">dr. Andi Saputra</strong> melewati tenggat waktu 2 hari.</p>
                <button className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-extrabold rounded-xl transition-all shadow-md shadow-red-200 uppercase tracking-widest">Isi MSF Sekarang</button>
              </div>

              {/* Alert 2 */}
              <div className="bg-amber-50/40 p-4.5 rounded-2xl border-l-4 border-amber-400 hover:bg-amber-50 transition-colors">
                <div className="flex justify-between items-start mb-1.5">
                  <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight">Laporan Tertunda</h5>
                  <span className="text-[9px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded tracking-widest select-none">WARNING</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">Ada <strong className="text-slate-700">3 laporan kasus</strong> dari <strong className="text-slate-700">dr. Siti Rahma</strong> yang belum Anda tinjau selama seminggu.</p>
                <button className="w-full py-2.5 border border-amber-200 bg-white text-amber-700 hover:bg-amber-100 text-[11px] font-extrabold rounded-xl transition-all uppercase tracking-widest">Buka Laporan</button>
              </div>
            </div>
          </div>

          {/* Validation Guidelines Tips Box */}
          <div className="bg-slate-900 text-white rounded-[32px] shadow-2xl p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group h-auto flex flex-col justify-between gap-6 select-none">
            <div className="absolute -right-8 -top-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <FiShield className="text-9xl" />
            </div>
            <div>
              <h3 className="font-['Manrope'] font-bold text-lg mb-3 flex items-center gap-2 relative z-10 leading-none">
                <FiAward className="text-blue-400" /> Tips Validasi Cepat
              </h3>
              <p className="text-sm text-slate-400 mb-2 font-['Inter'] leading-relaxed relative z-10">
                Gunakan filter "Bulk Action" untuk memvalidasi entri rutin secara bersamaan dan hemat waktu pengerjaan hingga 40%.
              </p>
            </div>
            <button className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-extrabold rounded-xl transition-all border border-white/10 tracking-widest uppercase relative z-10">
              Pelajari Selengkapnya
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}