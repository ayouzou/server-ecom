const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/categoryControllers");

router.post("/", categoryControllers.createCategory);
router.get("/", categoryControllers.getAllCategory);
router.get("/:id", categoryControllers.getCategoryById);
router.put("/:id", categoryControllers.updateCategory);
router.delete("/:id", categoryControllers.deleteCategory);
module.exports = router;
