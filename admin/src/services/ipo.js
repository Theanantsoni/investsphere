// src/services/ipo.js

import API from "./api";

/* ======================================================
  HELPER: STANDARD RESPONSE HANDLER
====================================================== */
const handleResponse = (res) => {
  return {
    success: res?.data?.success ?? true,
    data: res?.data?.data ?? res?.data ?? {},
    message: res?.data?.message ?? "Success",
  };
};

/* ======================================================
  HELPER: ERROR HANDLER
====================================================== */
const handleError = (error, fallbackMessage) => {
  console.error(fallbackMessage, error);
  throw error?.response?.data || { message: fallbackMessage };
};

/* ======================================================
  FETCH ALL IPO INVESTMENTS
====================================================== */
export const fetchIPO = async (params = {}) => {
  try {
    const res = await API.get("/admin/ipo", {
      params, // supports filters, search, pagination (future-ready)
    });

    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch IPO data");
  }
};

/* ======================================================
  FETCH SINGLE IPO
====================================================== */
export const fetchIPOById = async (id) => {
  try {
    const res = await API.get(`/admin/ipo/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch IPO");
  }
};

/* ======================================================
  DELETE IPO
====================================================== */
export const deleteIPO = async (id) => {
  try {
    const res = await API.delete(`/admin/ipo/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to delete IPO");
  }
};