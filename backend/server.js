// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

/* =========================================
   DATABASE CONNECTION
========================================= */
connectDB();

/* =========================================
   MIDDLEWARE
========================================= */

// ✅ FIXED CORS (IMPORTANT)
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.use(express.json());

// 🔥 Dev logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* =========================================
   HEALTH CHECK
========================================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 InvestSphere API Running",
  });
});

/* =========================================
   API ROUTES
========================================= */
app.use("/api/admin", adminRoutes);

/* =========================================
   404 HANDLER
========================================= */
app.use(notFound);

/* =========================================
   GLOBAL ERROR HANDLER
========================================= */
app.use(errorHandler);

/* =========================================
   SERVER START
========================================= */
const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});