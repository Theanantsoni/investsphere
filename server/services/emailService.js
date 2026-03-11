const nodemailer = require("nodemailer");

// =============================
// EMAIL TRANSPORTER
// =============================

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// =============================
// SEND OTP EMAIL
// =============================

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"InvestSphere" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "InvestSphere - Email Verification OTP",
        html: `
      <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
        <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="margin: 0; color: #111827; font-size: 28px;">Invest<span style="color: #22c55e;">Sphere</span></h1>
            <p style="margin-top: 8px; color: #6b7280; font-size: 14px;">Secure Email Verification</p>
          </div>

          <p style="font-size: 16px; color: #374151; margin-bottom: 12px;">
            Hello,
          </p>

          <p style="font-size: 15px; color: #4b5563; line-height: 1.7;">
            Use the OTP below to verify your email and complete your InvestSphere registration.
          </p>

          <div style="margin: 28px 0; text-align: center;">
            <div style="display: inline-block; background: #f0fdf4; color: #16a34a; font-size: 34px; font-weight: 700; letter-spacing: 8px; padding: 16px 28px; border-radius: 14px; border: 1px solid #bbf7d0;">
              ${otp}
            </div>
          </div>

          <p style="font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 20px;">
            This OTP is valid for 5 minutes.
          </p>

          <p style="font-size: 13px; color: #9ca3af; text-align: center; line-height: 1.6;">
            If you did not request this email, you can safely ignore it.
          </p>
        </div>
      </div>
    `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendOTPEmail
};