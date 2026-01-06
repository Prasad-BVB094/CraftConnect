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

exports.sendArtisanApprovalEmail = async (to, artisanName) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject: "🎉 Your CraftConnect Artisan Account is Approved!",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #A68A64;">
          <h1 style="color: #3E2723; margin: 0;">CraftConnect</h1>
          <p style="color: #8D6E63; margin: 5px 0;">Handcrafted Marketplace</p>
        </div>

        <div style="padding: 30px 0;">
          <h2 style="color: #2E7D32;">Congratulations, ${artisanName}! 🎨</h2>

          <p style="color: #555;">Great news! Your artisan account has been <strong>approved</strong> by our admin team.</p>

          <p style="color: #555;">You can now:</p>
          <ul style="color: #555;">
            <li>✅ Add your handcrafted products to the marketplace</li>
            <li>✅ Set your own prices and manage inventory</li>
            <li>✅ Receive orders from customers across India</li>
            <li>✅ Build your artisan profile and showcase your craft</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login/artisan" 
               style="background: linear-gradient(135deg, #A68A64, #8B6F47); color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Start Selling Now →
            </a>
          </div>

          <p style="color: #555;">
            Need help getting started? Visit our seller help center or reply to this email.
          </p>
        </div>

        <div style="border-top: 1px solid #E0E0E0; padding-top: 20px; text-align: center; color: #8D6E63; font-size: 13px;">
          <p>Happy crafting! 🎨<br><strong>Team CraftConnect</strong></p>
          <p>© 2026 CraftConnect. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error("Failed to send approval email:", err.message);
    // Don't throw - email failure shouldn't block approval
  }
};
