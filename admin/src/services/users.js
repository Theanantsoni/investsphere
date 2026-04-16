// src/services/users.js

import API from "./api";

/* ======================================================
  FETCH ALL USERS
====================================================== */
export const fetchUsers = async (params = {}) => {
  try {
    const res = await API.get("/admin/users", {
      params, // for future: pagination, search, filters
    });

    return res.data;
  } catch (error) {
    console.error("Fetch Users Error:", error);
    throw error?.response?.data || { message: "Failed to fetch users" };
  }
};

/* ======================================================
  FETCH SINGLE USER
====================================================== */
export const fetchUserById = async (id) => {
  try {
    const res = await API.get(`/admin/users/${id}`);
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error?.response?.data || { message: "Failed to fetch user" };
  }
};

/* ======================================================
  UPDATE USER ROLE
====================================================== */
export const updateUserRole = async (id, role) => {
  try {
    const res = await API.patch(`/admin/users/${id}/role`, { role });
    return res.data;
  } catch (error) {
    console.error("Update User Role Error:", error);
    throw error?.response?.data || { message: "Failed to update role" };
  }
};

/* ======================================================
  DELETE USER
====================================================== */
export const deleteUser = async (id) => {
  try {
    const res = await API.delete(`/admin/users/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete User Error:", error);
    throw error?.response?.data || { message: "Failed to delete user" };
  }
};