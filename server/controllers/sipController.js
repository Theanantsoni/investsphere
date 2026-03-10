const axios = require("axios");

let cachedSIP = null;
let lastSIPFetch = 0;

// ============================================
// SIP LIST
// ============================================

const getSIPList = async (req, res) => {

  try {

    const now = Date.now();

    if (cachedSIP && now - lastSIPFetch < 60000) {
      return res.json(cachedSIP);
    }

    const response = await axios.get(
      "https://api.mfapi.in/mf",
      { timeout: 10000 }
    );

    cachedSIP = response.data;
    lastSIPFetch = now;

    res.json(cachedSIP);

  }
  catch (err) {

    console.error("SIP API Error:", err.message);

    if (cachedSIP) {
      return res.json(cachedSIP);
    }

    res.json([]);

  }

};


// ============================================
// SIP DETAIL
// ============================================

const getSIPDetail = async (req, res) => {

  try {

    const response = await axios.get(
      `https://api.mfapi.in/mf/${req.params.id}`
    );

    res.json(response.data);

  }
  catch (error) {

    console.error("SIP Detail API Error:", error.message);

    res.status(500).json({
      error: "Failed to fetch fund details"
    });

  }

};

module.exports = {
  getSIPList,
  getSIPDetail
};