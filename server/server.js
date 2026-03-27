const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

/* ======================================================
   IMPORTS
====================================================== */

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

/* ✅ NEW ROUTE FOR PROFILE UPDATE */

const profileRoutes = require("./routes/profileRoutes");

/* ================= CONTROLLERS (Backward compatibility) ================= */

const {
   getTicker,
   getMarketHistory
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
   MIDDLEWARE
====================================================== */

app.use(
   cors({
      origin: "http://localhost:5173",
      credentials: true
   })
);

app.use(express.json());


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

/* ================= USER PROFILE ================= */

app.use("/api/users", userRoutes);

/* ================= SEND REPORT ================= */

app.use("/api/reports", reportRoutes);

/* ✅ PROFILE UPDATE ROUTE */

app.use("/api/profile", profileRoutes);

/* ================= SECURITY ROUTE ================= */

app.use("/api/security", securityRoutes); 


/* ======================================================
   BACKWARD COMPATIBILITY ROUTES
====================================================== */

app.get("/api/ticker", getTicker);

app.get("/api/market-history", getMarketHistory);

app.get("/api/stock/:symbol", getStockDetail);

app.get("/api/market-news", getMarketNews);


/* ======================================================
   ROOT ROUTE
====================================================== */

app.get("/", (req, res) => {
   res.json({
      success: true,
      message: "InvestSphere API Running 🚀"
   });
});


/* ======================================================
   GLOBAL ERROR HANDLER
====================================================== */

app.use((err, req, res, next) => {

   console.error("Server Error:", err);

   res.status(500).json({
      success: false,
      message: "Internal Server Error"
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
   console.log("====================================");

});


/* ======================================================
   WEBSOCKET INITIALIZATION
====================================================== */

initWebSocket(server);