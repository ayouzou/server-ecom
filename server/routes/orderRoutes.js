const express = require("express");
const router = express.Router();
const controllers = require("../controllers/orderControllers");
const verifyAuth = require("../middleware/auth/verifyAuth");

router.get("/:id", controllers.getOrdersByStore);
router.post("/", controllers.createOrder);
router.put("/:id", verifyAuth, controllers.updateOrder);
router.delete("/:id", verifyAuth, controllers.deleteOrder);
// router.get("/",controllers.getOrdersByUserIdAndStoreId)
router.get("/two/:slug",controllers.getOrdersByUserIdAndStoreSlug)
router.delete("/delete",controllers.deleteAllOrders)
module.exports = router;
