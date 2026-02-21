import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";

const playList = async (req, res) => {
  const userId = req.user.id;

  const { songId } = req.body;
  const songExist = await prisma.song.findUnique({
    where: { songId: songId },
  });
  if (!songExist) {
    return res.status(400).json({ message: "Song does not exist" });
  }
  const playlist = await prisma.playlist.create({
    data: {
      name,
      userId: req.user.id,
    },
  });
};
export { playList };
