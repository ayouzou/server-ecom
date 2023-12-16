const Product = require("../models/Product");
const Store = require("../models/Store");
const slugify = require("slugify");

const createProduct = async (req, res) => {
  try {
    console.log(req.body);
    const {
      store_slug,
      product_name,
      description,
      price,
      quantity_available,
      images,
      availability_status,
      available_colors,
      available_sizes,
      sizes,
      colors,
    } = req.body;

    if (!product_name || !description || !price || !quantity_available) {
      return res
        .status(400)
        .json({ error: "Please enter all required fields." });
    }
    const slug = product_name.split(" ").join("-").toLowerCase();

    const store = await Store.findOne({ slug: store_slug });

    const newProduct = new Product({
      store_id: store._id,
      product_name,
      description,
      price,
      sizes,
      colors,
      quantity_available,
      images,
      available_colors,
      availability_status,
      available_sizes,
      slug,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Error creating product" });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
};
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug: slug });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Error fetching product by ID" });
  }
};
const searchProduct = async (req, res) => {
  try {
    const { keyword } = req.query;
    const products = await Product.find({
      $or: [
        { product_name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error searching for products by keyword:", error);
    res

      .status(500)
      .json({ error: `Error searching for products by the given keyword}` });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id, ...updateFields } = req.body;

    if (updateFields.product_name) {
      updateFields.slug = slugify(updateFields.product_name, { lower: true });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Error updating product" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedProduct = await Product.findByIdAndRemove(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(204).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Error deleting product" });
  }
};

const getProductsByStore = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ error: "Please enter seller ID" });
    }
    const store = await Store.findOne({ slug: slug });

    console.log("storeeee", store);
    const products = await Product.find({ store_id: store._id });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Error fetching product by ID" });
  }
};
const randomLatestProducts = async (req, res) => {
  try {
    const { slug } = req.params;

    const store = await Store.findOne({ slug: slug });

    if (!store) {
      return res.status(404).json({ message: "Store not found." });
    }

    const allProducts = await Product.find({ store_id: store._id })
      .sort({ creation_date: -1 });

    res.json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  createProduct,
  getAllProducts,
  getProductBySlug,
  searchProduct,
  updateProduct,
  deleteProduct,
  getProductsByStore,
  randomLatestProducts,
};
