const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: { type: [orderItemSchema], required: true },

    shippingAddress: {
      address: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },

    // Customer contact info
    customerPhone: { type: String },
    customerAltPhone: { type: String },

    // Delivery options
    deliveryType: { 
      type: String, 
      enum: ["standard", "express"],
      default: "standard"
    },
    deliveryInstructions: { type: String },

    // Gift options
    isGift: { type: Boolean, default: false },
    giftMessage: { type: String },

    // Customization request (per order for now)
    customizationRequest: { type: String },

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    totalAmount: { type: Number, required: true },
    
    // Payment details
    paymentMethod: { 
      type: String, 
      enum: ["razorpay", "cod"],
      default: "cod"
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
