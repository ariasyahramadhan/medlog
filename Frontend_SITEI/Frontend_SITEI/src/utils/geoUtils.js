/**
 * Utility geolokasi dan pencocokan area presensi (Geofencing)
 */

/**
 * Hitung jarak 2 koordinat (latitude, longitude) dalam meter menggunakan rumus Haversine.
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius bumi dalam meter
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Cek apakah titik koordinat (lat, lng) berada di dalam poligon (ray casting algorithm).
 */
export function isPointInPolygon(lat, lng, polygonPoints) {
  if (!polygonPoints || !Array.isArray(polygonPoints) || polygonPoints.length < 3) {
    return false;
  }
  let inside = false;
  let j = polygonPoints.length - 1;
  for (let i = 0; i < polygonPoints.length; i++) {
    const xi = polygonPoints[i].lat;
    const yi = polygonPoints[i].lng;
    const xj = polygonPoints[j].lat;
    const yj = polygonPoints[j].lng;

    const intersect =
      yi > lng !== yj > lng &&
      lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
    j = i;
  }
  return inside;
}

/**
 * Cari area lokasi yang cocok dengan koordinat pengguna.
 * @param {number} lat - Latitude pengguna
 * @param {number} lng - Longitude pengguna
 * @param {Array} locationList - Daftar LocationArea yang disetujui
 * @returns {Object|null} - Area yang cocok beserta distanceMeters (jika radius) atau null jika di luar semua area
 */
export function findMatchingLocationArea(lat, lng, locationList = []) {
  if (!lat || !lng || !Array.isArray(locationList) || locationList.length === 0) {
    return null;
  }

  for (const area of locationList) {
    // 1. Tipe Radius
    if (area.type === "radius" && area.center_lat && area.center_lng) {
      const centerLat = parseFloat(area.center_lat);
      const centerLng = parseFloat(area.center_lng);
      const radius = parseFloat(area.radius_meters) || 100;
      const distance = calculateDistance(lat, lng, centerLat, centerLng);

      if (distance <= radius) {
        return {
          ...area,
          distanceMeters: Math.round(distance),
        };
      }
    }
    // 2. Tipe Poligon
    else if (area.type === "polygon" && Array.isArray(area.polygon_points) && area.polygon_points.length >= 3) {
      if (isPointInPolygon(lat, lng, area.polygon_points)) {
        return {
          ...area,
          distanceMeters: 0,
        };
      }
    }
  }

  return null;
}
