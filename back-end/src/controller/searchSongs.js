import { prisma } from "../config/db.js";

export const searchSongs = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(200).json([]);
        }

        const songs = await prisma.song.findMany({
            where: {
                OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    { artist: { contains: q, mode: "insensitive" } },
                    { genres: { has: q } }
                ]
            },
            orderBy: { createdAt: "desc" },
        });

        res.status(200).json(songs);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Server error during search", error: error.message });
    }
};
