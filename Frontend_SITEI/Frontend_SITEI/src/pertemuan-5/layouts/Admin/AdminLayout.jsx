import { Outlet, useNavigate } from "react-router-dom";
import { FiShield, FiSettings, FiDatabase, FiLogOut } from "react-icons/fi";

export default function AdminLayout() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[#0F172A] flex font-sans">
            <aside className="w-72 bg-slate-900 text-white p-8 border-r border-white/5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-black">A</div>
                        <h1 className="text-xl font-black uppercase tracking-tighter">Master Control</h1>
                    </div>
                    <nav className="space-y-3">
                        <div className="p-4 bg-red-600 rounded-xl flex items-center gap-4 font-bold shadow-lg shadow-red-600/20">
                            <FiShield /> Admin Center
                        </div>
                        <div className="p-4 flex items-center gap-4 font-bold text-slate-500 hover:text-white transition-all cursor-pointer">
                            <FiDatabase /> Database
                        </div>
                    </nav>
                </div>
                <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="p-4 bg-slate-800 hover:bg-red-600 rounded-xl flex items-center gap-4 font-bold transition-all uppercase text-[10px] tracking-widest">
                    <FiLogOut /> Shut Down
                </button>
            </aside>
            <main className="flex-1 p-10 overflow-y-auto bg-slate-950">
                <div className="max-w-6xl mx-auto"><Outlet /></div>
            </main>
        </div>
    );
}