const express = require("express");
const router = express.Router();
const {
  getAllProductCategory,
  createProductCategory,
  updateProductCategoryById,
  toggleStatusById,
} = require("../controllers/productCategoryController");
const verifyToken = require("../utils/verifyToken");
const isAdmin = require("../utils/isAdmin");
const {
  validateCategory,
  validateEditCategory,
} = require("../utils/validation/categoryValidation");
const { uploadToS3Middleware } = require("../middlewares/uploadS3Middleware");
const { uploadToCloudinary } = require("../middlewares/uploadMiddleware");


//Get All
router.get("/", getAllProductCategory);

//Create New

router.post(
  "/",
  verifyToken,
  isAdmin,
  uploadToCloudinary("categories", 1),
  validateCategory,
  createProductCategory
);

//update

router.patch(
  "/:id",
  verifyToken,
  isAdmin,
  validateEditCategory,
  updateProductCategoryById
);

//Delete

router.delete("/:id", verifyToken, isAdmin, toggleStatusById);

module.exports = router;
