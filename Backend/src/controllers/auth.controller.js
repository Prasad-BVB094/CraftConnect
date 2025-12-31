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

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: true,
      isApproved: role === "artisan" ? false : true,
    });

    res.status(201).json({ message: "User registered successfully" });
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
  res.json({ message: "OTP verified (placeholder)" });
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
