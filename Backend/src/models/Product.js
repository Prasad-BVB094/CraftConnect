const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    /* =========================
       PHASE 2.B ADDITION
    ========================= */
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    sku: {
      type: String,
      unique: true,
      index: true
    },

    /* ========================= */

    images: [
      {
        type: String,
        required: true,
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
productSchema.pre("save", function (next) {
  if (!this.sku) {
    const categoryCode =
      this.category?.toString().slice(-3).toUpperCase() || "GEN";
    const uniquePart = this._id.toString().slice(-6).toUpperCase();
    this.sku = `CC-${categoryCode}-${uniquePart}`;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
