import api from "./api";

// ─── Rekap Presensi ──────────────────────────────────────────────────────────
export const getAdminAttendanceHistory = (params) =>
  api.get("/admin/attendance/history", { params });

export const deleteAttendanceLog = (id) =>
  api.delete(`/admin/attendance/${id}`);

export const resetAttendanceFlag = (id) =>
  api.post(`/admin/attendance/${id}/reset-flag`);

export const exportAttendanceCsv = (params) =>
  api.get("/admin/attendance/export", { params, responseType: "blob" });

// ─── Manajemen Jadwal Rotasi ─────────────────────────────────────────────────
export const getSchedules = () =>
  api.get("/admin/schedules");

export const getScheduleDetail = (id) =>
  api.get(`/admin/schedules/${id}`);

export const createSchedule = (data) =>
  api.post("/admin/schedules", data);

export const updateSchedule = (id, data) =>
  api.put(`/admin/schedules/${id}`, data);

export const deleteSchedule = (id) =>
  api.delete(`/admin/schedules/${id}`);

export const getScheduleAssignedUsers = (id) =>
  api.get(`/admin/schedules/${id}/users`);

export const assignUsersToSchedule = (id, user_ids) =>
  api.post(`/admin/schedules/${id}/users`, { user_ids });

// ─── Manajemen Area Lokasi ───────────────────────────────────────────────────
export const getLocationAreas = () =>
  api.get("/admin/locations");

export const createLocationArea = (data) =>
  api.post("/admin/locations", data);

export const updateLocationArea = (id, data) =>
  api.put(`/admin/locations/${id}`, data);

export const deleteLocationArea = (id) =>
  api.delete(`/admin/locations/${id}`);

export const approveLocationArea = (id) =>
  api.post(`/admin/locations/${id}/approve`);

export const rejectLocationArea = (id) =>
  api.post(`/admin/locations/${id}/reject`);

// ─── Daftar Mahasiswa untuk Assign ───────────────────────────────────────────
export const getAllStudents = () =>
  api.get("/students");
