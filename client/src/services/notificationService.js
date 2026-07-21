import axios from "axios";
import.meta.env.VITE_API_URL

/* ======================================================
   AXIOS INSTANCE (INLINE - NO api.js REQUIRED)
====================================================== */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 20000,
  withCredentials: true,
});

/* ======================================================
   COMMON ERROR HANDLER
====================================================== */
const handleError = (error) => {
  console.error("API ERROR:", error?.response || error);

  return {
    success: false,
    message:
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong",
    data: [],
  };
};

/* ======================================================
   GET USER NOTIFICATIONS BY EMAIL
====================================================== */
export const getUserNotifications = async (email) => {
  try {
    if (!email) {
      return {
        success: false,
        message: "Email is required",
        data: [],
      };
    }

    const res = await API.get(
      `/messages/by-email?email=${encodeURIComponent(email)}`
    );

    return {
      success: true,
      data: res.data?.messages || [],
    };
  } catch (error) {
    return handleError(error);
  }
};