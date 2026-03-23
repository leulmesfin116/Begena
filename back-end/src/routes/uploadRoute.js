import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { prisma } from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// GET all songs
router.get("/uploads", async (req, res) => {
  try {
    const songs = await prisma.song.findMany({
      orderBy: [{ artist: "asc" }, { title: "asc" }, { createdAt: "desc" }],
    });
    res.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});

// UPLOAD song (audio + poster)
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
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

      const audioUrl = audioFile.path;
      const posterUrl = posterFile
        ? posterFile.path
        : "https://via.placeholder.com/150";

      const newSong = await prisma.song.create({
        data: {
          title,
          artist,
          audioUrl,
          posterUrl,
          createdBy: req.user.id,
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
router.delete(
  "/upload/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const song = await prisma.song.findUnique({ where: { id } });

      if (!song) {
        return res.status(404).json({ error: "Song not found" });
      }

      // Delete files from Cloudinary if they exist
      const deleteCloudinaryFile = async (url) => {
        if (!url) return;
        try {
          const parts = url.split("/");
          const filenameWithExt = parts[parts.length - 1];
          const public_id = filenameWithExt.split(".")[0];
          await cloudinary.uploader.destroy(public_id, {
            resource_type: "auto",
          });
        } catch (err) {
          console.warn("Could not delete Cloudinary file:", err.message);
        }
      };

      await deleteCloudinaryFile(song.audioUrl);
      await deleteCloudinaryFile(song.posterUrl);

      // Delete relations first
      await prisma.favouriteSong.deleteMany({ where: { songId: id } });
      await prisma.playlistSong.deleteMany({ where: { songId: id } });

      // Delete song record
      await prisma.song.delete({ where: { id } });

      res.json({ message: "Song and associated files deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      res
        .status(500)
        .json({ error: "Failed to delete song: " + error.message });
    }
  },
);

export default router;
