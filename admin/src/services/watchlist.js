// src/services/watchlist.js

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
  throw error?.response?.data || {
    message: fallbackMessage,
  };
};

/* ======================================================
  FETCH ALL WATCHLIST
====================================================== */
export const fetchWatchlist = async (params = {}) => {
  try {
    const res = await API.get("/admin/watchlist", {
      params,
    });

    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch watchlist");
  }
};

/* ======================================================
  FETCH SINGLE WATCHLIST ITEM
====================================================== */
export const fetchWatchlistById = async (id) => {
  try {
    const res = await API.get(`/admin/watchlist/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch watchlist item");
  }
};

/* ======================================================
  DELETE WATCHLIST ITEM
====================================================== */
export const deleteWatchlist = async (id) => {
  try {
    const res = await API.delete(`/admin/watchlist/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to delete watchlist item");
  }
};