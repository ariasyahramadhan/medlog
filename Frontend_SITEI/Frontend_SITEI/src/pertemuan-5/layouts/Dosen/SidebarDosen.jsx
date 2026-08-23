import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  FiHome, FiCheckSquare, FiClock, FiFileText, 
  FiBookOpen, FiActivity, FiAlertCircle, FiSettings, FiLogOut, FiPlus 
} from "react-icons/fi";

export default function SidebarDosen() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuSections = [
    {
      title: "Menu Utama",
      items: [
        { name: "Beranda", icon: <FiHome />, path: "/dosen/dashboard" }
      ]
    },
    {
      title: "Validasi Kasus",
      items: [
        { name: "Antrian & Bukti", icon: <FiCheckSquare />, path: "/dosen/validasi" },
        { name: "Riwayat Validasi", icon: <FiClock />, path: "/dosen/riwayat" }
      ]
    },
    {
      title: "Penilaian",
      items: [
        { name: "Form CBD", icon: <FiFileText />, path: "/dosen/cbd" },
        { name: "Form DOPS", icon: <FiFileText />, path: "/dosen/dops" },
        { name: "Form A-Cex", icon: <FiFileText />, path: "/dosen/a-cex" },
        { name: "Form MSF", icon: <FiFileText />, path: "/dosen/msf" },
        { name: "Bimbingan Skill", icon: <FiBookOpen />, path: "/dosen/bimbingan" }
      ]
    },
    {
      title: "Monitoring",
      items: [
        { name: "Progres Residen", icon: <FiActivity />, path: "/dosen/progres" },
        { name: "Input Sanksi", icon: <FiAlertCircle />, path: "/dosen/sanksi" }
      ]
    },
    {
      title: "Pengaturan",
      items: [
        { name: "Pengaturan Akun", icon: <FiSettings />, path: "/dosen/pengaturan" }
      ]
    }
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Keluar",
      text: "Apakah Anda yakin ingin keluar dari sistem?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider mx-2 outline-none border-none",
        cancelButton: "bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider mx-2 outline-none border-none",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  return (
    <aside className="fixed left-0 top-0 h-screen flex flex-col z-40 w-64 border-r border-slate-200 bg-white font-['Manrope'] shadow-sm select-none">
      {/* Brand Header */}
      <div className="p-8 flex items-center gap-3 select-none">
        <div className="w-10 h-10 bg-[#003178] rounded-xl flex items-center justify-center text-white shadow-md transform transition-transform duration-300 hover:rotate-90">
          <FiPlus className="text-2xl font-black" />
        </div>
        <div>
          <div className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">MedLog</div>
          <div className="text-[10px] text-[#003178] uppercase tracking-widest font-bold mt-1">Sistem Logbook</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 mt-2 space-y-5 overflow-y-auto pb-4 scrollbar-none">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase px-4 select-none opacity-80">
              {section.title}
            </span>
            <div className="space-y-0.5">
              {section.items.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={index}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition-all duration-300 ease-in-out group relative overflow-hidden ${
                      isActive 
                        ? "bg-blue-50/80 text-[#003178] shadow-sm translate-x-1" 
                        : "text-slate-500 hover:bg-slate-50/80 hover:text-[#003178] hover:translate-x-1"
                    }`}
                  >
                    {/* Garis indikator aktif di samping kiri tombol */}
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#003178] rounded-r-lg transition-all duration-300 ease-in-out ${
                      isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                    }`}></span>

                    <span className={`text-xl flex items-center transition-all duration-300 ease-in-out ${
                      isActive ? "scale-110 rotate-0" : "group-hover:scale-110 group-hover:rotate-3"
                    }`}>
                      {item.icon}
                    </span>
                    <span className={`text-sm transition-all duration-300 ${
                      isActive ? "font-extrabold" : "font-semibold"
                    }`}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Action */}
      <div className="px-4 py-6 mb-2 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-in-out group font-semibold hover:translate-x-1"
        >
          <FiLogOut className="text-lg transition-transform duration-300 group-hover:scale-110" />
          <span className="text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  );
}