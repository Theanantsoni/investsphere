const express = require("express");
const cors = require("cors");
require("dotenv").config();


// ======================================================
// IMPORTS
// ======================================================

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const ipoRoutes = require("./routes/ipoRoutes");
const stockRoutes = require("./routes/stockRoutes");
const sipRoutes = require("./routes/sipRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");
const marketRoutes = require("./routes/marketRoutes");
const newsRoutes = require("./routes/newsRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");

// Controllers (Backward compatibility)
const {
  getTicker,
  getMarketHistory
} = require("./controllers/marketController");

const { getStockDetail } = require("./controllers/stockController");

const { getMarketNews } = require("./controllers/newsController");

// Services
const initWebSocket = require("./services/websocketService");


// ======================================================
// APP INITIALIZATION
// ======================================================

const app = express();


// ======================================================
// DATABASE CONNECTION
// ======================================================

connectDB();


// ======================================================
// MIDDLEWARE
// ======================================================

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

// JSON Parser
app.use(express.json());


// ======================================================
// API ROUTES
// ======================================================

// Authentication
app.use("/api", authRoutes);

// IPO
app.use("/api/ipo", ipoRoutes);

// Stocks
app.use("/api/stocks", stockRoutes);

// SIP
app.use("/api/sip", sipRoutes);

// Crypto
app.use("/api/crypto", cryptoRoutes);

// Market
app.use("/api/market", marketRoutes);

// News
app.use("/api/news", newsRoutes);

// ⭐ WATCHLIST
app.use("/api/watchlist", watchlistRoutes);


// ======================================================
// BACKWARD COMPATIBILITY ROUTES
// ======================================================

// These exist for old frontend compatibility

app.get("/api/ticker", getTicker);

app.get("/api/market-history", getMarketHistory);

app.get("/api/stock/:symbol", getStockDetail);

app.get("/api/market-news", getMarketNews);


// ======================================================
// ROOT ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "InvestSphere API Running 🚀"
  });
});


// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {

  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });

});


// ======================================================
// SERVER START
// ======================================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {

  console.log("====================================");
  console.log(`🚀 InvestSphere Server Running`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("====================================");

});


// ======================================================
// WEBSOCKET INITIALIZATION
// ======================================================

initWebSocket(server);