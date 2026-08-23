import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiMail, FiCheckCircle, FiArrowLeft, FiLayers } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataForm, setDataForm] = useState({
    name: "",
    identifier: "",
    email: "",
    role: "Mahasiswa", // Default role
    password: "",
    password_confirmation: ""
  });

  const handleChange = (e) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("https://api.sigmaeducation.id/api/register", dataForm);
      
      Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil!',
        text: 'Akun Anda telah terdaftar. Silakan login.',
        confirmButtonColor: '#1e4f8a',
        timer: 2500
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registrasi Gagal',
        text: error.response?.data?.message || 'Terjadi kesalahan. Cek kembali data Anda.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto px-2 py-4 font-sans"
    >
      {/* Tombol Kembali */}
      <button 
        onClick={() => navigate("/login")} 
        className="flex items-center gap-2 text-gray-400 hover:text-[#1e4f8a] mb-8 transition-colors font-black text-[11px] uppercase tracking-widest"
      >
        <FiArrowLeft /> Kembali ke Login
      </button>

      {/* Header */}
      <div className="mb-12 text-left">
        <h2 className="text-5xl font-black text-[#1e4f8a] tracking-tighter uppercase leading-none">
          Daftar <span className="text-blue-500 font-light italic">Akun</span>
        </h2>
        <p className="text-gray-400 text-lg mt-4 font-medium italic leading-relaxed">
          Silakan lengkapi formulir pendaftaran di bawah ini.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-7">
        
        {/* Kolom Pilihan Role (Menggantikan Switcher) */}
        <div className="md:col-span-2 space-y-3">
          <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Kategori Pengguna</label>
          <div className="relative group">
            <FiLayers className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 text-2xl group-focus-within:text-blue-500 transition-colors" />
            <select
              name="role"
              value={dataForm.role}
              onChange={handleChange}
              className="w-full pl-16 pr-10 py-6 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-blue-500 outline-none transition-all text-lg font-bold shadow-sm appearance-none cursor-pointer text-slate-700"
            >
              <option value="Mahasiswa">Mahasiswa</option>
              <option value="Dosen">Dosen</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Nama Lengkap */}
        <div className="md:col-span-2 space-y-3">
          <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Nama Lengkap</label>
          <div className="relative group">
            <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 text-2xl group-focus-within:text-blue-500 transition-colors" />
            <input
              name="name"
              type="text"
              required
              onChange={handleChange}
              className="w-full pl-16 pr-6 py-6 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-blue-500 outline-none transition-all text-lg font-bold shadow-sm"
              placeholder="Masukkan nama lengkap"
            />
          </div>
        </div>

        {/* Identifier (NIM/NIP) */}
        <div className="space-y-3">
          <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Nomor Induk</label>
          <input
            name="identifier"
            type="text"
            required
            onChange={handleChange}
            className="w-full px-8 py-6 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-blue-500 outline-none transition-all text-lg font-bold shadow-sm"
            placeholder="NIM / NIP / ID"
          />
        </div>

        {/* Email */}
        <div className="space-y-3">
          <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Email</label>
          <div className="relative group">
            <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 text-2xl group-focus-within:text-blue-500 transition-colors" />
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="w-full pl-16 pr-6 py-6 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-blue-500 outline-none transition-all text-lg font-bold shadow-sm"
              placeholder="email@universitas.com"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-3">
          <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Kata Sandi</label>
          <div className="relative group">
            <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 text-2xl group-focus-within:text-blue-500 transition-colors" />
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              className="w-full pl-16 pr-6 py-6 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-blue-500 outline-none transition-all text-lg font-bold shadow-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-3">
          <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Konfirmasi</label>
          <div className="relative group">
            <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 text-2xl group-focus-within:text-blue-500 transition-colors" />
            <input
              name="password_confirmation"
              type="password"
              required
              onChange={handleChange}
              className="w-full pl-16 pr-6 py-6 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-blue-500 outline-none transition-all text-lg font-bold shadow-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 w-full bg-[#1e4f8a] hover:bg-blue-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-base flex items-center justify-center gap-5 transition-all shadow-2xl shadow-blue-100 disabled:opacity-50 mt-4 active:scale-[0.98]"
        >
          {loading ? <ImSpinner2 className="animate-spin text-3xl" /> : <>BUAT AKUN SEKARANG <FiCheckCircle className="text-2xl" /></>}
        </button>
      </form>
    </motion.div>
  );
}