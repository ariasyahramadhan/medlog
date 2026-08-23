import { FaBell, FaSearch, FaCheckDouble, FaUser, FaWallet, FaUsers, FaUserTie, FaLayerGroup } from "react-icons/fa";
import { FcAreaChart, FcBullish, FcReading } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";
import { FiLogOut, FiUser, FiActivity } from "react-icons/fi";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaBookBookmark, FaNoteSticky } from "react-icons/fa6";
import { IoArchive, IoSettings } from "react-icons/io5";
import { AiFillSchedule } from "react-icons/ai";
import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import echo from "../../utils/echo";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    // === 1. STATE MANAGEMENT ===
    const [profile, setProfile] = useState({ name: "Loading...", avatar: null });
    const [imageError, setImageError] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // === NEW: HEADER STATS STATE ===
    const [headerStats, setHeaderStats] = useState({
        total_siswa: 0,
        total_batch: 0,
        total_materi: "0 File"
    });

    // === SEARCH STATE ===
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const searchRef = useRef(null);

    const navigate = useNavigate();
    const notifRef = useRef(null);
    const chartRef = useRef(null);
    const settingsRef = useRef(null);

    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return null;
        if (avatarPath.startsWith("http")) return avatarPath;
        return `http://localhost:8000/storage/${avatarPath}`;
    };

    // === 2. DYNAMIC STATS (UPDATED) ===
    const quickStats = useMemo(() => [
        { label: "Total Siswa", value: headerStats.total_siswa, color: "bg-blue-500", icon: FcReading },
        { label: "Total Batch", value: `${headerStats.total_batch} Batch`, color: "bg-orange-500", icon: FaLayerGroup },
        { label: "Total Materi", value: headerStats.total_materi, color: "bg-indigo-500", icon: FaBookBookmark },
    ], [headerStats]);

    const unreadCount = notifications.filter(n => !n.read).length;

    // === 3. REAL-TIME & DATA FETCHING ===
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Fetch Header Stats
            axios.get("http://localhost:8000/api/mentor/header-stats", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setHeaderStats(res.data))
            .catch(err => console.error("Gagal load stats header", err));

            // Fetch Settings/Profile
            axios.get("http://localhost:8000/api/mentor/settings", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                setProfile({
                    name: res.data.username || res.data.nama || "Mentor",
                    avatar: res.data.avatar && !res.data.avatar.includes("default-avatar") ? res.data.avatar : null
                });
            }).catch(err => console.error(err));

            // Fetch Notifications
            axios.get("http://localhost:8000/api/notifications",{
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setNotifications(res.data))
            .catch(err => console.error("Gagal load notif lama", err));
        }

        const channel = echo.channel('notif-channel');
        channel.listen('.notif-event', (data) => {
            console.log("Sinyal Pusher Masuk:", data);
            const msg = data.message;
            if (msg.type === 'submission') {
                toast.success(msg.title, {
                    description: msg.desc,
                    icon: '📩',
                    duration: 6000,
                });
                const newNotif = {
                    id: msg.id || Date.now(),
                    title: msg.title,
                    desc: msg.desc,
                    time: "Baru saja",
                    read: false,
                    type: 'submission'
                };
                setNotifications(prev => [newNotif, ...prev]);
            }
        });

        return () => echo.leaveChannel('notif-channel');
    }, []);

    // === LOGIKA PENCARIAN DINAMIS ===
    useEffect(() => {
        const mentorMenus = [
            { title: "Dashboard", keywords: ["home", "beranda", "utama", "statistik"], link: "/mentor", icon: <TbLayoutDashboardFilled className="text-blue-500" /> },
            { title: "Kelas Saya", keywords: ["materi", "belajar", "course", "kelas", "tugas"], link: "/kelas-saya", icon: <FaBookBookmark className="text-emerald-500" /> },
            { title: "Jadwal", keywords: ["hari", "jam", "kalender", "schedule", "jadwal"], link: `/mentor/jadwal/${localStorage.getItem("last_active_course") || "1"}`, icon: <AiFillSchedule className="text-orange-500" /> },
            { title: "Kelas Arsip", keywords: ["lama", "arsip", "archive", "selesai"], link: "/kelas-arsip", icon: <IoArchive className="text-purple-500" /> },
            { title: "Catatan", keywords: ["notes", "memo", "tulis", "catatan"], link: "/catatan", icon: <FaNoteSticky className="text-yellow-500" /> },
            { title: "Pengaturan Akun", keywords: ["profil", "setting", "akun", "password", "foto"], link: "/accounts-settings", icon: <IoSettings className="text-gray-500" /> },
        ];

        if (searchQuery.trim().length > 1) {
            const filtered = mentorMenus.filter(menu => 
                menu.keywords.some(key => key.includes(searchQuery.toLowerCase())) ||
                menu.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    // === 4. EVENT HANDLERS ===
    useEffect(() => {
        function handleClickOutside(event) {
            if (activeDropdown === 'notification' && notifRef.current && !notifRef.current.contains(event.target)) setActiveDropdown(null);
            if (activeDropdown === 'chart' && chartRef.current && !chartRef.current.contains(event.target)) setActiveDropdown(null);
            if (activeDropdown === 'settings' && settingsRef.current && !settingsRef.current.contains(event.target)) setActiveDropdown(null);
            if (searchRef.current && !searchRef.current.contains(event.target)) setSearchResults([]);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activeDropdown]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_role");
        navigate("/login");
    };

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8000/api/notifications/mark-read", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            toast.success("Semua notifikasi ditandai telah dibaca");
        } catch (err) {
            console.error("Gagal menandai baca:", err);
            toast.error("Gagal memperbarui status notifikasi");
        }
    };

    return (
        <header className="flex justify-between items-center p-4 rounded-xl bg-white/50 backdrop-blur-sm sticky top-0 z-40 transition-all duration-300">
            
            {/*Search Bar Section */}
            <div className="relative w-full max-w-lg" ref={searchRef}>
                <div className="relative group">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari fitur, jadwal, atau manajemen kelas..."
                        className="border border-gray-200 p-3 pr-12 w-full rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all shadow-sm group-hover:shadow-md"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <FaSearch className="text-gray-400 text-lg group-focus-within:text-blue-500 transition-colors" />
                    </div>
                </div>

                <AnimatePresence>
                    {searchResults.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute left-0 mt-3 w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 p-2"
                        >
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-2">Hasil Pencarian Menu</p>
                            {searchResults.map((result, index) => (
                                <div 
                                    key={index}
                                    onClick={() => {
                                        navigate(result.link);
                                        setSearchQuery("");
                                        setSearchResults([]);
                                    }}
                                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all group"
                                >
                                    <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all text-xl">
                                        {result.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{result.title}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">Klik untuk membuka menu</p>
                                    </div>
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-bold">BUKA</div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Icon & Profile Section */}
            <div className="flex items-center space-x-4 ml-6">

                {/* --- 1. NOTIFICATION DROPDOWN --- */}
                <div className="relative" ref={notifRef}>
                    <div
                        onClick={() => setActiveDropdown(activeDropdown === 'notification' ? null : 'notification')}
                        className={`relative p-3 rounded-2xl cursor-pointer transition-all duration-200 
                            ${activeDropdown === 'notification' ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105'}
                        `}
                    >
                        <FaBell className="text-lg" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1.5 text-[10px] font-bold shadow-sm border-2 border-white animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </div>

                    <AnimatePresence>
                        {activeDropdown === 'notification' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 origin-top-right"
                            >
                                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="text-sm font-bold text-gray-700">Notifikasi Masuk</h3>
                                    <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                                        <FaCheckDouble /> Tandai baca
                                    </button>
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-10 text-center text-gray-400 text-sm italic">Belum ada tugas masuk</div>
                                    ) : (
                                        notifications.map((notif) => (
                                            <div key={notif.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer flex gap-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.type === 'submission' ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-blue-500'}`}></div>
                                                <div>
                                                    <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{notif.title}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-2">{notif.desc}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">{notif.time || 'Baru saja'}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- 2. QUICK STATS DROPDOWN --- */}
                <div className="relative" ref={chartRef}>
                    <div
                        onClick={() => setActiveDropdown(activeDropdown === 'chart' ? null : 'chart')}
                        className={`p-3 rounded-2xl cursor-pointer transition-all duration-200
                            ${activeDropdown === 'chart' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}
                        `}
                    >
                        <FiActivity className="text-lg" />
                    </div>

                    <AnimatePresence>
                        {activeDropdown === 'chart' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50"
                            >
                                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2"><FiActivity /> Performa Mengajar</h3>
                                <div className="space-y-4">
                                    {quickStats.map((stat, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-600 flex items-center gap-1"><stat.icon /> {stat.label}</span>
                                                <span className="font-bold">{stat.value}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                <div className={`h-full ${stat.color}`} style={{ width: '85%' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- 3. SETTINGS & PROFILE --- */}
                <div className="relative" ref={settingsRef}>
                    <div
                        onClick={() => setActiveDropdown(activeDropdown === 'settings' ? null : 'settings')}
                        className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                            activeDropdown === 'settings' ? "bg-red-500 text-white" : "bg-red-50 text-red-500 hover:bg-red-100"
                        }`}
                    >
                        <SlSettings className={`text-lg ${activeDropdown === 'settings' ? "rotate-90" : ""}`} />
                    </div>

                    <AnimatePresence>
                        {activeDropdown === 'settings' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                            >
                                <div className="px-4 py-3 border-b bg-gray-50/50">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mentor Account</p>
                                    <p className="text-sm font-bold text-gray-800 truncate">{profile.name}</p>
                                </div>
                                <div className="py-1">
                                    <button onClick={() => navigate('/accounts-settings')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"><FiUser /> Profile</button>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold"><FiLogOut /> Logout</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* DISPLAY PROFILE */}
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 h-10">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Hello, Mentor</span>
                        <span className="text-sm font-bold text-gray-800 leading-none">{profile.name}</span>
                    </div>
                    <div className="relative shrink-0">
                        {profile.avatar && !imageError ? (
                            <img
                                src={getAvatarUrl(profile.avatar)}
                                alt="Profile"
                                className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-white shadow-md">
                                <FaUser />
                            </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                </div>

            </div>
        </header>
    );
}