const mongoose = require("mongoose");

const supportQuerySchema = new mongoose.Schema(
  {
    // User reference (optional - for logged-in users)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Contact info (for guests or override)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    // Query details
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Query type
    category: {
      type: String,
      enum: ["general", "order", "payment", "technical", "feedback", "other"],
      default: "general",
    },

    // Status tracking
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "closed"],
      default: "pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    // Admin response
    adminReply: {
      type: String,
      trim: true,
    },

    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    repliedAt: {
      type: Date,
    },

    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
supportQuerySchema.index({ status: 1, createdAt: -1 });
supportQuerySchema.index({ email: 1 });

module.exports = mongoose.model("SupportQuery", supportQuerySchema);
