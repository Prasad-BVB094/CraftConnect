const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendOTPEmail = async (to, otp) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject: "CraftConnect OTP Verification",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>🔐 CraftConnect Email Verification</h2>

        <p>Hello there 👋</p>

        <p>Your One-Time Password (OTP) is:</p>

        <h1 style="letter-spacing: 3px;">${otp}</h1>

        <p>
          ⏱️ This OTP is valid for <b>10 minutes</b>.
        </p>

        <p style="color: #555;">
          This OTP will become <b> invalid in 10 minutes</b>. 
        </p>

        <p>
          If you didn’t request this, just ignore this email.
        </p>

        <p>Happy crafting! 🎨<br><b>Team CraftConnect</b></p>
      </div>
    `
  };

  await sgMail.send(msg);
};
