import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMusic, FaImage, FaUpload, FaSpinner, FaExclamationTriangle } from "react-icons/fa";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export function Upload() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/Login");
      return;
    }

    if (role === "ADMIN") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setCheckingAdmin(false);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!audioFile || !title) {
      setMessage({ type: "error", text: "Title and Audio file are required!" });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("audio", audioFile);
    if (posterFile) {
      formData.append("poster", posterFile);
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage({ type: "success", text: "Song uploaded successfully!" });
        setTitle("");
        setArtist("");
        setAudioFile(null);
        setPosterFile(null);
        // Clear file inputs
        e.target.reset();
      } else {
        setMessage({
          type: "error",
          text: data.error || data.message || "Upload failed",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-black dark:text-white" />
        <p className="mt-4 text-gray-500">Checking permissions...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl text-center">
        <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Access Denied</h2>
        <p className="text-red-600 dark:text-red-300 mb-6">
          Only administrators can access this page. If you believe this is an error, please contact support.
        </p>
        <button 
          onClick={() => navigate("/")}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 pb-32">
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">Upload New Music</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Add fresh tracks to the Begena library</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Message Alert */}
        {message.text && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === "success" 
              ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" 
              : "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          }`}>
            <span className="text-lg">{message.type === "success" ? "✓" : "⚠"}</span>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Input Groups */}
        <div className="bg-white dark:bg-card border border-gray-100 dark:border-border rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Song Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Song Title
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter song title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input w-full pl-10"
                required
              />
              <FaMusic className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Artist Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Artist Name
            </label>
            <input
              type="text"
              placeholder="Artist name (optional)"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="input w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audio File */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide flex items-center gap-2">
                <FaMusic size={12} /> Audio File
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files[0])}
                  className="hidden"
                  id="audio-upload"
                  required
                />
                <label 
                  htmlFor="audio-upload"
                  className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    audioFile 
                      ? "border-green-400 bg-green-50/50 dark:bg-green-900/10" 
                      : "border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white"
                  }`}
                >
                  <FaUpload className={`mb-2 text-2xl ${audioFile ? "text-green-500" : "text-gray-400"}`} />
                  <span className="text-xs text-center font-medium truncate max-w-[150px]">
                    {audioFile ? audioFile.name : "Select MP3 File"}
                  </span>
                </label>
              </div>
            </div>

            {/* Poster File */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide flex items-center gap-2">
                <FaImage size={12} /> Poster Image
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPosterFile(e.target.files[0])}
                  className="hidden"
                  id="poster-upload"
                />
                <label 
                  htmlFor="poster-upload"
                  className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    posterFile 
                      ? "border-blue-400 bg-blue-50/50 dark:bg-blue-900/10" 
                      : "border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white"
                  }`}
                >
                  <FaImage className={`mb-2 text-2xl ${posterFile ? "text-blue-500" : "text-gray-400"}`} />
                  <span className="text-xs text-center font-medium truncate max-w-[150px]">
                    {posterFile ? posterFile.name : "Select Cover Image"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
              loading 
                ? "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed" 
                : "bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Uploading track...</span>
              </>
            ) : (
              <>
                <FaUpload />
                <span>Publish Song</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
