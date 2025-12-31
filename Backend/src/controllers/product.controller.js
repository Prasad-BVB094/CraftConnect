const Product = require("../models/Product");
const User = require("../models/User");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");

/* =========================
   CREATE PRODUCT (ARTISAN)
========================= */
exports.createProduct = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || user.role !== "artisan") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!user.isApproved) {
      return res
        .status(403)
        .json({ message: "Artisan account pending admin approval" });
    }

    const { title, description, price, stock, category } = req.body;

    if (
      title === undefined ||
      description === undefined ||
      price === undefined ||
      stock === undefined ||
      category === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists || !categoryExists.isActive) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    if (req.files.length > 5) {
      return res.status(400).json({ message: "Maximum 5 images allowed" });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { folder: "craftconnect/products" }
      );
      imageUrls.push(result.secure_url);
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      stock: Number(stock),
      images: imageUrls,
      category,
      artisan: user._id,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: "Product creation failed",
      error: err.message,
    });
  }
};

/* =========================
   UPDATE PRODUCT (ARTISAN ONLY)
========================= */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.artisan.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allowedUpdates = [
      "title",
      "description",
      "price",
      "stock",
      "category",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: "Product update failed",
      error: err.message,
    });
  }
};

/* =========================
   DELETE PRODUCT (SOFT)
========================= */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const isOwner = product.artisan.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Product deletion failed",
      error: err.message,
    });
  }
};

/* =========================
   GET ALL PRODUCTS (PUBLIC)
========================= */
exports.getAllProducts = async (req, res) => {
  const products = await Product.find({ isActive: true })
    .populate("artisan", "name")
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  res.json(products);
};


/* =========================
   GET PRODUCT BY ID
========================= */
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("artisan", "name")
    .populate("category", "name slug");

  if (!product || !product.isActive) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};


/* =========================
   GET MY PRODUCTS (ARTISAN)
========================= */
exports.getMyProducts = async (req, res) => {
  const products = await Product.find({
    artisan: req.user.userId,
  })
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  res.json(products);
};

