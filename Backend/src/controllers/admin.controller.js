const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
/*
====================================
EXISTING LOGIC — DO NOT TOUCH
====================================
*/

// Get pending artisans
exports.getPendingArtisans = async (req, res) => {
  try {
    const artisans = await User.find({
      role: "artisan",
      isApproved: false
    }).select("-password");

    res.json(artisans);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending artisans" });
  }
};

// Approve artisan
exports.approveArtisan = async (req, res) => {
  try {
    const artisan = await User.findById(req.params.id);

    if (!artisan || artisan.role !== "artisan") {
      return res.status(404).json({ message: "Artisan not found" });
    }

    artisan.isApproved = true;
    await artisan.save();

    res.json({ message: "Artisan approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve artisan" });
  }
};

// Reject artisan
exports.rejectArtisan = async (req, res) => {
  try {
    const artisan = await User.findById(req.params.id);

    if (!artisan || artisan.role !== "artisan") {
      return res.status(404).json({ message: "Artisan not found" });
    }

    await artisan.deleteOne();
    res.json({ message: "Artisan rejected and removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject artisan" });
  }
};

/*
====================================
NEW READ-ONLY ADMIN VISIBILITY
====================================
*/

// Admin dashboard summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalArtisans = await User.countDocuments({ role: "artisan" });
    const pendingArtisans = await User.countDocuments({
      role: "artisan",
      isApproved: false
    });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({
      totalUsers,
      totalArtisans,
      pendingArtisans,
      totalProducts,
      totalOrders
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard summary" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get all artisans
exports.getAllArtisans = async (req, res) => {
  try {
    const artisans = await User.find({ role: "artisan" }).select("-password");
    res.json(artisans);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch artisans" });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("artisan", "name email")
      .populate("category", "name");

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "title price");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/*
====================================
ADMIN: UPDATE PRODUCT
====================================
*/
exports.updateProductByAdmin = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("artisan", "name email")
      .populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

/*
====================================
ADMIN: DELETE PRODUCT (HARD DELETE)
====================================
*/
exports.deleteProductByAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};
exports.adminUpdateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Admin can update only safe fields
    const allowedUpdates = ["title", "price", "stock", "isActive"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin product update failed" });
  }
};

/*
====================================
ADMIN: DELETE REVIEW (HARD DELETE)
====================================
*/
exports.deleteReviewByAdmin = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};
