import { prisma } from "../config/db.js";

const Podcast = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const podcasts = await prisma.podcast.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });
    res.json(podcasts);
  } catch (error) {
    console.error("Podcast fetch error:", error);
    res.status(500).json({ error: "Failed to fetch podcasts" });
  }
};

export const uploadPodcast = async (req, res) => {
  try {
    const { title, description, youtubeUrl, thumbnail } = req.body;
    if (!title || !youtubeUrl) {
      return res.status(400).json({ error: "Title and YouTube URL are required" });
    }

    const newPodcast = await prisma.podcast.create({
      data: {
        title,
        description: description || "",
        youtubeUrl,
        thumbnail: req.file?.path || thumbnail || null,
      },
    });

    res.status(201).json({ message: "Podcast uploaded successfully", podcast: newPodcast });
  } catch (error) {
    console.error("Podcast upload error:", error);
    res.status(500).json({ error: "Failed to upload podcast" });
  }
};

export const deletePodcast = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.podcast.delete({
      where: { id },
    });
    res.json({ message: "Podcast deleted successfully" });
  } catch (error) {
    console.error("Podcast delete error:", error);
    res.status(500).json({ error: "Failed to delete podcast" });
  }
};

export { Podcast };
