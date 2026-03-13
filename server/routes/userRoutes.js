const express = require("express");

const { getUserProfileByEmail } = require("../controllers/userController");

const router = express.Router();

/* ======================================================
   GET USER PROFILE BY EMAIL
====================================================== */

router.get("/profile/:email", getUserProfileByEmail);

module.exports = router;