import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const stored = JSON.parse(localStorage.getItem("user"));

  const token = stored?.token;

  console.log("🔥 TOKEN SENT:", token); // DEBUG

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const changePassword = async (data) => {
  const res = await API.put("/security/change-password", data);
  return res.data;
};