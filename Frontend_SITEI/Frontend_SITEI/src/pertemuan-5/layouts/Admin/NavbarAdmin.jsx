import { FiSearch, FiBell, FiMenu } from "react-icons/fi";

export default function NavbarAdmin({ user, onMenuClick }) {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 lg:h-20 bg-white/70 backdrop-blur-xl flex justify-between items-center px-4 lg:px-10 z-30 border-b border-slate-200/60 font-['Manrope'] select-none">
      {/* Left: Hamburger (mobile) + Search (desktop) */}
      <div className="flex items-center gap-3 flex-1">
        {/* Hamburger button — hanya tampil di mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Buka menu"
        >
          <FiMenu size={20} />
        </button>

        {/* Search input — tersembunyi di mobile kecil, tampil di sm ke atas */}
        <div className="hidden sm:flex items-center bg-slate-100/60 px-4 py-2.5 rounded-2xl w-full max-w-xs lg:max-w-[400px] border border-slate-200/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#003178]/10 transition-all">
          <FiSearch className="text-slate-400 mr-3 text-lg shrink-0" />
          <input
            className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full placeholder-slate-400 font-['Inter'] font-medium"
            placeholder="Cari log sistem atau pengguna..."
            type="text"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 lg:gap-5 shrink-0">
        <div className="relative cursor-pointer hover:bg-slate-100 p-2 rounded-xl transition-all">
          <FiBell className="text-slate-500 text-xl" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </div>

        <div className="flex items-center gap-2 lg:gap-3 bg-white p-1.5 pr-3 lg:pr-4 rounded-2xl border border-slate-200/60 cursor-pointer hover:shadow-md transition-all">
          <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-extrabold text-[#003178] text-sm font-['Manrope'] shadow-sm">
            AD
          </div>
          <div className="hidden sm:flex flex-col font-['Inter'] text-left">
            <span className="text-xs font-extrabold text-slate-800 leading-none">
              {user?.name || "Administrator"}
            </span>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5">Super User</span>
          </div>
        </div>
      </div>
    </header>
  );
}