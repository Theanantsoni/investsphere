const User = require("../models/Register");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

/* ======================================================
   GET USER PROFILE BY EMAIL
====================================================== */
const getUserProfileByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile Fetch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   UPLOAD PROFILE IMAGE
====================================================== */
const uploadProfileImage = async (req, res) => {
  try {
    const { email } = req.body;

    /* ================= VALIDATION ================= */

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    /* ================= FIND USER ================= */

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* ================= DELETE OLD IMAGE ================= */

    if (user.profileImageId) {
      try {
        await cloudinary.uploader.destroy(user.profileImageId);
      } catch (err) {
        console.log("Old image delete failed:", err.message);
      }
    }

    /* ================= UPLOAD NEW IMAGE ================= */

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "investsphere/users/profile",
      transformation: [
        { width: 500, height: 500, crop: "fill" },
      ],
    });

    /* ================= DELETE LOCAL FILE ================= */

    if (req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log("File delete error:", err.message);
      });
    }

    /* ================= SAVE TO DB ================= */

    user.profileImage = result.secure_url;
    user.profileImageId = result.public_id;

    await user.save();

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

module.exports = {
  getUserProfileByEmail,
  uploadProfileImage,
};