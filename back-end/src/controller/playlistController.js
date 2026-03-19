import { prisma } from "../config/db.js";

//  Create playlist
const playList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "playlist requires name" });
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        userId,
      },
    });

    res.status(201).json({
      message: "playlist created",
      playlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

// Add song
const addSongToPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playlistId, songId } = req.body;

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist || playlist.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const songExist = await prisma.song.findUnique({
      where: { id: songId },
    });

    if (!songExist) {
      return res.status(400).json({ message: "Song does not exist" });
    }

    const existing = await prisma.playlistSong.findFirst({
      where: { playlistId, songId },
    });

    if (existing) {
      return res.status(400).json({ message: "Song already in playlist" });
    }

    const count = await prisma.playlistSong.count({
      where: { playlistId },
    });

    await prisma.playlistSong.create({
      data: { 
        playlistId, 
        songId,
        order: count + 1
      },
    });

    res.status(200).json({ message: "Song added to playlist" });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

//  Get all playlists
const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;

    const playlists = await prisma.playlist.findMany({
      where: { userId },
      include: {
        playlist: {
          include: {
            song: true,
          },
        },
      },
    });

    // Map `playlist` to `songs` so frontend can read it correctly
    const formattedPlaylists = playlists.map(p => ({
      ...p,
      songs: p.playlist
    }));

    res.status(200).json(formattedPlaylists);
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

// Get single playlist
const getSinglePlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: {
        playlist: {
          include: {
            song: true,
          },
        },
      },
    });

    if (!playlist || playlist.userId !== userId) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const formattedPlaylist = {
      ...playlist,
      songs: playlist.playlist
    };

    res.status(200).json(formattedPlaylist);
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

// Remove song
const removeSongFromPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playlistId, songId } = req.body;

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist || playlist.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.playlistSong.deleteMany({
      where: { playlistId, songId },
    });

    res.status(200).json({ message: "Song removed from playlist" });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

// Delete playlist
const deletePlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const playlist = await prisma.playlist.findUnique({
      where: { id },
    });

    if (!playlist || playlist.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // delete relations first
    await prisma.playlistSong.deleteMany({
      where: { playlistId: id },
    });

    // delete playlist
    await prisma.playlist.delete({
      where: { id },
    });

    res.status(200).json({ message: "Playlist deleted" });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

export {
  playList,
  addSongToPlaylist,
  getUserPlaylists,
  getSinglePlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
};
