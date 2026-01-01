const Review = require("../models/Review");
const Product = require("../models/Product");

/*
====================================
ADD REVIEW (USER)
====================================
*/
exports.addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  if (!productId || !rating) {
    return res.status(400).json({ message: "Product and rating are required" });
  }

  try {
    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });

    // 🔁 Recalculate product rating
    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      {
        $group: {
          _id: "$product",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Product.findByIdAndUpdate(review.product, {
      averageRating: stats[0].avg,
      reviewCount: stats[0].count,
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }
    res.status(500).json({ message: "Failed to add review" });
  }
};

/*
====================================
GET REVIEWS FOR PRODUCT (PUBLIC)
====================================
*/
exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("user", "name");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

/*
====================================
DELETE REVIEW (ADMIN)
====================================
*/
exports.deleteReviewByAdmin = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const productId = review.product;
    await review.deleteOne();

    // 🔁 Recalculate product rating
    const stats = await Review.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: "$product",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Product.findByIdAndUpdate(productId, {
      averageRating: stats.length ? stats[0].avg : 0,
      reviewCount: stats.length ? stats[0].count : 0,
    });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};
