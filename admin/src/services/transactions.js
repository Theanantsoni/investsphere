// src/services/transactions.js

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
  FETCH ALL TRANSACTIONS
====================================================== */
export const fetchTransactions = async (params = {}) => {
  try {
    const res = await API.get("/admin/transactions", {
      params,
    });

    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch transactions");
  }
};

/* ======================================================
  FETCH SINGLE TRANSACTION
====================================================== */
export const fetchTransactionById = async (id) => {
  try {
    const res = await API.get(`/admin/transactions/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch transaction");
  }
};

/* ======================================================
  DELETE TRANSACTION
====================================================== */
export const deleteTransaction = async (id) => {
  try {
    const res = await API.delete(`/admin/transactions/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to delete transaction");
  }
};