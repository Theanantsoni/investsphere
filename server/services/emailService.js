const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTPEmail = async (email, otp, label = "Verification") => {

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
`
  };

  await transporter.sendMail(mailOptions);

};

module.exports = {
  sendOTPEmail
};