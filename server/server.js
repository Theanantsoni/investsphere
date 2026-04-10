const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

/* ================= ENV ================= */
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

/* ======================================================
   IMPORTS
====================================================== */

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

/* ================= NEW ORDER ROUTE ================= */
const orderRoutes = require("./routes/orderRoutes");

/* ================= CONTROLLERS ================= */
const {
  getTicker,
  getMarketHistory,
} = require("./controllers/marketController");

const { getStockDetail } = require("./controllers/stockController");
const { getMarketNews } = require("./controllers/newsController");

/* ================= SERVICES ================= */
const initWebSocket = require("./services/websocketService");

/* ======================================================
   APP INITIALIZATION
====================================================== */

const app = express();

/* ======================================================
   DATABASE CONNECTION
====================================================== */
connectDB();

/* ======================================================
   GLOBAL MIDDLEWARE
====================================================== */

/* ================= SECURITY ================= */
app.use(helmet());

/* ================= CORS ================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

/* ================= BODY PARSER ================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ======================================================
   REQUEST LOGGER (DEV ONLY)
====================================================== */
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    next();
  });
}

/* ======================================================
   API ROUTES
====================================================== */

/* ================= AUTH ================= */
app.use("/api", authRoutes);

/* ================= IPO ================= */
app.use("/api/ipo", ipoRoutes);

/* ================= STOCK ================= */
app.use("/api/stocks", stockRoutes);

/* ================= SIP ================= */
app.use("/api/sip", sipRoutes);

/* ================= CRYPTO ================= */
app.use("/api/crypto", cryptoRoutes);

/* ================= MARKET ================= */
app.use("/api/market", marketRoutes);

/* ================= NEWS ================= */
app.use("/api/news", newsRoutes);

/* ================= WATCHLIST ================= */
app.use("/api/watchlist", watchlistRoutes);

/* ================= USERS ================= */
app.use("/api/users", userRoutes);

/* ================= REPORT ================= */
app.use("/api/reports", reportRoutes);

/* ================= PROFILE ================= */
app.use("/api/profile", profileRoutes);

/* ================= SECURITY ================= */
app.use("/api/security", securityRoutes);

/* ================= SIP INVESTMENT ================= */
app.use("/api/sip-investments", sipInvestmentRoutes);

/* ================= STOCK INVESTMENT ================= */
app.use("/api/stock-investments", stockInvestmentRoutes);

/* ================= IPO INVESTMENT ================= */
app.use("/api/ipo-investments", ipoInvestmentRoutes);

/* ================= TRANSACTIONS ================= */
app.use("/api/transactions", transactionRoutes);

/* ================= PORTFOLIO ================= */
app.use("/api/portfolio", portfolioRoutes);

/* ================= WALLET ================= */
app.use("/api/wallet", walletRoutes);

/* ================= ORDER (SELL FEATURE) ================= */
app.use("/api/orders", orderRoutes);

/* ======================================================
   LEGACY / EXTRA ROUTES
====================================================== */

app.get("/api/ticker", getTicker);
app.get("/api/market-history", getMarketHistory);
app.get("/api/stock/:symbol", getStockDetail);
app.get("/api/market-news", getMarketNews);

/* ======================================================
   HEALTH CHECK
====================================================== */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy ✅",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

/* ======================================================
   ROOT ROUTE
====================================================== */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "InvestSphere API Running 🚀",
  });
});

/* ======================================================
   404 HANDLER
====================================================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ======================================================
   GLOBAL ERROR HANDLER
====================================================== */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ======================================================
   SERVER START
====================================================== */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("====================================");
  console.log("🚀 InvestSphere Server Running");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`🛠 ENV: ${process.env.NODE_ENV || "development"}`);
  console.log("====================================");
});

/* ======================================================
   WEBSOCKET INITIALIZATION
====================================================== */
initWebSocket(server);

/* ======================================================
   GRACEFUL SHUTDOWN (IMPORTANT)
====================================================== */
process.on("SIGINT", () => {
  console.log("🛑 Server shutting down...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});