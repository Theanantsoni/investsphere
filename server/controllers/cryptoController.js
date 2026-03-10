const axios = require("axios");

let cachedCryptoData = null;
let lastCryptoFetch = 0;

// ============================================
// CRYPTO + GOLD
// ============================================

const getCryptoData = async (req, res) => {

  try {

    const now = Date.now();

    if (cachedCryptoData && now - lastCryptoFetch < 10000) {
      return res.json(cachedCryptoData);
    }

    const [cryptoRes, goldRes] = await Promise.all([

      axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: "inr",
          order: "market_cap_desc",
          per_page: 4,
          page: 1,
          sparkline: false,
        },
      }),

      axios.get("https://api.coingecko.com/api/v3/simple/price", {
        params: {
          ids: "pax-gold",
          vs_currencies: "inr",
          include_24hr_change: true,
        },
      }),

    ]);

    const freshData = {
      coins: cryptoRes.data || [],
      gold: goldRes.data?.["pax-gold"] || null,
    };

    cachedCryptoData = freshData;
    lastCryptoFetch = now;

    res.json(freshData);

  }
  catch (err) {

    console.log("Crypto API Error:", err.message);

    if (cachedCryptoData) {
      return res.json(cachedCryptoData);
    }

    res.json({
      coins: [],
      gold: null,
    });

  }

};

module.exports = {
  getCryptoData
};