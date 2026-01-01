const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const {
  addReview,
  getReviewsByProduct,
  deleteReviewByAdmin
} = require("../controllers/review.controller");

/* Public */
router.get("/:productId", getReviewsByProduct);

/* User */
router.post("/", auth, addReview);

/* Admin */
router.delete("/:id", auth, requireRole("admin"), deleteReviewByAdmin);

module.exports = router;
