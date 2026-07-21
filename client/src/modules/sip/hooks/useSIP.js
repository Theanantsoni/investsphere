// hooks/useSIP.js

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API from "../../../config/api";


/* ======================================================
 AXIOS INSTANCE (BACKEND ONLY)
====================================================== */

const api = axios.create({
  baseURL: `${API}/api`,
  timeout: 20000,
});

/* ======================================================
 CUSTOM HOOK
====================================================== */

const useSIP = () => {
  const [sipData, setSipData] = useState([]); // always array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ======================================================
   FETCH SIP DATA
  ====================================================== */

  const fetchSIP = useCallback(async (retry = 0) => {
    try {
      console.log("📡 Fetching SIP data...");

      const res = await api.get("/sip"); // ✅ FIXED ROUTE

      console.log("✅ API RESPONSE COUNT:", res.data?.count);

      /* ✅ CORRECT DATA EXTRACTION */
      const safeData = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setSipData(safeData);
      setError(null);
    } catch (err) {
      console.error("❌ SIP ERROR:", err?.message);

      /* 🔁 RETRY */
      if (retry < 2) {
        console.log("🔁 Retrying SIP fetch...");
        setTimeout(() => fetchSIP(retry + 1), 1500);
        return;
      }

      /* ⚠️ FALLBACK DATA */
      console.log("⚠️ Using fallback data");

      setSipData([
        {
          schemeCode: "119551",
          schemeName: "Axis Bluechip Fund - Direct",
        },
        {
          schemeCode: "120503",
          schemeName: "SBI Small Cap Fund - Direct",
        },
        {
          schemeCode: "125497",
          schemeName: "HDFC Mid-Cap Opportunities Fund",
        },
      ]);

      setError("Live SIP data unavailable (fallback mode)");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ======================================================
   INIT LOAD
  ====================================================== */

  useEffect(() => {
    fetchSIP();
  }, [fetchSIP]);

  /* ======================================================
   RETURN
  ====================================================== */

  return {
    sipData,
    loading,
    error,
    refresh: fetchSIP,
  };
};

export default useSIP;