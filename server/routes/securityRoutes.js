const express = require("express");
const router = express.Router();

const { changePassword } = require("../controllers/securityController");
const { protectSecurity } = require("../middleware/securityMiddleware");

// CHANGE PASSWORD
router.put("/change-password", protectSecurity, changePassword);

module.exports = router;