const express = require("express");
const router = express.Router();

const { getCryptoData } = require("../controllers/cryptoController");

router.get("/", getCryptoData);

module.exports = router;