const mongoose = require("mongoose");

/* ======================================================
   REGISTER SCHEMA
====================================================== */

const registerSchema = new mongoose.Schema(
    {
        /* ================= BASIC INFO ================= */

        name: {
            type: String,
            trim: true,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
        },

        phone: {
            type: String,
            match: [/^[0-9]{10}$/, "Phone must be 10 digits"],
            index: true,
        },

        country: {
            type: String,
            default: "India",
        },

        state: {
            type: String,
            trim: true,
        },

        pan: {
            type: String,
            uppercase: true,
            match: [
                /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                "Invalid PAN format",
            ],
        },

        dob: {
            type: Date,
        },

        /* ================= AUTH ================= */

        password: {
            type: String,
            minlength: 6,
            select: false, // 🔥 important for security
        },

        otp: {
            type: String,
            select: false,
        },

        otpExpire: {
            type: Date,
        },

        verified: {
            type: Boolean,
            default: false,
            index: true,
        },

        /* ================= PROFILE IMAGE ================= */

        profileImage: {
            type: String,
            default: "",
        },

        profileImageId: {
            type: String,
            default: "",
        },
    },
    {
        collection: "register",
        timestamps: true,
    }
);

/* ======================================================
   INDEX OPTIMIZATION
====================================================== */

// Compound index for faster queries (optional advanced)
registerSchema.index({ email: 1, phone: 1 });

/* ======================================================
   EXPORT
====================================================== */

module.exports = mongoose.model("Register", registerSchema);

