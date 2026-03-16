import React, { useState, useEffect } from "react";
import { useAudio } from "../context/AudioContext";
import { FaPlay, FaPause, FaHeart } from "react-icons/fa";

export function NewMusic() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { playSong, currentSong, isPlaying, likedSongs, toggleLike } = useAudio();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/uploads").catch(err => {
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
        console.error("NewMusic fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading songs...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">New Releases</h1>

      <div className="flex flex-col gap-6">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 gap-4"
          >
            {/* Poster */}
            <img
              src={song.posterUrl}
              alt={song.title}
              className="w-24 h-24 object-cover rounded-lg"
            />

            {/* Song info */}
            <div className="flex-1">
              <h2 className="font-bold text-lg">{song.title}</h2>
              <p className="text-gray-500">{song.artist}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleLike(song.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  likedSongs.has(song.id) 
                    ? "text-red-500 bg-red-50 dark:bg-red-900/20" 
                    : "text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                title="Like"
              >
                <FaHeart size={20} />
              </button>

              <button
                onClick={() => playSong(song, songs)}
                className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center transition-transform hover:scale-105 shadow-md flex-shrink-0"
                title={currentSong?.id === song.id && isPlaying ? "Pause" : "Play"}
              >
                {currentSong?.id === song.id && isPlaying ? (
                  <FaPause size={20} />
                ) : (
                  <FaPlay size={20} className="ml-1" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
