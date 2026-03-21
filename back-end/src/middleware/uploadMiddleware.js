import multer from "multer";
import multerStorageCloudinary from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const { CloudinaryStorage } = multerStorageCloudinary;

// Storage configuration (Cloudinary, audio + poster)
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "audio" || file.fieldname === "file") {
      return {
        folder: file.fieldname === "file" ? "lofi" : "songs",
        resource_type: "auto",
      };
    }
    if (file.fieldname === "poster" || file.fieldname === "thumbnail") {
      return {
        folder: file.fieldname === "thumbnail" ? "podcast-thumbnails" : "images",
        resource_type: "image",
      };
    }
    return undefined;
  },
});

// File type validation
const fileFilter = (req, file, cb) => {
  if (
    (file.fieldname === "audio" || file.fieldname === "file") &&
    file.mimetype.startsWith("audio/")
  ) {
    cb(null, true);
    return;
  }
  if (
    (file.fieldname === "poster" || file.fieldname === "thumbnail") &&
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
    return;
  }
  cb(new Error(`Invalid file type for field ${file.fieldname}`), false);
};

// Set file size limit (10MB max)
const limits = { fileSize: 10 * 1024 * 1024 };

const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;
