const Review = require("../models/Review");
const Product = require("../models/Product");
const getSession = require("../utils/auth/getSession");
const Customer = require("../models/Customer");

const createReview = async (req, res) => {
  try {
    const { comment, images, score, productId, user_id } = req.body;
    const newReview = new Review({
      comment,
      images,
      score,
      user_id,
    });

    const createdReview = await newReview.save();

    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      $push: { reviews: createdReview._id },
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(201).json(createdReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create a review" });
  }
};

const getReviewById = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve the review" });
  }
};

const getReviewsByProductSlug = async (req, res) => {
  try {
    const { productSlug } = req.params;

    if (!productSlug) {
      return res
        .status(400)
        .json({ error: "productSlug is required in path params" });
    }
    const product = await Product.find({ slug: productSlug });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("second", product);
    const reviews = await Review.find({ _id: product[0].reviews });
    console.log("first", reviews);

    return res.json(reviews);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching reviews" });
  }
};
const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const updatedReviewData = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      updatedReviewData,
      {
        new: true,
      }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    return res.json(updatedReview);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while updating the review" });
  }
};
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.body.id;

    const session = getSession(req);
    const user = await Customer.findById(session.user.id);
    const review = await Review.findById(reviewId);
    if (review.user_id.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Permission denied. User is not the review owner." });
    }
    const deletedReview = await Review.findByIdAndRemove(reviewId);
    console.log("deletedReview",deletedReview)
    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    const product = await Product.findOne({ reviews: reviewId });
    if (product) {
      product.reviews.pull(reviewId);
      await product.save();
    }


    return res.json({ message: "Review deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the review" });
  }
};
module.exports = {
  createReview,
  getReviewById,
  getReviewsByProductSlug,
  updateReview,
  deleteReview,
};
