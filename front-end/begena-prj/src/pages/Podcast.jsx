import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useUser } from "../context/UserContext";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export function Podcast() {
  const [podcasts, setPodcasts] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const { isAdmin } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [podcastToDelete, setPodcastToDelete] = useState(null);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/podcasts`)
      .then((res) => {
        return res.text().then((text) => {
          let data = [];
          try {
            data = text ? JSON.parse(text) : [];
          } catch {
            throw new Error(
              "Server returned invalid data. Check API URL/backend.",
            );
          }
          if (!res.ok) {
            const msg =
              data?.message || data?.error || `Server error: ${res.status}`;
            throw new Error(msg);
          }
          return data;
        });
      })
      .then((data) => {
        setPodcasts(data);
        setError("");
      })
      .catch((err) => {
        console.error("Podcast fetch error:", err);
        setError(err.message || "Failed to load podcasts.");
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteClick = (p) => {
    setPodcastToDelete(p);
  };

  const confirmDelete = async () => {
    if (!podcastToDelete) return;
    const { id, title } = podcastToDelete;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/podcasts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setPodcasts(podcasts.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete podcast");
      }
    } catch (err) {
      alert("Error deleting podcast");
    } finally {
      setPodcastToDelete(null);
    }
  };

  // Helper to get YouTube embed URL from full URL
  const getEmbedUrl = (url) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/,
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:pb-32 pb-24">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Podcasts
      </h1>

      {loading && <div className="flex justify-center my-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div></div>}
      {error && <p className="text-center py-10 text-red-500">{error}</p>}

      {!loading && !error && podcasts.length === 0 && (
        <p className="text-center py-10 text-gray-500">No podcasts found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
        {podcasts.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-card rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
          >
            <div className="relative aspect-video">
              {playingVideoId === p.id ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={getEmbedUrl(p.youtubeUrl) + "?autoplay=1"}
                  title={p.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div
                  className="relative cursor-pointer group h-full"
                  onClick={() => setPlayingVideoId(p.id)}
                >
                  <img
                    src={p.thumbnail || `https://img.youtube.com/vi/${p.youtubeUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/)?.[1] || ""}/0.jpg`}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 sm:p-5 flex justify-between items-start gap-3">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {p.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 line-clamp-2">
                  {p.description}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(p);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <FaTrash size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {podcastToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/20 rounded-2xl shadow-2xl max-w-sm w-full p-8 transform animate-scale-in text-white text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center">
                <FaTrash size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Delete Episode?</h2>
            <p className="text-white/80 mb-8 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-white underline underline-offset-4">"{podcastToDelete.title}"</span>? This action is permanent.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="w-full py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setPodcastToDelete(null)}
                className="w-full py-3 rounded-lg border border-white/30 text-white font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
              >
                Keep Episode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
