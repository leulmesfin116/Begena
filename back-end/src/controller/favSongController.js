import { prisma } from "../config/db.js";
const addtoWatchList = async (req, res) => {
  const { userId, songId } = req.body;
  // adding a song
  const songExist = await prisma.favouriteSong.findUnique({
    where: {
      userId_songId: {
        userId,
        songId,
      },
    },
  });
  if (songExist) {
    return res.status(400).json({ message: "The song already exits" });
  }
  const addSong = await prisma.favouriteSong.create({
    data: { userId, songId },
  });
  res.status(201).json({ message: "song added to the favourite" });
};
export { addtoWatchList };
