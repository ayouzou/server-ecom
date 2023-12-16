const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  product_name: {
    type: String,
    required: true,
    unique: true,
  },

  slug: {
    type: String,
  },
  category_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  quantity_available: {
    type: Number,
    required: true,
  },
  availability_status: {
    type: String,
    enum: ["In Stock", "Out of Stock", "Limited Supply"],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  available_colors: {
    type: [String],
  },
  sizes: {
    type: [String],
  },
  colors: {
    type: [String],
  },
  available_sizes: {
    type: [String],
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
