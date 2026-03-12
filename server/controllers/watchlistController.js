const Watchlist = require("../models/watchlistModel");

/* ================= ADD TO WATCHLIST ================= */

exports.addToWatchlist = async (req, res) => {
    try {
        const { email, itemCode, itemName, type } = req.body;

        if (!email || !itemCode || !itemName || !type) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        /* ===== CHECK DUPLICATE ===== */

        const existing = await Watchlist.findOne({
            email,
            itemCode,
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Already in watchlist",
            });
        }

        /* ===== INSERT ===== */

        const watchItem = await Watchlist.create({
            email,
            itemCode,
            itemName,
            type,
        });

        res.status(201).json({
            success: true,
            message: "Added to watchlist",
            data: watchItem,
        });
    } catch (error) {
        console.error("Watchlist Add Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ================= GET USER WATCHLIST ================= */

exports.getWatchlist = async (req, res) => {
    try {
        const { email } = req.params;

        const watchlist = await Watchlist.find({ email }).sort({
            createdAt: -1,
        });

        res.json({
            success: true,
            data: watchlist,
        });
    } catch (error) {
        console.error("Watchlist Fetch Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ================= REMOVE WATCHLIST ================= */

exports.removeWatchlist = async (req, res) => {
    try {
        const { id } = req.params;

        await Watchlist.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Removed from watchlist",
        });
    } catch (error) {
        console.error("Watchlist Delete Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};