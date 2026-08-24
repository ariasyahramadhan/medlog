import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck,
  FiX, FiRefreshCw, FiCheckCircle, FiXCircle, FiAlertCircle, FiNavigation,
  FiSquare, FiCircle
} from "react-icons/fi";
import {
  MapContainer, TileLayer, Marker, Circle, Polygon, Polyline,
  useMapEvents, useMap
} from "react-leaflet";
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

// Custom map marker icon
const customMarkerIcon = new L.DivIcon({
  className: "custom-marker-icon",
  html: `<div style="background-color: #003178; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,49,120,0.4); border: 2px solid white;"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const polygonPointIcon = new L.DivIcon({
  className: "polygon-point-icon",
  html: `<div style="background-color: #f59e0b; color: white; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// ─── Component: fly peta ke koordinat baru ───────────────────────────────────
function MapFlyTo({ lat, lng, trigger }) {
  const map = useMap();
  const prevTrigger = useRef(null);
  useEffect(() => {
    if (trigger !== null && trigger !== prevTrigger.current && lat && lng) {
      map.flyTo([lat, lng], 16, { animate: true, duration: 1.2 });
      prevTrigger.current = trigger;
    }
  }, [trigger, lat, lng, map]);
  return null;
}

// ─── Component: handle klik peta untuk radius / polygon ──────────────────────
function MapInteractionHandler({ mode, onRadiusClick, onPolygonAddPoint }) {
  useMapEvents({
    click(e) {
      if (mode === "radius") {
        onRadiusClick(e.latlng.lat, e.latlng.lng);
      } else if (mode === "polygon") {
        onPolygonAddPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────
export default function AdminPresensiLokasi() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "radius",
    center_lat: DEFAULT_CENTER.lat,
    center_lng: DEFAULT_CENTER.lng,
    radius_meters: 100,
    polygon_points: [], // array of {lat, lng}
  });

  // GPS fly-to trigger (increment setiap kali GPS berhasil diambil)
  const [flyTrigger, setFlyTrigger] = useState(null);

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

  const defaultForm = () => ({
    name: "",
    type: "radius",
    center_lat: DEFAULT_CENTER.lat,
    center_lng: DEFAULT_CENTER.lng,
    radius_meters: 100,
    polygon_points: [],
  });

  const handleOpenCreate = () => {
    setEditingArea(null);
    setFormData(defaultForm());
    setFlyTrigger(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (area) => {
    setEditingArea(area);
    const type = area.type || "radius";
    setFormData({
      name: area.name,
      type,
      center_lat: parseFloat(area.center_lat) || DEFAULT_CENTER.lat,
      center_lng: parseFloat(area.center_lng) || DEFAULT_CENTER.lng,
      radius_meters: parseFloat(area.radius_meters) || 100,
      polygon_points: Array.isArray(area.polygon_points) ? area.polygon_points : [],
    });
    setFlyTrigger(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire("Validasi", "Nama area lokasi harus diisi.", "warning");
      return;
    }
    if (formData.type === "radius" && (!formData.center_lat || !formData.center_lng)) {
      Swal.fire("Validasi", "Koordinat titik lokasi harus ditentukan.", "warning");
      return;
    }
    if (formData.type === "polygon" && formData.polygon_points.length < 3) {
      Swal.fire("Validasi", "Poligon harus memiliki minimal 3 titik.", "warning");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        center_lat: formData.type === "radius" ? formData.center_lat : null,
        center_lng: formData.type === "radius" ? formData.center_lng : null,
        radius_meters: formData.type === "radius" ? formData.radius_meters : null,
        polygon_points: formData.type === "polygon" ? formData.polygon_points : [],
      };

      if (editingArea) {
        await updateLocationArea(editingArea.id, payload);
        Swal.fire("Berhasil", "Area lokasi berhasil diperbarui.", "success");
      } else {
        await createLocationArea(payload);
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
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;
        setFormData((prev) => ({
          ...prev,
          center_lat: newLat,
          center_lng: newLng,
        }));
        // Trigger peta untuk fly ke lokasi GPS
        setFlyTrigger((t) => (t === null ? 0 : t + 1));
      },
      (err) => {
        Swal.fire("Gagal", "Gagal mengambil lokasi GPS saat ini: " + err.message, "error");
      },
      { enableHighAccuracy: true }
    );
  };

  const handlePolygonAddPoint = useCallback((point) => {
    setFormData((prev) => ({
      ...prev,
      polygon_points: [...prev.polygon_points, point],
    }));
  }, []);

  const handlePolygonRemoveLastPoint = () => {
    setFormData((prev) => ({
      ...prev,
      polygon_points: prev.polygon_points.slice(0, -1),
    }));
  };

  const handlePolygonClear = () => {
    setFormData((prev) => ({ ...prev, polygon_points: [] }));
  };

  // ─── Hitung center poligon untuk overview map ─────────────────────────────
  const polygonCenter = (points) => {
    if (!points || points.length === 0) return null;
    const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
    const lng = points.reduce((s, p) => s + p.lng, 0) / points.length;
    return [lat, lng];
  };

  return (
    <div className="space-y-5 lg:space-y-7 font-['Inter'] pb-12 select-none">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-['Manrope']">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#003178] tracking-tight mb-1">
            Area Lokasi Presensi (Geofencing)
          </h1>
          <p className="text-xs lg:text-sm font-medium text-slate-500">
            Kelola zona validasi presensi: radius lingkaran atau poligon custom
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#003178] hover:bg-blue-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-blue-900/20 active:scale-95 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <FiPlus size={16} />
          <span>Tambah Area Baru</span>
        </button>
      </div>

      {/* ── Overview Map ── */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-3 px-1">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-[#003178]" />
            <h3 className="font-extrabold text-sm text-slate-800">Peta Sebaran Lokasi Valid</h3>
          </div>
          <span className="text-xs text-slate-400 font-bold">{areas.length} Area Terdaftar</span>
        </div>

        <div className="h-56 sm:h-72 lg:h-80 w-full rounded-2xl overflow-hidden border border-slate-200 z-0 relative">
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
              const isApproved = area.status === "approved";
              const colorOpts = {
                color: isApproved ? "#003178" : "#f59e0b",
                fillColor: isApproved ? "#3b82f6" : "#fbbf24",
                fillOpacity: 0.25,
                weight: 2,
              };

              if (area.type === "polygon" && Array.isArray(area.polygon_points) && area.polygon_points.length >= 3) {
                const center = polygonCenter(area.polygon_points);
                return (
                  <React.Fragment key={area.id}>
                    {center && <Marker position={center} icon={customMarkerIcon} />}
                    <Polygon
                      positions={area.polygon_points.map((p) => [p.lat, p.lng])}
                      pathOptions={colorOpts}
                    />
                  </React.Fragment>
                );
              }

              const lat = parseFloat(area.center_lat);
              const lng = parseFloat(area.center_lng);
              if (!lat || !lng) return null;
              return (
                <React.Fragment key={area.id}>
                  <Marker position={[lat, lng]} icon={customMarkerIcon} />
                  <Circle
                    center={[lat, lng]}
                    radius={parseFloat(area.radius_meters) || 100}
                    pathOptions={colorOpts}
                  />
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* ── Table (desktop) / Card (mobile) ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 lg:p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-extrabold text-slate-800 text-sm">Daftar Zona Presensi</h3>
          <button
            onClick={fetchAreas}
            className="p-2 text-slate-500 hover:text-[#003178] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Refresh"
          >
            <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-5">Nama Area / Fasilitas</th>
                <th className="py-4 px-4">Tipe Zona</th>
                <th className="py-4 px-4">Titik Koordinat / Titik Poligon</th>
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
                    <td className="py-4 px-5 font-extrabold text-slate-800 text-sm">{area.name}</td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                        {area.type || "Radius"}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600 text-[11px]">
                      {area.type === "polygon"
                        ? `${(area.polygon_points || []).length} titik`
                        : `${parseFloat(area.center_lat || 0).toFixed(5)}, ${parseFloat(area.center_lng || 0).toFixed(5)}`
                      }
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-700">
                      {area.type === "polygon" ? "—" : `${area.radius_meters || 100} m`}
                    </td>
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
                    <td className="py-4 px-5 text-right space-x-1.5">
                      {area.status === "pending" && (
                        <>
                          <button onClick={() => handleApprove(area.id)} className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer">Setujui</button>
                          <button onClick={() => handleReject(area.id)} className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer">Tolak</button>
                        </>
                      )}
                      <button onClick={() => handleOpenEdit(area)} className="p-2 text-slate-400 hover:text-[#003178] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer inline-block"><FiEdit2 size={14} /></button>
                      <button onClick={() => handleDelete(area.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer inline-block"><FiTrash2 size={14} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden">
          {loading ? (
            <div className="py-12 text-center text-slate-400 font-semibold">
              <FiRefreshCw className="animate-spin inline-block mr-2" size={16} />
              Memuat data...
            </div>
          ) : areas.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-semibold">Belum ada area lokasi.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {areas.map((area) => (
                <div key={area.id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-extrabold text-slate-800 text-sm">{area.name}</p>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1 inline-block">
                        {area.type || "Radius"}
                      </span>
                    </div>
                    {area.status === "approved" ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0">
                        <FiCheckCircle size={10} /> OK
                      </span>
                    ) : area.status === "rejected" ? (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0">
                        <FiXCircle size={10} /> Ditolak
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0">
                        <FiAlertCircle size={10} /> Menunggu
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 mb-3">
                    {area.type === "polygon"
                      ? `${(area.polygon_points || []).length} titik poligon`
                      : `${parseFloat(area.center_lat || 0).toFixed(5)}, ${parseFloat(area.center_lng || 0).toFixed(5)} · ${area.radius_meters || 100}m`
                    }
                  </p>
                  <div className="flex gap-2">
                    {area.status === "pending" && (
                      <>
                        <button onClick={() => handleApprove(area.id)} className="flex-1 py-1.5 bg-emerald-600 text-white rounded-xl text-[11px] font-bold cursor-pointer">Setujui</button>
                        <button onClick={() => handleReject(area.id)} className="flex-1 py-1.5 bg-amber-600 text-white rounded-xl text-[11px] font-bold cursor-pointer">Tolak</button>
                      </>
                    )}
                    <button onClick={() => handleOpenEdit(area)} className="p-2 text-slate-400 hover:text-[#003178] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"><FiEdit2 size={14} /></button>
                    <button onClick={() => handleDelete(area.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"><FiTrash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Add / Edit Location ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 max-w-xl w-full shadow-2xl relative max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base lg:text-lg font-extrabold text-[#003178]">
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

              {/* Pilih Tipe Zona */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Tipe Zona Geofencing</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: "radius" }))}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      formData.type === "radius"
                        ? "bg-[#003178] text-white border-[#003178] shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-[#003178]"
                    }`}
                  >
                    <FiCircle size={14} /> Radius Lingkaran
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: "polygon" }))}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      formData.type === "polygon"
                        ? "bg-[#003178] text-white border-[#003178] shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-[#003178]"
                    }`}
                  >
                    <FiSquare size={14} /> Poligon Custom
                  </button>
                </div>
              </div>

              {/* ── MODE RADIUS ── */}
              {formData.type === "radius" && (
                <>
                  {/* Radius Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Radius Geofence</label>
                      <span className="text-xs font-extrabold text-[#003178]">{formData.radius_meters} meter</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="1000"
                      step="10"
                      value={formData.radius_meters}
                      onChange={(e) => setFormData({ ...formData, radius_meters: Number(e.target.value) })}
                      className="w-full accent-[#003178] cursor-pointer"
                    />
                  </div>

                  {/* GPS Button */}
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">
                      Pilih Titik Pusat (Klik peta)
                    </label>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#003178] hover:underline cursor-pointer"
                    >
                      <FiNavigation size={12} /> Gunakan Lokasi GPS Saat Ini
                    </button>
                  </div>

                  {/* Map Picker — Radius */}
                  <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-200 z-0 relative">
                    <MapContainer
                      center={[formData.center_lat, formData.center_lng]}
                      zoom={15}
                      className="w-full h-full"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {/* Fly ke lokasi GPS saat dipilih */}
                      <MapFlyTo
                        lat={formData.center_lat}
                        lng={formData.center_lng}
                        trigger={flyTrigger}
                      />
                      <MapInteractionHandler
                        mode="radius"
                        onRadiusClick={(lat, lng) => {
                          setFormData((prev) => ({ ...prev, center_lat: lat, center_lng: lng }));
                        }}
                        onPolygonAddPoint={() => {}}
                      />
                      <Marker position={[formData.center_lat, formData.center_lng]} icon={customMarkerIcon} />
                      <Circle
                        center={[formData.center_lat, formData.center_lng]}
                        radius={formData.radius_meters}
                        pathOptions={{ color: "#003178", fillColor: "#3b82f6", fillOpacity: 0.3, weight: 2 }}
                      />
                    </MapContainer>
                  </div>

                  {/* Koordinat info */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Latitude</span>
                      <span className="font-mono font-bold text-slate-700">{formData.center_lat.toFixed(6)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Longitude</span>
                      <span className="font-mono font-bold text-slate-700">{formData.center_lng.toFixed(6)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* ── MODE POLYGON ── */}
              {formData.type === "polygon" && (
                <>
                  {/* Instruksi & GPS Action */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-800 font-semibold flex items-center justify-between gap-2">
                    <span>💡 Klik pada peta untuk menambahkan titik poligon secara berurutan. Minimal 3 titik.</span>
                  </div>

                  {/* Header Bar: Titik counter + GPS Fly-To */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-bold text-slate-700">
                      Gambar Poligon ({formData.polygon_points.length} titik terpasang)
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        className="flex items-center gap-1 text-[11px] font-bold text-[#003178] hover:underline cursor-pointer"
                      >
                        <FiNavigation size={12} /> Pindah ke Lokasi GPS
                      </button>
                    </div>
                  </div>

                  {/* Map Picker — Polygon */}
                  <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-200 z-0 relative">
                    <MapContainer
                      center={
                        formData.polygon_points.length > 0
                          ? [formData.polygon_points[0].lat, formData.polygon_points[0].lng]
                          : [formData.center_lat || DEFAULT_CENTER.lat, formData.center_lng || DEFAULT_CENTER.lng]
                      }
                      zoom={15}
                      className="w-full h-full"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {/* Fly ke lokasi GPS saat tombol GPS ditekan */}
                      <MapFlyTo
                        lat={formData.center_lat}
                        lng={formData.center_lng}
                        trigger={flyTrigger}
                      />
                      <MapInteractionHandler
                        mode="polygon"
                        onRadiusClick={() => {}}
                        onPolygonAddPoint={handlePolygonAddPoint}
                      />
                      {/* Tampilkan titik-titik poligon */}
                      {formData.polygon_points.map((pt, idx) => (
                        <Marker key={idx} position={[pt.lat, pt.lng]} icon={polygonPointIcon} />
                      ))}
                      {/* Garis sambung antar titik */}
                      {formData.polygon_points.length >= 2 && (
                        <Polyline
                          positions={formData.polygon_points.map((p) => [p.lat, p.lng])}
                          pathOptions={{ color: "#003178", weight: 2, dashArray: "6,4" }}
                        />
                      )}
                      {/* Poligon tertutup jika >= 3 titik */}
                      {formData.polygon_points.length >= 3 && (
                        <Polygon
                          positions={formData.polygon_points.map((p) => [p.lat, p.lng])}
                          pathOptions={{ color: "#003178", fillColor: "#3b82f6", fillOpacity: 0.25, weight: 2 }}
                        />
                      )}
                    </MapContainer>
                  </div>

                  {/* Kontrol Titik & Aksi Tambah GPS */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!navigator.geolocation) {
                          Swal.fire("Info", "Browser Anda tidak mendukung geolokasi.", "warning");
                          return;
                        }
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            const newLat = pos.coords.latitude;
                            const newLng = pos.coords.longitude;
                            setFormData((prev) => ({
                              ...prev,
                              center_lat: newLat,
                              center_lng: newLng,
                              polygon_points: [...prev.polygon_points, { lat: newLat, lng: newLng }],
                            }));
                            setFlyTrigger((t) => (t === null ? 0 : t + 1));
                          },
                          (err) => {
                            Swal.fire("Gagal", "Gagal mengambil lokasi GPS: " + err.message, "error");
                          },
                          { enableHighAccuracy: true }
                        );
                      }}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#003178] rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <FiPlus size={12} /> Tambah Titik GPS Saya
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handlePolygonRemoveLastPoint}
                        disabled={formData.polygon_points.length === 0}
                        className="text-[11px] font-bold text-slate-500 hover:text-red-600 disabled:opacity-40 cursor-pointer"
                      >
                        ← Hapus Titik Terakhir
                      </button>
                      <button
                        type="button"
                        onClick={handlePolygonClear}
                        disabled={formData.polygon_points.length === 0}
                        className="text-[11px] font-bold text-red-500 hover:text-red-700 disabled:opacity-40 cursor-pointer"
                      >
                        Reset Semua
                      </button>
                    </div>
                  </div>

                  {/* Daftar titik poligon */}
                  {formData.polygon_points.length > 0 && (
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-2 max-h-28 overflow-y-auto">
                      {formData.polygon_points.map((pt, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[10px] font-mono text-slate-600 py-0.5 px-1">
                          <span className="font-bold text-slate-400 w-6">#{idx + 1}</span>
                          <span>{pt.lat.toFixed(6)}, {pt.lng.toFixed(6)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

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
