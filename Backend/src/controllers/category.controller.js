const Category = require("../models/Category");
const Product = require("../models/Product");

/* =========================
   PUBLIC: LIST CATEGORIES
========================= */
exports.getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json(categories);
};

/* =========================
   PUBLIC: CATEGORY DETAILS
========================= */
exports.getCategoryBySlug = async (req, res) => {
  const category = await Category.findOne({
    slug: req.params.slug,
    isActive: true
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const products = await Product.find({
    category: category._id,
    isActive: true
  });

  res.json({ category, products });
};

/* =========================
   ADMIN: CREATE CATEGORY
========================= */
exports.createCategory = async (req, res) => {
  const { name, slug, icon } = req.body;

  const category = await Category.create({ name, slug, icon });
  res.status(201).json(category);
};

/* =========================
   ADMIN: UPDATE CATEGORY
========================= */
exports.updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json(category);
};

/* =========================
   ADMIN: DELETE CATEGORY
========================= */
exports.deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  category.isActive = false;
  await category.save();

  res.json({ message: "Category disabled" });
};
