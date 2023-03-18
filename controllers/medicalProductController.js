const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const medicalProductModel = require("../models/medicalProductModel");
const medicalProductTypeModel = require("./../models/medicalProductTypeModel");
var ObjectId = require("mongodb").ObjectId;

//Adding Medical Product

const addMedicalProduct = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, process.env.JWT_SECRET);

  loginBy = decode.id;

  const medicalProduct = await new medicalProductModel({
    medicalProductTypeId: req.body.medicalProductTypeId,
    medicalProductName: req.body.productName,
    medicalProductPrice: req.body.productPrice,
    medicalProduct_description: req.body.product_description,
    expDate: new Date(req.body.expDate),
    userId: loginBy,
  });
  if (req.files.length > 0) {
    medicalProduct.photo = req.files.map((item) => item.path).join(",");
  }
  medicalProduct
    .save()
    .then((medicalProduct) => {
      res.json({
        message: "Medical Product Added Successfully!!",
      });
    })
    .catch((error) => {
      res.json({
        message: `Error occurred while adding Medical Product ${error}`,
      });
    });
};

// Updating Medical Product

const updateMedicalProduct = async (req, res, next) => {
  try {
    const medicalProductId = req.params.productID;
    const updates = req.body;
    const result = await medicalProductModel.findByIdAndUpdate(
      medicalProductId,
      { $set: updates }
    );
    res.send(result);
  } catch (error) {
    res.json({
      status: "fail",
      message: `An error occurred while updating the Medical Product ${error}`,
    });
  }
};

// Deleting Medical Product

const deleteMedicalProduct = async (req, res, next) => {
  try {
    const medicalProductId = req.params.productID;
    const product = await medicalProductModel.findByIdAndDelete(
      medicalProductId
    );
    res.json({
      status: "success",
      message: "Medical Product deleted Successfully!!",
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: `An error occurred while deleting the Medical Product ${error}`,
    });
  }
};

//Getting All Medical Product

const getAllMedicalProduct = async (req, res, next) => {
  try {
    const products = await medicalProductModel
      .find()
      .populate({
        path: "userId",
        select: ["_id", "name"],
      })
      .populate({
        path: "medicalProductTypeId",
        select: ["_id", "medicalProductType"],
      });
    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: `Error has been occurred while retreiving Medical Products ${error}`,
    });
  }
};

// Get All Medical Products Page Wise

const getAllProductPageWise = async (req, res, next) => {
  try {
    const { page = 1, limit = 2 } = req.query;
    const data = await medicalProductModel
      .find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-__v")
      .populate({
        path: "medicalProductTypeId",
        select: ["_id", "medicalProductType"],
      })
      .populate({ path: "userId", select: ["_id", "name"] });
    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: `An Error Occured: ${error}`,
    });
  }
};

// Get All Medical Products By Medical Product Type

const getAllProductByProductType = async (req, res, next) => {
  try {
    // const productTypeId = req.params.productTypeId;

    // const { productTypeName } = req.body;
    const { productTypeName } = req.params;
    const productFound = await medicalProductTypeModel.findOne({
      medicalProductType: productTypeName,
    });
    if (productFound) {
      const data = await medicalProductModel.aggregate([
        {
          $lookup: {
            from: "medicalproducttype_tbls",
            localField: "medicalProductTypeId",
            foreignField: "_id",
            as: "result",
          },
        },
        { $unwind: "$result" },
        {
          $match: {
            "result.medicalProductType": {
              $in: [new RegExp(req.params.productTypeName, "i")],
            },
          },
        },
        {
          $project: {
            medicalProductName: 1,
            medicalProductPrice: 1,
            medicalProductType: "$result.medicalProductType",
          },
        },
      ]);
      res.status(200).json({
        status: "success",
        results: data.length,
        data: {
          data,
        },
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Medical Product type does not exist",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: `Error occurred ${error}`,
    });
  }
};

//Like and Dislike Medical Product

const addLike = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, process.env.JWT_SECRET);

  loginBy = decode.id;

  const product = await medicalProductModel.find({
    _id: req.params.productid,
    likes: loginBy,
  });

  const { productid } = req.params;

  if (product.length > 0) {
    try {
      const record = await medicalProductModel.findByIdAndUpdate(productid, {
        $pull: { likes: loginBy },
        $push: { dislikes: loginBy },
      });
      res.json({
        message: `You disliked ${productid} product ...`,
      });
    } catch (error) {
      res.status(404).json({
        message: `Error occur while liking product...${error.message}`,
      });
    }
  } else {
    const record = await medicalProductModel.updateOne(
      { _id: productid },
      { $push: { likes: loginBy }, $pull: { dislikes: loginBy } }
    );

    res.json({
      message: `You Liked Product ...`,
    });
  }
};

//Most Liked Medical Product

const mostLikedProduct = async (req, res) => {
  try {
    const products = await medicalProductModel.find().select("-__v");
    const like = products.filter((pid) => {
      return pid.likes.length > 0;
    });
    console.log(like);

    const product = products.sort((x, y) => {
      return y.likes.length - x.likes.length;
    });
    res.status(200).send(product[0]);
  } catch (e) {
    res.status(400).send(e);
  }
};

// Adding comment to product
/**
 *
 * @param {*} req
 * @param {*} res
 */
const addProductComment = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, process.env.JWT_SECRET);

  loginBy = decode.id;

  try {
    const { productid } = req.params;
    const comment = await medicalProductModel.updateOne(
      { _id: productid },
      {
        $push: {
          comment: [{ userID: loginBy, description: req.body.description }],
        },
      }
    );
    res.status(200).json({
      status: "success",
      message: "Comment added successfully...",
      // data: { comment },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: `Error occur while commenting on Bike...${error}`,
    });
  }
};

// Most Recent Manufactured Product

const mostRecentManufacturedProduct = async (req, res, next) => {
  try {
    const products = await medicalProductModel.find();
    const product = products.sort((x, y) => {
      return y.mfgdate - x.mfgdate;
    });
    res.status(200).json({
      status: "success",
      data: {
        product: product[0],
      },
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: `Error occurred while fetching most recent manufactured product detail ${error}`,
    });
  }
};

// Get Product By Id

const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await medicalProductModel.findById(productId);
    res.status(200).json({ status: "success", data: { product } });
  } catch (error) {
    res
      .status(400)
      .json({ status: "fail", message: `Invalid Product Id ${error}` });
  }
};

// Product's List with multiple search

const getProductBySearch = async (req, res, next) => {
  try {
    const key = req.params.key;
    let product = await medicalProductModel.find({
      $or: [{ medicalProductName: { $regex: key } }],
    });
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    res.json({
      staus: "fail",
      message: `Error occurred while Serching Product By key ${error}`,
    });
  }
};

module.exports = {
  addMedicalProduct,
  updateMedicalProduct,
  deleteMedicalProduct,
  getAllMedicalProduct,
  getAllProductByProductType,
  addLike,
  mostLikedProduct,
  addProductComment,
  mostRecentManufacturedProduct,
  getAllProductPageWise,
  getProductById,
  getProductBySearch,
};
