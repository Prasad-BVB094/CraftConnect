const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const {
  getPendingArtisans,
  approveArtisan,
  rejectArtisan,
  getDashboardSummary,
  getAllUsers,
  getAllArtisans,
  getAllProducts,
  getAllOrders,
  adminUpdateProduct,
  deleteProductByAdmin,
  deleteReviewByAdmin,
} = require("../controllers/admin.controller");

/* GLOBAL ADMIN PROTECTION */
router.use(auth);
router.use(requireRole("admin"));

/* ARTISANS */
router.get("/artisans/pending", getPendingArtisans);
router.post("/artisans/:id/approve", approveArtisan);
router.post("/artisans/:id/reject", rejectArtisan);

/* DASHBOARD */
router.get("/dashboard", getDashboardSummary);

/* LISTS */
router.get("/users", getAllUsers);
router.get("/artisans", getAllArtisans);
router.get("/products", getAllProducts);
router.get("/orders", getAllOrders);

/* PRODUCT CONTROL */
router.put("/products/:id", adminUpdateProduct);
router.delete("/products/:id", deleteProductByAdmin);

/* REVIEW CONTROL */
router.delete("/reviews/:id", deleteReviewByAdmin);

module.exports = router;
