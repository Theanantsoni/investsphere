const express = require("express");
const router = express.Router();

const {
  getMarketNews
} = require("../controllers/newsController");

// Market news
router.get("/", getMarketNews);

module.exports = router;