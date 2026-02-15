import { prisma } from "../config/db.js";
// adding song
const song = async (req, res) => {
  try {
    const { title, artist, posterUrl } = req.body;
    // validationg the input
    if (!title || !artist || !posterUrl) {
      return res.status(400).json({ message: "All the fields are required" });
    }
    // adding new song
    const newSong = await prisma.song.create({
      data: { title, artist, posterUrl },
    });
    res.status(201).json({ song: newSong });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};
export { song };
