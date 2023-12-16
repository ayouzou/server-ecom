const jwt = require("jsonwebtoken");

const getSession = (req) => {
  try {
    const bearer = req.headers["authorization"];
    const token = bearer.split(" ")[1];
    console.log("tokedn", token);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("decoded", decoded);
    return {
      user: decoded,
    };
  } catch (error) {
    return { user: null };
  }
};

module.exports = getSession;
