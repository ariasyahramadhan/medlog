import axios from "axios";

// Ambil base URL dari env (bisa "http://localhost:8000", "https://api.sigmaeducation.id", dll)
const rawBaseUrl = import.meta.env.VITE_API_URL || "https://api.sigmaeducation.id";

// Bersihkan trailing slash
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");

// Pastikan berakhiran /api tanpa double slashes
const apiBaseUrl = cleanBaseUrl.endsWith("/api") ? cleanBaseUrl : `${cleanBaseUrl}/api`;

const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// 🔐 INTERCEPTOR → auto kirim token & normalisasi URL
api.interceptors.request.use((config) => {
    // Hilangkan leading slash pada url jika baseURL sudah memiliki /api
    if (config.url && typeof config.url === "string") {
        config.url = config.url.replace(/^\/+/, "");
    }

    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
