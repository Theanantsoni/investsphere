const express = require("express");
const upload = require("../middleware/multer");

const {
  getUserProfileByEmail,
  uploadProfileImage,
} = require("../controllers/userController");

const router = express.Router();

/* ======================================================
   GET USER PROFILE BY EMAIL
====================================================== */
router.get("/profile/:email", getUserProfileByEmail);

/* ======================================================
   UPLOAD PROFILE IMAGE
====================================================== */
router.post(
  "/upload-profile",
  upload.single("image"),
  uploadProfileImage
);

module.exports = router;