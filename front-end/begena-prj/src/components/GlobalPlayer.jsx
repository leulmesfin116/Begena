import React from "react";
import { useAudio } from "../context/AudioContext";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaHeart,
  FaRandom,
  FaRetweet,
} from "react-icons/fa";

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function GlobalPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
    currentTime,
    duration,
    playlist,
    likedSongs,
    toggleLike,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeatMode,
  } = useAudio();

  if (!currentSong) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasPlaylist = playlist.length > 1;
  const isLiked = likedSongs.has(currentSong.id);

  const handleSeek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    seekTo(newTime);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-2xl z-50 flex flex-col">
      {/* Progress Bar */}
      <div
        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 cursor-pointer group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-black dark:bg-white rounded-r-full transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between p-3">
        {/* Current Song Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <img
            src={currentSong.posterUrl || "/default-poster.jpg"}
            alt={currentSong.title}
            className="w-12 h-12 object-cover rounded-md shadow-md flex-shrink-0"
          />
          <div className="min-w-0 flex items-center gap-3">
            <div className="hidden sm:block min-w-0">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-[150px] md:max-w-[200px]">
                {currentSong.title}
              </h4>
              <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-[200px]">
                {currentSong.artist || "Unknown Artist"}
              </p>
            </div>

            <button
              onClick={() => toggleLike(currentSong.id)}
              className={`transition-colors p-1 hover:scale-110 active:scale-95 ${
                isLiked
                  ? "text-red-500"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              title={isLiked ? "Remove from Favorites" : "Add to Favorites"}
            >
              <FaHeart size={18} />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 flex-1">
          <button
            onClick={toggleShuffle}
            title="Shuffle"
            className={`transition-colors ${
              isShuffle
                ? "text-black dark:text-white"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <FaRandom size={18} />
          </button>

          <button
            onClick={playPrev}
            disabled={!hasPlaylist}
            className={`transition-colors ${
              hasPlaylist
                ? "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
            }`}
          >
            <FaStepBackward size={20} />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            {isPlaying ? (
              <FaPause size={16} />
            ) : (
              <FaPlay size={16} className="ml-1" />
            )}
          </button>

          <button
            onClick={playNext}
            disabled={!hasPlaylist}
            className={`transition-colors ${
              hasPlaylist
                ? "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
            }`}
          >
            <FaStepForward size={20} />
          </button>

          <button
            onClick={toggleRepeatMode}
            title={`Repeat: ${repeatMode}`}
            className={`transition-colors relative ${
              repeatMode !== "none"
                ? "text-black dark:text-white"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <FaRetweet size={18} />
            {repeatMode === "one" && (
              <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-black dark:bg-white text-white dark:text-black rounded-full w-3 h-3 flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>

        {/* Time display */}
        <div className="hidden md:flex items-center justify-end flex-1 pr-6">
          <span className="text-xs text-black dark:text-white tabular-nums font-medium">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
