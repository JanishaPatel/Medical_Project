const mongoose = require("mongoose");
const validator = require("validator");

const medicalProductTypeSchema = mongoose.Schema(
  {
    medicalProductType: {
      type: String,
      required: [true, "Please, Enter medical product type"],
      trim: true,
      unique: true,
      validate: [validator.isAlpha, "Medical Product Type must be characters"],
    },
    givenBy: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Please, Enter users id"],
      ref: "user_tbl",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "medicalProductType_tbl",
  medicalProductTypeSchema
);
