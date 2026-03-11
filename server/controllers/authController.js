const Register = require("../models/Register");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { verifyCaptcha } = require("../services/captchaService");
const { sendOTPEmail } = require("../services/emailService");


// =======================================================
// SEND OTP FOR REGISTRATION
// =======================================================

const sendRegisterOTP = async (req, res) => {

  try {

    const { email, recaptchaToken } = req.body;

    // ==========================
    // BASIC VALIDATION
    // ==========================

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    if (!recaptchaToken) {
      return res.status(400).json({
        success: false,
        message: "Captcha verification required"
      });
    }

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter valid email address"
      });
    }

    // ==========================
    // CAPTCHA VERIFY
    // ==========================

    const captchaValid = await verifyCaptcha(recaptchaToken);

    if (!captchaValid) {
      return res.status(400).json({
        success: false,
        message: "Captcha verification failed"
      });
    }

    // ==========================
    // CHECK EMAIL ALREADY REGISTERED
    // ==========================

    const existingUser = await Register.findOne({
      email,
      verified: true
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email id is already registered. Please enter new email id."
      });
    }

    // ==========================
    // GENERATE OTP
    // ==========================

    const otp = crypto.randomInt(100000, 999999).toString();

    const expireMinutes =
      process.env.OTP_EXPIRE_MINUTES || 5;

    const otpExpire = new Date(
      Date.now() + expireMinutes * 60 * 1000
    );

    // ==========================
    // FIND OR CREATE USER
    // ==========================

    let user = await Register.findOne({ email });

    if (!user) {

      user = new Register({
        email,
        verified: false
      });

    }

    // ==========================
    // UPDATE OTP
    // ==========================

    user.otp = otp;
    user.otpExpire = otpExpire;

    await user.save();

    // ==========================
    // SEND OTP EMAIL
    // ==========================

    await sendOTPEmail(email, otp);

    return res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {

    console.error("Send OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP sending failed"
    });

  }

};


// =======================================================
// VERIFY OTP + COMPLETE REGISTRATION
// =======================================================

const verifyRegisterOTP = async (req, res) => {

  try {

    const { email, otp, form } = req.body;

    // ==========================
    // VALIDATION
    // ==========================

    if (!email || !otp || !form) {
      return res.status(400).json({
        success: false,
        message: "Invalid request"
      });
    }

    const user = await Register.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    // ==========================
    // OTP VALIDATION
    // ==========================

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (!user.otpExpire || user.otpExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    // ==========================
    // PASSWORD HASH
    // ==========================

    const hashedPassword = await bcrypt.hash(
      form.password,
      10
    );

    // ==========================
    // UPDATE USER DATA
    // ==========================

    user.name = form.name;
    user.phone = form.phone;
    user.country = form.country || "India";
    user.state = form.state;
    user.pan = form.pan;
    user.dob = form.dob;
    user.password = hashedPassword;

    user.verified = true;

    // remove otp fields completely
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Registration successful"
    });

  } catch (error) {

    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Verification failed"
    });

  }

};


// =======================================================
// EXPORT
// =======================================================

module.exports = {
  sendRegisterOTP,
  verifyRegisterOTP
};