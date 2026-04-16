// src/services/auth.js

import API from "./api";

export const loginAdmin = async (payload) => {
  try {
    const res = await API.post("/auth/admin-login", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const getProfile = async () => {
  try {
    const res = await API.get("/auth/me");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetch failed" };
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem("admin_token");
};