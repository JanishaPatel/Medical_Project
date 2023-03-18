const jwt = require("jsonwebtoken");

require("dotenv");
// dotenv.config({ path: "./config.env" });

const User = require("../models/userModel");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const userid = decode.id;

    const obj = await User.findById(userid);
    if (obj.token == "") {
      // if(!obj.token){
      res.json({
        message: "Unauthorize User...",
      });
    }

    next();
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      res.status(401).json({
        message: "Token Expired!!",
      });
    } else {
      res.json({
        message: "Authentication failed!!!",
      });
    }
  }
};

module.exports = authenticate;
