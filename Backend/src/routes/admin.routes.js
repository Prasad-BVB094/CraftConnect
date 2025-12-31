const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const {
  getPendingArtisans,
  approveArtisan,
  rejectArtisan,
  getDashboardSummary,
  getAllUsers,
  getAllArtisans,
  getAllProducts,
  getAllOrders,
  deleteProductByAdmin,
  adminUpdateProduct
} = require("../controllers/admin.controller");



/*
====================================
GLOBAL ADMIN PROTECTION
====================================
*/
router.use(auth);
router.use((req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
});

/*
====================================
EXISTING ROUTES — DO NOT TOUCH
====================================
*/
router.get("/artisans/pending", getPendingArtisans);
router.post("/artisans/:id/approve", approveArtisan);
router.post("/artisans/:id/reject", rejectArtisan);

/*
====================================
NEW READ-ONLY ADMIN ROUTES
====================================
*/

// Dashboard summary
router.get("/dashboard", getDashboardSummary);

// Lists
router.get("/users", getAllUsers);
router.get("/artisans", getAllArtisans);
router.get("/products", getAllProducts);
router.put("/products/:id", adminUpdateProduct);
router.delete("/products/:id", deleteProductByAdmin);
router.get("/orders", getAllOrders);

module.exports = router;
