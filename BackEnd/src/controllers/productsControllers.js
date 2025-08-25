const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const { deleteFile } = require("../utils/commonUsedFunction");
const { dataUri } = require("../utils/multer");
const path = require("path");

// ــــــــــــــــــــــــــــــ get All Products ـــــــــــــــــــــــــــــــــــــــــــــ

const getAllProducts = async (req, res, next) => {
  const Products = await Product.find({
    status: "active",
  }).sort({ createdAt: -1 });
  res.status(200).send({
    message: "All products are retrieved sucessfully",
    Products,
  });
};

// ــــــــــــــــــــــــــــــ get All Products in the sub category ـــــــــــــــــــــــــــــــــــــــــــــ

const getAllProductsInSubCategory = async (req, res, next) => {
  try {
    const { subCategoryId } = req.body; // Extract from query params
    // console.log(
    //   "🚀 ~ getAllProductsInSubCategory ~ subCategoryId:",
    //   subCategoryId
    // );

    if (!subCategoryId) {
      return res.status(400).send({ message: "subCategoryId is required" });
    }

    const products = await Product.find({
      status: "active",
      subCategoryId,
    }).sort({ createdAt: -1 });

    res.status(200).send({
      message: "All products are retrieved successfully",
      products,
    });
  } catch (error) {
    next(error);
  }
};

// ــــــــــــــــــــــــــــــ newest Products ـــــــــــــــــــــــــــــــــــــــــــــ

const newestProducts = async (req, res, next) => {
  const newestTenProducts = await Product.find({
    status: "active",
  })
    .sort({ createdAt: -1 })
    .limit(10);
  res.status(200).send({
    message: "Newest 10 products are retrieved sucessfully",
    newestTenProducts,
  });
};
// ــــــــــــــــــــــــــــــ get Product By Id ـــــــــــــــــــــــــــــــــــــــــــــ

const getProductById = async (req, res, next) => {
  const product_id = req.params.id;
  const product = await Product.findById(product_id);
  if (!product) return next(new AppError("Product Not Found!", 400));
  res.status(200).send({
    message: " product  retrieved sucessfully",
    product,
  });
};
// --------------------------------------------------------------------------------------------------------
/**
 * create Product
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, subCategoryId, vendor, price, description } = req.body;

    // Handle multiple files
          const filePaths = req.files?.map((file) => file.path) || [];
      
    
  

    // Create a new Product
    const createdProduct = await Product.create({
      name,
      price,
      subCategoryId,
      vendor,
      price,
      description,
      imgsUrls: filePaths,
    });

    res.status(201).send({
      message: `Product ${name} Created Successfully!`,
      createdProduct,
    });
  } catch (error) {
    console.error("Error in product category creation:", error);
    return next(new AppError(error.message || "Failed to create category", 500));
  }
};
// --------------------------------------------------------------------------------------------------------
/**
 * Edit Product
 */

// const updateProduct = async (req, res, next) => {
//   try {
//     const product_id = req.params.id;
//     const {  name, subCategoryId, vendor, price, description } = req.body;

//     // Find the product in the database
//     const product = await Product.findById(product_id);
//     if (!product) {
//       return next(
//         new AppError("Product With The Provided Id Not Found 🤷‍♀️", 404)
//       );
//     }

//     const filePaths = [];
//     if (req.files && req.files.length > 0) {
//       req.files.forEach((file) => {
//         const filePath = path.join(
//           "uploads",
//           "products",
//           `${req.body. name}_${req.body.subCategoryId}`,
//           file.filename
//         );
//         filePaths.push(filePath);
//       });
//     }
//     // Update product in database
//     const updatedProduct = await Product.findByIdAndUpdate(
//       product_id,
//       {
//          name,
//         subCategoryId,
//         vendor,
//         price,
//         description,
//         imgsUrls: filePaths, // Set updated images
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       message: `Product ${ name} Updated Successfully!`,
//       updatedProduct,
//     });
//   } catch (error) {
//     if (req.files && req.files.length > 0) {
//       req.files.forEach((file) => {
//         const filePath = path.join(
//           "uploads",
//           "products",
//           `${req.body. name}_${req.body.subCategoryId}`,
//           file.filename
//         );
//         deleteFile(filePath);
//       });
//     }
//     console.error("Error updating Cancelation:", error);

//     const errorMsg = error.message || "Error during product updating";
//     return next(new AppError(errorMsg, 400));
//   }
// };

const updateProduct = async (req, res, next) => {
  try {
    const product_id = req.params.id;
    const { name, subCategoryId, vendor, price, description } = req.body;

    let old_images = [];
    if (req.body.old_images?.length) {
      old_images = JSON.parse(req.body.old_images);
    }

    const product = await Product.findById(product_id);
    if (!product)
      return next(
        new AppError("Product With The Provided Id Not Found 🤷‍♀️", 404)
      );

    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map((file) =>
        path.join(
          "uploads",
          "products",
          `${name}_${subCategoryId}`,
          file.filename
        )
      );
    }

    // Ensure the total number of images does not exceed 8
    if (old_images.length + uploadedImages.length > 8) {
      // Delete newly uploaded images before returning the error
      uploadedImages.forEach((filePath) => deleteFile(filePath));
      return next(
        new AppError("Total images (old + new) must not exceed 8.", 400)
      );
    }

    // Update product in database
    const updatedProduct = await Product.findByIdAndUpdate(
      product_id,
      {
        name,
        subCategoryId,
        vendor,
        price,
        description,
        imgsUrls: [...old_images, ...uploadedImages],
      },
      { new: true }
    );

    res.status(200).json({
      message: `Product ${name} Updated Successfully!`,
      updatedProduct,
    });
  } catch (error) {
    // Cleanup newly uploaded images on error
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        deleteFile(
          path.join(
            "uploads",
            "products",
            `${req.body.name}_${req.body.subCategoryId}`,
            file.filename
          )
        );
      });
    }

    console.error("Error updating product:", error);
    return next(
      new AppError(error.message || "Error during product updating", 400)
    );
  }
};

// --------------------------------------------------------------------------------------------------------
/**
 * Delete Product
 */

const toggleStatusById = async (req, res, next) => {
  const { id } = req.params;

  // Find  by ID
  const foundProduct = await getAnyById(Product, id, res);

  if (!foundProduct) return;
  // Toggle the status based on the current value
  const newStatus = foundProduct.status == "active" ? "inActive" : "active";

  // Update the status
  foundProduct.status = newStatus;
  await foundProduct.save();
  // console.log(newStatus);
  console.log("🚀 ~ toggleStatusById ~ foundProduct:", foundProduct);

  // Respond with the updated Product
  res.status(200).json({
    message: "status changed sucessfully!", // Make sure this key exists in your translations
    foundProduct,
  });
};

module.exports = {
  getAllProducts,
  getAllProductsInSubCategory,
  newestProducts,

  getProductById,
  createProduct,
  updateProduct,
  toggleStatusById,
};
