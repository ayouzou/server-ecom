const getSession = require("../../utils/auth/getSession");
const User = require("../../models/User");
const Product = require("../../models/Product");
const Store = require("../../models/Store");
require("dotenv").config();

const verifyProductOwnership = async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log("product id", id);
    const session = getSession(req);
    const user = await User.findById(session.user.id);
    const product = await Product.findById(id);
    const store = await Store.findById(product.store_id);

    if (user._id.toString() !== store.seller_id.toString()) {
      return res
        .status(403)
        .json({ error: "Permission denied. User is not the store owner." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed", error });
  }
};
module.exports = verifyProductOwnership;
