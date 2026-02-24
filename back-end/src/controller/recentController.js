import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
const recent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.body;
    const songExist = await prisma.song.findUnique({
      where: { id: songId },
    });
    if (!songExist) {
      return res.status(401).json({ message: "the song doesnt exist" });
    }
    // adding in to the playlist
    const newsong = await prisma.recentlyplayed.create({
      data: {
        userId: userId,
        songId,
      },
    });
    const recentsongs = await prisma.recentlyplayed.findMany({
      where: { userId: req.user.id },
      orderBy: { playedAt: "desc" },
      take: 11,
      include: {
        Recsong: true,
      },
    });
    res.status(200).json({ message: "song are added" });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};
export { recent };
