const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const User = require("../models/userModel");

//User Registration

const register = (req, res, next) => {
  const password = req.body.password;
  // console.log(password);
  if (
    password.length < 8 ||
    // password.contains(" ") == 1 ||
    // password.search(/^\s*$/) == -1 ||
    // password.search(/' '/) == -1 ||
    password.search(/[0-9]/) == -1 ||
    password.search(/[a-z]/) == -1 ||
    password.search(/[A-Z]/) == -1 ||
    password.search(/[!\@\#\$\%\^\&\*]/) == -1
  ) {
    res.status(400).json({
      status: "fail",
      message:
        "Password must contain atleast 8 character, 1 uppercase, 1 lowercase, 1 digit, 1 special character and does not contain whitespace",
    });
  }

  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({ error: err });
    }
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPass,
      token: "",
    });
    user
      .save()
      .then((user) => {
        res.json({
          message: "User successfully Registered!!",
        });
      })
      .catch((error) => {
        res.json({
          message: `Error occurred while registering user ${error}`,
        });
      });
  });
};

//User login

const login = (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ $or: [{ email: username }, { phone: username }] }).then(
    (user) => {
      if (user) {
        bcrypt.compare(password, user.password, async function (err, result) {
          if (err) {
            res.json({
              error: err,
            });
          }
          if (result) {
            let token = jwt.sign(
              { name: user.name, id: user._id },
              process.env.JWT_SECRET,
              {
                expiresIn: process.env.JWT_EXPIRES_IN,
              }
            );

            if (token) {
              const decode = jwt.verify(token, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
              });
              const userid = decode.id;
              // console.log(userid);
              let authtoken = {
                token: token,
              };
              // console.log(authtoken);
              await User.findByIdAndUpdate(userid, { $set: authtoken });
            }

            res.json({
              message: "Login Successfull!!!!",
              token,
            });
          } else {
            res.json({
              message: "Password doesn't match!!!",
            });
          }
        });
      } else {
        res.json({
          message: "No user found",
        });
      }
    }
  );
};

//Show the list of Users

const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: `Error has been occurred while retreiving Users List ${error}`,
    });
  }
};

// LogOut

const logOut = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  const userid = decode.id;
  const addtoken = {
    token: "",
  };
  const user = await User.findByIdAndUpdate(userid, { $set: addtoken });
  if (user) {
    res.json({
      message: "logged out successfully",
    });
  } else {
    res.json({
      message: "Error occurred while user try to logging out",
    });
  }
};

// AllLogOut

const logOutAll = async (req, res, next) => {
  try {
    const user = await User.find();
    user.filter(async (token) => {
      if (token != "") {
        await token.updateOne({ $set: { token: "" } });
      }
    });
    res.status(200).json({
      status: "success",
      message: "All users are loged out successfully",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: `Error occurred while logging all users out ${error}`,
    });
  }
};

module.exports = { register, login, getAllUser, logOut, logOutAll };
