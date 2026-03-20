import { prisma } from "../config/db.js";

export const uploadLofi = async (req, res) => {
  try {
    const { title } = req.body;
    const files = req.files;

    if (!files?.file || !files.file[0]) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioUrl = `http://localhost:5000/lofi/${files.file[0].filename}`;
    let posterUrl = "/default-poster.jpg";

    if (files.poster && files.poster[0]) {
        posterUrl = `http://localhost:5000/lofi/${files.poster[0].filename}`;
    }

    // Save track to DB as a regular Song with "lofi" genre
    const track = await prisma.song.create({
      data: { 
        title: title || "Untitled Lofi", 
        artist: "Lofi Community",
        audioUrl,
        posterUrl,
        genres: ["lofi"],
        createdBy: "admin"
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
          has: "lofi"
        }
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(tracks);
  } catch (error) {
    console.error("Lofi fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};
