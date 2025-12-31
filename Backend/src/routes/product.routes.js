const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const controller = require("../controllers/product.controller");

/* Public */
router.get("/", controller.getAllProducts);
router.get("/:id", controller.getProductById);

/* Artisan */
router.post(
  "/",
  auth,
  upload.array("images", 5),
  controller.createProduct
);

router.get("/my/list", auth, controller.getMyProducts);
router.put("/:id", auth, controller.updateProduct);

/* Delete (Artisan + Admin) */
router.delete("/:id", auth, controller.deleteProduct);

module.exports = router;
