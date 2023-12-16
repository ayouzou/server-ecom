const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  // phone: Number,
  // address: String,
  storeSlugs: [
    {
      type: String,
      ref: "Store",
      slug: {
        type: String,
        ref: "Store",
      },
    },
  ],
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  creation_date: {
    type: Date,
    default: Date.now,
  },
  last_login: {
    type: Date,
    default: Date.now,
  },
  last_update: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
