import { prisma } from "../config/db.js";

const recent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.body;
    
    // If a songId is provided via POST, add/update it in the recently played list
    if (songId) {
      const songExist = await prisma.song.findUnique({
        where: { id: songId },
      });
      if (songExist) {
        await prisma.recentlyplayed.upsert({
          where: {
            userId_songId: { userId, songId },
          },
          update: {
            playedAt: new Date(),
          },
          create: {
            userId,
            songId,
          },
        });
      }
    }

    // Always fetch and return the latest list
    const recentsongs = await prisma.recentlyplayed.findMany({
      where: { userId: req.user.id },
      orderBy: { playedAt: "desc" },
      take: 20,
      include: {
        RecSong: true,
      },
    });

    // Map `RecSong` to the expected UI standard
    const mappedSongs = recentsongs.map(r => r.RecSong);

    res.status(200).json(mappedSongs);
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

export { recent };
