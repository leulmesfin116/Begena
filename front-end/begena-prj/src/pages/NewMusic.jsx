import React, { useEffect, useState } from "react";

export function NewMusic() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/uploads");
        if (!res.ok) throw new Error("Failed to fetch songs");
        const data = await res.json();

        // Map backend fields to the ones you use in JSX
        const mapped = data.map((song) => ({
          ...song,
          audioUrl: song.url, // map url → audioUrl
          posterUrl: "/default-poster.jpg", // optional default image
          artist: "Unknown Artist", // optional
        }));

        setSongs(mapped);
      } catch (err) {
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

            {/* Audio player */}
            <audio controls className="w-48">
              <source src={song.audioUrl} type="audio/mpeg" />
              Your browser does not support audio.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}
