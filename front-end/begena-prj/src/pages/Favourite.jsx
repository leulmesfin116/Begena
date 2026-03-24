import React, { useEffect, useState } from "react";
import { useAudio } from "../context/AudioContext";
import { FaPlay, FaPause, FaHeart } from "react-icons/fa";
import { normalizeSongMedia } from "../utils/mediaUrl";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export function Favourite() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { playSong, currentSong, isPlaying, likedSongs, toggleLike } =
    useAudio();

  // Use likedSongs from context to trigger re-fetch or filter local list
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view your favorite songs.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/fav`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch((err) => {
          throw new Error(
            "Network error: Could not connect to server. Please check if the backend is running.",
          );
        });

        const text = await res.text();
        let data = [];
        try {
          data = text ? JSON.parse(text) : [];
        } catch {
          throw new Error(
            "Server returned invalid data. Check VITE_API_URL or backend endpoint.",
          );
        }
        if (!res.ok) {
          throw new Error(
            data?.message || data?.error || `Server error: ${res.status}`,
          );
        }
        const mapped = data
          .filter((song) => song !== null)
          .map((song) => normalizeSongMedia(song, API_BASE_URL));
        setSongs(mapped);
      } catch (err) {
        console.error("Favourite fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [likedSongs]); // Re-fetch when likedSongs set changes in context

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:pb-32 pb-24">
      <div className="m-4 sm:m-8 mb-8">
        <h1 className="text-black dark:text-white text-3xl font-bold text-center">
          Favourite Songs
        </h1>
      </div>

      {loading && <div className="flex justify-center my-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div></div>}
      {error && (
        <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-lg mb-8 max-w-xl mx-auto border border-gray-200 dark:border-gray-700">
          {error}
        </div>
      )}
      {!loading && !error && songs.length === 0 && (
        <p className="text-center text-gray-500">
          You haven't liked any songs yet.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center bg-white dark:bg-card shadow-sm hover:shadow-md rounded-xl p-2.5 sm:p-3 gap-3 sm:gap-4 transition-all"
          >
            {/* Poster */}
            <img
              src={song.posterUrl || "/default-poster.jpg"}
              alt={song.title}
              className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md shadow-sm"
            />

            {/* Song info */}
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 dark:text-white">
                {song.title}
              </h2>
              <p className="text-sm text-gray-500">
                {song.artist || "Unknown Artist"}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 pr-1 sm:pr-2">
              <button
                onClick={() => toggleLike(song.id)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 hover:scale-105 active:scale-95 transition-transform"
                title="Remove from Favorites"
              >
                <FaHeart size={16} />
              </button>

              <button
                onClick={() => playSong(song, songs)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center transition-transform hover:scale-105 shadow-md flex-shrink-0"
                title={
                  currentSong?.id === song.id && isPlaying ? "Pause" : "Play"
                }
              >
                {currentSong?.id === song.id && isPlaying ? (
                  <FaPause size={14} />
                ) : (
                  <FaPlay size={14} className="ml-0.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
