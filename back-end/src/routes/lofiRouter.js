import express from "express";
import multer from "multer";
import { prisma } from "../config/db.js"; // if using Prisma

const router = express.Router();

// Storage setup: save files to public/lofi
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/lofi"); // folder where mp3s will live
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // avoid name conflicts
  },
});

const upload = multer({ storage });

// POST route to upload a lofi track
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title } = req.body; // optional title from frontend
    const audioUrl = `/lofi/${req.file.filename}`; // file path served by Express

    // If you’re using Prisma to store in DB
    const track = await prisma.lofi.create({
      data: { title, audioUrl },
    });

    res.json({ message: "Upload successful!", track });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
