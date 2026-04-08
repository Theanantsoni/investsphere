const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    userEmail: String,
    points: {
      type: Number,
      default: 0,
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardSchema);