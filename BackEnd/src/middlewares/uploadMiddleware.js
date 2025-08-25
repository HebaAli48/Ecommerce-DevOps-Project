const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const AppError = require("../utils/AppError");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Cloudinary Storage
function createUploadMiddleware(folderName, maxFiles) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `elegance/uploads/${folderName}`, // ✅ Updated folder path      format: async (req, file) => "png", // Convert all uploads to PNG format
      public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
  });

  // Create the Multer instance
  const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB max file size
    fileFilter: function (req, file, cb) {
      const allowedImageTypes = /jpeg|jpg|png|gif|webp|avif/;
      const isValid = allowedImageTypes.test(file.mimetype);
      if (!isValid) {
        return cb(new AppError("Only images are allowed!", 400), false);
      }
      cb(null, true);
    },
  }).array("files", maxFiles); // Max file count

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return next(new AppError("Too many files uploaded!", 400));
          } else if (err.code === "LIMIT_FILE_SIZE") {
            return next(new AppError("File size exceeds 1MB limit!", 400));
          }
        }
        return next(err);
      }
      next();
    });
  };
}

// Export function
module.exports = {
  uploadToCloudinary: createUploadMiddleware,
};
