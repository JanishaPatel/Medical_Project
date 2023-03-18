const express = require("express");
const router = express.Router();
const medicalProductTypeController = require("../controllers/medicalProductTypeController");
const medicalProductController = require("./../controllers/medicalProductController");
const authenticate = require("../middleware/authenticate");
const upload = require("./../middleware/upload");

// Medical Product Type

router.post(
  "/addMedicalProductType",authenticate,
  medicalProductTypeController.addMedicalProductType
);
router.post(
  "/updateMedicalProductType/:medicalProductTypeID",
  authenticate,
  medicalProductTypeController.updateMedicalProductType
);
router.delete(
  "/deleteMedicalProductType/:medicalProductTypeID",
  authenticate,
  medicalProductTypeController.deleteMedicalProductType
);

router.get(
  "/getAllMedicalProductType",
  authenticate,
  medicalProductTypeController.getAllMedicalProductType
);

// Medical Products

router.post(
  "/addMedicalProduct",authenticate,
  upload,
  medicalProductController.addMedicalProduct
);

router.post(
  "/updateMedicalProduct/:productID",authenticate,
  medicalProductController.updateMedicalProduct
);

router.delete(
  "/deleteMedicalProduct/:productID",authenticate,
  medicalProductController.deleteMedicalProduct
);

router.get(
  "/getAllMedicalProduct",
  // authenticate,
  medicalProductController.getAllMedicalProduct
);

router.get(
  "/getAllProductByProductType/:productTypeName",
  medicalProductController.getAllProductByProductType
);

router.post("/addProductLike/:productid", medicalProductController.addLike);
router.get("/mostLikedProduct", medicalProductController.mostLikedProduct);
router.post(
  "/addProductComment/:productid",
  medicalProductController.addProductComment
);
router.get(
  "/mostRecentManufacturedProduct",
  medicalProductController.mostRecentManufacturedProduct
);

router.get(
  "/getAllProductPageWise",
  medicalProductController.getAllProductPageWise
);

router.get(
  "/getProductById/:productId",
  medicalProductController.getProductById
);

router.get(
  "/getProductBySearch/:key",
  medicalProductController.getProductBySearch
);

module.exports = router;
