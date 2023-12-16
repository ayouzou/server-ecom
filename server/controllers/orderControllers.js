const Order = require("../models/Order");
const Store = require("../models/Store");
const getSession = require("../utils/auth/getSession");


const createOrder = async (req, res) => {
  try {

    const {
      customer_id,
      email,
      tele,
      address,
      store_id,
      products,
      status,
      first_name,
      last_name,
    } = req.body;

    if (!customer_id || !email || !tele || !address || !products) {
      return res
        .status(400)
        .json({ error: "Please enter all required fields." });
    }
    const newOrder = new Order({
      user_info: {
        customer_id,
        email,
        tele,
        address,
        first_name,
        last_name,
      },
      store_id,
      products,
      status,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Error creating order" });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ error: "Error fetching order by ID" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updateFields = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateFields, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating Order:", error);
    res.status(500).json({ error: "Error updating order" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndRemove(id);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Error deleting order" });
  }
};
const getOrdersByStore = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Please enter seller ID" });
    }
    const orders = await Order.find({ store_id: id });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Error fetching product by ID" });
  }
};


const getOrdersByUserIdAndStoreSlug = async (req, res) => {
  try {
    // const { customer_id } = req.body;
    const session = getSession(req);
    const { slug } = req.params;
    // console.log("slug",slug)
    // console.log("session",session.user.id)
    const store = await Store.findOne({ slug });
    // console.log("store",store)
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const orders = await Order.find({
      "user_info.customer_id": session.user.id,
      store_id: store._id,

    });
    // console.log("orders",orders)
    
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ error: "Orders not found for the user and store" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by user ID and store slug:", error);
    res
      .status(500)
      .json({ error: "Error fetching orders by user ID and store slug" });
  }
};
const deleteAllOrders = async (req, res) => {
  try {
   
    await Order.deleteMany({});
    
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting all orders:", error);
    res.status(500).json({ error: "Error deleting all orders" });
  }
};
module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByStore,
  deleteAllOrders,
  getOrdersByUserIdAndStoreSlug,
};
