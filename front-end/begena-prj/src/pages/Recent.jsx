import React, { useState, useEffect } from "react";
import { useAudio } from "../context/AudioContext";
import { FaPlay, FaPause, FaHeart, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export function Recent() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openPlaylistMenuId, setOpenPlaylistMenuId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const { playSong, currentSong, isPlaying, likedSongs, toggleLike } = useAudio();

  useEffect(() => {
    const fetchRecentAndPlaylists = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to see your recently played music.");
          setLoading(false);
          return;
        }

        // Fetch recently played songs
        const recentRes = await fetch("http://localhost:5000/recent/played", {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(err => {
          throw new Error("Network error: Could not connect to server.");
        });
        
        if (!recentRes.ok) {
          const errData = await recentRes.json().catch(() => ({}));
          throw new Error(errData.message || errData.error || `Server error: ${recentRes.status}`);
        }
        
        const recentData = await recentRes.json();
        const mapped = recentData
          .filter((song) => song !== null)
          .map((song) => {
            let pUrl = song.posterUrl || "/default-poster.jpg";
            if (pUrl && !pUrl.startsWith("http") && !pUrl.startsWith("/")) {
              pUrl = `http://localhost:5000/uploads/${pUrl}`;
            }
            let aUrl = song.audioUrl || song.url;
            if (aUrl && !aUrl.startsWith("http") && !aUrl.startsWith("/")) {
              aUrl = `http://localhost:5000/uploads/${aUrl}`;
            }
            return {
              ...song,
              audioUrl: aUrl,
              posterUrl: pUrl,
              artist: song.artist || "Unknown Artist",
            };
          });
        setSongs(mapped);

        // Fetch playlists
        const playRes = await fetch("http://localhost:5000/play", {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null);
        
        if (playRes && playRes.ok) {
          const playData = await playRes.json();
          if (Array.isArray(playData)) {
            setPlaylists(playData);
          }
        }
      } catch (err) {
        console.error("Recent fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAndPlaylists();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenPlaylistMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleAddToPlaylist = async (playlistId, songId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/play/add-song", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ playlistId, songId }),
      });
      
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to add song");
      }
      
      showToast("Added to playlist!");
      setOpenPlaylistMenuId(null);
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  if (loading) return <div className="flex justify-center my-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div></div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:pb-32 pb-24 border-none">
      <h1 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">Recently Played</h1>

      {error ? (
        <p className="text-center text-red-500 mt-10 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-xl mx-auto">{error}</p>
      ) : songs.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">You haven't played anything yet!</p>
          <p className="text-sm mt-1 mb-5 max-w-xs mx-auto text-gray-400">Discover and play some tracks to see them appear here.</p>
          <Link 
            to="/newMusic" 
            className="inline-flex items-center gap-2 px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 shadow-sm"
          >
            Explore Music
          </Link>
        </div>
      ) : (
        <>
          {toastMsg && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-lg transition-all animate-fade-in">
              {toastMsg}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {songs.map((song) => (
              <div
                key={song.id}
                className="group flex flex-col sm:flex-row sm:items-center bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 rounded-2xl p-4 gap-4 transition-all"
              >
                {/* Poster */}
                <div className="relative shrink-0 w-full sm:w-20">
                  <img
                    src={song.posterUrl}
                    alt={song.title}
                    className="w-full sm:w-20 h-48 sm:h-20 object-cover rounded-xl shadow-sm"
                  />
                  {currentSong?.id === song.id && isPlaying && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>

                {/* Song info */}
                <div className="flex-1 min-w-0 px-1 sm:px-0">
                  <h2 className={`font-bold text-lg truncate ${currentSong?.id === song.id ? 'text-black dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                    {song.title}
                  </h2>
                  <p className="text-gray-500 text-sm truncate">{song.artist}</p>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-2 sm:mt-0 w-full sm:w-auto">
                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(song.id)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors ${
                      likedSongs.has(song.id) 
                        ? "text-red-500 bg-red-50 dark:bg-red-900/20" 
                        : "text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    title="Like"
                  >
                    <FaHeart size={18} />
                  </button>

                  {/* Add to Playlist Dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenPlaylistMenuId(openPlaylistMenuId === song.id ? null : song.id);
                      }}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors ${
                        openPlaylistMenuId === song.id 
                          ? "bg-gray-200 dark:bg-gray-600 text-black dark:text-white" 
                          : "text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      title="Add to Playlist"
                    >
                      <FaPlus size={16} />
                    </button>
                    
                    {openPlaylistMenuId === song.id && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 sm:right-1/2 sm:translate-x-1/2 top-12 sm:top-auto sm:bottom-14 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right sm:origin-bottom"
                      >
                        <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Add to Playlist</p>
                        </div>
                        <div className="max-h-56 overflow-y-auto overscroll-contain">
                          {playlists.length === 0 ? (
                            <p className="p-4 text-sm text-center text-gray-500">No playlists available.</p>
                          ) : (
                            <div className="py-1">
                              {playlists.map(pl => (
                                <button
                                  key={pl.id}
                                  onClick={() => handleAddToPlaylist(pl.id, song.id)}
                                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate active:bg-gray-200 dark:active:bg-gray-600"
                                >
                                  {pl.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={() => playSong(song, songs)}
                    className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center transition-all hover:scale-105 shadow-md flex-shrink-0"
                    title={currentSong?.id === song.id && isPlaying ? "Pause" : "Play"}
                  >
                    {currentSong?.id === song.id && isPlaying ? (
                      <FaPause size={16} />
                    ) : (
                      <FaPlay size={16} className="ml-1" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
