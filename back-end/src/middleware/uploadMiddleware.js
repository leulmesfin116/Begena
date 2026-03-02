import multer from "multer";
import path from "path";

// 1️⃣ Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // where files are saved
  },
  filename: (req, file, cb) => {
    // Add timestamp + original name to avoid collisions
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

// 2️⃣ File type validation
const fileFilter = (req, file, cb) => {
  // Allow only audio files
  if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Only audio files are allowed"), false);
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
