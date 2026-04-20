// server/routes/messageRoutes.js

const express = require("express");
const router = express.Router();

const {
  getAllUserEmails,
  sendMessage,
  getAllMessages,
  getMessagesByEmail,
  getMessageSuggestions,
} = require("../controllers/messageController");

/* ================= ROUTES ================= */

// get all users email
router.get("/emails", getAllUserEmails);

// send message
router.post("/send", sendMessage);

// get all messages
router.get("/all", getAllMessages);

// filter by email
router.get("/by-email", getMessagesByEmail);

// suggestions for admin UI
router.get("/suggestions", getMessageSuggestions);

module.exports = router;

