import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function UploadMusic() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!title || !audioFile) {
      setError("Title and Audio file are required.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("artist", artist);
      formData.append("audio", audioFile);
      if (posterFile) {
        formData.append("poster", posterFile);
      }

      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload song");
      }

      const data = await res.json();
      setMessage(data.message || "Song uploaded successfully!");
      
      // Clear form
      setTitle("");
      setArtist("");
      setAudioFile(null);
      setPosterFile(null);
      
      // Optional: navigate to the new releases page after a delay
      setTimeout(() => {
        navigate("/newMusic");
      }, 1500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:mt-10">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Upload New Song</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Song Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-2 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter song title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Artist (Optional)
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full border-2 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter artist name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Audio File (.mp3, .wav) *
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
              className="w-full border-2 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cover Image / Poster (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPosterFile(e.target.files[0])}
              className="w-full border-2 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className={`mt-4 w-full py-3 rounded-lg font-bold text-white transition-colors ${
              isUploading 
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed" 
                : "bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload Song"}
          </button>
        </form>
      </div>
    </div>
  );
}
