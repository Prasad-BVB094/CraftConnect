const Cart = require("../models/Cart");
const Product = require("../models/Product");

/* =========================
   GET MY CART
========================= */
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.userId })
    .populate("items.product");

  res.json(cart || { items: [] });
};

/* =========================
   ADD TO CART
========================= */
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({ message: "Product not available" });
  }

  let cart = await Cart.findOne({ user: req.user.userId });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.userId,
      items: [{ product: productId, quantity }]
    });
  } else {
    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  res.json({ message: "Added to cart" });
};

/* =========================
   UPDATE QUANTITY
========================= */
exports.updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  const cart = await Cart.findOne({ user: req.user.userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  item.quantity = quantity;
  await cart.save();

  res.json({ message: "Quantity updated" });
};

/* =========================
   REMOVE ITEM
========================= */
exports.removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== req.params.productId
  );

  await cart.save();
  res.json({ message: "Item removed" });
};
