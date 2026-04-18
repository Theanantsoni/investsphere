// backend/models/Notification.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    collection: {
      type: String,
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: ["insert", "update", "delete"],
      required: true, // 🔥 FIX: required (null removed)
    },

    eventType: {
      type: String,
      enum: ["data_change", "collection_create", "collection_delete"],
      default: "data_change",
      index: true,
    },

    message: {
      type: String,
      required: true,
    },

    // 🔥 FIXED STRUCTURE (NO BLOCKING INSERT)
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}, // 🔥 IMPORTANT: allow flexible object
    },

    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "notification",
    suppressReservedKeysWarning: true,
    minimize: false,
  }
);

// INDEXES
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ collection: 1, createdAt: -1 });
notificationSchema.index({ eventType: 1, createdAt: -1 });
notificationSchema.index({ action: 1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

module.exports = Notification;