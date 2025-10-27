import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // If your backend uses cookies for auth or sends cookies, enable this.
  // Set to true only if you expect cookies (sameSite/settings on server).
  withCredentials: true,
});

// Automatically add token from localStorage (set by AuthContext)
api.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth && auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
