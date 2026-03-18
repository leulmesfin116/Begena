import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

export default function LofiMusic() {
  const [tracks, setTracks] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  // Fetch tracks from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/lofi") // your API route
      .then((res) => res.json())
      .then((data) => setTracks(data))
      .catch((err) => console.error(err));
  }, []);

  const playTrack = (track) => {
    if (current?.id === track.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play();
      setCurrent(track);
      setIsPlaying(true);
    }
  };

  return (
    <div className="text-center m-8">
      <h1 className="text-3xl font-bold mb-6">LofiMusic 🎧</h1>

      {tracks.length === 0 && <p>Loading tracks...</p>}

      <div className="flex flex-col items-center gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg w-80 justify-between"
          >
            <span>{track.title}</span>
            <button
              onClick={() => playTrack(track)}
              className="p-2 bg-black text-white rounded-full"
            >
              {current?.id === track.id && isPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
