const express = require("express");

const router = express.Router();

const {
    addToWatchlist,
    getWatchlist,
    removeWatchlist,
} = require("../controllers/watchlistController");

/* ================= ADD WATCHLIST ================= */

router.post("/add", addToWatchlist);

/* ================= GET USER WATCHLIST ================= */

router.get("/:email", getWatchlist);

/* ================= REMOVE WATCHLIST ================= */

router.delete("/remove", removeWatchlist);

module.exports = router;