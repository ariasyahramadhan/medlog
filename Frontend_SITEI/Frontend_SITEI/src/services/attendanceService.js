import api from "./api";

// ─── Status Presensi Hari Ini ────────────────────────────────────────────────
export const getTodayAttendance = () => api.get("/attendance/today");

// ─── Riwayat Presensi ────────────────────────────────────────────────────────
export const getAttendanceHistory = (month, year) =>
  api.get("/attendance/history", { params: { month, year } });

// ─── Jadwal Hari Ini ─────────────────────────────────────────────────────────
export const getTodaySchedule = () => api.get("/user/schedule/today");

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
