import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ton backend
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 (Optionnel) Ajouter un interceptor pour les tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // JWT après login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
