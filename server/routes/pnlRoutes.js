const express = require("express");
const router = express.Router();

const { getPnL } = require("../controllers/pnlController");

router.get("/", getPnL);

module.exports = router;