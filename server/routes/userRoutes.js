const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const verifyAuth = require("../middleware/auth/verifyAuth");

//this router for add user to db
router.post("/", userController.createUser);
// router for verify email
router.get("/verify", userController.verifyEmail);
// router login
router.post("/login", userController.login);
//router protected
router.get("/protected", verifyAuth, userController.protected);

//search for user
router.get("/search", userController.searchUsers);

//get user by id
router.get("/:userId", userController.getUserById);

//update a user
router.put("/:userId", userController.updateUser);

//delete a user
router.delete("/:userId", userController.deleteUser);
module.exports = router;
