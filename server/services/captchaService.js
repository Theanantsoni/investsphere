const axios = require("axios");


// =======================================================
// VERIFY GOOGLE RECAPTCHA TOKEN
// =======================================================

const verifyCaptcha = async (token) => {

    try {

        // ================================
        // VALIDATE TOKEN
        // ================================

        if (!token) {
            console.error("Captcha token missing");
            return false;
        }

        // ================================
        // CHECK SECRET KEY
        // ================================

        const secret = process.env.RECAPTCHA_SECRET;

        if (!secret) {
            console.error("RECAPTCHA_SECRET not defined in .env");
            return false;
        }

        // ================================
        // GOOGLE VERIFY API
        // ================================

        const verifyURL = "https://www.google.com/recaptcha/api/siteverify";

        const response = await axios.post(
            verifyURL,
            null,
            {
                params: {
                    secret: secret,
                    response: token
                }
            }
        );

        // ================================
        // CHECK RESPONSE
        // ================================

        if (!response.data.success) {

            console.log("Captcha verification failed:", response.data);

            return false;

        }

        return true;

    } catch (error) {

        console.error("Captcha verification error:", error.message);

        return false;

    }

};


// =======================================================
// EXPORT SERVICE
// =======================================================

module.exports = {
    verifyCaptcha
};