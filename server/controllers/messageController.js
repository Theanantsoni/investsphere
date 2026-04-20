// server/controllers/messageController.js

const Message = require("../models/Message");
const Register = require("../models/Register"); // ✅ FIXED: using existing Register model

/* ======================================================
   GET ALL USER EMAILS
====================================================== */
exports.getAllUserEmails = async (req, res) => {
  try {
    const users = await Register.find({}, "email");

    const emails = users.map((u) => u.email).filter(Boolean);

    return res.status(200).json({
      success: true,
      count: emails.length,
      emails,
    });
  } catch (error) {
    console.error("GET EMAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch emails",
    });
  }
};

/* ======================================================
   SEND MESSAGE
====================================================== */
exports.sendMessage = async (req, res) => {
  try {
    const {
      title,
      description,
      recipients,
      messageType,
      suggestionTag,
    } = req.body;

    if (
      !title ||
      !description ||
      !Array.isArray(recipients) ||
      recipients.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    console.log("📩 Incoming Message Payload:", {
      title,
      description,
      recipients,
      messageType,
      suggestionTag,
    });

    const message = await Message.create({
      title: title.trim(),
      description: description.trim(),
      recipients,
      messageType: messageType || "general",
      suggestionTag: suggestionTag || undefined,
      sentBy: "admin",
    });

    console.log("✅ Message Saved:", message._id);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("❌ SEND MESSAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

/* ======================================================
   GET ALL MESSAGES
====================================================== */
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

/* ======================================================
   FILTER BY EMAIL
====================================================== */
exports.getMessagesByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const messages = await Message.find({
      recipients: { $in: [email] },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("FILTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to filter messages",
    });
  }
};

/* ======================================================
   SUGGESTIONS
====================================================== */
exports.getMessageSuggestions = async (req, res) => {
  try {
    const suggestions = [
      {
        label: "Top Stocks",
        type: "stock_alert",
        title: "Top Performing Stocks Today",
        description: "Check out today's top performing stocks.",
      },
      {
        label: "IPO Opening",
        type: "ipo_alert",
        title: "New IPO is Open",
        description: "A new IPO is now open for subscription.",
      },
      {
        label: "Market Crash Alert",
        type: "market_update",
        title: "Market Alert",
        description: "Market is volatile. Trade carefully.",
      },
      {
        label: "Profit Booking",
        type: "stock_alert",
        title: "Profit Booking Alert",
        description: "Consider booking profits on selected stocks.",
      },
      {
        label: "New SIP Plan",
        type: "sip_update",
        title: "Start New SIP",
        description: "New SIP opportunities available.",
      },
      {
        label: "Wallet Update",
        type: "wallet_update",
        title: "Wallet Update",
        description: "Your wallet has been updated.",
      },
      {
        label: "Breaking News",
        type: "news",
        title: "Market News",
        description: "Latest market news update.",
      },
      {
        label: "System Maintenance",
        type: "system",
        title: "Maintenance Notice",
        description: "Platform maintenance scheduled.",
      },
      {
        label: "Special Offer",
        type: "offer",
        title: "Special Investment Offer",
        description: "Limited-time investment offer available.",
      },
    ];

    return res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("SUGGESTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load suggestions",
    });
  }
};