const Category = require("../models/Category");
const { handleMongoError } = require("../utils/errors/handleMongoError");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ message: "Please enter all required fields." });
    }
    const category = new Category({
      name,
      description,
    });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    handleMongoError(error, res);
  }
};
const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch the category" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { name, description } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: id },
      { name, description },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update the category" });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOneAndRemove({ _id: id });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(204).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete the category" });
  }
};
module.exports = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
