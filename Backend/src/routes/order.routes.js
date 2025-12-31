const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const controller = require("../controllers/order.controller");

/* =========================
   USER
========================= */
router.post(
  "/place",
  auth,
  requireRole("user"),
  controller.placeOrder
);

router.get(
  "/my",
  auth,
  requireRole("user"),
  controller.getUserOrders
);

/* =========================
   ARTISAN
========================= */
router.get(
  "/artisan",
  auth,
  requireRole("artisan"),
  controller.getArtisanOrders
);

/* =========================
   ADMIN
========================= */
router.get(
  "/",
  auth,
  requireRole("admin"),
  controller.getAllOrders
);

/* =========================
   STATUS UPDATE (ARTISAN + ADMIN)
========================= */
router.put(
  "/:id/status",
  auth,
  (req, res, next) => {
    if (req.user.role === "artisan" || req.user.role === "admin") {
      return next();
    }
    return res.status(403).json({ message: "Forbidden" });
  },
  controller.updateOrderStatus
);

module.exports = router;
