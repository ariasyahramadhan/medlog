import axios from "axios";

const api = axios.create({
    baseURL:  import.meta.env.VITE_API_URL + "/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// 🔐 INTERCEPTOR → auto kirim token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:8000/api",
//     headers: {
//         Accept: "application/json",
//     },
// });

// // inject token otomatis
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default api;

