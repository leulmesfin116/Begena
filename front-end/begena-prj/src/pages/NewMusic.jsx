import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function NewMusic() {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    posterUrl: "",
    runtime: "",
    genres: "",
    createdBy: "",
  });
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      setMessage("Please select an audio file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 1. Upload the audio file
      const fileData = new FormData();
      fileData.append("audio", audioFile);

      const uploadRes = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: fileData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload audio file.");
      }

      const uploadData = await uploadRes.json();
      const audioUrl = uploadData.url;

      // 2. Submit the song details
      const songPayload = {
        title: formData.title,
        artist: formData.artist,
        posterUrl: formData.posterUrl,
        audioUrl: audioUrl,
        runtime: parseInt(formData.runtime, 10) || 0,
        genres: formData.genres.split(",").map((g) => g.trim()).filter(Boolean),
        createdBy: formData.createdBy,
      };

      const songRes = await fetch("http://localhost:5000/song/addSong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(songPayload),
      });

      if (!songRes.ok) {
        throw new Error("Failed to save song details.");
      }

      setMessage("Song successfully uploaded!");
      setTimeout(() => navigate("/Library"), 2000);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-8">
      <div className="mb-8 p-4 text-center">
        <h1 className="text-black dark:text-white text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 inline-block">
          Upload New Music
        </h1>
        <p className="text-gray-500 mt-2">Add a new track to the Begena platform</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-10 border border-gray-100 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input type="text" name="title" required value={formData.title} onChange={handleInputChange} 
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors" placeholder="Song Title" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Artist</label>
            <input type="text" name="artist" required value={formData.artist} onChange={handleInputChange} 
               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors" placeholder="Artist Name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Poster URL</label>
            <input type="text" name="posterUrl" required value={formData.posterUrl} onChange={handleInputChange} 
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors" placeholder="https://example.com/image.jpg" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Runtime (sec)</label>
              <input type="number" name="runtime" value={formData.runtime} onChange={handleInputChange} 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors" placeholder="e.g. 240" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin / Creator ID</label>
              <input type="text" name="createdBy" required value={formData.createdBy} onChange={handleInputChange} 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors" placeholder="Admin ID/Name" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genres</label>
            <input type="text" name="genres" value={formData.genres} onChange={handleInputChange} 
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors" placeholder="Pop, Rock, Classical (comma separated)" />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Audio File</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-400 dark:hover:border-blue-400 transition-colors">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" accept="audio/*" className="sr-only" onChange={handleFileChange} />
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                   MP3, WAV up to 15MB
                </p>
                {audioFile && <p className="text-sm font-semibold text-green-500 mt-2">{audioFile.name}</p>}
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center font-medium ${message.includes('success') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
            {message}
          </div>
        )}

        <div className="mt-8">
          <button type="submit" disabled={loading} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}>
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : "Upload Song"}
          </button>
        </div>
      </form>
    </div>
  );
}
