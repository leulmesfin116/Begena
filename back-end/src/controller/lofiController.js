import { prisma } from "../config/db.js";

export const uploadLofi = async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const audioUrl = `http://localhost:5000/lofi/${req.file.filename}`;

    // Save track to DB
    const track = await prisma.lofi.create({
      data: { 
        title: title || "Untitled Lofi", 
        audioUrl 
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
    const tracks = await prisma.lofi.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(tracks);
  } catch (error) {
    console.error("Lofi fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};
