import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // ton backend
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
