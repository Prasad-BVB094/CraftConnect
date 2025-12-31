const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");
const controller = require("../controllers/category.controller");

/* Public */
router.get("/", controller.getCategories);
router.get("/:slug", controller.getCategoryBySlug);

/* Admin */
router.post("/", auth, requireRole("admin"), controller.createCategory);
router.put("/:id", auth, requireRole("admin"), controller.updateCategory);
router.delete("/:id", auth, requireRole("admin"), controller.deleteCategory);

module.exports = router;
