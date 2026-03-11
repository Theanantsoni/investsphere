const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema(

    {
        // ================================
        // NAME
        // ================================

        name: {
            type: String,
            trim: true
        },

        // ================================
        // EMAIL
        // ================================

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        // ================================
        // PHONE
        // ================================

        phone: {
            type: String,
            match: /^[0-9]{10}$/
        },

        // ================================
        // COUNTRY
        // ================================

        country: {
            type: String,
            default: "India"
        },

        // ================================
        // STATE
        // ================================

        state: {
            type: String,
            trim: true
        },

        // ================================
        // PAN NUMBER
        // ================================

        pan: {
            type: String,
            uppercase: true,
            match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
        },

        // ================================
        // DATE OF BIRTH
        // ================================

        dob: {
            type: Date
        },

        // ================================
        // PASSWORD
        // ================================

        password: {
            type: String,
            minlength: 6
        },

        // ================================
        // OTP
        // ================================

        otp: {
            type: String
        },

        // ================================
        // OTP EXPIRY
        // ================================

        otpExpire: {
            type: Date
        },

        // ================================
        // VERIFIED FLAG
        // ================================

        verified: {
            type: Boolean,
            default: false,
            index: true
        }

    },

    {
        collection: "register",
        timestamps: true
    }

);


// ====================================
// EXPORT MODEL
// ====================================

module.exports = mongoose.model(
    "Register",
    registerSchema
);