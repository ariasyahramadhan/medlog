import React from "react";
import { FiMapPin, FiLoader, FiAlertTriangle, FiCheckCircle, FiRefreshCw } from "react-icons/fi";

/**
 * Komponen tampilan status GPS.
 * Props:
 *  - latitude, longitude, accuracy, error, loading (dari useGeolocation)
 *  - onRefresh: callback untuk ambil ulang lokasi
 */
export default function LocationStatus({ latitude, longitude, accuracy, error, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
        <FiLoader className="animate-spin text-[#003178] shrink-0" size={16} />
        <p className="text-xs font-bold text-[#003178]">Mengambil lokasi GPS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
        <FiAlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-red-600 mb-1">GPS Tidak Tersedia</p>
          <p className="text-[11px] text-red-500">{error}</p>
        </div>
        <button
          onClick={onRefresh}
          className="text-red-400 hover:text-red-600 transition-colors shrink-0"
          title="Coba lagi"
        >
          <FiRefreshCw size={14} />
        </button>
      </div>
    );
  }

  if (latitude && longitude) {
    const accuracyLabel = accuracy
      ? accuracy <= 20 ? "Sangat Akurat" : accuracy <= 50 ? "Akurat" : "Kurang Akurat"
      : null;
    const accuracyColor = accuracy
      ? accuracy <= 20 ? "text-emerald-600" : accuracy <= 50 ? "text-amber-600" : "text-orange-600"
      : "";

    return (
      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
        <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-emerald-700 mb-1">Lokasi Ditemukan</p>
          <p className="text-[11px] text-slate-600 font-mono truncate">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
          {accuracy && (
            <p className={`text-[11px] font-bold mt-0.5 ${accuracyColor}`}>
              Akurasi: ±{Math.round(accuracy)}m ({accuracyLabel})
            </p>
          )}
        </div>
        <button
          onClick={onRefresh}
          className="text-emerald-400 hover:text-emerald-600 transition-colors shrink-0"
          title="Perbarui lokasi"
        >
          <FiRefreshCw size={14} />
        </button>
      </div>
    );
  }

  return null;
}
