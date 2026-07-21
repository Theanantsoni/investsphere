import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

/* ======================================================
   REQUEST INTERCEPTOR (ATTACH TOKEN)
====================================================== */
API.interceptors.request.use(
  (config) => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const token = stored?.token;

    console.log("🔥 TOKEN SENT:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ======================================================
   RESPONSE INTERCEPTOR (ERROR HANDLING)
====================================================== */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("🔥 API ERROR:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/* ======================================================
   CHANGE PASSWORD API
====================================================== */
export const changePassword = async (data) => {
  const res = await API.put("/security/change-password", data);
  return res.data;
};

/* ======================================================
   EXPORT BASE API (OPTIONAL USE)
====================================================== */
export default API;