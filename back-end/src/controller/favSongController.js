import { prisma } from "../config/db.js";
const addtoWatchList = async (req, res) => {
  const { userId, songId } = req.body;
  try {
    // check if the song exist on the table
    const song = await prisma.song.findUnique({ where: { id: songId } });
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
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
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};
export { addtoWatchList };
