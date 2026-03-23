import { prisma } from "../config/db.js";
const addtoFav = async (req, res) => {
  const { songId } = req.body;
  const userId = req.user.id;
  try {
    const song = await prisma.song.findUnique({ where: { id: songId } });
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const songExist = await prisma.favouriteSong.findUnique({
      where: {
        userId_songId: {
          userId,
          songId,
        },
      },
    });

    if (songExist) {
      await prisma.favouriteSong.delete({
        where: {
          userId_songId: {
            userId,
            songId,
          },
        },
      });
      return res
        .status(200)
        .json({ message: "Song removed from favourites", removed: true });
    }

    await prisma.favouriteSong.create({
      data: { userId, songId },
    });
    res
      .status(201)
      .json({ message: "Song added to the favourite", removed: false });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};
const getFavorites = async (req, res) => {
  const userId = req.user.id;
  try {
    const favorites = await prisma.favouriteSong.findMany({
      where: { userId },
      include: {
        favsong: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const songs = favorites
      .map((fav) => fav.favsong)
      .filter((song) => song !== null);
    res.status(200).json(songs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch favorites", error: err.message });
  }
};

export { addtoFav, getFavorites };
