import { useEffect, useState } from "react";

export function Podcast() {
  const [podcasts, setPodcasts] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch podcasts from backend
    setLoading(true);
    fetch("http://localhost:5000/api/podcasts")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setPodcasts(data);
        setError("");
      })
      .catch((err) => {
        console.error("Podcast fetch error:", err);
        setError(
          "Failed to load podcasts. Please ensure the backend is running.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  // Helper to get YouTube embed URL from full URL
  const getEmbedUrl = (url) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/,
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:pb-32 pb-24">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Podcasts
      </h1>

      {loading && <div className="flex justify-center my-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div></div>}
      {error && <p className="text-center py-10 text-red-500">{error}</p>}

      {!loading && !error && podcasts.length === 0 && (
        <p className="text-center py-10 text-gray-500">No podcasts found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    src={
                      p.thumbnail ||
                      `https://img.youtube.com/vi/${getEmbedUrl(p.youtubeUrl)?.split("/").pop()}/0.jpg`
                    }
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
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {p.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                {p.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
