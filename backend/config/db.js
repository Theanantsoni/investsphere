// config/db.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "investsphereDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    mongoose.connection.on("connected", () => {
      console.log("🔗 Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Mongoose disconnected");
    });

    console.log("====================================");
    console.log("✅ MongoDB Atlas Connected");
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log("====================================");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;