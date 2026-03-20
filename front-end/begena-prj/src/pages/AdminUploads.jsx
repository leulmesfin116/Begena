import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPodcast, FaMusic, FaUpload, FaSpinner, FaExclamationTriangle, FaYoutube, FaLink, FaAlignLeft } from "react-icons/fa";
import { useUser } from "../context/UserContext";

export function AdminUploads() {
  const [activeTab, setActiveTab] = useState("podcast");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { isAdmin } = useUser();
  const navigate = useNavigate();

  // Podcast Form State
  const [podTitle, setPodTitle] = useState("");
  const [podDesc, setPodDesc] = useState("");
  const [podYoutube, setPodYoutube] = useState("");
  const [podThumb, setPodThumb] = useState("");

  // Lofi Form State
  const [lofiTitle, setLofiTitle] = useState("");
  const [lofiFile, setLofiFile] = useState(null);
  const [lofiPoster, setLofiPoster] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "ADMIN") {
      // Small delay to allow context to load if needed, but if role is in localStorage we can redirect early
      const timeout = setTimeout(() => {
         if (localStorage.getItem("userRole") !== "ADMIN") navigate("/");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [navigate]);

  const handlePodcastSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/podcasts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: podTitle,
          description: podDesc,
          youtubeUrl: podYoutube,
          thumbnail: podThumb,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Podcast published successfully!" });
        setPodTitle("");
        setPodDesc("");
        setPodYoutube("");
        setPodThumb("");
      } else {
        setMessage({ type: "error", text: data.error || "Upload failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleLofiSubmit = async (e) => {
    e.preventDefault();
    if (!lofiFile) {
      setMessage({ type: "error", text: "Please select a lofi audio file!" });
      return;
    }

    const formData = new FormData();
    formData.append("title", lofiTitle);
    formData.append("file", lofiFile);
    if (lofiPoster) {
      formData.append("poster", lofiPoster);
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/lofi/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Lofi track uploaded successfully!" });
        setLofiTitle("");
        setLofiFile(null);
        setLofiPoster(null);
        e.target.reset();
      } else {
        setMessage({ type: "error", text: data.error || "Upload failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin && localStorage.getItem("userRole") !== "ADMIN") {
      return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-black text-white text-center rounded-2xl border border-white/20">
          <FaExclamationTriangle className="text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">Administrators only area.</p>
          <button onClick={() => navigate("/")} className="bg-white text-black font-bold py-2 px-6 rounded-lg">Return Home</button>
        </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 pb-32">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold dark:text-white mb-2 uppercase tracking-tighter">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage Podcasts and Lofi Content</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 bg-gray-100 dark:bg-card p-1.5 rounded-2xl border border-gray-200 dark:border-border">
        <button
          onClick={() => setActiveTab("podcast")}
          className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "podcast" ? "bg-black dark:bg-white text-white dark:text-black shadow-lg" : "text-gray-500 hover:text-black dark:hover:text-white"
          }`}
        >
          <FaPodcast /> Podcasts
        </button>
        <button
          onClick={() => setActiveTab("lofi")}
          className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "lofi" ? "bg-black dark:bg-white text-white dark:text-black shadow-lg" : "text-gray-500 hover:text-black dark:hover:text-white"
          }`}
        >
          <FaMusic /> Lofi Tracks
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fade-in ${
          message.type === "success" 
            ? "bg-green-100 text-green-700 border border-green-200" 
            : "bg-red-100 text-red-700 border border-red-200"
        }`}>
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Forms Container */}
      <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl shadow-xl p-6 sm:p-10">
        {activeTab === "podcast" ? (
          <form onSubmit={handlePodcastSubmit} className="space-y-6">
            <h2 className="text-xl font-bold dark:text-white flex items-center gap-2 mb-2">
              <FaYoutube className="text-red-600" /> New Podcast Episode
            </h2>
            
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Title</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Episode title"
                  value={podTitle}
                  onChange={(e) => setPodTitle(e.target.value)}
                  className="input w-full pl-10"
                  required
                />
                <FaPodcast className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Description</label>
              <div className="relative">
                <textarea
                  placeholder="What's this episode about?"
                  value={podDesc}
                  onChange={(e) => setPodDesc(e.target.value)}
                  className="input w-full pl-10 h-24 pt-3 resize-none"
                />
                <FaAlignLeft className="absolute left-3.5 top-4 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">YouTube URL</label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={podYoutube}
                    onChange={(e) => setPodYoutube(e.target.value)}
                    className="input w-full pl-10"
                    required
                  />
                  <FaLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Thumbnail URL</label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="Image link (optional)"
                    value={podThumb}
                    onChange={(e) => setPodThumb(e.target.value)}
                    className="input w-full pl-10"
                  />
                  <FaLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <><FaUpload /> Publish Episode</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLofiSubmit} className="space-y-6">
            <h2 className="text-xl font-bold dark:text-white flex items-center gap-2 mb-2">
              <FaMusic className="text-blue-500" /> New Lofi Track
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Track Title</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Lofi track name"
                  value={lofiTitle}
                  onChange={(e) => setLofiTitle(e.target.value)}
                  className="input w-full pl-10"
                  required
                />
                <FaMusic className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Audio File (MP3)</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setLofiFile(e.target.files[0])}
                  className="hidden"
                  id="lofi-file-upload"
                />
                <label
                  htmlFor="lofi-file-upload"
                  className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all h-36 ${
                    lofiFile ? "border-green-400 bg-green-50 dark:bg-green-900/10" : "border-gray-200 dark:border-border hover:border-black dark:hover:border-white"
                  }`}
                >
                  <FaUpload className={`text-2xl mb-2 ${lofiFile ? "text-green-500" : "text-gray-300"}`} />
                  <span className="font-bold text-xs text-center">{lofiFile ? lofiFile.name.substring(0, 20) + "..." : "Select Audio"}</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Poster Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLofiPoster(e.target.files[0])}
                  className="hidden"
                  id="lofi-poster-upload"
                />
                <label
                  htmlFor="lofi-poster-upload"
                  className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all h-36 border-gray-200 dark:border-border hover:border-black dark:hover:border-white`}
                >
                   {lofiPoster ? (
                      <span className="text-green-500 font-bold text-xs">Poster Selected</span>
                   ) : (
                      <>
                        <FaUpload className="text-2xl mb-2 text-gray-300" />
                        <span className="font-bold text-xs">Select Poster</span>
                      </>
                   )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <><FaUpload /> Upload Track</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
