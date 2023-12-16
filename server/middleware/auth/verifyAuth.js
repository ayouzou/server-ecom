const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyAuth = (req, res, next) => {
  try {
    const bearer = req.headers["authorization"];
    const token = bearer.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
module.exports = verifyAuth;
