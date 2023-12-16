const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendVerificationEmail = require("../utils/emails/sendVerificationEmail");
const getBaseUrl = require("../utils/core/getBaseUrl");
require("dotenv").config();

// Verify email controller
const verifyEmail = async (req, res) => {
  const { id } = req.query;

  try {
    console.log("Verifying email for user:", id);
    const user = await User.findByIdAndUpdate(id, { active: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while verifying email" });
  }
};

// Create controller for insert data in collection User
const createUser = async (req, res) => {
  try {
    console.log("newUser",req.body)
    const newUser = new User(req.body);
    
   

      await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, username: newUser.username ,role:"SELLER"},
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    console.log("token",token)
    // await sendVerificationEmail(
    //   saveUser.email,
    //   `${getBaseUrl()}/api/users/verify?id=${saveUser._id}`
    // );
    res.status(201).json({token});
  } catch (error) {
    res
      .status(400)
      .json({ error: "User creation failed", message: error.message });
  }
};
// this function for login user and if SELLER OR CUSTOMER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res
        .status(401)
        .json({ message: "No user found with the provided credentials" });
    }

    // check if user is not active

    // if (!user.active) {
    //   return res.status(401).json({ message: "Email not verified" });
    // }

   
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username ,role:user.role},
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    if (user.role === "SELLER") {
      return res
        .status(200)
        .json({ message: `Welcome , ${user.role}!`, token });
    } else {
      return res
        .status(200)
        .json({ message: `Welcome ,${user.role}! `, token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "User Login failed", message: error.message });
  }
};
const protected = (req, res) => {
  // const userData = req.userData;
  res.status(200).json({ message: "This is a protected route" });
};

// this controller for get User By Id
const getUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while retrieving user", error: error.message });
  }
};
const searchUsers = async (req, res) => {
  try {
    const { keyword } = req.query;
    const users = await User.find({
      lastname: { $regex: new RegExp(keyword, "i") },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error while searching for users" });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.userId;

  const updateData = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while updating user", error: error.message });
  }
};
const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const deletedUser = await User.findByIdAndRemove(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while deleting user", error: error.message });
  }
};
module.exports = {
  createUser,
  login,
  protected,
  verifyEmail,
  getUserById,
  searchUsers,
  updateUser,
  deleteUser,
};
