const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "artisan", "admin"],
      default: "user",
    },

    phone: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    bio: { type: String, default: "", trim: true },

    isVerified: { type: Boolean, default: false },

    // ONLY meaningful for artisan
    isApproved: { type: Boolean, default: false },

    otpHash: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
