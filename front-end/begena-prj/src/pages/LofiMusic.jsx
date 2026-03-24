import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useAudio } from "../context/AudioContext";
import { FaPlay, FaPause, FaHeart, FaTrash } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import { normalizeSongMedia } from "../utils/mediaUrl";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
const SONGS_PER_PAGE = 10;

export function LofiMusic() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [songToDelete, setSongToDelete] = useState(null);

  const { playSong, currentSong, isPlaying, likedSongs, toggleLike } = useAudio();
  const { isAdmin } = useUser();
  const observer = useRef();
  
  const lastSongRef = useCallback(
    (node) => {
      if (loading || fetchingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, fetchingMore, hasMore],
  );

  const fetchLofi = async () => {
    try {
      if (page === 1) setLoading(true);
      else setFetchingMore(true);

      const res = await fetch(`${API_BASE_URL}/api/lofi?page=${page}&limit=${SONGS_PER_PAGE}`);
      if (!res.ok) throw new Error("Failed to fetch lofi music");
      const data = await res.json();
      
      if (data.length < SONGS_PER_PAGE) {
        setHasMore(false);
      }

      const mapped = (Array.isArray(data) ? data : []).map((song) =>
        normalizeSongMedia(song, API_BASE_URL),
      );

      setSongs((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchLofi();
  }, [page]);

  const handleDeleteClick = (song) => {
    setSongToDelete(song);
  };

  const confirmDelete = async () => {
    if (!songToDelete) return;
    const { id } = songToDelete;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/upload/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setSongs(songs.filter((s) => s.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete track");
      }
    } catch (err) {
      alert("Error deleting track");
    } finally {
      setSongToDelete(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center my-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-32">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">Lofi & Chill</h1>
                <p className="text-gray-500 mt-1">Relax and listen to uploaded beats</p>
            </div>
        </div>

      {error && (
        <p className="text-center text-red-500 mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {error}
        </p>
      )}

      <div className="grid gap-4">
        {songs.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-card/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-border">
                <p className="text-gray-500">No lofi tracks uploaded yet.</p>
            </div>
        ) : (
            songs.map((song, index) => {
                const isCurrent = currentSong?.id === song.id;
                const active = isCurrent && isPlaying;

                return (
                    <motion.div
                        key={song.id}
                        ref={songs.length === index + 1 ? lastSongRef : null}
                        initial={false}
                        animate={active ? { 
                            scale: 1.02, 
                            borderColor: "rgba(0,0,0,0.3)",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                        } : { 
                            scale: 1,
                            borderColor: "transparent",
                            boxShadow: "none"
                        }}
                        className={`group flex items-center bg-white dark:bg-card shadow-sm hover:shadow-md border border-gray-100 dark:border-border rounded-2xl p-3 gap-4 transition-all overflow-hidden ${active ? "ring-2 ring-black/5 dark:ring-white/10" : ""}`}
                    >
                        <div className="relative w-14 h-14 flex-shrink-0">
                            <img
                                src={song.posterUrl || "/default-poster.jpg"}
                                alt={song.title}
                                className={`w-full h-full object-cover rounded-xl shadow-inner transition-transform duration-700 ${active ? "scale-110" : ""}`}
                            />
                            {active && (
                                <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                                    <div className="flex gap-0.5 items-end h-5">
                                        {[...Array(4)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    height: [4, 16, 8, 20, 10],
                                                }}
                                                transition={{
                                                    duration: 0.6 + (i * 0.1),
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className="w-1 bg-white rounded-full"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h2 className={`font-bold text-lg truncate ${isCurrent ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                                {song.title}
                            </h2>
                            <p className="text-gray-500 text-sm truncate uppercase tracking-widest text-[10px] opacity-70">
                                {active ? "Now Playing Lofi" : "Lofi Beat"}
                            </p>
                        </div>

                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <button
                                onClick={() => handleDeleteClick(song)}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Delete"
                            >
                                <FaTrash size={16} />
                            </button>
                        )}
                        <button
                            onClick={() => toggleLike(song.id)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                likedSongs.has(song.id)
                                    ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                                    : "text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                            title="Like"
                        >
                            <FaHeart size={18} />
                        </button>

                        <button
                            onClick={() => playSong(song, songs)}
                            className="w-11 h-11 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center transition-all hover:scale-110 shadow-lg active:scale-95"
                        >
                            {active ? (
                                <FaPause size={16} />
                            ) : (
                                <FaPlay size={16} className="ml-1" />
                            )}
                        </button>
                    </div>
                </motion.div>
            );
        }))}
      </div>

      {/* Loading More Indicator */}
      {fetchingMore && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black dark:border-white"></div>
        </div>
      )}

      {/* End of results message */}
      {!hasMore && songs.length > 0 && (
        <p className="text-center text-gray-500 mt-8 mb-4 text-sm font-medium italic">
          You've reached the end of the lofi library.
        </p>
      )}


      {/* Custom Delete Confirmation Modal */}
      {songToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/20 rounded-2xl shadow-2xl max-sm w-full p-8 transform animate-scale-in text-white text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center">
                <FaTrash size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Delete Track?</h2>
            <p className="text-white/80 mb-8 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-white underline underline-offset-4">"{songToDelete.title}"</span>? This action is permanent.
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
                Keep Track
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
