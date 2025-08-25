const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const AppError = require("../utils/AppError");
require("dotenv").config();

// Configure S3 Client (AWS SDK v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// Function to check file type
const checkFileType = (file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp|avif/;
  const isImage = allowedImageTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (!isImage) {
    return cb(new AppError("File type not allowed. Upload an image.", 400), false);
  }

  cb(null, true);
};

// Function to create multer upload middleware
const createUploadMiddleware = (Length) => {
  return multer({
    storage,
    limits: { fileSize: 1000 * 1024 }, // 1000 KB limit
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    },
  }).array("files", Length);
};

// Function to upload a file to S3
const uploadToS3 = async (file, folderName) => {
  try {
    if (!file) throw new AppError("No file provided", 400);

    // Ensure that file.originalname is a valid string
    if (!file.originalname) throw new AppError("Invalid file name", 400);

    const fileKey = `uploads/${folderName}/${uuidv4()}-${file.originalname}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Upload to S3
    await s3.send(new PutObjectCommand(uploadParams));

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  } catch (error) {
    console.error("S3 Upload Error:", error.message);
    throw new AppError(`Failed to upload file to S3: ${error.message}`, 500);
  }
};

// Middleware to process S3 uploads
const uploadToS3Middleware = (folderName, Length) => {
  const upload = createUploadMiddleware(Length);

  return async (req, res, next) => {
    upload(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return next(new AppError("File upload error", 400));
        }
        return next(err);
      }

      if (!req.files || req.files.length > Length) {
        return next(new AppError("Invalid number of files", 400));
      }

      try {
        const uploadedFiles = await Promise.all(
          req.files.map((file) => uploadToS3(file, folderName))
        );

        req.uploadedFiles = uploadedFiles;
        next();
      } catch (error) {
        next(error);
      }
    });
  };
};

module.exports = {
  uploadToS3Middleware,
};
