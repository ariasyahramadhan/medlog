import React from "react";
import { FiMapPin, FiLoader, FiAlertTriangle, FiCheckCircle, FiRefreshCw, FiInfo } from "react-icons/fi";

/**
 * Komponen tampilan status GPS & Geofencing Area.
 * Props:
 *  - latitude, longitude, accuracy, error, loading (dari useGeolocation)
 *  - matchedArea: objek area lokasi yang cocok (jika berada dalam radius/poligon)
 *  - isOutside: boolean apakah posisi GPS berada di luar area presensi yang ditentukan
 *  - onRefresh: callback untuk ambil ulang lokasi
 */
export default function LocationStatus({
  latitude,
  longitude,
  accuracy,
  error,
  loading,
  matchedArea,
  isOutside = false,
  onRefresh,
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3.5">
        <FiLoader className="animate-spin text-[#003178] shrink-0" size={18} />
        <div>
          <p className="text-xs font-bold text-[#003178]">Mengambil sinyal GPS & mendeteksi area lokasi...</p>
          <p className="text-[11px] text-blue-600/70 mt-0.5">Pastikan izin lokasi perangkat telah aktif.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
        <FiAlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-extrabold text-red-700 mb-0.5">GPS / Lokasi Tidak Tersedia</p>
          <p className="text-[11px] text-red-600 leading-relaxed">{error}</p>
        </div>
        <button
          onClick={onRefresh}
          className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 p-2 rounded-xl transition-colors shrink-0"
          title="Coba ambil lokasi lagi"
        >
          <FiRefreshCw size={14} />
        </button>
      </div>
    );
  }

  if (latitude && longitude) {
    // ── KASUS 1: Berada di Luar Area Presensi yang Ditentukan ──
    if (isOutside || !matchedArea) {
      return (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-300/80 rounded-2xl px-4 py-3.5 shadow-xs">
          <FiAlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-amber-800">
                Peringatan: Berada di Luar Area Lokasi
              </span>
              <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md uppercase">
                Perlu Ditinjau
              </span>
            </div>
            <p className="text-[11px] text-amber-900/80 leading-relaxed">
              Titik koordinat Anda saat ini tidak masuk ke dalam area lokasi presensi resmi. Anda tetap dapat melakukan presensi, namun presensi Anda akan berstatus <strong>Ditinjau</strong> dan Anda perlu <strong>menghubungi Admin</strong> untuk disetujui.
            </p>
            <div className="pt-1 flex items-center gap-3 text-[11px] font-mono text-amber-800/80">
              <span className="flex items-center gap-1">
                <FiMapPin size={11} className="text-amber-600" />
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </span>
              {accuracy && <span>(±{Math.round(accuracy)}m)</span>}
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="text-amber-700 hover:text-amber-900 bg-amber-200/60 hover:bg-amber-200 p-2 rounded-xl transition-colors shrink-0"
            title="Perbarui titik lokasi GPS"
          >
            <FiRefreshCw size={14} />
          </button>
        </div>
      );
    }

    // ── KASUS 2: Berada di Dalam Area Presensi yang Valid ──
    return (
      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3.5 shadow-xs">
        <FiCheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-extrabold text-emerald-800">
              Lokasi Valid: {matchedArea.name}
            </span>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md uppercase">
              Area Terdeteksi
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 leading-relaxed">
            Posisi Anda terdeteksi berada di dalam area lokasi presensi resmi.
          </p>
          <div className="pt-0.5 flex items-center gap-3 text-[11px] font-mono text-slate-600">
            <span className="flex items-center gap-1">
              <FiMapPin size={11} className="text-emerald-600" />
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </span>
            {accuracy && <span className="text-slate-400 font-sans">(±{Math.round(accuracy)}m)</span>}
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="text-emerald-600 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 p-2 rounded-xl transition-colors shrink-0"
          title="Perbarui titik lokasi GPS"
        >
          <FiRefreshCw size={14} />
        </button>
      </div>
    );
  }

  return null;
}

