import multer from "multer";
import path from "path";

// 1️⃣ Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // where files are saved
  },
  filename: (req, file, cb) => {
    // Add timestamp + sanitized original name to avoid collisions and URL issues
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, "-") // replace anything not alphanumeric with -
      .replace(/-+/g, "-")        // replace multiple - with a single -
      .replace(/^-|-$/g, "");     // remove leading/trailing -
    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

// 2️⃣ File type validation
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "audio" && file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else if (file.fieldname === "poster" && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for field ${file.fieldname}`), false);
  }
};

// 3️⃣ Set file size limit (10MB max)
const limits = { fileSize: 10 * 1024 * 1024 }; // 10 MB

// 4️⃣ Create multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;
