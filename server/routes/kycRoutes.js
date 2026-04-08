const express = require("express");
const router = express.Router();

const { submitKYC } = require("../controllers/kycController");

router.post("/", submitKYC);

module.exports = router;