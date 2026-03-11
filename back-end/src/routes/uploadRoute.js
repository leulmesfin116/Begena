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
    const artist = req.body.artist || "Unknown Artist";

    if (!audioFile || !title) {
      return res
        .status(400)
        .json({ error: "Audio file and title are required" });
    }

    res.json({
      message: "Song uploaded successfully",
      title,
      artist,
      audioUrl: `http://localhost:5000/uploads/${audioFile.filename}`,
      posterUrl: posterFile
        ? `http://localhost:5000/uploads/${posterFile.filename}`
        : "/default-poster.jpg",
    });
  },
);

// Get all uploaded songs
router.get("/uploads", (req, res) => {
  const uploadsDir = "uploads";

  const files = fs.readdirSync(uploadsDir);

  const songs = files
    .filter((f) => f.endsWith(".mp3") || f.endsWith(".wav"))
    .map((file, index) => ({
      id: index,
      title: file.replace(/\.[^/.]+$/, ""),
      artist: "Unknown Artist",
      audioUrl: `http://localhost:5000/uploads/${file}`,
      posterUrl: "/default-poster.jpg",
    }));

  res.json(songs);
});
export default router;
