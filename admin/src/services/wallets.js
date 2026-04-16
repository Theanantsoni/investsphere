// src/services/wallets.js

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
  FETCH ALL WALLETS
====================================================== */
export const fetchWallets = async (params = {}) => {
  try {
    const res = await API.get("/admin/wallets", {
      params,
    });

    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch wallets");
  }
};

/* ======================================================
  FETCH SINGLE WALLET
====================================================== */
export const fetchWalletById = async (id) => {
  try {
    const res = await API.get(`/admin/wallets/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch wallet");
  }
};

/* ======================================================
  DELETE WALLET
====================================================== */
export const deleteWallet = async (id) => {
  try {
    const res = await API.delete(`/admin/wallets/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to delete wallet");
  }
};