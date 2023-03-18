const mongoose = require("mongoose");

const medicalProductSchema = mongoose.Schema(
  {
    medicalProductTypeId: {
      type: mongoose.Schema.ObjectId,
      ref: "medicalProductType_tbl",
      required: [true, "Please, Enter Medical Product TypeId"],
    },
    medicalProductName: {
      type: String,
      required: [true, "Please, Enter Medical Product Name"],
      trim: true,
      unique: true,
    },
    medicalProductPrice: {
      type: Number,
      required: [true, "Please, Enter Medical Product Price"],
    },
    medicalProduct_description: {
      type: String,
      required: [true, "Please, Enter Medical Product Description"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user_tbl",
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user_tbl",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user_tbl",
      },
    ],
    comment: [
      {
        userID: String,
        description: String,
      },
    ],
    photo: String,
    mfgdate: {
      type: Date,
      default: Date.now,
    },
    expDate: {
      type: Date,
      //   default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("medicalProduct_tbl", medicalProductSchema);
