import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiLogOut, FiEye, FiEyeOff, FiCamera, FiX } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import Webcam from "react-webcam"; 

export default function Login() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState("Mahasiswa");
  const [dataForm, setDataForm] = useState({ identifier: "", password: "" });
  
  // State khusus Face Recognition
  const [showCamera, setShowCamera] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (e) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
  };

  // --- LOGIC: Handle Login Manual ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        identifier: dataForm.identifier,
        password: dataForm.password,
        role: activeRole,
      });

      const { access_token, user, is_first_login } = response.data;
      processLogin(access_token, user, is_first_login);

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.response?.data?.message || "Periksa kembali kredensial Anda.",
        confirmButtonColor: "#1e4f8a",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC: Face Recognition Login ---
  const handleFaceRecognition = async () => {
    if (!dataForm.identifier) {
      Swal.fire("Info", "Masukkan NIP Anda terlebih dahulu untuk verifikasi wajah.", "info");
      return;
    }

    setIsVerifying(true);
    const imageSrc = webcamRef.current.getScreenshot();

    try {
      // 1. Ambil Face Vector dari Laravel berdasarkan NIP
      const userRes = await axios.get(`http://127.0.0.1:8000/api/get-user-vector/${dataForm.identifier}`);
      const storedVector = userRes.data.face_vector;

      // 2. Kirim ke AI Server (Python FastAPI)
      const aiRes = await axios.post("http://127.0.0.1:8001/verify-face", {
        image_base64: imageSrc,
        stored_vector: storedVector
      });

      if (aiRes.data.success) {
        // 3. Jika AI Cocok, minta Laravel membuatkan Token (Bypass Password)
        const loginRes = await axios.post("http://127.0.0.1:8000/api/login-biometric", {
          identifier: dataForm.identifier,
          role: "Dosen"
        });

        const { access_token, user, is_first_login } = loginRes.data;
        setShowCamera(false);
        processLogin(access_token, user, is_first_login);
      } else {
        Swal.fire("Gagal", "Wajah tidak cocok. Silakan coba lagi.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Sistem biometrik sedang tidak tersedia.", "error");
    } finally {
      setIsVerifying(false);
    }
  };

  const processLogin = (token, user, is_first_login) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", user.role);
    localStorage.setItem("is_first_login", is_first_login ? "true" : "false");

    Swal.fire({
      icon: "success",
      title: "Login Berhasil",
      text: `Selamat datang kembali, ${user.name}!`,
      showConfirmButton: false,
      timer: 1500,
    });

    setTimeout(() => {
      if (is_first_login) {
        navigate("/change-password");
      } else {
        if (user.role === "Admin") navigate("/admin/dashboard");
        else if (user.role === "Dosen") navigate("/dosen/dashboard");
        else navigate("/mahasiswa/dashboard");
      }
    }, 1500);
  };

  const slideVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <motion.div 
      layout 
      className="w-full max-w-2xl mx-auto overflow-hidden px-2 py-4 font-sans"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Role Switcher Pill */}
      <div className="bg-gray-50 p-2 rounded-full flex mb-14 shadow-inner border border-gray-100 max-w-sm mx-auto md:mx-0">
        {["Mahasiswa", "Dosen", "Admin"].map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => { setActiveRole(role); setShowCamera(false); }}
            className={`flex-1 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-full transition-all duration-300 z-10 ${
              activeRole === role 
                ? "bg-white text-[#1e4f8a] shadow-lg border border-gray-100 scale-105" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeRole}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Header Section */}
          <motion.div layout className="mb-10 text-left">
            <h2 className="text-5xl font-black text-[#1e4f8a] tracking-tighter uppercase leading-none">
              Login <span className="text-blue-500 font-light italic">{activeRole}</span>
            </h2>
            <p className="text-gray-400 text-lg mt-4 font-medium italic leading-relaxed">
              Silakan masukkan kredensial sistem Anda.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-7 w-full">
            <motion.div layout className="space-y-7">
              <div className="space-y-3">
                <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">
                  {activeRole === "Mahasiswa" ? "Nomor Induk Mahasiswa" : activeRole === "Dosen" ? "Nomor Induk Pegawai" : "Username Admin"}
                </label>
                <div className="relative group">
                  <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 text-2xl group-focus-within:text-blue-500 transition-colors" />
                  <input
                    name="identifier"
                    type="text"
                    required
                    autoComplete="off"
                    value={dataForm.identifier}
                    onChange={handleChange}
                    className="w-full pl-16 pr-6 py-6 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-blue-500 outline-none transition-all text-lg font-bold shadow-sm"
                    placeholder={`Masukkan ${activeRole === "Mahasiswa" ? "NIM" : activeRole === "Dosen" ? "NIP" : "Username"}`}
                  />
                </div>
              </div>

              {!showCamera && (
                <div className="space-y-3">
                  <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Kata Sandi</label>
                  <div className="relative group">
                    <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 text-2xl group-focus-within:text-blue-600 transition-colors" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required={!showCamera}
                      onChange={handleChange}
                      className="w-full pl-16 pr-16 py-6 bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-blue-500 outline-none transition-all text-lg font-bold shadow-sm"
                      placeholder="••••••••"
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
              )}
            </motion.div>

            {/* --- FITUR BIOMETRIK DOSEN --- */}
            <AnimatePresence>
              {activeRole === "Dosen" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {!showCamera ? (
                    <div className="bg-blue-50/50 border-2 border-blue-100 rounded-[2rem] p-5 flex items-center gap-5 mt-4">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                        <FiCamera className="text-[#1e4f8a] text-3xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[#1e4f8a] font-black text-sm uppercase tracking-widest leading-none">Biometrik</h4>
                        <p className="text-gray-500 text-[11px] mt-1 font-medium italic">Gunakan Face ID untuk masuk cepat.</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setShowCamera(true)}
                        className="px-6 py-3 bg-[#1e4f8a] text-white font-black text-[10px] rounded-xl uppercase tracking-widest shadow-md hover:bg-blue-800 transition-all"
                      >
                        Buka
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 relative bg-black rounded-[2rem] overflow-hidden border-4 border-blue-100 shadow-2xl">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-auto scale-x-[-1]"
                      />
                      <div className="absolute inset-0 border-[3px] border-blue-400/30 m-10 rounded-full animate-pulse pointer-events-none"></div>
                      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-6">
                        <button
                          type="button"
                          onClick={handleFaceRecognition}
                          disabled={isVerifying}
                          className="flex-1 bg-white text-[#1e4f8a] py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                        >
                          {isVerifying ? <ImSpinner2 className="animate-spin text-lg" /> : <><FiCamera /> Verifikasi Wajah</>}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCamera(false)}
                          className="w-14 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-600 transition-all"
                        >
                          <FiX size={24} />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div layout className="flex items-center justify-between px-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-6 h-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                <span className="text-base text-gray-500 font-bold group-hover:text-gray-800 transition-colors text-sans">Ingat Saya</span>
              </label>
              <button 
                type="button"
                onClick={() => navigate("/register")}
                className="text-sm text-blue-600 font-black hover:underline underline-offset-8 decoration-2 uppercase tracking-tight"
              >
                Belum punya akun?
              </button>
            </motion.div>

            {!showCamera && (
              <motion.button
                layout
                type="submit"
                disabled={loading}
                className="w-full bg-[#1e4f8a] hover:bg-blue-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-base flex items-center justify-center gap-5 transition-all transform active:scale-[0.98] shadow-2xl shadow-blue-100 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <ImSpinner2 className="animate-spin text-3xl" />
                ) : (
                  <>MASUK KE SISTEM <FiLogOut className="text-2xl" /></>
                )}
              </motion.button>
            )}
          </form>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}