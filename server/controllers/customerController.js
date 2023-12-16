const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const sendVerificationEmail = require("../utils/emails/sendVerificationEmail");
const getBaseUrl = require("../utils/core/getBaseUrl");
require("dotenv").config();

// Verify email controller
const verifyEmail = async (req, res) => {
  const { id } = req.query;

  try {
    console.log("Verifying email for customer:", id);
    const customer = await Customer.findByIdAndUpdate(id, { active: true });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while verifying email" });
  }
};


const createCustomer = async (req, res) => {
  const { storeSlug, ...rest } = req.body;

  if (!storeSlug) {
    return res.status(400).json({ error: "Store slug is required" });
  }

  try {

    const optimisticCustomerWithEmail = await Customer.findOne({
      email: rest.email,
    });

    if (optimisticCustomerWithEmail) {
      await Customer.findOneAndUpdate(
        { email: rest.email },
        { $push: { storeSlugs: storeSlug } },
        { new: true }
      );
      return res.status(201).json({ message: "Customer registered!" });
    }
    const newCustomer = new Customer(rest);
    newCustomer.storeSlugs.push(storeSlug);

    await newCustomer.save();
  
    const token = jwt.sign(
      {
        id: newCustomer._id,
        email: newCustomer.email,
        role: "CUSTOMER",
        username: newCustomer.username,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "Customer creation failed", message: error.message });
  }
};
// this function for login customer and if SELLER OR CUSTOMER
const login = async (req, res) => {
  try {
    const { storeSlug, email, password } = req.body;
    const customer = await Customer.findOne({ email, password });

    if (!customer) {
      return res
        .status(401)
        .json({ message: "No customer found with the provided credentials" });
    }

    // check if customer is not active

    if (!customer.storeSlugs.includes(storeSlug)) {
      return res
        .status(401)
        .json({ message: "Customer not registered to this store" });
    }

    // if (!customer.active) {
    //   return res.status(401).json({ message: "Email not verified" });
    // }

    const token = jwt.sign(
      {
        id: customer._id,
        email: customer.email,
        role: "CUSTOMER",
        username: customer.username,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );
    return res.status(200).json({ token });

  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "Customer Login failed", message: error.message });
  }
};
const protected = (req, res) => {
  // const customerData = req.customerData;
  res.status(200).json({ message: "This is a protected route" });
};



const getCustomerByStoreSlug = async (req, res) => {
  const storeSlug = req.params.storeSlug;
  try {
    const customers = await Customer.find({ storeSlugs: storeSlug });

    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "Customers not found for the specified store slug" });
    }

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: "Error while retrieving customers",
      error: error.message,
    });
  }
};














// this controller for get Customer By Id
const getCustomerById = async (req, res) => {
  const customerId = req.params.customerId;
  try {
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({
      message: "Error while retrieving customer",
      error: error.message,
    });
  }
};
const searchCustomers = async (req, res) => {
  try {
    const { keyword } = req.query;
    const customers = await Customer.find({
      lastname: { $regex: new RegExp(keyword, "i") },
    });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error while searching for customers" });
  }
};

const updateCustomer = async (req, res) => {
  const customerId = req.params.customerId;

  const updateData = req.body;
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      updateData,
      {
        new: true,
      }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while updating customer", error: error.message });
  }
};
const deleteCustomer = async (req, res) => {
  const customerId = req.params.customerId;
  try {
    const deletedCustomer = await Customer.findByIdAndRemove(customerId);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while deleting customer", error: error.message });
  }
};
module.exports = {
  createCustomer,
  login,
  protected,
  verifyEmail,
  getCustomerById,
  searchCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerByStoreSlug
};
