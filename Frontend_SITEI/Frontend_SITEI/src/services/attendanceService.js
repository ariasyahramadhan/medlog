import api from "./api";

// ─── Status Presensi Hari Ini ────────────────────────────────────────────────
export const getTodayAttendance = () => api.get("/attendance/today");

// ─── Riwayat Presensi ────────────────────────────────────────────────────────
export const getAttendanceHistory = (month, year) =>
  api.get("/attendance/history", { params: { month, year } });

// ─── Jadwal Hari Ini ─────────────────────────────────────────────────────────
export const getTodaySchedule = () => api.get("/user/schedule/today");

// ─── Daftar Area Lokasi Presensi yang Disetujui ──────────────────────────────
export const getAttendanceLocations = () => api.get("/attendance/locations");

// ─── Deteksi Wajah Biometrik Instan ──────────────────────────────────────────
export const detectFaceBiometric = (photo_base64) =>
  api.post("/detect-face", { image_base64: photo_base64 });

// ─── Check-In ────────────────────────────────────────────────────────────────
/**
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} photo_base64 - base64 string gambar wajah (format: data:image/jpeg;base64,...)
 */
export const checkIn = (latitude, longitude, photo_base64) =>
  api.post("/attendance/check-in", { latitude, longitude, photo_base64 });

// ─── Check-Out ───────────────────────────────────────────────────────────────
export const checkOut = (latitude, longitude, photo_base64) =>
  api.post("/attendance/check-out", { latitude, longitude, photo_base64 });

