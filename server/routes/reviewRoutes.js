const express = require("express");
const router = express.Router();
const reviewControllers = require("../controllers/reviewControllers");

router.post("/", reviewControllers.createReview);
router.get("/product/:productSlug", reviewControllers.getReviewsByProductSlug);
router.get("/:id", reviewControllers.getReviewById);
router.put("/:id", reviewControllers.updateReview);
router.delete("/", reviewControllers.deleteReview);

module.exports = router;
