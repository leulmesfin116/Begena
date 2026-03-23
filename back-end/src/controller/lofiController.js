import { prisma } from "../config/db.js";

export const uploadLofi = async (req, res) => {
  try {
    const { title } = req.body;
    const files = req.files;

    if (!files?.file || !files.file[0]) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioUrl = files.file[0].path;
    let posterUrl = "/default-poster.jpg";

    if (files.poster && files.poster[0]) {
      posterUrl = files.poster[0].path;
    }

    const track = await prisma.song.create({
      data: {
        title: title || "Untitled Lofi",
        artist: "Lofi Community",
        audioUrl,
        posterUrl,
        genres: ["lofi"],
        createdBy: req.user.id,
      },
    });

    res.json({ message: "Upload successful!", track });
  } catch (error) {
    console.error("Lofi upload error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getLofiTracks = async (req, res) => {
  try {
    const tracks = await prisma.song.findMany({
      where: {
        genres: {
          has: "lofi",
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(tracks);
  } catch (error) {
    console.error("Lofi fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};
