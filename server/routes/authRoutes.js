const express = require("express");

const {
  sendRegisterOTP,
  verifyRegisterOTP,
  loginUser
} = require("../controllers/authController");

const router = express.Router();


// ======================================================
// AUTH ROUTES
// ======================================================


// --------------------------------------
// SEND OTP FOR REGISTRATION
// --------------------------------------

router.post(
  "/register/send-otp",
  sendRegisterOTP
);


// --------------------------------------
// VERIFY OTP + COMPLETE REGISTRATION
// --------------------------------------

router.post(
  "/register/verify-otp",
  verifyRegisterOTP
);


// --------------------------------------
// LOGIN USER
// --------------------------------------

router.post(
  "/login",
  loginUser
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;