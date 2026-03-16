import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { prisma } from "../config/db.js";

const router = express.Router();

// Upload a song
router.post(
  "/upload",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const audioFile = req.files?.audio?.[0];
      const posterFile = req.files?.poster?.[0];
      const title = req.body.title;
      const artist = req.body.artist || "Unknown Artist";

      if (!audioFile || !title) {
        return res
          .status(400)
          .json({ error: "Audio file and title are required" });
      }

      const audioUrl = `http://localhost:5000/uploads/${audioFile.filename}`;
      const posterUrl = posterFile
        ? `http://localhost:5000/uploads/${posterFile.filename}`
        : "/default-poster.jpg";

      // Save to database
      const newSong = await prisma.song.create({
        data: {
          title,
          artist,
          audioUrl,
          posterUrl,
          createdBy: "admin", // Assuming admin or creator ID for now
        },
      });

      res.json({
        message: "Song uploaded successfully",
        song: newSong,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload song" });
    }
  },
);

// Get all uploaded songs
router.get("/uploads", async (req, res) => {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(songs);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});
export default router;
