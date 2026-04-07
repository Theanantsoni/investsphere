import { useState, useEffect } from "react";
import axios from "axios";

/* ======================================================
   AXIOS CONFIG
====================================================== */

const api = axios.create({
  baseURL: "https://api.mfapi.in",
  timeout: 10000, // ⏱️ prevent hanging
});

/* ======================================================
   CUSTOM HOOK
====================================================== */

const useSIP = () => {
  const [sipData, setSipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ======================================================
     FETCH WITH RETRY (MAIN FIX 🔥)
  ====================================================== */

  const fetchSIP = async (retryCount = 0) => {
    try {
      const res = await api.get("/mf");

      const safeData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setSipData(safeData);
      setError(null);

    } catch (err) {
      console.error("SIP fetch error:", err?.message);

      /* 🔁 RETRY LOGIC */
      if (retryCount < 2) {
        setTimeout(() => {
          fetchSIP(retryCount + 1);
        }, 1000);
      } else {
        setError("Failed to load SIP data");
      }

    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     INIT LOAD
  ====================================================== */

  useEffect(() => {
    fetchSIP();
  }, []);

  /* ======================================================
     RETURN
  ====================================================== */

  return {
    sipData,
    loading,
    error,
  };
};

export default useSIP;