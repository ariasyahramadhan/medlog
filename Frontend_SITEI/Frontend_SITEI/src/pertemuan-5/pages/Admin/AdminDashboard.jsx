import { 
  FiUsers, FiAward, FiPlus, FiArrowRight, FiShield, 
  FiGrid, FiSettings, FiCheckSquare, FiAlertCircle 
} from "react-icons/fi";

export default function DashboardAdmin() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="space-y-8 font-['Inter'] w-full select-none pb-6">
      
      {/* Header Profile Title */}
      <div className="font-['Manrope']">
        <h1 className="text-3xl font-extrabold text-[#003178] mb-1.5 tracking-tight">
          Selamat Datang, {user?.name || "Administrator"}!
        </h1>
        <p className="font-['Inter'] text-base font-medium text-slate-500">
          Kelola sistem logbook dan pantau aktivitas mahasiswa secara menyeluruh
        </p>
      </div>

      {/* Bento Stats Grid - Stretch Full Width */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
        {/* Total Mahasiswa */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between w-full">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003178] text-2xl">
              <FiUsers />
            </div>
            <span className="text-[11px] font-extrabold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">+12 this month</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Mahasiswa</p>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[32px] leading-none">256</h2>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[#003178] h-full w-[75%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Dosen */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between w-full">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 text-2xl">
              <FiAward />
            </div>
            <span className="text-[11px] font-extrabold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">+3 this month</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Dosen</p>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[32px] leading-none">45</h2>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[40%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Support */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between w-full">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 text-2xl">
              <FiAlertCircle />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Support</p>
            <div className="flex items-baseline gap-2">
              <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-[32px] leading-none">4</h2>
              <span className="text-xs font-bold text-amber-600">Tickets unresolved</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[#003178] text-white p-7 rounded-[24px] shadow-xl shadow-blue-900/10 flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 w-full min-h-[170px]">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-blue-200/80 uppercase tracking-widest mb-2">System Status</p>
            <h3 className="font-['Manrope'] font-bold text-white mb-2 leading-tight text-xl">All Modules Operational</h3>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-[11px] font-medium text-blue-100/70">Database Integrity: 100%</p>
            </div>
          </div>
          <button className="relative z-10 mt-4 text-xs font-extrabold flex items-center gap-2 text-white group/btn">
            View Audit Logs 
            <FiArrowRight className="transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Dashboard Split Sections - Edge-to-Edge Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
        
        {/* System Activity Timeline (2/3 width) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full min-h-[420px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-8 px-2 select-none font-['Manrope']">
              <h3 className="text-lg font-bold text-slate-900 leading-none">System Activity Overview</h3>
              <button className="text-sm font-extrabold text-[#003178] hover:text-blue-800 transition-colors flex items-center gap-1 group uppercase tracking-widest">
                View All Activities <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {/* Row 1 */}
              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-100 group/item">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#003178] border border-blue-100 shadow-sm group-hover/item:scale-105 transition-transform text-2xl">
                    <FiPlus />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-none">New student registration <span className="text-slate-400 font-medium font-['Inter']">for Dr. Sarah's Program</span></h4>
                    <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-tight">Today at 10:45 AM • Admin ID: #AD-902</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="px-4 py-1.5 rounded-full bg-blue-100/50 text-blue-700 text-[10px] font-extrabold uppercase tracking-widest border border-blue-200">User Management</span>
                  <FiArrowRight className="text-slate-300 text-lg group-hover/item:text-[#003178] transition-colors" />
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-100 group/item">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shadow-sm group-hover/item:scale-105 transition-transform text-2xl">
                    <FiShield />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-none">Database Schema Update <span className="text-slate-400 font-medium font-['Inter']">successfully applied</span></h4>
                    <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-tight">Today at 08:30 AM • Auto-System</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="px-4 py-1.5 rounded-full bg-orange-100/50 text-orange-700 text-[10px] font-extrabold uppercase tracking-widest border border-orange-200">System</span>
                  <FiArrowRight className="text-slate-300 text-lg group-hover/item:text-[#003178] transition-colors" />
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-100 group/item">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100 shadow-sm group-hover/item:scale-105 transition-transform text-2xl">
                    <FiCheckSquare />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-none">Batch Validation Completed <span className="text-slate-400 font-medium font-['Inter']">by Prof. Wijaya</span></h4>
                    <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-tight">Yesterday at 04:12 PM • Verification Engine</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="px-4 py-1.5 rounded-full bg-green-100/50 text-green-700 text-[10px] font-extrabold uppercase tracking-widest border border-green-200">Validation</span>
                  <FiArrowRight className="text-slate-300 text-lg group-hover/item:text-[#003178] transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* System Health Monitoring Section */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full min-h-[170px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 leading-none font-['Manrope'] uppercase tracking-wide">System Health Monitoring</h3>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Real-time
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Uptime</span>
                  <span className="text-lg font-extrabold text-slate-900">99.98%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[99.98%] rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Latency</span>
                  <span className="text-lg font-extrabold text-slate-900">24ms</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#003178] h-full w-[24%] rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Capacity</span>
                  <span className="text-lg font-extrabold text-slate-900">68%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[68%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Section (1/3 width Column) */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full justify-between">
          
          {/* Quick Shortcuts Box */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-auto flex flex-col justify-between flex-1">
            <h3 className="font-['Manrope'] font-bold text-slate-800 mb-6 flex items-center gap-3 text-lg leading-none">
              <div className="w-8 h-8 bg-[#003178]/5 rounded-lg flex items-center justify-center">
                <FiGrid className="text-[#003178] text-base" />
              </div>
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center gap-3 p-4 bg-slate-50/60 rounded-[24px] border border-slate-100 hover:border-[#003178]/30 hover:bg-white hover:shadow-md transition-all group">
                <FiPlus className="text-[#003178] text-xl group-hover:scale-110 transition-transform" />
                <span className="text-xs font-extrabold text-slate-600 uppercase tracking-tight">Add Student</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 bg-slate-50/60 rounded-[24px] border border-slate-100 hover:border-[#003178]/30 hover:bg-white hover:shadow-md transition-all group">
                <FiUsers className="text-[#003178] text-xl group-hover:scale-110 transition-transform" />
                <span className="text-xs font-extrabold text-slate-600 uppercase tracking-tight">Faculty Management</span>
              </button>
            </div>
          </div>

          {/* Dynamic Module Capacity Graph Card */}
          <div className="bg-slate-900 text-white rounded-[32px] shadow-2xl p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col justify-between flex-1 gap-6 select-none">
            <div className="absolute -right-8 -top-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <FiShield className="text-9xl" />
            </div>
            <div>
              <h3 className="font-['Manrope'] font-bold text-lg mb-4 relative z-10 uppercase tracking-wider leading-none">Module Capacity</h3>
              <div className="space-y-4 relative z-10">
                <div>
                  <div className="flex justify-between text-[11px] font-extrabold text-blue-300 uppercase tracking-widest mb-2 leading-none">
                    <span>Logbook Storage</span>
                    <span>68%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="bg-[#003178] h-full w-[68%] rounded-full shadow-[0_0_10px_rgba(0,49,120,0.5)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-extrabold text-blue-300 uppercase tracking-widest mb-2 leading-none">
                    <span>Concurrent Users</span>
                    <span>42/100</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full w-[42%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Technical Help Desk Card */}
          <div className="bg-blue-50/60 rounded-[32px] shadow-sm border border-blue-100 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between flex-1">
            <div className="flex items-center gap-4 mb-4 select-none">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#003178] shadow-sm">
                <FiSettings className="text-xl" />
              </div>
              <div>
                <h3 className="font-['Manrope'] font-bold text-slate-900 text-lg leading-none">System Help Desk</h3>
                <p className="text-xs font-medium font-['Inter'] text-slate-400 mt-1 uppercase">Technical Support</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed font-['Inter']">
              Akses dokumentasi internal atau hubungi developer untuk melaporkan isu sistem logbook.
            </p>
            <button className="w-full py-3.5 bg-white hover:bg-blue-50 text-[#003178] text-xs font-extrabold rounded-xl transition-all border border-blue-100/50 active:scale-95 uppercase tracking-widest">
              Open Help Desk
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}