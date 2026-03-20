import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { prisma } from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import path from "path";
import fs from "fs";

const router = express.Router();

router.get("/uploads", async (req, res) => {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});

router.post(
  "/upload",
  authMiddleware, // ensure user is logged in
  adminMiddleware, // ensure user is ADMIN
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
        : "https://via.placeholder.com/150"; // Default poster if none provided

      const newSong = await prisma.song.create({
        data: {
          title,
          artist,
          audioUrl,
          posterUrl,
          createdBy: req.user.id, // store admin ID
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

// DELETE song (Admin only)
router.delete("/upload/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const song = await prisma.song.findUnique({ where: { id } });

    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Attempt to delete files
    const deleteFile = (url) => {
      if (url && url.includes("/uploads/")) {
        const filename = url.split("/uploads/").pop();
        const filePath = path.join(process.cwd(), "uploads", filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);
        }
      }
    };

    deleteFile(song.audioUrl);
    deleteFile(song.posterUrl);

    // Delete relations first to avoid constraint issues
    await prisma.favouriteSong.deleteMany({ where: { songId: id } });
    await prisma.playlistSong.deleteMany({ where: { songId: id } });

    // Delete from database
    await prisma.song.delete({ where: { id } });

    res.json({ message: "Song and associated files deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete song: " + error.message });
  }
});

export default router;
