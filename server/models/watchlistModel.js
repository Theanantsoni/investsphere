const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        itemCode: {
            type: String,
            required: true,
            trim: true,
        },

        itemName: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            required: true,
            enum: ["sip", "stock", "ipo"],
        },
    },
    {
        timestamps: true,
    }
);

/* ================= DUPLICATE PREVENTION =================
   Same user cannot add same item twice
*/

watchlistSchema.index({ email: 1, itemCode: 1 }, { unique: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);