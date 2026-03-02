import express from "express";
import { upload } from "../upload/upload.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/", upload.single("audio"), async (req, res) => {
  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  res.json({ url: fileUrl });
});
router.post("/upload", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({ url: req.file.path });
});

export default router;
