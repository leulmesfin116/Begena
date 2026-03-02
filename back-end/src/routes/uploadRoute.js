import express from "express";
import upload from "../middleware/uploadMiddleware.js"; // your middleware

const router = express.Router();

// Single audio file upload
router.post("/upload", upload.single("audio"), (req, res) => {
  // If no file, return error
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // File uploaded successfully
  res.json({
    message: "File uploaded successfully",
    file: req.file, // info about the uploaded file
  });
});

export default router;
