const Customer = require("../../models/Customer");

const isUserRegisteredToStore = async (req, res, next) => {
  const { storeSlug, email } = req.body;

  try {
    const customer = await Customer.findOne({ email: email });

    if (!customer) {
      return next();
    }
    if (!customer.storeSlugs.includes(storeSlug)) {
      next();
    } else {
      return res.status(401).json({ error: "Customer already registered" });
    }
  } catch (error) {
    console.log(error);
    // console.log(error);
    error;
  }
};

module.exports = isUserRegisteredToStore;
