import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCamera, FiMapPin, FiCheckCircle, FiLoader,
  FiAlertTriangle, FiClock, FiRefreshCw, FiXCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAttendance from "../../../../hooks/useAttendance";
import useGeolocation from "../../../../hooks/useGeolocation";
import CameraCapture from "./components/CameraCapture";
import LocationStatus from "./components/LocationStatus";

// ─── Helper ──────────────────────────────────────────────────────────────────
const formatTime = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
};

export default function MahasiswaPresensi() {
  const {
    schedule, locations, loading, submitting, error,
    hasCheckedIn, hasCheckedOut, checkInLog, checkOutLog,
    getMatchedArea, submitCheckIn, submitCheckOut, refresh,
  } = useAttendance();

  const geo = useGeolocation();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);       // base64 foto
  const [step, setStep] = useState("status");      // "status" | "camera" | "confirm"

  // ─── Cek Geofencing Area ──────────────────────────────────────────────────
  const matchedArea = geo.latitude && geo.longitude ? getMatchedArea(geo.latitude, geo.longitude) : null;
  const isOutside = Boolean(geo.latitude && geo.longitude && locations && locations.length > 0 && !matchedArea);

  // ─── Callbacks ──────────────────────────────────────────────────────────────
  const handleCapture = useCallback((base64) => {
    setPhoto(base64);
    setStep("confirm");
  }, []);

  const handleReset = useCallback(() => {
    setPhoto(null);
    setStep("camera");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!photo) {
      Swal.fire("Foto Diperlukan", "Silakan ambil foto wajah terlebih dahulu.", "warning");
      return;
    }
    if (!geo.latitude || !geo.longitude) {
      Swal.fire("GPS Diperlukan", "Lokasi GPS belum tersedia. Pastikan izin lokasi perangkat telah diaktifkan.", "warning");
      return;
    }

    // ── POPUP WARNING JIKA DI LUAR LOKASI ──
    if (isOutside) {
      const confirmAlert = await Swal.fire({
        title: "Presensi di Luar Lokasi?",
        html: "<p class='text-xs sm:text-sm text-slate-600 leading-relaxed text-left sm:text-center'>Titik koordinat Anda terdeteksi <b>berada di luar area lokasi presensi resmi</b>.<br/><br/>Presensi tetap dapat dikirimkan dengan status <b>Ditinjau</b>, namun Anda perlu <b>menghubungi Admin</b> untuk disetujui.<br/><br/>Apakah Anda ingin tetap mengirim presensi sekarang?</p>",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#003178",
        cancelButtonColor: "#94a3b8",
        confirmButtonText: "Ya, Tetap Kirim",
        cancelButtonText: "Periksa Lokasi Lagi",
      });

      if (!confirmAlert.isConfirmed) {
        return;
      }
    }

    const action = hasCheckedIn ? submitCheckOut : submitCheckIn;
    const result = await action(geo.latitude, geo.longitude, photo);

    if (result.success) {
      const isFlaggedResult = result.is_flagged || isOutside;
      Swal.fire({
        title: isFlaggedResult ? "Presensi Dikirim (Ditinjau)" : "Presensi Berhasil!",
        html: isFlaggedResult
          ? "<div class='text-xs sm:text-sm text-slate-600 space-y-2 text-left sm:text-center'><p>" + (result.message || 'Presensi berhasil disimpan.') + "</p><div class='p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold leading-relaxed'>⚠️ Catatan: Karena berada di luar area resmi, status presensi Anda ditandai <b>Ditinjau</b>. Silakan hubungi Admin untuk persetujuan.</div></div>"
          : (result.message || "Presensi Anda berhasil dicatat."),
        icon: isFlaggedResult ? "info" : "success",
        confirmButtonColor: "#003178"
      });
      setPhoto(null);
      setStep("status");
    } else {
      Swal.fire({
        title: "Gagal Presensi",
        text: result.message,
        icon: "error",
        confirmButtonColor: "#003178"
      });
    }
  }, [photo, geo, isOutside, hasCheckedIn, submitCheckIn, submitCheckOut]);

  const handleStartAbsen = useCallback(() => {
    setStep("camera");
    setPhoto(null);
  }, []);

  const handleCancel = useCallback(() => {
    setStep("status");
    setPhoto(null);
  }, []);

  // ─── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <FiLoader className="animate-spin text-[#003178]" size={28} />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Memuat data presensi...
        </p>
      </div>
    );
  }

  // ─── Error fatal ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
        <div className="bg-white border border-red-100 rounded-3xl p-8 max-w-sm w-full shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-red-500" size={20} />
            <h2 className="font-black text-red-600 text-sm uppercase tracking-wide">Gagal Memuat</h2>
          </div>
          <p className="text-sm text-slate-600">{error}</p>
          <button
            onClick={refresh}
            className="w-full py-3 bg-[#003178] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-800 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 font-['Inter'] max-w-2xl mx-auto">
      {/* ── Header ── */}
      <div className="font-['Manrope'] flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#003178] tracking-tight mb-1">
            Presensi Harian
          </h1>
          <p className="text-sm text-slate-400 font-medium capitalize">
            {formatDate(new Date().toISOString())}
          </p>
        </div>
        <button
          onClick={() => navigate("/mahasiswa/presensi/riwayat")}
          className="flex items-center gap-1.5 text-xs font-bold text-[#003178] bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors mt-1"
        >
          <FiClock size={13} />
          Riwayat
        </button>
      </div>

      {/* ── Jadwal Aktif ── */}
      {schedule ? (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-center gap-4">
          <FiClock className="text-[#003178] shrink-0" size={18} />
          <div>
            <p className="text-[10px] font-black text-[#003178] uppercase tracking-widest">Jadwal Hari Ini</p>
            <p className="text-sm font-bold text-slate-700 mt-0.5">
              {schedule.name || "Rotasi Klinik"} —{" "}
              {schedule.check_in_start?.slice(0, 5)} s/d {schedule.check_out_end?.slice(0, 5)}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-4">
          <FiXCircle className="text-slate-400 shrink-0" size={18} />
          <p className="text-sm font-bold text-slate-500">Tidak ada jadwal aktif hari ini.</p>
        </div>
      )}

      {/* ── Status Hari Ini ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Check-in */}
        <div className={`rounded-2xl border p-4 ${hasCheckedIn ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Masuk</p>
          {hasCheckedIn ? (
            <>
              <p className="text-lg font-extrabold text-emerald-700">{formatTime(checkInLog?.attended_at)}</p>
              {checkInLog?.is_flagged && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 mt-1 inline-block">
                  ⏳ Ditinjau
                </span>
              )}
            </>
          ) : (
            <p className="text-sm font-bold text-slate-400">Belum absen</p>
          )}
        </div>

        {/* Check-out */}
        <div className={`rounded-2xl border p-4 ${hasCheckedOut ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pulang</p>
          {hasCheckedOut ? (
            <>
              <p className="text-lg font-extrabold text-emerald-700">{formatTime(checkOutLog?.attended_at)}</p>
              {checkOutLog?.is_flagged && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 mt-1 inline-block">
                  ⏳ Ditinjau
                </span>
              )}
            </>
          ) : (
            <p className="text-sm font-bold text-slate-400">Belum absen</p>
          )}
        </div>
      </div>

      {/* ── Lokasi GPS ── */}
      <LocationStatus
        latitude={geo.latitude}
        longitude={geo.longitude}
        accuracy={geo.accuracy}
        error={geo.error}
        loading={geo.loading}
        matchedArea={matchedArea}
        isOutside={isOutside}
        onRefresh={geo.refresh}
      />

      {/* ── Tombol / Area Kamera ── */}
      <AnimatePresence mode="wait">
        {/* Status — tombol absen */}
        {step === "status" && !hasCheckedOut && (
          <motion.div
            key="status-action"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {hasCheckedIn && hasCheckedOut ? null : (
              <button
                onClick={handleStartAbsen}
                disabled={!schedule}
                className="w-full bg-[#003178] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-blue-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <FiCamera size={18} />
                {hasCheckedIn ? "Lakukan Check-out" : "Lakukan Check-in"}
              </button>
            )}
          </motion.div>
        )}

        {/* Selesai semua */}
        {hasCheckedIn && hasCheckedOut && step === "status" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center"
          >
            <FiCheckCircle className="text-emerald-500 mx-auto mb-3" size={32} />
            <p className="font-extrabold text-emerald-700 text-base">Presensi Hari Ini Selesai!</p>
            <p className="text-xs text-slate-500 mt-1">Selamat, Anda telah melakukan presensi masuk dan pulang.</p>
          </motion.div>
        )}

        {/* Kamera */}
        {step === "camera" && (
          <motion.div
            key="camera"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-700 text-sm">
                {hasCheckedIn ? "Foto untuk Check-out" : "Foto untuk Check-in"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
            <CameraCapture onCapture={handleCapture} onReset={handleReset} />
          </motion.div>
        )}

        {/* Konfirmasi */}
        {step === "confirm" && photo && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm"
          >
            <h2 className="font-bold text-slate-700 text-sm">Konfirmasi Presensi</h2>

            {/* Preview foto */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-w-xs mx-auto">
              <img src={photo} alt="Preview presensi" className="w-full object-cover" />
            </div>

            {/* Warning jika berada di luar lokasi */}
            {isOutside && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
                <FiAlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div className="text-xs text-amber-900/90 space-y-1">
                  <p className="font-extrabold text-amber-800">Perhatian: Anda di Luar Area Presensi</p>
                  <p className="leading-relaxed text-[11px]">
                    Presensi Anda tetap dapat dikirim, namun akan tercatat berstatus <strong>Ditinjau</strong>. Harap segera hubungi Admin setelah submit untuk disetujui.
                  </p>
                </div>
              </div>
            )}

            {/* Ringkasan lokasi */}
            {geo.latitude && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                <FiMapPin size={14} className={isOutside ? "text-amber-600" : "text-emerald-600"} />
                <span className="truncate">
                  {matchedArea ? matchedArea.name : "Di Luar Area"} ({geo.latitude.toFixed(5)}, {geo.longitude.toFixed(5)})
                </span>
                {geo.accuracy && <span className="text-slate-400 font-normal shrink-0">(±{Math.round(geo.accuracy)}m)</span>}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Ambil Ulang
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-2 flex-1 py-3 rounded-xl bg-[#003178] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-800 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <><FiLoader className="animate-spin" size={15} /> Mengirim...</>
                ) : (
                  <><FiCheckCircle size={15} /> {hasCheckedIn ? "Konfirmasi Check-out" : "Konfirmasi Check-in"}</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
