const express = require("express");
const ProductSubCategory = require("../models/ProductSubCategory");
const { getAnyById } = require("../utils/commonUsedFunction");
const path = require("path");
const _ = require("lodash");

// ـــــــــــــــــــــــــــــــــــ get all  ProductCategories ــــــــــــــــــــــــــــــــــ

const getAllProductSubCategory = async (req, res, next) => {
  try {
    // Retrieve all active product subcategories and sort by creation date
    const productSubCategories = await ProductSubCategory.find({
      status: "active",
    }).sort({ createdAt: 1 });

    // console.log("productSubCategories", productSubCategories[0]);

    // Group subcategories by category name using lodash
    const groupedSubCategories = _.groupBy(
      productSubCategories,
      (subCategory) => subCategory.category?.name // Group by category name
    );
    // console.log(
    //   "🚀 ~ getAllProductSubCategory ~ groupedSubCategories:",
    //   groupedSubCategories
    // );

    // Transform the grouped data into the desired format
    const result = Object.keys(groupedSubCategories).map((categoryName) => {
      return {
        name: categoryName, // Category name
        categoryId: groupedSubCategories[categoryName][0].categoryId, // Category name
        subcategories: groupedSubCategories[categoryName].map(
          (subCategory) => ({
            name: subCategory.name, // Subcategory name
            image: subCategory.image, // Subcategory image
            _id: subCategory._id, // Subcategory image
          })
        ),
      };
    });

    res.status(200).send({
      message: "All categories are retrieved successfully",
      categories: result, // Return the transformed data
    });
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
};

// ــــــــــــــــــــــــــــــ Create product sub category ـــــــــــــــــــــــــــــــــــــــــــــ
const createProductSubCategory = async (req, res, next) => {
  try {
    const { name, categoryId } = req.body;
      const filePaths = req.files?.map((file) => file.path) || [];
  
      // If there are files, set the first one as the main image
      const mainImage = filePaths.length > 0 ? filePaths[0] : null;
  
    let newProductSubCategory = await ProductSubCategory.create({
      name,
      image: mainImage, // Store the first file as the main image
      categoryId,
    });
    res.status(201).json({
      message: "product sub category has been Created",
      newProductSubCategory,
    });
  } catch (error) {
    console.error("Error in product category creation:", error);
    return next(new AppError(error.message || "Failed to create category", 500));
  }
};
// ـــــــــــــــــــــــــــــــــــ update the ProductSubCategory by id ــــــــــــــــــــــــــــــــــ
const updateProductSubCategoryById = async (req, res, next) => {
  const { id } = req.params;

  const { name, image, categoryId } = req.body;
  // Find  by ID
  const foundProductSubCategory = await getAnyById(ProductSubCategory, id, res);
  if (!foundProductSubCategory) return;

  const updatedProductSubCategory = await ProductSubCategory.findByIdAndUpdate(
    id,
    {
      name,
      image,
      categoryId,
    },
    { new: true }
  );
  res.status(201).send({
    message: `category With Id ${id} Has Been updated`, // Make sure this key exists in your translations

    updatedProductSubCategory,
  });
};
//_________________________________//toggle between activation  by Id //_______________________________//

const toggleStatusById = async (req, res, next) => {
  const { id } = req.params;
  // Find  by ID
  const foundProductSubCategory = await getAnyById(ProductSubCategory, id, res);
  if (!foundProductSubCategory) return;
  // Toggle the status based on the current value
  const newStatus =
    foundProductSubCategory.status == "active" ? "inActive" : "active";

  // Update the status
  foundProductSubCategory.status = newStatus;
  await foundProductSubCategory.save();
  // console.log(newStatus);

  // Respond with the updated ProductSubCategory
  res.status(200).json({
    message: "status changed sucessfully!", // Make sure this key exists in your translations
    foundProductSubCategory,
  });
};

module.exports = {
  getAllProductSubCategory,
  createProductSubCategory,
  updateProductSubCategoryById,
  toggleStatusById,
};
