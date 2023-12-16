const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const verifyAuth = require("../middleware/auth/verifyAuth");
const isUserRegisteredToStore = require("../middleware/auth/isUserRegisteredToStore");

//this router for add user to db

router.post("/", customerController.createCustomer);
// router for verify email
router.get("/verify", customerController.verifyEmail);
// router login
router.post("/login", customerController.login);

router.get("/all/:storeSlug", customerController.getCustomerByStoreSlug);
router.post("/", isUserRegisteredToStore, customerController.createCustomer);

router.post("/login", customerController.login);

module.exports = router;
