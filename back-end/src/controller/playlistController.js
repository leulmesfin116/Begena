import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";

const playList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, songId } = req.body;

    const songExist = await prisma.song.findUnique({
      where: { id: songId },
    });
    if (!songExist) {
      return res.status(400).json({ message: "Song does not exist" });
    }
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "playlist require name" });
    }
    const playlist = await prisma.playlist.create({
      data: {
        name,
        userId: userId,
      },
    });
    await prisma.playlistSong.create({
      data: {
        playlistId: playlist.id,
        songId: songId,
      },
    });
    res.status(201).json({
      message: "the playlist created",
      playlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};
export { playList };
