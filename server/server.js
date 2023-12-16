const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const database = require("./config/database");

require("dotenv").config();
const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

//call the user route
const userRouter = require("./routes/userRoutes");
app.use("/api/users", userRouter);
// call the customer routes
const customerRouter = require("./routes/customerRoutes");
app.use("/api/customers", customerRouter);

//call the store route
const storeRouter = require("./routes/storeRoutes");
app.use("/api/stores", storeRouter);

// call the product route
const productRouter = require("./routes/productRoutes");
app.use("/api/products", productRouter);
//call the category route
const categoryRouter = require("./routes/categoryRoutes");
app.use("/api/category", categoryRouter);

// call the product order
const orderRouter = require("./routes/orderRoutes");
app.use("/api/orders", orderRouter);

// call the review route
const reviewRouter = require("./routes/reviewRoutes");
app.use("/api/reviews", reviewRouter);
database.connectToDatabase();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`the server running localhost:${PORT}`);
});
