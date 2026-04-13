// server.js (FINAL PRODUCTION VERSION)

const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const axios = require("axios");

/* ================= ENV ================= */
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

/* ================= DB ================= */
const connectDB = require("./config/db");

/* ================= ROUTES ================= */
const authRoutes = require("./routes/authRoutes");
const ipoRoutes = require("./routes/ipoRoutes");
const stockRoutes = require("./routes/stockRoutes");
const sipRoutes = require("./routes/sipRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");
const marketRoutes = require("./routes/marketRoutes");
const newsRoutes = require("./routes/newsRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const securityRoutes = require("./routes/securityRoutes");
const stockInvestmentRoutes = require("./routes/stockInvestmentRoutes");
const sipInvestmentRoutes = require("./routes/sipInvestmentRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const profileRoutes = require("./routes/profileRoutes");
const ipoInvestmentRoutes = require("./routes/ipoInvestmentRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const walletRoutes = require("./routes/walletRoutes");
const orderRoutes = require("./routes/orderRoutes");

/* ================= CONTROLLERS ================= */
const { getTicker, getMarketHistory } = require("./controllers/marketController");
const { getStockDetail } = require("./controllers/stockController");
const { getMarketNews } = require("./controllers/newsController");

/* ================= SERVICES ================= */
const initWebSocket = require("./services/websocketService");

/* ======================================================
APP INIT
====================================================== */
const app = express();
connectDB();

/* ======================================================
MIDDLEWARE
====================================================== */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================= LOGGER ================= */
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    next();
  });
}

/* ======================================================
API ROUTES
====================================================== */
app.use("/api", authRoutes);
app.use("/api/ipo", ipoRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/sip", sipRoutes);
app.use("/api/crypto", cryptoRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/sip-investments", sipInvestmentRoutes);
app.use("/api/stock-investments", stockInvestmentRoutes);
app.use("/api/ipo-investments", ipoInvestmentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/orders", orderRoutes);

/* ======================================================
🔥 SIP PROXY (FINAL FIX)
====================================================== */

// helper with retry + headers
const fetchMF = async (url) => {
  try {
    console.log("👉 Calling MF API:", url);

    const res = await axios.get(url, {
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    console.log("✅ Success:", Array.isArray(res.data) ? res.data.length : "object");
    return res.data;

  } catch (err) {
    console.log("⚠️ First attempt failed:", err.message);

    try {
      console.log("🔁 Retrying...");

      const retry = await axios.get(url, {
        timeout: 30000,
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      return retry.data;

    } catch (retryErr) {
      console.log("❌ Retry failed:", retryErr.message);
      return null;
    }
  }
};

/* ================= ALL SIP ================= */
app.get("/api/proxy/sip", async (req, res) => {
  try {
    const data = await fetchMF("https://api.mfapi.in/mf");

    if (!data || !Array.isArray(data)) {
      return res.json([
        {
          schemeCode: "119551",
          schemeName: "Axis Bluechip Fund - Direct",
        },
        {
          schemeCode: "120503",
          schemeName: "SBI Small Cap Fund - Direct",
        },
      ]);
    }

    res.json(data);

  } catch (error) {
    console.log("🔥 SIP FINAL ERROR:", error.message);
    res.json([]);
  }
});

/* ================= SINGLE SIP ================= */
app.get("/api/proxy/sip/:id", async (req, res) => {
  try {
    const data = await fetchMF(
      `https://api.mfapi.in/mf/${req.params.id}`
    );

    if (!data || !data.data) {
      return res.json({
        success: false,
        data: [],
      });
    }

    res.json({
      success: true,
      meta: data.meta,
      data: data.data,
    });

  } catch (error) {
    console.log("🔥 SIP DETAIL ERROR:", error.message);

    res.json({
      success: false,
      data: [],
    });
  }
});

/* ======================================================
OTHER ROUTES
====================================================== */
app.get("/api/ticker", getTicker);
app.get("/api/market-history", getMarketHistory);
app.get("/api/stock/:symbol", getStockDetail);
app.get("/api/market-news", getMarketNews);

/* ======================================================
HEALTH
====================================================== */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy ✅",
    uptime: process.uptime(),
  });
});

/* ======================================================
ROOT
====================================================== */
app.get("/", (req, res) => {
  res.json({
    message: "InvestSphere API Running 🚀",
  });
});

/* ======================================================
404 + ERROR
====================================================== */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({ message: err.message });
});

/* ======================================================
START SERVER
====================================================== */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("====================================");
  console.log("🚀 Server Running");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("====================================");
});

/* ================= SOCKET ================= */
initWebSocket(server);

/* ================= SHUTDOWN ================= */
process.on("SIGINT", () => {
  console.log("🛑 Shutting down...");
  server.close(() => process.exit(0));
});