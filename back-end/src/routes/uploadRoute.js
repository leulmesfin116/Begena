// uploadRoute.js
import express from "express";
import upload from "../upload/upload.js"; // our multer + Cloudinary setup

const router = express.Router();

// Single route to upload audio
router.post("/", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Return the Cloudinary URL
  res.json({ url: req.file.path });
});

export default router;
