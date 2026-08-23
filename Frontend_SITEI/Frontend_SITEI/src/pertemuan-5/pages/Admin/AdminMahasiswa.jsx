import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  FiSearch, FiPlus, FiEdit, FiTrash2, 
  FiX, FiDownload, FiUsers, FiCheckCircle, FiSlash,
  FiEye, FiEyeOff, FiLock 
} from "react-icons/fi";

export default function AdminMahasiswa() {
  // State Utama dari Database
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Filter & Search
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("Semua Departemen");
  const [batchFilter, setBatchFilter] = useState("Semua Angkatan");

  // State Modal Form dengan Animasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // State Input Form sesuai struktur Tabel Users
  const [formData, setFormData] = useState({
    name: "",
    identifier: "",
    role: "Mahasiswa",
    email: "",
    password: "", // Field baru
    department: "Bedah",
    batch: "2021",
    status: "Aktif"
  });

  // URL API Laravel
  const API_URL = "https://api.sigmaeducation.id/api/students";

  // Konfigurasi Kustom SweetAlert2 agar Senada dengan Tema Sistem
  const customSwal = Swal.mixin({
    customClass: {
      confirmButton: "bg-[#003178] hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider mx-2 outline-none border-none",
      cancelButton: "bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider mx-2 border border-slate-200"
    },
    buttonsStyling: false
  });

  // Ambil token dari localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // 1. READ: Ambil Data dari API
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeader(),
        params: {
          search: search,
          department: deptFilter,
          batch: batchFilter
        }
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Gagal mengambil data mahasiswa dari database:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, deptFilter, batchFilter]);

  // 2. CREATE & UPDATE: Handler Simpan Data
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Kirim password hanya jika diisi (untuk update password)
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;

        await axios.put(`${API_URL}/${selectedStudent.id}`, updateData, {
          headers: getAuthHeader()
        });
        closeModal();
        fetchStudents();
        customSwal.fire({
          title: "Berhasil Diperbarui!",
          text: "Data mahasiswa telah berhasil diupdate.",
          icon: "success"
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: getAuthHeader()
        });
        closeModal();
        fetchStudents();
        customSwal.fire({
          title: "Berhasil Ditambahkan!",
          text: "Mahasiswa baru berhasil didaftarkan ke sistem.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      customSwal.fire({
        title: "Gagal!",
        text: error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.",
        icon: "error"
      });
    }
  };

  // 3. DELETE: Handler Hapus dengan Konfirmasi
  const handleDelete = async (id) => {
    customSwal.fire({
      title: "Hapus Data Mahasiswa?",
      text: "Data yang dihapus tidak dapat dipulihkan kembali!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeader()
          });
          fetchStudents();
          customSwal.fire({
            title: "Terhapus!",
            text: "Data mahasiswa telah dihapus dari database.",
            icon: "success"
          });
        } catch (error) {
          console.error("Gagal menghapus data:", error);
          customSwal.fire({
            title: "Gagal!",
            text: "Terjadi kesalahan saat menghapus data mahasiswa.",
            icon: "error"
          });
        }
      }
    });
  };

  // Handler Buka Modal dengan Animasi Slide-In
  const openAddModal = () => {
    setIsEditMode(false);
    setShowPassword(false);
    setFormData({
      name: "",
      identifier: "",
      role: "Mahasiswa",
      email: "",
      password: "",
      department: "Bedah",
      batch: "2021",
      status: "Aktif"
    });
    setIsModalOpen(true);
    setTimeout(() => setAnimateModal(true), 10);
  };

  // Handler Edit
  const openEditModal = (student) => {
    setIsEditMode(true);
    setShowPassword(false);
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      identifier: student.identifier,
      role: "Mahasiswa",
      email: student.email || "",
      password: "", // Kosongkan password saat edit kecuali mau diganti
      department: student.department || "Bedah",
      batch: student.batch || "2021",
      status: student.status || "Aktif"
    });
    setIsModalOpen(true);
    setTimeout(() => setAnimateModal(true), 10);
  };

  // Handler Tutup Modal dengan Animasi Slide-Out
  const closeModal = () => {
    setAnimateModal(false);
    setTimeout(() => setIsModalOpen(false), 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8 font-['Inter'] w-full select-none pb-6">
      
      {/* Header Page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-['Manrope']">
        <div>
          <h2 className="text-3xl font-extrabold text-[#003178] tracking-tight leading-none">
            Manajemen Mahasiswa
          </h2>
          <p className="text-sm font-medium text-slate-500 font-['Inter'] mt-2">
            Kelola data akademik dan rotasi klinis secara langsung dari database.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#003178] hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 uppercase tracking-wider text-xs shrink-0"
        >
          <FiPlus className="text-lg" /> Tambah Mahasiswa
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003178] text-2xl border border-blue-100/50">
            <FiUsers />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Total Mahasiswa</p>
            <p className="text-3xl font-extrabold text-slate-800 leading-none">{students.length}</p>
          </div>
        </div>

        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 text-2xl border border-green-100/50">
            <FiCheckCircle />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Aktif</p>
            <p className="text-3xl font-extrabold text-slate-800 leading-none">
              {students.filter((s) => s.status === "Aktif").length}
            </p>
          </div>
        </div>

        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 text-2xl border border-red-100/50">
            <FiSlash />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tidak Aktif</p>
            <p className="text-3xl font-extrabold text-slate-800 leading-none">
              {students.filter((s) => s.status === "Tidak Aktif").length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Data Container */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden w-full">
        
        {/* Table Filters */}
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative focus-within:ring-2 focus-within:ring-[#003178]/10 rounded-xl transition-all border border-slate-200/60 flex items-center bg-slate-50">
              <FiSearch className="absolute left-3.5 text-slate-400 text-lg" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau NIM..." 
                className="bg-transparent border-none focus:ring-0 text-xs px-10 py-2.5 w-64 placeholder-slate-400 font-medium rounded-xl outline-none"
              />
            </div>

            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none cursor-pointer"
            >
              <option>Semua Departemen</option>
              <option>Bedah</option>
              <option>Interna</option>
              <option>Pediatri</option>
              <option>Obgyn</option>
            </select>

            <select 
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none cursor-pointer"
            >
              <option>Semua Angkatan</option>
              <option>2021</option>
              <option>2022</option>
              <option>2023</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto w-full">
          {loading ? (
            <div className="text-center py-10 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Memuat data dari database...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/60 font-['Manrope'] border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">NIM</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Nama Lengkap</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Departemen</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Angkatan</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-600">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-xs font-bold text-slate-400 italic uppercase">
                      Tidak ada data ditemukan
                    </td>
                  </tr>
                ) : (
                  students.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-mono text-[#003178] font-bold text-xs">{std.identifier}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-extrabold text-slate-800 text-sm leading-none">{std.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{std.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#003178] border border-blue-100">
                          {std.department || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-extrabold text-slate-800">{std.batch || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          std.status === "Aktif" ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-400 border-slate-200"
                        }`}>
                          {std.status || "Aktif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEditModal(std)} className="p-2 text-slate-400 hover:text-[#003178] hover:bg-blue-50 rounded-xl transition-all"><FiEdit /></button>
                          <button onClick={() => handleDelete(std.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Form Tambah/Edit dengan Animasi Transisi Slide In-Out */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop Overlay */}
          <div 
            onClick={closeModal} 
            className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ${
              animateModal ? "opacity-100" : "opacity-0"
            }`}
          ></div>
          
          {/* Panel Modal */}
          <div 
            className={`relative h-full w-full max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-100 transition-transform duration-300 ease-out transform ${
              animateModal ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-['Manrope'] font-extrabold text-base text-slate-800 uppercase tracking-wide">
                {isEditMode ? "Edit Data Mahasiswa" : "Tambah Mahasiswa"}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><FiX /></button>
            </div>

            <form id="student-form" onSubmit={handleSave} className="flex-1 p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIM</label>
                  <input required name="identifier" value={formData.identifier} onChange={handleInputChange} disabled={isEditMode} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:bg-white disabled:opacity-50 focus:ring-1 focus:ring-[#003178] outline-none" type="text" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Angkatan</label>
                  <input required name="batch" value={formData.batch} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-[#003178] outline-none" type="text" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-[#003178] outline-none" type="text" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Akademik</label>
                <input required name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-[#003178] outline-none" type="email" />
              </div>

              {/* FIELD PASSWORD BARU */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {isEditMode ? "Ubah Kata Sandi" : "Kata Sandi"}
                  </label>
                  {isEditMode && (
                    <span className="text-[9px] text-slate-400 italic">Kosongkan jika tidak diubah</span>
                  )}
                </div>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm group-focus-within:text-[#003178] transition-colors" />
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"}
                    required={!isEditMode}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={isEditMode ? "••••••••" : "Masukkan kata sandi"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-[#003178] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#003178] transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Departemen</label>
                <select name="department" value={formData.department} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 cursor-pointer focus:bg-white focus:ring-1 focus:ring-[#003178] outline-none">
                  <option>Bedah</option>
                  <option>Interna</option>
                  <option>Pediatri</option>
                  <option>Obgyn</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Akademik</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 cursor-pointer focus:bg-white focus:ring-1 focus:ring-[#003178] outline-none">
                  <option>Aktif</option>
                  <option>Tidak Aktif</option>
                </select>
              </div>
            </form>

            <div className="p-6 border-t border-slate-100 flex items-center gap-3 bg-slate-50/30">
              <button type="button" onClick={closeModal} className="flex-1 py-3 text-xs font-black text-slate-500 bg-slate-100 rounded-xl uppercase tracking-widest border border-slate-200 hover:bg-slate-200 transition-colors">Batal</button>
              <button type="submit" form="student-form" className="flex-1 py-3 text-xs font-black text-white bg-[#003178] hover:bg-blue-800 rounded-xl transition-all uppercase tracking-widest shadow-md">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}