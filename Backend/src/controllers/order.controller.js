const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

/* =========================
   PLACE ORDER (USER)
========================= */
exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const { 
      shippingAddress, 
      customerPhone,
      customerAltPhone,
      deliveryType,
      deliveryInstructions,
      paymentMethod,
      customizationRequest,
      isGift,
      giftMessage
    } = req.body;
    
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product || !product.isActive) {
        return res.status(400).json({ 
          message: `Product "${product?.title || 'Unknown'}" is no longer available.` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for "${product.title}". Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }

      totalAmount += item.quantity * product.price;

      orderItems.push({
        product: product._id,
        artisan: product.artisan,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await Order.create({
      user: req.user.userId,
      items: orderItems,
      shippingAddress,
      customerPhone,
      customerAltPhone,
      deliveryType: deliveryType || "standard",
      deliveryInstructions,
      paymentMethod: paymentMethod || "cod",
      customizationRequest,
      isGift: isGift || false,
      giftMessage,
      totalAmount,
      status: "pending",
      isPaid: false,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully. Proceed to payment.",
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: "Order placement failed",
      error: err.message,
    });
  }
};

/* =========================
   GET USER ORDERS
========================= */
exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })
    .populate("items.product", "title")
    .sort({ createdAt: -1 });

  res.json(orders);
};

/* =========================
   GET ARTISAN ORDERS
========================= */
exports.getArtisanOrders = async (req, res) => {
  const orders = await Order.find({ "items.artisan": req.user.userId })
    .populate("items.product", "title")
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
};

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
exports.getAllOrders = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product", "title")
    .sort({ createdAt: -1 });

  res.json(orders);
};

/* =========================
   UPDATE ORDER STATUS
========================= */
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (
    req.user.role === "artisan" &&
    !order.items.some(
      (i) => i.artisan.toString() === req.user.userId
    )
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  order.status = status;
  await order.save();

  res.json({ message: "Order status updated", order });
};
