const express = require("express");
const ProductCategory = require("../models/ProductCategory");
const AppError = require("../utils/AppError");
const verifyToken = require("../utils/verifyToken");
const { getAnyById } = require("../utils/commonUsedFunction");
const path = require("path");

// ـــــــــــــــــــــــــــــــــــ get all  ProductCategories ــــــــــــــــــــــــــــــــــ
const getAllProductCategory = async (req, res, next) => {
  const productCategories = await ProductCategory.find({
    status: "active",
  }).sort({ createdAt: 1 });
  console.log("productCategories", productCategories.length);

  res.status(200).send({
    message: "All categories are retrieved sucessfully",
    productCategories,
  });
};

// ــــــــــــــــــــــــــــــ Create product category ـــــــــــــــــــــــــــــــــــــــــــــ

const createProductCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Extract uploaded file URLs from Cloudinary
    const filePaths = req.files?.map((file) => file.path) || [];

    // If there are files, set the first one as the main image
    const mainImage = filePaths.length > 0 ? filePaths[0] : null;

    // Ensure name is provided
    if (!name) {
      return next(new AppError("Category name is required!", 400));
    }

    // Ensure an image is uploaded
    if (!mainImage) {
      return next(new AppError("Image is required!", 400));
    }

    // Create a new product category in the database
    const newProductCategory = await ProductCategory.create({
      name,
      description,
      image: mainImage, // Store the first file as the main image
    });


    // Send response
    res.status(201).json({
      message: "Product category has been created successfully",
      category: newProductCategory,
    });
  } catch (error) {
    console.error("Error in product category creation:", error);
    return next(new AppError(error.message || "Failed to create category", 500));
  }
};


// ـــــــــــــــــــــــــــــــــــ update the ProductCategory by id ــــــــــــــــــــــــــــــــــ
const updateProductCategoryById = async (req, res, next) => {
  const { id } = req.params;

  const { name, description } = req.body;

  // Find  by ID
  const foundProductcategory = await getAnyById(ProductCategory, id, res);
  if (!foundProductcategory) return;
  const filePaths = [];
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      const filePath = path.join(
        "uploads",
        "categories",
        `${req.body.name}`,
        file.filename
      );
      filePaths.push(filePath);
    });
  }
  const updatedProductCategory = await ProductCategory.findByIdAndUpdate(id, {
    name,
    description,
    image: filePaths[0],
  });
  res.status(200).send({
    message: `category With Id ${id} Has Been updated`, // Make sure this key exists in your translations

    updatedProductCategory,
  });
};
//_________________________________//toggle between activation  by Id //_______________________________//

const toggleStatusById = async (req, res, next) => {
  const { id } = req.params;

  // Find  by ID
  const foundProductcategory = await getAnyById(ProductCategory, id, res);

  if (!foundProductcategory) return;
  // Toggle the status based on the current value
  const newStatus =
    foundProductcategory.status == "active" ? "inActive" : "active";

  // Update the status
  foundProductcategory.status = newStatus;
  await foundProductcategory.save();
  // console.log(newStatus);
  console.log(
    "🚀 ~ toggleStatusById ~ foundProductcategory:",
    foundProductcategory
  );

  // Respond with the updated ProductCategory
  res.status(200).json({
    message: "status changed sucessfully!", // Make sure this key exists in your translations
    foundProductcategory,
  });
};

module.exports = {
  getAllProductCategory,
  createProductCategory,
  updateProductCategoryById,
  toggleStatusById,
};
