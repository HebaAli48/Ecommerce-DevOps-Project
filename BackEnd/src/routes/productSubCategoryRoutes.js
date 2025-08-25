const express = require("express");
const router = express.Router();
const {
  getAllProductSubCategory,
  createProductSubCategory,
  updateProductSubCategoryById,
  toggleStatusById,
} = require("../controllers/productSubCategoryController");
const verifyToken = require("../utils/verifyToken");

const {
  validateSubCategory,
  validateEditSubCategory,
} = require("../utils/validation/subCategoryValidation");
const isAdmin = require("../utils/isAdmin");
const { uploadToS3Middleware } = require("../middlewares/uploadS3Middleware");
const { uploadToCloudinary } = require("../middlewares/uploadMiddleware");


//Get All
router.get("/", getAllProductSubCategory);

//Create New
//
router.post(
  "/",
  verifyToken,
  isAdmin,
  uploadToCloudinary("sub_categories", 1),

  validateSubCategory,
  createProductSubCategory
);

//update

router.patch(
  "/:id",
  verifyToken,
  isAdmin,
  validateEditSubCategory,
  updateProductSubCategoryById
);

//Delete

router.delete("/:id", verifyToken, isAdmin, toggleStatusById);

module.exports = router;
