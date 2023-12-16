const express = require("express");
const router = express.Router();
const controllers = require("../controllers/productControllers");
const verifyProductOwnership = require("../middleware/store/verifyProductOwnership");

router.post("/", controllers.createProduct);
router.get("/:slug", controllers.getProductsByStore);
router.get("/one/:slug", controllers.getProductBySlug);
router.put("/", verifyProductOwnership, controllers.updateProduct);
router.delete("/", verifyProductOwnership, controllers.deleteProduct);
router.get("/:slug/latest",controllers.randomLatestProducts);

module.exports = router;
