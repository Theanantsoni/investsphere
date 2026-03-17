const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true,
        },

        otp: {
            type: String,
            required: true,
        },

        purpose: {
            type: String,
            required: true,
            enum: ["profile_update", "forgot_password"],
        },

        field: {
            type: String,
            enum: ["phone", "password"], // optional for profile
        },

        value: {
            type: String,
        },

        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 },
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Otp", otpSchema);