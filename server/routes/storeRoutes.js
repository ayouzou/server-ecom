const express = require("express");
const router = express.Router();
const storeControllers = require("../controllers/storeControllers");

// router.get("/", storeControllers.getAllStores);
router.get("/search", storeControllers.searchStore);
router.get("/:slug", storeControllers.getStoreBySlug);
router.post("/", storeControllers.createStore);
router.put("/", storeControllers.updateStore);
router.delete("/", storeControllers.deleteStore);
router.get("/", storeControllers.getStoresByUserId);

module.exports = router;
