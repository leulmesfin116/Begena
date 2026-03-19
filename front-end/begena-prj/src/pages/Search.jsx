import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAudio } from "../context/AudioContext";
import { FaPlay, FaPause, FaHeart, FaSearch } from "react-icons/fa";

export function Search() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  const { playSong, currentSong, isPlaying, likedSongs, toggleLike } = useAudio();

  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:5000/song/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Search failed");
        
        const data = await res.json();
        const mapped = data.map(song => {
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
            artist: song.artist || "Unknown Artist"
          };
        });
        setSongs(mapped);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:pb-32 pb-24 border-none">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-center text-black dark:text-white flex items-center gap-3">
          <FaSearch size={24} className="text-gray-400" />
          Search Results
        </h1>
        {query && (
          <p className="text-gray-500 mt-2">Showing results for "{query}"</p>
        )}
      </div>

      {loading && (
        <div className="flex justify-center my-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
        </div>
      )}

      {error && (
        <p className="text-center text-red-500 mt-10 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-xl mx-auto">
          {error}
        </p>
      )}

      {!loading && !error && songs.length === 0 && query && (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 max-w-xl mx-auto">
              <p className="text-gray-500 text-lg font-medium">No matches found for "{query}"</p>
              <p className="text-sm text-gray-400 mt-1">Try checking for typos or searching something else.</p>
          </div>
      )}

      <div className="flex flex-col gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="group flex items-center bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 sm:p-3 gap-3 sm:gap-4 transition-all"
          >
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

            <div className="flex-1 min-w-0 pr-2">
              <h2
                className={`font-bold text-base sm:text-lg leading-tight truncate ${currentSong?.id === song.id ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-gray-100"}`}
              >
                {song.title}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm truncate mt-0.5">
                {song.artist}
              </p>
            </div>

            <div className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0">
              <button
                onClick={() => toggleLike(song.id)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${
                  likedSongs.has(song.id)
                    ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                    : "text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                title="Like"
              >
                <FaHeart size={16} />
              </button>

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
