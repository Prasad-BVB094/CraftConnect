const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/*
====================================
CREATE PAYMENT ORDER
====================================
*/
exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "PAID") {
      return res.status(400).json({ message: "Order already paid" });
    }

    const existingPayment = await Payment.findOne({
      orderId: order._id,
      status: { $in: ["CREATED", "PAID"] },
    });

    if (existingPayment) {
      return res
        .status(400)
        .json({ message: "Payment already initiated" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100,
      currency: "INR",
      receipt: `order_${order._id}`,
    });

    const payment = await Payment.create({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      user: req.user.userId,
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentId: payment._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: "Payment order creation failed" });
  }
};

/*
====================================
VERIFY PAYMENT
====================================
*/
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const payment = await Payment.findOne({ razorpayOrderId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "PAID") {
      return res.status(400).json({ message: "Payment already verified" });
    }

    payment.status = "PAID";
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    await Order.findByIdAndUpdate(payment.orderId, {
      isPaid: true,
      status: "confirmed",
      paidAt: new Date(),
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId
    });

    res.json({ message: "Payment verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Payment verification failed" });
  }
};
