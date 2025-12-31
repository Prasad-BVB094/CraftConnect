const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/cart.controller");

router.use(auth);

router.get("/", controller.getCart);
router.post("/add", controller.addToCart);
router.put("/update", controller.updateQuantity);
router.delete("/remove/:productId", controller.removeFromCart);

module.exports = router;
