import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAudio } from "../context/AudioContext";
import { useUser } from "../context/UserContext";
import { FaPlay, FaPause, FaHeart, FaPlus, FaTrash } from "react-icons/fa";

export function NewMusic() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openPlaylistMenuId, setOpenPlaylistMenuId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [songToDelete, setSongToDelete] = useState(null);
  const location = useLocation();
  const fromPlaylist = location.state?.fromPlaylist;

  const { playSong, currentSong, isPlaying, likedSongs, toggleLike } =
    useAudio();
  const { isAdmin } = useUser();

  useEffect(() => {
    const fetchSongsAndPlaylists = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch songs
        const songsRes = await fetch("http://localhost:5000/api/uploads").catch(
          (err) => {
            throw new Error("Network error: Could not connect to server.");
          },
        );
        if (!songsRes.ok) {
          const errData = await songsRes.json().catch(() => ({}));
          throw new Error(
            errData.message ||
              errData.error ||
              `Server error: ${songsRes.status}`,
          );
        }

        const songsData = await songsRes.json();
        const mappedSongs = songsData
          .filter((song) => song !== null)
          .map((song) => {
            let pUrl = song.posterUrl || "/default-poster.jpg";
            if (pUrl && !pUrl.startsWith("http") && !pUrl.startsWith("/")) {
              pUrl = `http://localhost:5000/uploads/${pUrl}`;
            }
            let aUrl = song.audioUrl || song.url;
            if (aUrl && !aUrl.startsWith("http") && !aUrl.startsWith("/")) {
              aUrl = `http://localhost:5000/uploads/${aUrl}`;
            }
            return {
              ...song,
              audioUrl: aUrl,
              posterUrl: pUrl,
              artist: song.artist || "Unknown Artist",
            };
          });
        setSongs(mappedSongs);

        // Fetch playlists if logged in
        if (token) {
          const playRes = await fetch("http://localhost:5000/play", {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => null);

          if (playRes && playRes.ok) {
            const playData = await playRes.json();
            if (Array.isArray(playData)) {
              setPlaylists(playData);
            }
          }
        }
      } catch (err) {
        console.error("NewMusic fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongsAndPlaylists();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenPlaylistMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleAddToPlaylist = async (playlistId, songId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Please login first to add songs to playlists.");
        return;
      }

      const res = await fetch("http://localhost:5000/play/add-song", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ playlistId, songId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to add song");
      }

      showToast("Added to playlist!");
      setOpenPlaylistMenuId(null);
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleDeleteClick = (song) => {
    setSongToDelete(song);
  };

  const confirmDelete = async () => {
    if (!songToDelete) return;
    const songId = songToDelete.id;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/upload/${songId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setSongs(songs.filter((s) => s.id !== songId));
        showToast(`"${songToDelete.title}" deleted successfully`);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to delete song", true);
      }
    } catch (err) {
      showToast("Error deleting song", true);
    } finally {
      setSongToDelete(null);
    }
  };

  const showToast = (msg, isError = false) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  if (loading)
    return (
      <div className="flex justify-center my-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  if (error)
    return (
      <p className="text-center text-red-500 mt-10 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-xl mx-auto">
        {error}
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:pb-32 pb-24 border-none">
      <h1 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">
        New Releases
      </h1>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-lg transition-all animate-fade-in border border-gray-200 dark:border-border">
          {toastMsg}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {songToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/20 rounded-2xl shadow-2xl max-w-sm w-full p-8 transform animate-scale-in text-white text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center">
                <FaTrash size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Delete Song?</h2>
            <p className="text-white/80 mb-8 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-white underline underline-offset-4">"{songToDelete.title}"</span>? This action is permanent and cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="w-full py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setSongToDelete(null)}
                className="w-full py-3 rounded-lg border border-white/30 text-white font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
              >
                Keep Song
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="group flex items-center bg-white dark:bg-card shadow-sm hover:shadow-md border border-gray-100 dark:border-border rounded-xl p-2.5 sm:p-3 gap-3 sm:gap-4 transition-all"
          >
            {/* Poster */}
            <div className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16">
              <img
                src={song.posterUrl}
                alt={song.title}
                className="w-full h-full object-cover rounded-lg shadow-sm"
              />
              {currentSong?.id === song.id && isPlaying && (
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              )}
            </div>

            {/* Song info */}
            <div className="flex-1 min-w-0 pr-2">
              <h2
                className={`font-bold text-base sm:text-lg leading-tight truncate ${currentSong?.id === song.id ? "text-black dark:text-white" : "text-gray-900 dark:text-gray-100"}`}
              >
                {song.title}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm truncate mt-0.5">
                {song.artist}
              </p>
            </div>

            <div className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0">
              {/* Like Button */}
              <button
                onClick={() => toggleLike(song.id)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${
                  likedSongs.has(song.id)
                    ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                    : "text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-accent"
                }`}
                title="Like"
              >
                <FaHeart size={16} />
              </button>

              {/* Add to Playlist Dropdown - Only visible if navigated from Playlist page */}
              {fromPlaylist && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenPlaylistMenuId(
                        openPlaylistMenuId === song.id ? null : song.id,
                      );
                    }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${
                      openPlaylistMenuId === song.id
                        ? "bg-gray-200 dark:bg-muted text-black dark:text-white"
                        : "text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-accent"
                    }`}
                    title="Add to Playlist"
                  >
                    <FaPlus size={14} />
                  </button>

                  {openPlaylistMenuId === song.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-12 w-48 bg-white dark:bg-card rounded-xl shadow-xl border border-gray-100 dark:border-border z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right"
                    >
                      <div className="p-3 border-b border-gray-100 dark:border-border bg-gray-50/50 dark:bg-card/50">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Add to Playlist
                        </p>
                      </div>
                      <div className="max-h-56 overflow-y-auto overscroll-contain">
                        {!localStorage.getItem("token") ? (
                          <p className="p-4 text-xs text-center text-gray-500">
                            Log in to add to playlists.
                          </p>
                        ) : playlists.length === 0 ? (
                          <p className="p-4 text-xs text-center text-gray-500">
                            No playlists available.
                          </p>
                        ) : (
                          <div className="py-1">
                            {playlists.map((pl) => (
                              <button
                                key={pl.id}
                                onClick={() =>
                                  handleAddToPlaylist(pl.id, song.id)
                                }
                                className="w-full text-left px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-accent transition-colors truncate active:bg-gray-200 dark:active:bg-muted"
                              >
                                {pl.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Admin Delete Button */}
              {isAdmin && (
                <button
                  onClick={() => handleDeleteClick(song)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  title="Delete Song"
                >
                  <FaTrash size={14} />
                </button>
              )}

              {/* Play Button */}
              <button
                onClick={() => playSong(song, songs)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center transition-all hover:scale-105 shadow-md flex-shrink-0"
                title={
                  currentSong?.id === song.id && isPlaying ? "Pause" : "Play"
                }
              >
                {currentSong?.id === song.id && isPlaying ? (
                  <FaPause size={14} />
                ) : (
                  <FaPlay size={14} className="ml-1" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
