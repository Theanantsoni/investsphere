const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
}));

const PORT = 5000;
const FINN_KEY = process.env.FINNHUB_API_KEY;

// 🔒 Check API key
if (!FINN_KEY) {
  console.error("❌ FINNHUB_API_KEY missing in .env");
  process.exit(1);
}

if (!process.env.GNEWS_API_KEY) {
  console.error("❌ GNEWS_API_KEY missing in .env");
  process.exit(1);
}

console.log("✅ Server Started");

// ============================================
// 🔥 IPO ROUTE
// ============================================

app.get("/api/ipo/:type", async (req, res) => {
  const { type } = req.params;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);

    let from, to;

    if (type === "ongoing") {
      from = todayStr;
      to = todayStr;
    } else {
      const past = new Date();
      past.setMonth(past.getMonth() - 24);
      from = past.toISOString().slice(0, 10);

      const future = new Date();
      future.setMonth(future.getMonth() + 6);
      to = future.toISOString().slice(0, 10);
    }

    const response = await axios.get(
      "https://finnhub.io/api/v1/calendar/ipo",
      { params: { from, to, token: FINN_KEY } }
    );

    const ipoData = response.data?.ipoCalendar || [];

    let formatted = ipoData
      .filter(ipo => ipo.symbol && ipo.name && ipo.exchange)
      .map((ipo) => {

        const ipoDate = new Date(ipo.date);
        ipoDate.setHours(0, 0, 0, 0);

        let status = "closed";

        if (ipoDate > today) {
          status = "upcoming";
        } else if (ipoDate.getTime() === today.getTime()) {
          status = "ongoing";
        }

        // 🔥 Smart Open/Close Date Logic
        let openDate, closeDate;

        if (status === "upcoming") {
          openDate = ipo.date;

          const close = new Date(ipoDate);
          close.setDate(close.getDate() + 3);
          closeDate = close.toISOString().slice(0, 10);

        } else if (status === "ongoing") {
          const open = new Date(ipoDate);
          open.setDate(open.getDate() - 1);
          openDate = open.toISOString().slice(0, 10);

          const close = new Date(ipoDate);
          close.setDate(close.getDate() + 1);
          closeDate = close.toISOString().slice(0, 10);

        } else {
          const open = new Date(ipoDate);
          open.setDate(open.getDate() - 3);
          openDate = open.toISOString().slice(0, 10);

          closeDate = ipo.date;
        }

        return {
          symbol: ipo.symbol,
          name: ipo.name,
          exchange: ipo.exchange,
          type: ipo.type || "EQUITY",
          price: ipo.price || "N/A",
          numberOfShares: ipo.numberOfShares || 0,
          totalSharesValue: ipo.totalSharesValue || 0,
          openDate,
          closeDate,
          status,
        };
      });

    // 🔥 Filter by tab
    formatted = formatted.filter(ipo => ipo.status === type);

    // 🔥 Force Ongoing If Empty
    if (type === "ongoing" && formatted.length === 0) {

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      formatted = [
        {
          symbol: "DEMO",
          name: "Live Market IPO Ltd.",
          exchange: "NSE",
          type: "EQUITY",
          price: "₹ 125 - 135",
          numberOfShares: 2500000,
          totalSharesValue: 337500000,
          openDate: yesterday.toISOString().slice(0, 10),
          closeDate: tomorrow.toISOString().slice(0, 10),
          status: "ongoing",
        }
      ];
    }

    formatted.sort((a, b) => new Date(b.openDate) - new Date(a.openDate));

    res.json(formatted);

  } catch (err) {
    console.error("Finnhub Error:", err.message);
    res.json([]);
  }
});


const fetchQuote = async (symbol) => {
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
      {
        params: {
          range: "1d",
          interval: "1d",
        },
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const result = response.data.chart.result[0];
    if (!result) return null;

    const meta = result.meta;

    const current = meta.regularMarketPrice;
    const previous =
      meta.chartPreviousClose || meta.previousClose;

    if (!current || !previous) {
      return {
        c: current || 0,
        dp: 0,
      };
    }

    const percent = ((current - previous) / previous) * 100;

    return {
      c: current,
      dp: percent,
    };
  } catch (err) {
    console.log("Yahoo Fetch Error:", err.message);
    return null;
  }
};


// ============================================
// MARKET SNAPSHOT (FAST + 60s CACHE)
// MARKET HISTORY FOR NIFTY, SENSEX, BANKNIFTY, GOLD CARD
// ============================================

let cachedMarketData = null;
let lastMarketFetch = 0;

app.get("/api/market", async (req, res) => {
  try {
    const now = Date.now();

    // ✅ 60 sec cache
    if (cachedMarketData && now - lastMarketFetch < 60000) {
      return res.json(cachedMarketData);
    }

    const [sensex, nifty, bankNifty] = await Promise.all([
  fetchQuote("^BSESN"),      // Sensex
  fetchQuote("^NSEI"),       // Nifty 50
  fetchQuote("^NSEBANK"),    // Bank Nifty
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
});


// ============================================
// MARKET HISTORY ROUTE (REAL TIME)
// ============================================

app.get("/api/market-history", async (req, res) => {
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
        params: {
          range,
          interval: "1d",
        },
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const result = response.data.chart.result?.[0];
    if (!result) return res.json([]);

   const timestamps = result.timestamp || [];
const closes = result.indicators?.quote?.[0]?.close || [];

    const formatted = timestamps.map((time, i) => ({
      date: new Date(time * 1000).toLocaleDateString(),
      value: closes[i],
    })).filter(item => item.value !== null);

    res.json(formatted);

  } catch (error) {
    console.error("Market History Error:", error.message);
    res.json([]);
  }
});


// ============================================
// CRYPTO + GOLD ROUTE (PARALLEL + 10s CACHE)
// ============================================

let cachedCryptoData = null;
let lastCryptoFetch = 0;

app.get("/api/crypto", async (req, res) => {
  try {
    const now = Date.now();

    // ✅ Return cached data if within 10 seconds
    if (cachedCryptoData && now - lastCryptoFetch < 10000) {
      return res.json(cachedCryptoData);
    }

    // ✅ Fetch both APIs in parallel
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

    // ✅ Save to cache
    cachedCryptoData = freshData;
    lastCryptoFetch = now;

    res.json(freshData);

  } catch (err) {
    console.log("Crypto API Error:", err.message);

    // ✅ If error but cache exists, return old cache
    if (cachedCryptoData) {
      return res.json(cachedCryptoData);
    }

    res.json({
      coins: [],
      gold: null,
    });
  }
});


// -------------------------- SIP Data Fetching --------------------------

// SIP List Route
let cachedSIP = null;
let lastSIPFetch = 0;

app.get("/api/sip", async (req, res) => {
  try {
    const now = Date.now();

    // ✅ 60 sec cache
    if (cachedSIP && now - lastSIPFetch < 60000) {
      return res.json(cachedSIP);
    }

    const response = await axios.get("https://api.mfapi.in/mf", {
      timeout: 10000,
    });

    cachedSIP = response.data;
    lastSIPFetch = now;

    res.json(cachedSIP);

  } catch (err) {
    console.error("SIP API Error:", err.message);

    // ✅ If API fails but we have old cache → use it
    if (cachedSIP) {
      return res.json(cachedSIP);
    }

    // ❗ Do NOT return 500
    res.json([]);
  }
});

// SIP Detail Route
app.get("/api/sip/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.mfapi.in/mf/${req.params.id}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fund details" });
  }
});

// ============================================
// 📰 MARKET NEWS ROUTE (GNEWS)
// ============================================

let cachedMarketNews = {};
let lastMarketNewsFetch = 0;

app.get("/api/market-news", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const category = req.query.category || "market";
    const limit = 6;

    // 🔥 Dynamic Query Based On Category
    const query =
      category === "ipo"
        ? "IPO India stock listing"
        : category === "sip"
          ? "SIP mutual fund India"
          : category === "stock"
            ? "stock market India shares NSE BSE"
            : "stock market finance India";

    const now = Date.now();

    // ✅ 5 minute cache per category
    if (
      cachedMarketNews[category] &&
      now - lastMarketNewsFetch < 300000
    ) {
      const cachedData = cachedMarketNews[category];

      const startIndex = (page - 1) * limit;
      const paginated = cachedData.slice(startIndex, startIndex + limit);

      return res.json({
        page,
        totalPages: Math.ceil(cachedData.length / limit),
        news: paginated,
      });
    }

    const response = await axios.get(
      "https://gnews.io/api/v4/search",
      {
        params: {
          q: query,
          lang: "en",
          max: 18,
          apikey: process.env.GNEWS_API_KEY,
        },
      }
    );

    const articles = response.data?.articles || [];

    const formatted = articles.map((item) => ({
      title: item.title,
      description: item.description,
      image: item.image,
      url: item.url,
      source: item.source?.name || "Unknown",
      publishedAt: item.publishedAt,
    }));

    // ✅ Save to cache
    cachedMarketNews[category] = formatted;
    lastMarketNewsFetch = now;

    const startIndex = (page - 1) * limit;
    const paginated = formatted.slice(startIndex, startIndex + limit);

    res.json({
      page,
      totalPages: Math.ceil(formatted.length / limit),
      news: paginated,
    });

  } catch (error) {
    console.error("Market News Error:", error.response?.data || error.message);
    res.status(500).json({
      page: 1,
      totalPages: 1,
      news: [],
    });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Running on http://localhost:${PORT}`);
});


