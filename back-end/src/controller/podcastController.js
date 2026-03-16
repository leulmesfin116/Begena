import { prisma } from "../config/db.js";

const Podcast = async (req, res) => {
  const podcasts = await prisma.podcast.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(podcasts);
};
export { Podcast };
