const bcrypt = require("bcryptjs");
const Register = require("../models/Register");

// ==============================
// CHANGE PASSWORD
// ==============================
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    // VALIDATION
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

    // 🔥 FIX: INCLUDE PASSWORD
    const user = await Register.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 SAFETY CHECK
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Password not found",
      });
    }

    // MATCH CURRENT PASSWORD
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // HASH NEW PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("SECURITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};