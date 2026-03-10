const axios = require("axios");
const fetchQuote = require("../services/fetchQuote");

let cachedMarketData = null;
let lastMarketFetch = 0;

let cachedTicker = null;
let lastTickerFetch = 0;

// ============================================
// MARKET SNAPSHOT
// ============================================

const getMarketSnapshot = async (req, res) => {
  try {
    const now = Date.now();

    if (cachedMarketData && now - lastMarketFetch < 60000) {
      return res.json(cachedMarketData);
    }

    const [sensex, nifty, bankNifty] = await Promise.all([
      fetchQuote("^BSESN"),
      fetchQuote("^NSEI"),
      fetchQuote("^NSEBANK"),
    ]);

    const data = {
      sensex: sensex || {},
      nifty: nifty || {},
      bankNifty: bankNifty || {},
    };

    cachedMarketData = data;
    lastMarketFetch = now;

    res.json(data);
  } catch (error) {
    console.error("Market API Error:", error.message);

    if (cachedMarketData) {
      return res.json(cachedMarketData);
    }

    res.status(500).json({
      sensex: {},
      nifty: {},
      bankNifty: {},
    });
  }
};

// ============================================
// MARKET HISTORY
// ============================================

const getMarketHistory = async (req, res) => {
  try {
    const { symbol, days } = req.query;

    if (!symbol || !days) {
      return res.status(400).json([]);
    }

    const range =
      days == 1 ? "1d" :
      days == 7 ? "7d" :
      days == 30 ? "1mo" :
      "3mo";

    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
      {
        params: { range, interval: "1d" },
        headers: { "User-Agent": "Mozilla/5.0" },
      }
    );

    const result = response.data.chart.result?.[0];

    if (!result) return res.json([]);

    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];

    const formatted = timestamps
      .map((time, i) => ({
        date: new Date(time * 1000).toLocaleDateString(),
        value: closes[i],
      }))
      .filter((item) => item.value !== null);

    res.json(formatted);
  } catch (error) {
    console.error("Market History Error:", error.message);
    res.json([]);
  }
};

// ============================================
// LIVE TICKER
// ============================================

const getTicker = async (req, res) => {
  try {
    const now = Date.now();

    if (cachedTicker && now - lastTickerFetch < 60000) {
      return res.json(cachedTicker);
    }

    const symbols = [
      "AAPL","MSFT","GOOGL","TSLA","AMZN",
      "META","NVDA","NFLX","AMD","INTC",
      "UBER","ORCL","IBM","BA","JPM"
    ];

    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const response = await axios.get(
            "https://finnhub.io/api/v1/quote",
            {
              params: {
                symbol,
                token: process.env.FINNHUB_API_KEY
              }
            }
          );

          const data = response.data;

          return {
            symbol,
            price: data.c ? data.c.toFixed(2) : "0.00",
            percent: data.dp ? data.dp.toFixed(2) : "0.00"
          };

        } catch {
          return null;
        }
      })
    );

    const filtered = results.filter(Boolean);

    cachedTicker = filtered;
    lastTickerFetch = now;

    res.json(filtered);

  } catch (err) {

    console.error("Ticker Error:", err.message);

    if (cachedTicker) return res.json(cachedTicker);

    res.json([]);
  }
};

module.exports = {
  getMarketSnapshot,
  getMarketHistory,
  getTicker
};