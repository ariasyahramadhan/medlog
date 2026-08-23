import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook untuk mengambil koordinat GPS pengguna.
 * Mengembalikan: { latitude, longitude, accuracy, error, loading, refresh }
 */
export default function useGeolocation() {
  const [state, setState] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
  });

  const getPosition = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        loading: false,
        error: "Browser tidak mendukung Geolocation.",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          error: null,
          loading: false,
        });
      },
      (err) => {
        let msg = "Gagal mendapatkan lokasi.";
        if (err.code === 1) msg = "Izin lokasi ditolak. Mohon aktifkan akses lokasi di browser.";
        if (err.code === 2) msg = "Lokasi tidak tersedia. Pastikan GPS aktif.";
        if (err.code === 3) msg = "Permintaan lokasi timeout. Coba lagi.";
        setState((s) => ({ ...s, loading: false, error: msg }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    getPosition();
  }, [getPosition]);

  return { ...state, refresh: getPosition };
}
