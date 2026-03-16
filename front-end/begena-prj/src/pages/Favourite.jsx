import React, { useEffect, useState } from "react";
import { useAudio } from "../context/AudioContext";
import { FaPlay, FaPause, FaHeart } from "react-icons/fa";

export function Favourite() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { playSong, currentSong, isPlaying, likedSongs, toggleLike } = useAudio();

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

        const res = await fetch("http://localhost:5000/fav", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }).catch(err => {
          throw new Error("Network error: Could not connect to server. Please check if the backend is running.");
        });
        
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Server error: ${res.status}`);
        }

        const data = await res.json();
        const mapped = data
          .filter((song) => song !== null)
          .map((song) => ({
            ...song,
            audioUrl: song.audioUrl || `http://localhost:5000/uploads/${song.url}`,
            posterUrl: song.posterUrl || "/default-poster.jpg",
            artist: song.artist || "Unknown Artist",
          }));
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
    <div className="max-w-5xl mx-auto p-6 md:pb-32 pb-24">
      <div className="m-4 sm:m-8 mb-8">
        <h1 className="text-black dark:text-white text-3xl font-bold text-center">
          Favourite Songs
        </h1>
      </div>

      {loading && <p className="text-center">Loading your favorites...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && songs.length === 0 && (
        <p className="text-center text-gray-500">You haven't liked any songs yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-xl p-3 gap-4 transition-all"
          >
            {/* Poster */}
            <img
              src={song.posterUrl || "/default-poster.jpg"}
              alt={song.title}
              className="w-16 h-16 object-cover rounded-md shadow-sm"
            />

            {/* Song info */}
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 dark:text-white">{song.title}</h2>
              <p className="text-sm text-gray-500">{song.artist || "Unknown Artist"}</p>
            </div>
            
            <div className="flex items-center gap-3 pr-2">
              <button
                onClick={() => toggleLike(song.id)}
                className="text-red-500 hover:scale-110 transition-transform"
                title="Remove from Favorites"
              >
                <FaHeart size={20} />
              </button>

              <button
                onClick={() => playSong(song, songs)}
                className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center transition-transform hover:scale-105 shadow-md flex-shrink-0"
                title={currentSong?.id === song.id && isPlaying ? "Pause" : "Play"}
              >
                {currentSong?.id === song.id && isPlaying ? (
                  <FaPause size={16} />
                ) : (
                  <FaPlay size={16} className="ml-1" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
