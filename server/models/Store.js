const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
  },
  address: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  template: {
    type: String,
    enum: ["XMTA", "RAYBAN"],
    default: "RAYBAN",
  },
  category: {
    type: String,
    enum: [
      "FASHION",
      "FOOD",
      "ELECTRONICS",
      "SPORTS",
      "HOME",
      "TECH",
      "OTHERS",
    ],
    default: "FASHION",
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
const Store = mongoose.model("Stores", storeSchema);

module.exports = Store;
