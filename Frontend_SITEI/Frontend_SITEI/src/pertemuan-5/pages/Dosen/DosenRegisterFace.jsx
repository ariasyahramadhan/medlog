import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiCamera, FiCheckCircle, FiRefreshCw, FiShield, FiVideoOff, FiLock, FiInfo } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterFace() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const res = await axios.get("https://api.sigmaeducation.id/api/lecturer/check-face-status", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setIsRegistered(res.data.is_registered);
      } catch (err) {
        console.error("Gagal mengambil status registrasi:", err);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    checkRegistrationStatus();
    return () => stopVideo();
  }, []);

  const startVideo = () => {
    if (isRegistered) {
      Swal.fire({
        icon: "warning",
        title: "Akses Ditolak",
        text: "Anda sudah melakukan registrasi wajah sebelumnya atau hubungi admin untuk melakukan reset.",
        confirmButtonColor: "#003178"
      });
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Kamera Gagal Diakses",
          text: "Pastikan izin kamera telah diberikan. " + err.message,
          confirmButtonColor: "#003178"
        });
      });
  };

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleRegister = async () => {
    if (isRegistered) {
      Swal.fire("Pemberitahuan", "Wajah Anda sudah terdaftar di dalam sistem.", "info");
      return;
    }

    if (!isCameraActive) {
      Swal.fire("Kamera Belum Aktif", "Silakan aktifkan kamera terlebih dahulu.", "warning");
      return;
    }

    setIsCapturing(true);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL("image/jpeg");

    try {
      const pythonRes = await axios.post("https://api.sigmaeducation.id/api/extract-face", {
        image_base64: base64Image
      });

      if (pythonRes.data.success) {
        const vector = pythonRes.data.vector;

        await axios.post("https://api.sigmaeducation.id/api/lecturer/register-face",
          { face_vector: vector },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
        );

        setIsRegistered(true);
        stopVideo();

        Swal.fire({
          icon: "success",
          title: "Registrasi Berhasil",
          text: "Vektor wajah Anda telah berhasil dipetakan menggunakan model Facenet.",
          confirmButtonColor: "#003178"
        });
      } else {
        throw new Error(pythonRes.data.message || "Gagal mengekstrak karakteristik wajah.");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: err.response?.data?.message || err.response?.data?.detail || err.message,
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setIsCapturing(false);
    }
  };

  if (isLoadingStatus) {
    return (
      <div className="w-full min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <FiRefreshCw className="animate-spin text-[#003178]" size={28} />
          <p className="text-sm text-slate-400 font-medium">Memverifikasi status registrasi...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { label: "Aktifkan Kamera", done: isCameraActive || isRegistered },
    { label: "Pindai Wajah", done: isCapturing || isRegistered },
    { label: "Simpan Vektor", done: isRegistered },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full min-h-screen bg-slate-100 flex items-center justify-center p-5 md:p-10"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-blue-600 to-[#003178]" />

        <div className="p-8 md:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#003178] mb-4 shadow-sm">
              <FiShield size={26} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Registrasi Kredensial Wajah
            </h1>
            <p className="text-slate-400 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
              Sistem biometrik terenkripsi. Vektor wajah diproses aman menggunakan model{" "}
              <span className="font-semibold text-blue-600">Facenet</span>.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1 mb-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
                  ${step.done ? "bg-white border border-slate-200 shadow-sm" : ""}`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all
                    ${step.done ? "bg-[#003178] text-white" : "bg-slate-200 text-slate-400"}`}
                >
                  {step.done ? <FiCheckCircle size={11} /> : i + 1}
                </div>
                <span className={`text-[11px] font-medium leading-tight ${step.done ? "text-slate-700" : "text-slate-400"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Camera Viewport */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video border border-slate-800 shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraActive ? "opacity-100" : "opacity-20"}`}
            />

            {/* Scanner frame overlay */}
            {isCameraActive && !isCapturing && (
              <>
                {/* LIVE badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.25)]" />
                  <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">LIVE</span>
                </div>

                {/* Corner brackets */}
                <div className="absolute inset-0 m-6 border border-blue-500/20 rounded-xl pointer-events-none">
                  <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400 rounded-tl-sm" />
                  <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400 rounded-tr-sm" />
                  <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400 rounded-bl-sm" />
                  <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400 rounded-br-sm" />
                  {/* Scan line */}
                  <div className="absolute inset-x-0 top-0 h-px bg-blue-400/60 animate-pulse" />
                </div>
              </>
            )}

            {/* Inactive overlay */}
            <AnimatePresence mode="wait">
              {!isCameraActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/80"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                    <FiVideoOff size={22} />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-300 text-sm font-semibold">Kamera Belum Aktif</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {isRegistered
                        ? "Registrasi telah selesai."
                        : "Nyalakan kamera untuk memindai titik wajah."}
                    </p>
                  </div>
                  {!isRegistered && (
                    <button
                      onClick={startVideo}
                      className="mt-1 bg-[#003178] hover:bg-[#00255c] active:scale-95 text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-950/30"
                    >
                      <FiCamera size={13} />
                      Aktifkan Kamera Web
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Extracting overlay */}
            {isCapturing && (
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <div className="relative w-11 h-11">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-900" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
                </div>
                <p className="text-blue-400 text-[11px] font-semibold uppercase tracking-widest animate-pulse">
                  Mengekstrak Vektor Wajah...
                </p>
              </div>
            )}
          </div>

          {/* Camera status bar */}
          {isCameraActive && !isRegistered && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-xs text-slate-500 font-medium">
                Kamera aktif — posisikan wajah Anda di dalam bingkai
              </span>
              <button
                onClick={stopVideo}
                className="ml-auto text-slate-400 hover:text-red-500 transition-colors"
                title="Matikan kamera"
              >
                <FiVideoOff size={13} />
              </button>
            </motion.div>
          )}

          {/* Divider */}
          <div className="h-px bg-slate-100 my-6" />

          {/* Action area */}
          {isRegistered ? (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3.5">
              <FiCheckCircle size={20} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-emerald-800 text-sm font-bold leading-snug">Wajah Anda Telah Terdaftar</p>
                <p className="text-emerald-600 text-xs mt-0.5">Sesi pendaftaran dikunci demi keamanan data Anda.</p>
              </div>
            </div>
          ) : (
            <button
              onClick={handleRegister}
              disabled={isCapturing || !isCameraActive}
              className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-300
                ${isCameraActive && !isCapturing
                  ? "bg-[#003178] hover:bg-[#00255c] active:scale-[0.99] text-white shadow-md shadow-blue-950/20 cursor-pointer"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
            >
              {isCapturing
                ? <FiRefreshCw className="animate-spin" size={14} />
                : <FiCheckCircle size={14} />
              }
              {isCapturing ? "Proses Enkripsi..." : "Ambil & Daftarkan Wajah"}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 flex items-center justify-center gap-1.5">
          <FiLock size={11} className="text-slate-300" />
          <span className="text-[11px] text-slate-300 text-center leading-relaxed">
            Data terenkripsi end-to-end &bull; Facenet 512-d embedding &bull; Tidak disimpan sebagai gambar
          </span>
        </div>

      </div>
    </motion.div>
  );
}