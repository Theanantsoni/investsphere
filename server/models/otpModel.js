const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
{
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },

    otp: {
        type: String,
        required: true
    },

    field: {
        type: String,
        required: true,
        enum: ["phone", "password"]
    },

    value: {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    }

},
{
    timestamps: true
}
);

module.exports = mongoose.model("Otp", otpSchema);