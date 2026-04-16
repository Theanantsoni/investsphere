// src/services/api.js

import axios from "axios";

/* ======================================================
  AXIOS INSTANCE
====================================================== */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  withCredentials: true,
});

/* ======================================================
  REQUEST INTERCEPTOR (CLERK READY)
====================================================== */
API.interceptors.request.use(
  async (config) => {
    try {
      // 🔐 Clerk session token
      const clerkToken = window?.Clerk?.session?.getToken
        ? await window.Clerk.session.getToken()
        : null;

      if (clerkToken) {
        config.headers.Authorization = `Bearer ${clerkToken}`;
      }

      config.headers["Content-Type"] = "application/json";

      return config;
    } catch (err) {
      console.error("Request interceptor error:", err);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

/* ======================================================
  RESPONSE INTERCEPTOR
====================================================== */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const status = error?.response?.status;

      // 🔐 Unauthorized → redirect login
      if (status === 401) {
        window.location.href = "/login";
      }

      if (status === 403) {
        console.warn("Access denied");
      }

      if (!error.response) {
        console.error("Network error or server not reachable");
      }

      return Promise.reject(error);
    } catch (err) {
      console.error("Response interceptor error:", err);
      return Promise.reject(error);
    }
  }
);

export default API;