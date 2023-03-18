const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const medicalProductTypeModel = require("../models/medicalProductTypeModel");
const medicalProductModel = require("../models/medicalProductModel");
// const authenticate = require("./../middleware/authenticate");

//Adding Medical Product Type

const addMedicalProductType = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, process.env.JWT_SECRET);

  givenBy = decode.id;

  let medicalProductType = await new medicalProductTypeModel({
    medicalProductType: req.body.medicalProductType,
    givenBy: givenBy,
  });
  medicalProductType
    .save()
    .then((medicalProductType) => {
      res.json({
        message: "Medical Product Type successfully Added !!",
      });
    })
    .catch((error) => {
      res.json({
        message: `Error occurred while adding Medical Product Type ${error}`,
      });
    });
};

// Updating Medical Product Type

const updateMedicalProductType = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, process.env.JWT_SECRET);

  givenBy = decode.id;

  let medicalProductTypeId = req.params.medicalProductTypeID;
  let updateMedicalProductType = {
    medicalProductType: req.body.medicalProductType,
    givenBy: givenBy,
  };
  medicalProductTypeModel
    .findByIdAndUpdate(medicalProductTypeId, { $set: updateMedicalProductType })
    .then(() => {
      res.json({
        status: "success",
        message: "Medical Product Type updated Successfully!!",
      });
    })
    .catch((error) => {
      res.json({
        status: "fail",
        message: `An error occurred while updating the Medical Product type ${error}`,
      });
    });
};

// Deleting Medical Product Type

// const deleteMedicalProductType = async (req, res, next) => {
//   try {
//     const medicalProductTypeId = req.params.medicalProductTypeID;
//     const product = await medicalProductTypeModel.findByIdAndDelete(
//       medicalProductTypeId
//     );
//     if (product) {
//       res.status(200).json({
//         status: "success",
//         message: "Medical Product Type deleted Successfully!!",
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       message: `Error  occurred while deleting Medical Product Type ${error}`,
//     });
//   }
// };

const deleteMedicalProductType = async (req, res, next) => {
  try {
    const medicalProductTypeId = req.params.medicalProductTypeID;
    await medicalProductModel
      .findOne({
        medicalProductTypeId: medicalProductTypeId,
      })
      .then(async(productId) => {
        if (productId) {
          res.status(400).json({
            status: "fail",
            message: "This producttype contain some product first delete that",
          });
        } else {
          const product =
            await medicalProductTypeModel.findByIdAndDelete(medicalProductTypeId);
          if (product) {
            res.status(200).json({
              status: "success",
              message: "Medical Product Type deleted Successfully!!",
            });
          }
        }
      });
  } catch (error) {
    res.json(400).json({
      message: `Error  occurred while deleting Medical Product Type ${error}`,
    });
  }
};

//Getting All Medical Product Types

const getAllMedicalProductType = async (req, res, next) => {
  try {
    const productType = await medicalProductTypeModel
      .find()
      .populate({ path: "givenBy", select: ["_id", "name"] });
    res.status(200).json({
      status: "success",
      results: productType.length,
      data: { productType },
    });
  } catch (error) {
    res.status(400).json({
      message: `Error  occurred while returning Medical Product Type ${error}`,
    });
  }
};

module.exports = {
  addMedicalProductType,
  updateMedicalProductType,
  deleteMedicalProductType,
  getAllMedicalProductType,
};
