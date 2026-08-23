import React, { useState, useEffect } from "react";
import {
  FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck,
  FiX, FiRefreshCw, FiCheckCircle, FiXCircle, FiAlertCircle, FiNavigation
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";
import {
  getLocationAreas,
  createLocationArea,
  updateLocationArea,
  deleteLocationArea,
  approveLocationArea,
  rejectLocationArea
} from "../../../../services/adminAttendanceService";

// Default coordinates: Pekanbaru / FK UNRI / RSUD Arifin Achmad
const DEFAULT_CENTER = { lat: 0.5284, lng: 101.4497 };

// Leaflet Default Marker Icon Fix
const customMarkerIcon = new L.DivIcon({
  className: "custom-marker-icon",
  html: `<div style="background-color: #003178; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,49,120,0.4); border: 2px solid white;"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Component to handle map clicks for coordinate selection
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function AdminPresensiLokasi() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "radius",
    center_lat: DEFAULT_CENTER.lat,
    center_lng: DEFAULT_CENTER.lng,
    radius_meters: 100,
  });

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const res = await getLocationAreas();
      const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setAreas(list);
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Gagal memuat daftar area lokasi presensi.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleOpenCreate = () => {
    setEditingArea(null);
    setFormData({
      name: "",
      type: "radius",
      center_lat: DEFAULT_CENTER.lat,
      center_lng: DEFAULT_CENTER.lng,
      radius_meters: 100,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (area) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      type: area.type || "radius",
      center_lat: parseFloat(area.center_lat) || DEFAULT_CENTER.lat,
      center_lng: parseFloat(area.center_lng) || DEFAULT_CENTER.lng,
      radius_meters: parseFloat(area.radius_meters) || 100,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire("Validasi", "Nama area lokasi harus diisi.", "warning");
      return;
    }
    if (!formData.center_lat || !formData.center_lng) {
      Swal.fire("Validasi", "Koordinat titik lokasi harus ditentukan.", "warning");
      return;
    }

    try {
      if (editingArea) {
        await updateLocationArea(editingArea.id, formData);
        Swal.fire("Berhasil", "Area lokasi berhasil diperbarui.", "success");
      } else {
        await createLocationArea(formData);
        Swal.fire("Berhasil", "Area lokasi baru berhasil ditambahkan.", "success");
      }
      setIsModalOpen(false);
      fetchAreas();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Gagal menyimpan area lokasi.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Area Lokasi?",
      text: "Data area ini akan dihapus dari sistem.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteLocationArea(id);
        Swal.fire("Dihapus", "Area lokasi berhasil dihapus.", "success");
        fetchAreas();
      } catch (err) {
        Swal.fire("Gagal", "Gagal menghapus area lokasi.", "error");
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveLocationArea(id);
      Swal.fire("Disetujui", "Pengajuan lokasi mahasiswa telah disetujui.", "success");
      fetchAreas();
    } catch (err) {
      Swal.fire("Gagal", "Gagal menyetujui lokasi.", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectLocationArea(id);
      Swal.fire("Ditolak", "Pengajuan lokasi mahasiswa telah ditolak.", "info");
      fetchAreas();
    } catch (err) {
      Swal.fire("Gagal", "Gagal menolak lokasi.", "error");
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire("Info", "Browser Anda tidak mendukung geolokasi.", "warning");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          center_lat: pos.coords.latitude,
          center_lng: pos.coords.longitude,
        }));
      },
      (err) => {
        Swal.fire("Gagal", "Gagal mengambil lokasi GPS saat ini: " + err.message, "error");
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-7 font-['Inter'] pb-12 select-none">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-['Manrope']">
        <div>
          <h1 className="text-3xl font-extrabold text-[#003178] tracking-tight mb-1">
            Area Lokasi Presensi (Geofencing)
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Kelola zona validasi presensi rumah sakit, klinik rotasi, dan radius geofence
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#003178] hover:bg-blue-900 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-md shadow-blue-900/20 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <FiPlus size={16} />
          <span>Tambah Area Baru</span>
        </button>
      </div>

      {/* ── Overview Map ── */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-3 px-2">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-[#003178]" />
            <h3 className="font-extrabold text-sm text-slate-800">Peta Sebaran Lokasi Valid</h3>
          </div>
          <span className="text-xs text-slate-400 font-bold">{areas.length} Area Terdaftar</span>
        </div>

        <div className="h-80 w-full rounded-2xl overflow-hidden border border-slate-200 z-0 relative">
          <MapContainer
            center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
            zoom={13}
            className="w-full h-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {areas.map((area) => {
              const lat = parseFloat(area.center_lat);
              const lng = parseFloat(area.center_lng);
              if (!lat || !lng) return null;
              const isApproved = area.status === "approved";

              return (
                <React.Fragment key={area.id}>
                  <Marker position={[lat, lng]} icon={customMarkerIcon} />
                  <Circle
                    center={[lat, lng]}
                    radius={parseFloat(area.radius_meters) || 100}
                    pathOptions={{
                      color: isApproved ? "#003178" : "#f59e0b",
                      fillColor: isApproved ? "#3b82f6" : "#fbbf24",
                      fillOpacity: 0.25,
                      weight: 2,
                    }}
                  />
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* ── Table of Locations ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-extrabold text-slate-800 text-sm">Daftar Zona & Radius Presensi</h3>
          <button
            onClick={fetchAreas}
            className="p-2 text-slate-500 hover:text-[#003178] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Refresh"
          >
            <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-5">Nama Area / Fasilitas</th>
                <th className="py-4 px-4">Tipe Zona</th>
                <th className="py-4 px-4">Titik Koordinat (Lat, Lng)</th>
                <th className="py-4 px-4">Radius</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                    <FiRefreshCw className="animate-spin inline-block mr-2" size={16} />
                    Memuat data area lokasi...
                  </td>
                </tr>
              ) : areas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                    Belum ada area lokasi yang terdaftar.
                  </td>
                </tr>
              ) : (
                areas.map((area) => (
                  <tr key={area.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name */}
                    <td className="py-4 px-5 font-extrabold text-slate-800 text-sm">
                      {area.name}
                    </td>

                    {/* Type */}
                    <td className="py-4 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                        {area.type || "Radius"}
                      </span>
                    </td>

                    {/* Coords */}
                    <td className="py-4 px-4 font-mono text-slate-600">
                      {parseFloat(area.center_lat || 0).toFixed(5)}, {parseFloat(area.center_lng || 0).toFixed(5)}
                    </td>

                    {/* Radius */}
                    <td className="py-4 px-4 font-bold text-slate-700">
                      {area.radius_meters || 100} meter
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {area.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                          <FiCheckCircle size={11} /> Disetujui
                        </span>
                      ) : area.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                          <FiXCircle size={11} /> Ditolak
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                          <FiAlertCircle size={11} /> Menunggu
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right space-x-1.5">
                      {area.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(area.id)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer"
                            title="Setujui Pengajuan"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleReject(area.id)}
                            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer"
                            title="Tolak Pengajuan"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleOpenEdit(area)}
                        className="p-2 text-slate-400 hover:text-[#003178] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer inline-block"
                        title="Edit Area"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(area.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer inline-block"
                        title="Hapus Area"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Add / Edit Location ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-extrabold text-[#003178]">
                {editingArea ? "Edit Area Lokasi" : "Tambah Area Lokasi Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Nama Lokasi */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Area / Fasilitas Rumah Sakit
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: RSUD Arifin Achmad (Gedung Bedah Sentral)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#003178]"
                  required
                />
              </div>

              {/* Radius Slider / Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Radius Geofence</label>
                  <span className="text-xs font-extrabold text-[#003178]">
                    {formData.radius_meters} meter
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={formData.radius_meters}
                  onChange={(e) =>
                    setFormData({ ...formData, radius_meters: Number(e.target.value) })
                  }
                  className="w-full accent-[#003178] cursor-pointer"
                />
              </div>

              {/* Interactive Map Picker */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Pilih Titik Pusat di Peta (Klik untuk memindahkan pin)
                  </label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#003178] hover:underline cursor-pointer"
                  >
                    <FiNavigation size={12} />
                    Gunakan Lokasi GPS Saat Ini
                  </button>
                </div>

                <div className="h-64 w-full rounded-2xl overflow-hidden border border-slate-200 z-0 relative">
                  <MapContainer
                    center={[formData.center_lat, formData.center_lng]}
                    zoom={15}
                    className="w-full h-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler
                      onLocationSelect={(lat, lng) =>
                        setFormData((prev) => ({ ...prev, center_lat: lat, center_lng: lng }))
                      }
                    />
                    <Marker
                      position={[formData.center_lat, formData.center_lng]}
                      icon={customMarkerIcon}
                    />
                    <Circle
                      center={[formData.center_lat, formData.center_lng]}
                      radius={formData.radius_meters}
                      pathOptions={{
                        color: "#003178",
                        fillColor: "#3b82f6",
                        fillOpacity: 0.3,
                        weight: 2,
                      }}
                    />
                  </MapContainer>
                </div>
              </div>

              {/* Coordinates info */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Latitude</span>
                  <span className="font-mono font-bold text-slate-700">
                    {formData.center_lat.toFixed(6)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Longitude</span>
                  <span className="font-mono font-bold text-slate-700">
                    {formData.center_lng.toFixed(6)}
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#003178] hover:bg-blue-900 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  {editingArea ? "Simpan Perubahan" : "Tambah Area"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
