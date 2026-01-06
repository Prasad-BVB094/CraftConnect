const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/support.controller");

// Public - Submit support query (auth optional)
router.post("/", controller.createSupportQuery);

// Admin only routes
router.get("/", auth, controller.getAllSupportQueries);
router.get("/pending-count", auth, controller.getPendingCount);
router.post("/:id/reply", auth, controller.replyToQuery);
router.put("/:id/status", auth, controller.updateQueryStatus);
router.delete("/:id", auth, controller.deleteQuery);

module.exports = router;
