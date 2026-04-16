// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /* =========================================
       BASIC INFO
    ========================================= */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: false,
    },

    /* =========================================
       ROLE
    ========================================= */
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    /* =========================================
       PROFILE
    ========================================= */
    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    /* =========================================
       ACCOUNT STATUS
    ========================================= */
    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    /* =========================================
       CLERK SUPPORT
    ========================================= */
    clerkId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,

    // 🔥 FIX: tumhara data "register" collection me hai
    collection: "register",
  }
);

module.exports = mongoose.model("User", userSchema);