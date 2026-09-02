import { useState, useEffect, useCallback } from "react";
import { getTodayAttendance, getTodaySchedule, getAttendanceLocations, checkIn, checkOut } from "../services/attendanceService";
import { findMatchingLocationArea } from "../utils/geoUtils";

/**
 * Custom hook untuk logika presensi mahasiswa.
 * Mengelola state hari ini, jadwal, area lokasi yang disetujui, dan submit check-in/out.
 */
export default function useAttendance() {
  const [todayLogs, setTodayLogs] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Ambil status hari ini, jadwal aktif, & daftar lokasi yang disetujui
   */
  const fetchTodayStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [logsRes, schedRes, locsRes] = await Promise.allSettled([
        getTodayAttendance(),
        getTodaySchedule(),
        getAttendanceLocations(),
      ]);

      if (logsRes.status === "fulfilled") {
        setTodayLogs(logsRes.value.data?.data ?? []);
      }
      if (schedRes.status === "fulfilled") {
        setSchedule(schedRes.value.data?.data ?? null);
      }
      if (locsRes.status === "fulfilled") {
        const locList = Array.isArray(locsRes.value.data)
          ? locsRes.value.data
          : (locsRes.value.data?.data ?? []);
        setLocations(locList);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal memuat status presensi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayStatus();
  }, [fetchTodayStatus]);

  /**
   * Apakah user sudah check-in hari ini?
   */
  const hasCheckedIn = todayLogs.some((log) => log.type === "check_in");

  /**
   * Apakah user sudah check-out hari ini?
   */
  const hasCheckedOut = todayLogs.some((log) => log.type === "check_out");

  /**
   * Log check-in hari ini (jika ada)
   */
  const checkInLog = todayLogs.find((log) => log.type === "check_in") ?? null;

  /**
   * Log check-out hari ini (jika ada)
   */
  const checkOutLog = todayLogs.find((log) => log.type === "check_out") ?? null;

  /**
   * Helper untuk mencari area lokasi yang cocok berdasarkan koordinat
   */
  const getMatchedArea = useCallback((lat, lng) => {
    return findMatchingLocationArea(lat, lng, locations);
  }, [locations]);

  /**
   * Submit check-in
   * @param {number} latitude
   * @param {number} longitude
   * @param {string} photoBase64
   * @returns {{ success: boolean, message: string, is_flagged?: boolean }}
   */
  const submitCheckIn = async (latitude, longitude, photoBase64) => {
    setSubmitting(true);
    try {
      const res = await checkIn(latitude, longitude, photoBase64);
      await fetchTodayStatus();
      return { 
        success: true, 
        message: res.data?.message || "Check-in berhasil!",
        is_flagged: res.data?.is_flagged ?? false
      };
    } catch (err) {
      const msg = err?.response?.data?.message || "Check-in gagal. Coba lagi.";
      return { success: false, message: msg };
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Submit check-out
   */
  const submitCheckOut = async (latitude, longitude, photoBase64) => {
    setSubmitting(true);
    try {
      const res = await checkOut(latitude, longitude, photoBase64);
      await fetchTodayStatus();
      return { 
        success: true, 
        message: res.data?.message || "Check-out berhasil!",
        is_flagged: res.data?.is_flagged ?? false
      };
    } catch (err) {
      const msg = err?.response?.data?.message || "Check-out gagal. Coba lagi.";
      return { success: false, message: msg };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    todayLogs,
    schedule,
    locations,
    loading,
    submitting,
    error,
    hasCheckedIn,
    hasCheckedOut,
    checkInLog,
    checkOutLog,
    getMatchedArea,
    submitCheckIn,
    submitCheckOut,
    refresh: fetchTodayStatus,
  };
}
