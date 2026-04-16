// src/services/reports.js

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
  FETCH ALL REPORTS
====================================================== */
export const fetchReports = async (params = {}) => {
  try {
    const res = await API.get("/admin/reports", {
      params,
    });

    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch reports");
  }
};

/* ======================================================
  FETCH SINGLE REPORT
====================================================== */
export const fetchReportById = async (id) => {
  try {
    const res = await API.get(`/admin/reports/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to fetch report");
  }
};

/* ======================================================
  DELETE REPORT
====================================================== */
export const deleteReport = async (id) => {
  try {
    const res = await API.delete(`/admin/reports/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error, "Failed to delete report");
  }
};