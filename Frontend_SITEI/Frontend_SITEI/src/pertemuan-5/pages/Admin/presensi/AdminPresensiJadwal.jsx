import React, { useState, useEffect } from "react";
import {
  FiCalendar, FiPlus, FiEdit2, FiTrash2, FiUsers,
  FiClock, FiMapPin, FiCheck, FiX, FiRefreshCw, FiSearch
} from "react-icons/fi";
import Swal from "sweetalert2";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getScheduleAssignedUsers,
  assignUsersToSchedule,
  getLocationAreas,
  getAllStudents
} from "../../../../services/adminAttendanceService";

const DAYS_OF_WEEK = [
  { id: "Senin", label: "Senin" },
  { id: "Selasa", label: "Selasa" },
  { id: "Rabu", label: "Rabu" },
  { id: "Kamis", label: "Kamis" },
  { id: "Jumat", label: "Jumat" },
  { id: "Sabtu", label: "Sabtu" },
  { id: "Minggu", label: "Minggu" }
];

export default function AdminPresensiJadwal() {
  const [schedules, setSchedules] = useState([]);
  const [locationAreas, setLocationAreas] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Schedule Form (Create/Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    days_of_week: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
    check_in_start: "07:00",
    check_in_end: "08:30",
    check_out_start: "15:00",
    check_out_end: "18:00",
    allow_home_location: false,
    location_area_ids: []
  });

  // Modal State for Assign Users
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [assignedUserIds, setAssignedUserIds] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [savingAssign, setSavingAssign] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schedRes, locRes, studRes] = await Promise.all([
        getSchedules(),
        getLocationAreas(),
        getAllStudents()
      ]);
      setSchedules(Array.isArray(schedRes.data) ? schedRes.data : (schedRes.data?.data ?? []));
      setLocationAreas(Array.isArray(locRes.data) ? locRes.data : (locRes.data?.data ?? []));
      setStudents(Array.isArray(studRes.data) ? studRes.data : (studRes.data?.data ?? []));
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Gagal memuat data jadwal.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingSchedule(null);
    setFormData({
      name: "",
      days_of_week: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
      check_in_start: "07:00",
      check_in_end: "08:30",
      check_out_start: "15:00",
      check_out_end: "18:00",
      allow_home_location: false,
      location_area_ids: locationAreas.map((a) => a.id)
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (sched) => {
    setEditingSchedule(sched);
    setFormData({
      name: sched.name,
      days_of_week: Array.isArray(sched.days_of_week)
        ? sched.days_of_week
        : JSON.parse(sched.days_of_week || "[]"),
      check_in_start: sched.check_in_start ? sched.check_in_start.slice(0, 5) : "07:00",
      check_in_end: sched.check_in_end ? sched.check_in_end.slice(0, 5) : "08:30",
      check_out_start: sched.check_out_start ? sched.check_out_start.slice(0, 5) : "15:00",
      check_out_end: sched.check_out_end ? sched.check_out_end.slice(0, 5) : "18:00",
      allow_home_location: Boolean(sched.allow_home_location),
      location_area_ids: sched.location_areas ? sched.location_areas.map((a) => a.id) : []
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire("Validasi", "Nama jadwal harus diisi.", "warning");
      return;
    }
    if (formData.days_of_week.length === 0) {
      Swal.fire("Validasi", "Pilih minimal 1 hari aktif.", "warning");
      return;
    }

    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, formData);
        Swal.fire("Berhasil", "Jadwal berhasil diperbarui.", "success");
      } else {
        await createSchedule(formData);
        Swal.fire("Berhasil", "Jadwal baru berhasil dibuat.", "success");
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", err.response?.data?.message || "Gagal menyimpan jadwal.", "error");
    }
  };

  const handleDeleteSchedule = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Jadwal?",
      text: "Jadwal ini akan dihapus dari sistem.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        await deleteSchedule(id);
        Swal.fire("Dihapus", "Jadwal berhasil dihapus.", "success");
        fetchData();
      } catch (err) {
        Swal.fire("Gagal", "Gagal menghapus jadwal.", "error");
      }
    }
  };

  const handleOpenAssign = async (sched) => {
    setSelectedSchedule(sched);
    setStudentSearch("");
    setIsAssignOpen(true);
    try {
      const res = await getScheduleAssignedUsers(sched.id);
      setAssignedUserIds(res.data?.assigned_user_ids ?? []);
    } catch (err) {
      setAssignedUserIds(sched.users ? sched.users.map((u) => u.id) : []);
    }
  };

  const toggleUserAssignment = (userId) => {
    setAssignedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const selectAllStudents = () => {
    const allIds = students.map((s) => s.id);
    if (assignedUserIds.length === allIds.length) {
      setAssignedUserIds([]);
    } else {
      setAssignedUserIds(allIds);
    }
  };

  const handleSaveAssignment = async () => {
    setSavingAssign(true);
    try {
      await assignUsersToSchedule(selectedSchedule.id, assignedUserIds);
      Swal.fire("Berhasil", "Penugasan mahasiswa berhasil disimpan.", "success");
      setIsAssignOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Gagal menyimpan penugasan mahasiswa.", "error");
    } finally {
      setSavingAssign(false);
    }
  };

  const toggleDay = (dayId) => {
    setFormData((prev) => {
      const exists = prev.days_of_week.includes(dayId);
      return {
        ...prev,
        days_of_week: exists
          ? prev.days_of_week.filter((d) => d !== dayId)
          : [...prev.days_of_week, dayId]
      };
    });
  };

  const toggleLocation = (locId) => {
    setFormData((prev) => {
      const exists = prev.location_area_ids.includes(locId);
      return {
        ...prev,
        location_area_ids: exists
          ? prev.location_area_ids.filter((id) => id !== locId)
          : [...prev.location_area_ids, locId]
      };
    });
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.identifier?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-7 font-['Inter'] pb-12 select-none">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-['Manrope']">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#003178] tracking-tight mb-1">
            Jadwal Rotasi Klinis
          </h1>
          <p className="text-xs lg:text-sm font-medium text-slate-500">
            Atur jam kerja, hari aktif, dan penugasan mahasiswa residen ke jadwal rotasi
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#003178] hover:bg-blue-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-blue-900/20 active:scale-95 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <FiPlus size={16} />
          <span>Tambah Jadwal Baru</span>
        </button>
      </div>

      {/* ── Schedule Grid ── */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-slate-400 font-semibold">
          <FiRefreshCw className="animate-spin inline-block mr-2" size={18} />
          Memuat daftar jadwal...
        </div>
      ) : schedules.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
          <FiCalendar className="text-slate-300 mx-auto mb-3" size={36} />
          <h3 className="font-extrabold text-slate-700 text-base mb-1">Belum Ada Jadwal</h3>
          <p className="text-xs text-slate-400 mb-5">
            Buat jadwal rotasi pertama Anda untuk mengatur waktu presensi mahasiswa.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-[#003178] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-900 transition-all cursor-pointer"
          >
            + Buat Jadwal Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schedules.map((sched) => {
            const days = Array.isArray(sched.days_of_week)
              ? sched.days_of_week
              : JSON.parse(sched.days_of_week || "[]");
            const assignedCount = sched.users ? sched.users.length : 0;

            return (
              <div
                key={sched.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Title & Actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#003178] px-2.5 py-1 rounded-full border border-blue-100">
                        Rotasi
                      </span>
                      <h3 className="font-extrabold text-slate-800 text-lg mt-2 tracking-tight">
                        {sched.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(sched)}
                        className="p-2 text-slate-400 hover:text-[#003178] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                        title="Edit Jadwal"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(sched.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Hapus Jadwal"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Times */}
                  <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Check-In
                      </p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">
                        {sched.check_in_start?.slice(0, 5)} - {sched.check_in_end?.slice(0, 5)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Check-Out
                      </p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">
                        {sched.check_out_start?.slice(0, 5)} - {sched.check_out_end?.slice(0, 5)}
                      </p>
                    </div>
                  </div>

                  {/* Active Days */}
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Hari Aktif
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {DAYS_OF_WEEK.map((d) => {
                        const active = days.includes(d.id);
                        return (
                          <span
                            key={d.id}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              active
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-400 opacity-50"
                            }`}
                          >
                            {d.label.slice(0, 3)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer: Assign Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <FiUsers size={14} className="text-[#003178]" />
                    <span>{assignedCount} Mahasiswa</span>
                  </div>
                  <button
                    onClick={() => handleOpenAssign(sched)}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-[#003178] text-[#003178] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Atur Mahasiswa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal Create / Edit Schedule ── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-extrabold text-[#003178]">
                {editingSchedule ? "Edit Jadwal Rotasi" : "Buat Jadwal Rotasi Baru"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-5">
              {/* Nama Jadwal */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Nama Jadwal / Rotasi</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Rotasi Bedah Sentral (Shift Pagi)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#003178]"
                  required
                />
              </div>

              {/* Hari Aktif */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Hari Aktif Presensi</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map((d) => {
                    const isChecked = formData.days_of_week.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleDay(d.id)}
                        className={`py-2 px-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          isChecked
                            ? "bg-[#003178] text-white shadow-xs"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {d.label.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Waktu Check-In & Check-Out */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Mulai Check-In</label>
                  <input
                    type="time"
                    value={formData.check_in_start}
                    onChange={(e) => setFormData({ ...formData, check_in_start: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Batas Akhir Check-In</label>
                  <input
                    type="time"
                    value={formData.check_in_end}
                    onChange={(e) => setFormData({ ...formData, check_in_end: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Mulai Check-Out</label>
                  <input
                    type="time"
                    value={formData.check_out_start}
                    onChange={(e) => setFormData({ ...formData, check_out_start: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Batas Akhir Check-Out</label>
                  <input
                    type="time"
                    value={formData.check_out_end}
                    onChange={(e) => setFormData({ ...formData, check_out_end: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Area Lokasi Terkait */}
              {locationAreas.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Hubungkan Area Lokasi Valid
                  </label>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    {locationAreas.map((loc) => {
                      const isChecked = formData.location_area_ids.includes(loc.id);
                      return (
                        <label
                          key={loc.id}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 p-1.5 rounded-lg"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleLocation(loc.id)}
                            className="rounded border-slate-300 text-[#003178] focus:ring-0"
                          />
                          <span>{loc.name}</span>
                          {loc.radius_meters && (
                            <span className="text-[10px] text-slate-400">({loc.radius_meters}m)</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#003178] hover:bg-blue-900 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  {editingSchedule ? "Simpan Perubahan" : "Buat Jadwal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Assign Students ── */}
      {isAssignOpen && selectedSchedule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#003178]">
                  Penugasan Mahasiswa
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Jadwal: <span className="font-bold text-slate-700">{selectedSchedule.name}</span>
                </p>
              </div>
              <button
                onClick={() => setIsAssignOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Search and Select All Bar */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Cari mahasiswa berdasarkan nama/NIM..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#003178]"
                />
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600">
                  {assignedUserIds.length} dari {students.length} Mahasiswa Terpilih
                </span>
                <button
                  type="button"
                  onClick={selectAllStudents}
                  className="text-xs font-extrabold text-[#003178] hover:underline cursor-pointer"
                >
                  {assignedUserIds.length === students.length ? "Batal Pilih Semua" : "Pilih Semua"}
                </button>
              </div>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
              {filteredStudents.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-8">
                  Mahasiswa tidak ditemukan.
                </p>
              ) : (
                filteredStudents.map((s) => {
                  const isChecked = assignedUserIds.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleUserAssignment(s.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? "bg-blue-50 border-blue-200 text-[#003178]"
                          : "bg-white border-slate-200/70 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <p className="font-extrabold text-xs">{s.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">{s.identifier}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-colors ${
                          isChecked ? "bg-[#003178] text-white" : "border border-slate-300"
                        }`}
                      >
                        {isChecked && <FiCheck size={13} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Save Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setIsAssignOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveAssignment}
                disabled={savingAssign}
                className="flex-1 py-3 rounded-xl bg-[#003178] hover:bg-blue-900 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {savingAssign ? "Menyimpan..." : "Simpan Penugasan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
