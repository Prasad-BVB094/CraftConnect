const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");

/* =========================
   AUTH
========================= */
router.post("/register", controller.register);
router.post("/verify-otp", controller.verifyOtp);
router.post("/login", controller.login);

/* =========================
   SESSION INFO
========================= */
router.get("/me", auth, (req, res) => {
  res.json({
    userId: req.user.userId,
    role: req.user.role
  });
});

/* =========================
   PROFILE (PHASE 2.B)
========================= */
router.get("/profile/:id", auth, controller.getProfile);
router.put("/profile/:id", auth, controller.updateProfile);

module.exports = router;
