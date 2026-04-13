// controllers/sipController.js

const axios = require("axios");

/* ======================================================
 AXIOS INSTANCE
====================================================== */

const api = axios.create({
  baseURL: "https://api.mfapi.in",
  timeout: 20000,
});

/* ======================================================
 RETRY FUNCTION
====================================================== */

const fetchWithRetry = async (url, retries = 2) => {
  try {
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    if (retries > 0) {
      console.log(`🔁 Retry ${url} (${retries})`);
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
};

/* ======================================================
 AMFI PARSER (🔥 FIXED)
====================================================== */

const parseAMFI = (text) => {
  const lines = text.split("\n");

  return lines
    .map((line) => {
      const parts = line.split(";");

      if (!parts || parts.length < 4) return null;

      const schemeCode = parts[0]?.trim();
      const schemeName = parts[3]?.trim();

      if (
        !schemeCode ||
        !schemeName ||
        schemeCode === "Scheme Code"
      ) {
        return null;
      }

      return {
        schemeCode,
        schemeName,
      };
    })
    .filter(Boolean);
};

/* ======================================================
 GET SIP LIST (MAIN API)
====================================================== */

const getSIPList = async (req, res) => {
  try {
    let data = [];

    /* ================= PRIMARY API ================= */

    try {
      const response = await fetchWithRetry("/mf");

      data = Array.isArray(response)
        ? response
        : response?.data || [];

      console.log("✅ MFAPI SUCCESS:", data.length);
    } catch (err) {
      console.log("❌ MFAPI FAILED → Using AMFI fallback");

      /* ================= FALLBACK ================= */

      try {
        const fallback = await axios.get(
          "https://portal.amfiindia.com/spages/NAVAll.txt",
          { timeout: 20000 }
        );

        data = parseAMFI(fallback.data);

        console.log("✅ AMFI SUCCESS:", data.length);
      } catch (fallbackErr) {
        console.log("❌ FALLBACK FAILED");

        return res.status(200).json({
          success: false,
          count: 0,
          data: [],
          message: "All SIP APIs failed",
        });
      }
    }

    /* ================= FINAL SAFETY ================= */

    const safeData = Array.isArray(data) ? data : [];

    res.json({
      success: true,
      count: safeData.length,
      data: safeData,
    });
  } catch (error) {
    console.error("🔥 SIP LIST ERROR:", error.message);

    res.status(500).json({
      success: false,
      count: 0,
      data: [],
      message: "Failed to fetch SIP list",
    });
  }
};

/* ======================================================
 GET SIP DETAIL
====================================================== */

const getSIPDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Scheme ID required",
      });
    }

    try {
      const data = await fetchWithRetry(`/mf/${id}`);

      return res.json({
        success: true,
        data,
      });
    } catch (err) {
      console.log("❌ DETAIL FAILED");

      return res.status(200).json({
        success: false,
        data: null,
        message: "Detail not available",
      });
    }
  } catch (error) {
    console.error("🔥 SIP DETAIL ERROR:", error.message);

    res.status(500).json({
      success: false,
      data: null,
    });
  }
};

/* ======================================================
 EXPORTS
====================================================== */

module.exports = {
  getSIPList,
  getSIPDetail,
};