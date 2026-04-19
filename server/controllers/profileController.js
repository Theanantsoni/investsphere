// backend/controllers/profileController.js (FINAL FULL CORRECT - ALL FLOWS WORKING)

const Register = require("../models/Register");
const Otp = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const { sendOTPEmail } = require("../services/emailService");

/* ================= OTP GENERATOR ================= */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* ======================================================
   SEND OTP (PROFILE UPDATE - PHONE / PASSWORD)
====================================================== */
exports.sendProfileUpdateOTP = async (req, res) => {
  try {
    const email = req.body.email || req.user?.email;
    const { field, value } = req.body;

    if (!email || !field || !value) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!["phone", "password"].includes(field)) {
      return res.status(400).json({ message: "Invalid field" });
    }

    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const expireMinutes = parseInt(process.env.OTP_EXPIRE_MINUTES) || 5;
    const expiresAt = new Date(Date.now() + expireMinutes * 60000);

    await Otp.deleteMany({ email, purpose: "profile_update" });

    await Otp.create({
      email,
      otp,
      purpose: "profile_update",
      field: field, // MUST match enum exactly
      value,
      expiresAt,
    });

    await sendOTPEmail(email, otp, `Update ${field}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("🔥 PROFILE OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "OTP sending failed",
    });
  }
};

/* ======================================================
   VERIFY OTP + UPDATE PROFILE
====================================================== */
exports.verifyOTPAndUpdate = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const otpDoc = await Otp.findOne({
      email,
      otp,
      purpose: "profile_update",
    });

    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    const { field, value } = otpDoc;

    let updateValue = value;

    if (field === "password") {
      const salt = await bcrypt.genSalt(10);
      updateValue = await bcrypt.hash(value, salt);
    }

    const updateField = field === "phone" ? "phone" : field;

    const updatedUser = await Register.findOneAndUpdate(
      { email },
      { $set: { [updateField]: updateValue } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await Otp.deleteOne({ _id: otpDoc._id });

    return res.status(200).json({
      success: true,
      message: `${field} updated successfully`,
    });
  } catch (error) {
    console.error("🔥 VERIFY OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

/* ======================================================
   CHANGE PASSWORD (SECURITY SETTINGS)
====================================================== */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    let { currentPassword, newPassword } = req.body;

    currentPassword = currentPassword?.trim();
    newPassword = newPassword?.trim();

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different",
      });
    }

    const user = await Register.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ======================================================
   FORGOT PASSWORD - SEND OTP
====================================================== */
exports.sendForgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await Register.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const expireMinutes = parseInt(process.env.OTP_EXPIRE_MINUTES) || 5;
    const expiresAt = new Date(Date.now() + expireMinutes * 60000);

    await Otp.deleteMany({ email, purpose: "forgot_password" });

    await Otp.create({
      email,
      otp,
      purpose: "forgot_password",
      field: "password", // IMPORTANT for consistency
      value: "",
      expiresAt,
    });

    await sendOTPEmail(email, otp, "Forgot Password");

    return res.status(200).json({
      success: true,
      message: "OTP sent",
    });
  } catch (error) {
    console.error("FORGOT OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

/* ======================================================
   RESET PASSWORD (FORGOT FLOW)
====================================================== */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const otpDoc = await Otp.findOne({
      email,
      otp,
      purpose: "forgot_password",
    });

    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await Register.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Otp.deleteOne({ _id: otpDoc._id });

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Reset failed",
    });
  }
};