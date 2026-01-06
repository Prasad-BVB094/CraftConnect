const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { generateOTP } = require("../utils/otp");
    const { sendOTPEmail } = require("../utils/email");
    const otpData = generateOTP();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: false, // Must verify OTP
      isApproved: role === "artisan" ? false : true,
      otpHash: otpData.hash,
      otpExpiry: otpData.expiry,
    });

    try {
      console.log(`[AUTH] OTP for ${email}: ${otpData.otp}`);
      await sendOTPEmail(email, otpData.otp);
    } catch (emailErr) {
      console.error("Failed to send OTP email:", emailErr.message);
      // We still created the user, they can try to login/resend later
    }

    res.status(201).json({ message: "OTP sent to your email. Please verify to continue." });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your account." });
    }

    if (user.role === "artisan" && !user.isApproved) {
      return res.status(403).json({ message: "Artisan not approved by admin" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* =========================
   OTP VERIFY (KEEP AS IS)
========================= */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    const { verifyOTP } = require("../utils/otp");
    const isValid = verifyOTP(otp, user.otpHash);

    if (!isValid || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "Email verified successfully! You can now login." });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};

/* =========================
   GET PROFILE (PHASE 2.B)
========================= */
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Only self or admin
    if (req.user.userId !== id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* =========================
   UPDATE PROFILE (PHASE 2.B)
========================= */
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.userId !== id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
};
