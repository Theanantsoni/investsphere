// backend/services/emailService.js (FINAL PRODUCTION FIXED - STABLE SMTP)

const nodemailer = require("nodemailer");

/* ================= VALIDATE ENV ================= */
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL ENV NOT SET (EMAIL_USER / EMAIL_PASS)");
}

/* ================= TRANSPORTER ================= */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password required
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/* ================= VERIFY CONNECTION ================= */
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email Transport Error:", error);
  } else {
    console.log("✅ Email Server Ready");
  }
});

/* ================= SEND OTP EMAIL ================= */
const sendOTPEmail = async (email, otp, label = "Verification") => {
  try {
    console.log("📩 EMAIL USER:", process.env.EMAIL_USER);
    console.log("📩 EMAIL PASS:", process.env.EMAIL_PASS ? "SET" : "NOT SET");

    const mailOptions = {
      from: `"InvestSphere" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `InvestSphere - ${label} OTP`,
      html: `
<div style="font-family:Arial;background:#f8fafc;padding:30px">

<div style="max-width:520px;margin:auto;background:white;padding:30px;border-radius:12px;border:1px solid #e5e7eb">

<h2 style="text-align:center;color:#111827">
Invest<span style="color:#22c55e">Sphere</span>
</h2>

<p style="text-align:center;color:#6b7280">
Secure Account Verification
</p>

<p style="text-align:center;font-size:32px;font-weight:bold;color:#16a34a">
${otp}
</p>

<p style="text-align:center;color:#6b7280">
OTP valid for 5 minutes
</p>

</div>

</div>
`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📩 OTP Email Sent:", info.response);

    return true;

  } catch (error) {
    console.error("🔥 EMAIL SEND ERROR:", error.message);
    console.error(error);

    throw new Error("Email sending failed");
  }
};

module.exports = {
  sendOTPEmail,
};