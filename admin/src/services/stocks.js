// src/services/stocks.js

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
  FETCH ALL STOCK INVESTMENTS
====================================================== */
export const fetchStocks = async (params = {}) => {
  try {
    const res = await API.get("/admin/stocks", {
      params, // support for search, filters, pagination (future-ready)
    });

    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch stocks");
  }
};

/* ======================================================
  FETCH SINGLE STOCK
====================================================== */
export const fetchStockById = async (id) => {
  try {
    const res = await API.get(`/admin/stocks/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch stock");
  }
};

/* ======================================================
  DELETE STOCK
====================================================== */
export const deleteStock = async (id) => {
  try {
    const res = await API.delete(`/admin/stocks/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to delete stock");
  }
};