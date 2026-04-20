const express = require("express");
const router = express.Router();

const {
  getAllUserEmails,
  sendMessage,
  getAllMessages,
  getMessagesByEmail,
  getMessageSuggestions,
} = require("../controllers/messageController");

/* ======================================================
   ROUTES
====================================================== */

// emails
router.get("/emails", getAllUserEmails);

// send
router.post("/send", sendMessage);

// all messages
router.get("/all", getAllMessages);

// filter
router.get("/by-email", getMessagesByEmail);

// suggestions
router.get("/suggestions", getMessageSuggestions);

module.exports = router;