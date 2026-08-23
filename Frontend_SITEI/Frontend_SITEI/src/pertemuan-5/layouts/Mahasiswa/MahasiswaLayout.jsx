import { Outlet, useNavigate } from "react-router-dom";
import { FiHome, FiBook, FiLogOut, FiUser } from "react-icons/fi";

export default function MahasiswaLayout() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <div className="min-h-screen bg-[#F4F7FE] flex font-sans">
            <aside className="w-72 bg-[#1e4f8a] text-white p-8 flex flex-col justify-between shadow-2xl">
                <div>
                    <div className="mb-12">
                        <h1 className="text-2xl font-black tracking-tighter italic">STUDENT<span className="text-blue-300">HUB</span></h1>
                    </div>
                    <nav className="space-y-4">
                        <div className="p-4 bg-white/10 rounded-2xl flex items-center gap-4 font-bold cursor-pointer hover:bg-white/20 transition-all">
                            <FiHome /> Dashboard
                        </div>
                        <div className="p-4 flex items-center gap-4 font-bold text-white/60 cursor-pointer hover:text-white transition-all">
                            <FiBook /> Logbook Saya
                        </div>
                    </nav>
                </div>
                <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="p-4 bg-red-500/20 hover:bg-red-500 rounded-2xl flex items-center gap-4 font-black transition-all uppercase text-[10px] tracking-widest">
                    <FiLogOut /> Logout
                </button>
            </aside>
            <main className="flex-1 p-10 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Portal Mahasiswa</h2>
                    <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-sm border border-gray-100">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white shadow-md">M</div>
                        <span className="font-bold text-sm text-slate-600">{user.name || "Mahasiswa"}</span>
                    </div>
                </header>
                <Outlet />
            </main>
        </div>
    );
}