import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { FiCamera, FiRefreshCw, FiCheck, FiAlertTriangle } from "react-icons/fi";

/**
 * Komponen kamera yang mengambil foto untuk deteksi wajah.
 * Props:
 *  - onCapture(base64): callback saat foto berhasil diambil
 *  - onReset(): callback untuk reset ke state kamera
 */
export default function CameraCapture({ onCapture, onReset }) {
  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState(null); // base64 dari foto yang diambil
  const [facingMode, setFacingMode] = useState("user"); // "user" = depan

  const videoConstraints = {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode,
  };

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot({
      width: 640,
      height: 480,
    });
    if (imageSrc) {
      setPhoto(imageSrc);
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

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
          Foto berhasil diambil
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
      </div>

      <p className="text-[11px] text-slate-500 font-bold text-center">
        Posisikan wajah Anda di dalam lingkaran
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleCamera}
          className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
          title="Ganti kamera"
        >
          <FiRefreshCw size={16} />
        </button>

        <button
          onClick={capture}
          className="flex items-center gap-2 bg-[#003178] text-white px-7 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 active:scale-95 transition-all text-sm"
        >
          <FiCamera size={16} />
          Ambil Foto
        </button>
      </div>
    </div>
  );
}
