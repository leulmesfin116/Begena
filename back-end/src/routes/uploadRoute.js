import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import fs from "fs";

const router = express.Router();

// Upload a song
router.post(
  "/upload",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ]),
  (req, res) => {
    const audioFile = req.files.audio?.[0];
    const posterFile = req.files.poster?.[0];
    const title = req.body.title;

    if (!audioFile || !title) {
      return res.status(400).json({ error: "Audio file and title required" });
    }

    res.json({
      message: "Song uploaded successfully",
      title,
      audioUrl: `http://localhost:5000/uploads/${audioFile.filename}`,
      posterUrl: posterFile
        ? `http://localhost:5000/uploads/${posterFile.filename}`
        : "/default-poster.jpg",
    });
  },
);

// Get all uploaded songs
router.get("/uploads", (req, res) => {
  const directoryPath = "uploads";

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to scan files" });
    }

    const songs = files.map((file, index) => ({
      id: index,
      title: file,
      url: `http://localhost:5000/uploads/${file}`,
    }));

    res.json(songs);
  });
});

export default router;
