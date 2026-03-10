const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
}));

// =============================
// ROUTES
// =============================

const authRoutes = require("./routes/authRoutes");
const ipoRoutes = require("./routes/ipoRoutes");
const stockRoutes = require("./routes/stockRoutes");
const sipRoutes = require("./routes/sipRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");
const marketRoutes = require("./routes/marketRoutes");
const newsRoutes = require("./routes/newsRoutes");

// Controllers (for backward compatibility routes)
const {
  getTicker,
  getMarketHistory
} = require("./controllers/marketController");

const { getStockDetail } = require("./controllers/stockController");
const { getMarketNews } = require("./controllers/newsController");

// Main routes
app.use("/api", authRoutes);
app.use("/api/ipo", ipoRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/sip", sipRoutes);
app.use("/api/crypto", cryptoRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/news", newsRoutes);

// =============================
// BACKWARD COMPATIBILITY ROUTES
// =============================

// Old frontend routes support
app.get("/api/ticker", getTicker);
app.get("/api/market-history", getMarketHistory);
app.get("/api/stock/:symbol", getStockDetail);
app.get("/api/market-news", getMarketNews);

// =============================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Running on http://localhost:${PORT}`);
});

// =============================
// WEBSOCKET
// =============================

const initWebSocket = require("./services/websocketService");

initWebSocket(server);