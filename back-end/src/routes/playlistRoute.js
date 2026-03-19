import express from "express";
import {
  playList,
  addSongToPlaylist,
  getUserPlaylists,
  getSinglePlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} from "../controller/playlistController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, playList);
router.post("/add-song", authMiddleware, addSongToPlaylist);
router.get("/", authMiddleware, getUserPlaylists);
router.get("/:id", authMiddleware, getSinglePlaylist);
router.delete("/remove-song", authMiddleware, removeSongFromPlaylist);
router.delete("/:id", authMiddleware, deletePlaylist);

export default router;
