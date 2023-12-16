const mongoose = require("mongoose");
//Create Schema  for users
const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: async function (value) {
        // Check if the email already exists in the database
        const user = await this.constructor.findOne({ email: value });
        return !user;
      },
      message: "Email already exists",
    },
  },
  role: {
    type: String,
    enum: ["CUSTOMER", "SELLER", "ADMIN"],
    default: "SELLER",
  },
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
    default: true,
  },
});

const User = mongoose.model("User", userSchema);
//Export the User collection
module.exports = User;
