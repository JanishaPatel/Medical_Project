const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please, Enter Name"],
      trim: true,
      validate: [validator.isAlpha, "User name must be alphabet"],
    },
    email: {
      type: String,
      required: [true, "Please, Enter Email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Please, Enter Phone"],
      minlength: 10,
    },
    password: {
      type: String,
      required: [true, "Please, Enter Password"],
      //   maxlength: 8,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user_tbl", userSchema);
module.exports = User;
