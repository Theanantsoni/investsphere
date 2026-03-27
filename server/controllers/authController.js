const Register = require("../models/Register");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { verifyCaptcha } = require("../services/captchaService");
const { sendOTPEmail } = require("../services/emailService");

/* ================================================= */
/* HELPER */
/* ================================================= */

const normalizeEmail = (email) => email?.trim().toLowerCase();

/* ================================================= */
/* SEND OTP REGISTER */
/* ================================================= */

const sendRegisterOTP = async (req, res) => {
  try {
    const { email, recaptchaToken } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    if (!recaptchaToken) {
      return res
        .status(400)
        .json({ success: false, message: "Captcha required" });
    }

    const captchaValid = await verifyCaptcha(recaptchaToken);

    if (!captchaValid) {
      return res
        .status(400)
        .json({ success: false, message: "Captcha failed" });
    }

    const cleanEmail = normalizeEmail(email);

    const existingUser = await Register.findOne({
      email: cleanEmail,
      verified: true,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    let user = await Register.findOne({ email: cleanEmail });

    if (!user) {
      user = new Register({
        email: cleanEmail,
        verified: false,
      });
    }

    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 5 * 60000);

    await user.save();

    await sendOTPEmail(cleanEmail, otp);

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "OTP sending failed",
    });
  }
};

/* ================================================= */
/* VERIFY REGISTER OTP */
/* ================================================= */

const verifyRegisterOTP = async (req, res) => {
  try {
    const { email, otp, form } = req.body;

    if (!email || !otp || !form) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const cleanEmail = normalizeEmail(email);

    const user = await Register.findOne({ email: cleanEmail }).select("+otp");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.name = form.name || "";
    user.phone = form.phone || "";
    user.country = form.country || "India";
    user.state = form.state || "";
    user.pan = form.pan || "";
    user.dob = form.dob || null;
    user.password = await bcrypt.hash(form.password, 10);

    user.verified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("VERIFY REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

/* ================================================= */
/* LOGIN */
/* ================================================= */

const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const cleanEmail = normalizeEmail(email);

    const user = await Register.findOne({
      email: cleanEmail,
      verified: true,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🔥 CREATE TOKEN
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      message: "Login successful",
      token, // ✅ ADD THIS
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || "",
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/* ================================================= */
/* SEND FORGOT PASSWORD OTP */
/* ================================================= */

const sendForgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const cleanEmail = normalizeEmail(email);

    const user = await Register.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email not registered",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 5 * 60000);

    await user.save();

    await sendOTPEmail(cleanEmail, otp, "Password Reset");

    return res.json({
      success: true,
      message: "OTP sent",
    });
  } catch (error) {
    console.error("FORGOT OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================================================= */
/* VERIFY FORGOT PASSWORD OTP */
/* ================================================= */

const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const cleanEmail = normalizeEmail(email);

    const user = await Register.findOne({ email: cleanEmail }).select("+otp");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    /* mark verified */
    user.otp = "VERIFIED";
    await user.save();

    return res.json({ success: true });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================================================= */
/* RESET PASSWORD */
/* ================================================= */

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = normalizeEmail(email);

    const user = await Register.findOne({ email: cleanEmail }).select("+otp");

    if (!user || user.otp !== "VERIFIED") {
      return res.status(400).json({
        success: false,
        message: "OTP verification required",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password updated",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================================================= */
/* FIND EMAIL BY MOBILE */
/* ================================================= */

const findEmailByMobile = async (req, res) => {
  try {
    const { phone } = req.body;

    const users = await Register.find({
      phone,
      verified: true,
    });

    const emails = users.map((u) => ({
      email: u.email,
      masked: u.email.slice(0, 3) + "****@" + u.email.split("@")[1],
    }));

    return res.json({ success: true, emails });
  } catch (error) {
    console.error("FIND EMAIL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  sendRegisterOTP,
  verifyRegisterOTP,
  loginUser,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetPassword,
  findEmailByMobile,
};
