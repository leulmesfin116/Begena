import React, { useState, useEffect, useRef } from "react";
import { useAudio } from "../context/AudioContext";
import { FaPlay, FaPause, FaUpload, FaHeart } from "react-icons/fa";

export function LofiMusic() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fileInput = useRef();
  const [uploadLoading, setUploadLoading] = useState(false);

  const { playSong, currentSong, isPlaying, likedSongs, toggleLike } = useAudio();

  const fetchLofi = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/lofi");
      if (!res.ok) throw new Error("Failed to fetch lofi music");
      const data = await res.json();
      setSongs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLofi();
  }, []);

  const handleUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setUploadLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name.split('.')[0]);

        try {
            const res = await fetch("http://localhost:5000/api/lofi/upload", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Upload failed");
            await fetchLofi();
            if (fileInput.current) fileInput.current.value = "";
        } catch (err) {
            alert(err.message);
        } finally {
            setUploadLoading(false);
        }
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
            <div>
                <input 
                    type="file" 
                    ref={fileInput} 
                    className="hidden" 
                    id="lofi-upload" 
                    accept="audio/*"
                    onChange={handleUpload}
                />
                <label 
                    htmlFor="lofi-upload" 
                    className={`cursor-pointer bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full flex items-center gap-2 hover:scale-105 active:scale-95 transition-all font-semibold shadow-lg ${uploadLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FaUpload size={14} />
                    {uploadLoading ? "Uploading..." : "Upload New Beat"}
                </label>
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
                <p className="text-sm text-gray-400 mt-1">Be the first to share a beat!</p>
            </div>
        ) : (
            songs.map((song) => (
                <div
                    key={song.id}
                    className="group flex items-center bg-white dark:bg-card shadow-sm hover:shadow-md border border-gray-100 dark:border-border rounded-2xl p-3 gap-4 transition-all"
                >
                    <div className="relative w-14 h-14 flex-shrink-0">
                        <img
                            src={song.posterUrl || "/default-poster.jpg"}
                            alt={song.title}
                            className="w-full h-full object-cover rounded-xl shadow-inner"
                        />
                        {currentSong?.id === song.id && isPlaying && (
                            <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                                <div className="flex gap-1 items-end h-4">
                                    <div className="w-1 bg-white animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1 bg-white animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1 bg-white animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h2 className={`font-bold text-lg truncate ${currentSong?.id === song.id ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-gray-100"}`}>
                            {song.title}
                        </h2>
                        <p className="text-gray-500 text-sm truncate">Lofi Community Beat</p>
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
                            <FaHeart size={18} />
                        </button>

                        <button
                            onClick={() => playSong(song, songs)}
                            className="w-11 h-11 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center transition-all hover:scale-110 shadow-lg active:scale-95"
                        >
                            {currentSong?.id === song.id && isPlaying ? (
                                <FaPause size={16} />
                            ) : (
                                <FaPlay size={16} className="ml-1" />
                            )}
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
