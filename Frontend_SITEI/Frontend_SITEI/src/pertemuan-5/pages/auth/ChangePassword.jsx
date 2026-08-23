import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dataForm, setDataForm] = useState({
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "http://127.0.0.1:8000/api/change-password",
        {
          password: dataForm.password,
          password_confirmation: dataForm.password_confirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Tandai bahwa login pertama sudah selesai
      localStorage.setItem("is_first_login", "false");

      Swal.fire({
        icon: "success",
        title: "Password Diperbarui",
        text: "Password default Anda berhasil diganti!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Redirect berdasarkan role yang tersimpan saat login
      const role = localStorage.getItem("role");
      setTimeout(() => {
        if (role === "Admin") navigate("/admin/dashboard");
        else if (role === "Dosen") navigate("/dosen/dashboard");
        else navigate("/mahasiswa/dashboard");
      }, 1500);

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal Mengubah Password",
        text: error.response?.data?.message || "Pastikan password minimal 8 karakter dan konfirmasi cocok.",
        confirmButtonColor: "#1e4f8a",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full max-w-2xl mx-auto overflow-hidden px-2 py-4 font-sans"
    >
      {/* Header Section */}
      <div className="mb-10 text-left">
        <h2 className="text-5xl font-black text-[#1e4f8a] tracking-tighter uppercase leading-none">
          Ganti <span className="text-blue-500 font-light italic">Password</span>
        </h2>
        <p className="text-gray-400 text-lg mt-4 font-medium italic leading-relaxed">
          Demi keamanan akun Anda, silakan ubah password default bawaan sistem.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7 w-full">
        <div className="space-y-7">
          {/* Input Password Baru */}
          <div className="space-y-3">
            <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">
              Password Baru
            </label>
            <div className="relative group">
              <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 text-2xl group-focus-within:text-blue-500 transition-colors" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                onChange={handleChange}
                className="w-full pl-16 pr-16 py-6 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-blue-500 outline-none transition-all text-lg font-bold shadow-sm"
                placeholder="Masukkan password baru"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                {showPassword ? <FiEyeOff size={26} /> : <FiEye size={26} />}
              </button>
            </div>
          </div>

          {/* Input Konfirmasi Password */}
          <div className="space-y-3">
            <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">
              Konfirmasi Password
            </label>
            <div className="relative group">
              <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 text-2xl group-focus-within:text-blue-600 transition-colors" />
              <input
                name="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                required
                onChange={handleChange}
                className="w-full pl-16 pr-16 py-6 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-blue-500 outline-none transition-all text-lg font-bold shadow-sm"
                placeholder="Ulangi password baru"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                {showConfirmPassword ? <FiEyeOff size={26} /> : <FiEye size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1e4f8a] hover:bg-blue-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-base flex items-center justify-center gap-5 transition-all transform active:scale-[0.98] shadow-2xl shadow-blue-100 disabled:opacity-50 mt-4"
        >
          {loading ? (
            <ImSpinner2 className="animate-spin text-3xl" />
          ) : (
            <>
              SIMPAN PASSWORD BARU <FiCheckCircle className="text-2xl" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}