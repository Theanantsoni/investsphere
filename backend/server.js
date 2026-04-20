// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const messageRoutes = require("./routes/messageRoutes"); // ✅ NEW
const startWatcher = require("./utils/watcher");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

/* =========================================
   MIDDLEWARE
========================================= */

// ✅ FIXED CORS
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
app.use("/api/messages", messageRoutes); // ✅ NEW ROUTE

/* =========================================
   404 HANDLER
========================================= */
app.use(notFound);

/* =========================================
   GLOBAL ERROR HANDLER
========================================= */
app.use(errorHandler);

/* =========================================
   SERVER + DB + WATCHER START
========================================= */

const PORT = process.env.PORT || 5100;

const startServer = async () => {
  try {
    // ✅ Connect DB FIRST
    await connectDB();

    // ✅ Ensure DB connection is ready
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Mongo Ready — Starting Watcher...");
      await startWatcher();
    } else {
      mongoose.connection.once("open", async () => {
        console.log("✅ Mongo Ready (delayed) — Starting Watcher...");
        await startWatcher();
      });
    }

    // ✅ Start server
    app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed:", error.message);
    process.exit(1);
  }
};

startServer();

