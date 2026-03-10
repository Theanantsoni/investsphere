const express = require("express");
const router = express.Router();

const { getIPOs } = require("../controllers/ipoController");

router.get("/:type", getIPOs);

module.exports = router;