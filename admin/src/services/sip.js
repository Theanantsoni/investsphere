// src/services/sip.js

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
  FETCH ALL SIP INVESTMENTS
====================================================== */
export const fetchSIP = async (params = {}) => {
  try {
    const res = await API.get("/admin/sip", {
      params, // support for filters, pagination, search (future-ready)
    });

    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch SIP data");
  }
};

/* ======================================================
  FETCH SINGLE SIP
====================================================== */
export const fetchSIPById = async (id) => {
  try {
    const res = await API.get(`/admin/sip/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch SIP");
  }
};

/* ======================================================
  DELETE SIP
====================================================== */
export const deleteSIP = async (id) => {
  try {
    const res = await API.delete(`/admin/sip/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to delete SIP");
  }
};