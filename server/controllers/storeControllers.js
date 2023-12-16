const Store = require("../models/Store");
const User = require("../models/User");
const getSession = require("../utils/auth/getSession");

const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();

    res.status(200).json({ stores });
  } catch (err) {
    console.error("Error retrieving stores:", err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving stores." });
  }
};
const createStore = async (req, res) => {
  try {
    const { name, description, logo, template, category, address } = req.body;
    console.log("create store body", req.body);
    const session = getSession(req);
    const user = await User.findById(session.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.role !== "SELLER") {
      return res
        .status(403)
        .json({ message: "Permission denied. User is not a seller." });
    }
    const slug = name.toLowerCase().replace(/ /g, "-");
    const newStore = new Store({
      name,
      slug,
      description,
      seller_id: user._id,
      logo,
      template,
      category,
      address,
    });
    const store = await newStore.save();
    res.status(201).json({ message: "Store created", store });
  } catch (err) {
    console.error("Error creating a store:", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the store." });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Store id is required." });
    }
    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({ message: "Store not found." });
    }

    const session = getSession(req);
    const user = await User.findById(session.user.id);

    if (user.role !== "SELLER") {
      return res
        .status(403)
        .json({ message: "Permission denied. User is not a seller." });
    }

    if (store.seller_id.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Permission denied. User is not the store owner." });
    }

    await Store.findByIdAndRemove(id);
    res.status(200).json({ message: "Store deleted successfully" });
  } catch (err) {
    console.error("Error deleting a store:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the store." });
  }
};
const searchStore = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res
        .status(400)
        .json({ message: "Keyword is required for the search." });
    }
    const stores = await Store.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    res.status(200).json({ stores });
  } catch (err) {
    console.error("Error searching stores:", err);
    res
      .status(500)
      .json({ error: "An error occurred while searching for stores." });
  }
};
const getStoreBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log("this is slug", slug);
    const store = await Store.findOne({ slug: slug });
    console.log("this is store",store)
    if (!store) {
      return res.status(404).json({ message: "Store not found." });
    }
    res.status(200).json({ store });
  } catch (err) {
    console.error("Error searching for a store by slug:", err);
    res
      .status(500)
      .json({ error: "An error occurred while searching for the store." });
  }
};

const getStoresByUserId = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      res.status(400).json({ message: "Missing user id in query param" });
    }

    const stores = (await Store.find({ seller_id: userId })).reverse();
    if (!stores) {
      return res.status(404).json({ message: "Stores not found." });
    }
    res.status(200).json({ stores });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while getting your stores." });
  }
};
const updateStore = async (req, res) => {
  try {
    const { id } = req.body;
    console.log("this is id", id);
    const store = await Store.findById(id);
    console.log(store);
    if (!store) {
      return res.status(404).json({ message: "Store not found." });
    }
    const session = getSession(req);
    const user = await User.findById(session.user.id);

    if (user.role !== "SELLER") {
      return res
        .status(403)
        .json({ message: "Permission denied. User is not a seller." });
    }

    if (store.seller_id.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Permission denied. User is not the store owner." });
    }

    const { name, description, category, address, template } = req.body;
    if (name) {
      store.name = name;
    }
    if (description) {
      store.description = description;
    }
    if (category) {
      store.category = category;
    }
    if (address) {
      store.address = address;
    }
    if (template) {
      store.template = template;
    }
    const updatedStore = await store.save();
    res.status(200).json({ message: "Store updated", store: updatedStore });
  } catch (err) {
    console.error("Error updating a store:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the store." });
  }
};
module.exports = {
  getAllStores,
  createStore,
  deleteStore,
  searchStore,
  getStoreBySlug,
  updateStore,
  getStoresByUserId,
};
