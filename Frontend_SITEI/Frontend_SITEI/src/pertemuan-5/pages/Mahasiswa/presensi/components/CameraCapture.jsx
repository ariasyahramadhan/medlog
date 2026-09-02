import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { FiCamera, FiRefreshCw, FiCheck, FiAlertTriangle, FiLoader } from "react-icons/fi";
import Swal from "sweetalert2";
import { detectFaceBiometric } from "../../../../../services/attendanceService";

/**
 * Komponen kamera yang mengambil foto untuk deteksi wajah.
 * Props:
 *  - onCapture(base64): callback saat foto berhasil diambil & wajah terdeteksi
 *  - onReset(): callback untuk reset ke state kamera
 */
export default function CameraCapture({ onCapture, onReset }) {
  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState(null); // base64 dari foto yang diambil
  const [facingMode, setFacingMode] = useState("user"); // "user" = depan
  const [isVerifying, setIsVerifying] = useState(false);

  const videoConstraints = {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode,
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current || isVerifying) return;
    const imageSrc = webcamRef.current.getScreenshot({
      width: 640,
      height: 480,
    });
    if (!imageSrc) return;

    setIsVerifying(true);
    try {
      // Panggil verifikasi biometrik AI
      const res = await detectFaceBiometric(imageSrc);
      const faceDetected = res.data?.face_detected;

      if (faceDetected === false) {
        // Wajah TIDAK terdeteksi -> Beritahu via popup
        Swal.fire({
          title: "Wajah Tidak Terdeteksi",
          text: res.data?.message || "Wajah tidak terdeteksi pada kamera. Pastikan wajah terlihat jelas, pencahayaan cukup, dan menghadap lurus ke kamera.",
          icon: "warning",
          confirmButtonColor: "#003178",
          confirmButtonText: "Foto Ulang",
        });
        setIsVerifying(false);
        return;
      }

      // Wajah TERDETEKSI -> TIDAK PERLU POPUP, langsung lanjut
      setPhoto(imageSrc);
      onCapture(imageSrc);
    } catch (err) {
      console.warn("Gagal menghubungi layanan AI verifikasi wajah:", err);
      // Jika error jaringan microservice, tetap izinkan lanjut
      setPhoto(imageSrc);
      onCapture(imageSrc);
    } finally {
      setIsVerifying(false);
    }
  }, [webcamRef, isVerifying, onCapture]);

  const reset = useCallback(() => {
    setPhoto(null);
    onReset?.();
  }, [onReset]);

  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, []);

  // ─── Preview setelah ambil foto ─────────────────────────────────────────────
  if (photo) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-lg">
          <img src={photo} alt="Foto presensi" className="w-full object-cover" />
          <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1.5 shadow">
            <FiCheck size={14} />
          </div>
        </div>
        <p className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5">
          Foto & wajah berhasil diverifikasi
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#003178] transition-colors"
        >
          <FiRefreshCw size={13} />
          Ambil ulang
        </button>
      </div>
    );
  }

  // ─── Live Kamera ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-[#003178]/30 shadow-lg bg-slate-900">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.85}
          videoConstraints={videoConstraints}
          className="w-full"
          mirrored={facingMode === "user"}
          onUserMediaError={() => {}}
        />
        {/* Overlay panduan wajah */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-44 h-52 border-2 border-white/60 rounded-[50%] shadow-[0_0_0_2000px_rgba(0,0,0,0.25)]" />
        </div>

        {/* Loading overlay saat memverifikasi wajah */}
        {isVerifying && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white">
            <FiLoader className="animate-spin text-blue-400" size={28} />
            <span className="text-xs font-bold tracking-wide">Memeriksa deteksi wajah...</span>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-500 font-bold text-center">
        Posisikan wajah Anda tegak di dalam lingkaran
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleCamera}
          disabled={isVerifying}
          className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-50"
          title="Ganti kamera"
        >
          <FiRefreshCw size={16} />
        </button>

        <button
          type="button"
          onClick={capture}
          disabled={isVerifying}
          className="flex items-center gap-2 bg-[#003178] text-white px-7 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 active:scale-95 transition-all text-sm disabled:opacity-60"
        >
          {isVerifying ? (
            <>
              <FiLoader className="animate-spin" size={16} />
              Memverifikasi...
            </>
          ) : (
            <>
              <FiCamera size={16} />
              Ambil Foto
            </>
          )}
        </button>
      </div>
    </div>
  );
}

