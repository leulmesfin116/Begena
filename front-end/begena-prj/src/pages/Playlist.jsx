import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAudio } from "../context/AudioContext";
import {
  FaPlay,
  FaPause,
  FaTrash,
  FaPlus,
  FaChevronDown,
  FaTimes,
  FaMusic
} from "react-icons/fa";
import { normalizeSongMedia } from "../utils/mediaUrl";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Server returned invalid data. Check API URL/backend.");
  }
}

export function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { playSong, currentSong, isPlaying } = useAudio();

  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your playlists.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/play`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch((err) => {
        throw new Error(
          "Network error: Could not connect to server. Please check if the backend is running."
        );
      });

      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error(
          data.message || data.error || `Server error: ${res.status}`,
        );
      }
      
      // Ensure data is an array before setting
      if (Array.isArray(data)) {
        setPlaylists(data);
      } else {
        setPlaylists([]);
        console.error("Expected array but got:", data);
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      setCreating(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/play`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newPlaylistName }),
      });

      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Failed to create playlist",
        );
      }

      setNewPlaylistName("");
      // refetch to ensure we get exactly what is in DB
      fetchPlaylists();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const confirmDeletePlaylist = async () => {
    if (!playlistToDelete) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/play/${playlistToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Failed to delete playlist",
        );
      }

      setPlaylists((prev) => prev.filter((p) => p.id !== playlistToDelete.id));
      if (expandedId === playlistToDelete.id) setExpandedId(null);
      setPlaylistToDelete(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRemoveSong = async (playlistId, songId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/play/remove-song`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ playlistId, songId }),
      });

      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to remove song");
      }

      // Update local state without refetching all playlists
      setPlaylists((prev) =>
        prev.map((p) => {
          if (p.id === playlistId) {
            return {
              ...p,
              songs: p.songs.filter((s) => s.songId !== songId),
            };
          }
          return p;
        })
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const getMappedSongs = (playlistSongs) => {
    if (!playlistSongs) return [];
    return playlistSongs.map((ps) =>
      normalizeSongMedia(ps.song, API_BASE_URL),
    );
  };

  const handlePlayPlaylist = (playlist, e) => {
    e.stopPropagation();
    if (!playlist.songs || playlist.songs.length === 0) return;
    const mappedSongs = getMappedSongs(playlist.songs);
    playSong(mappedSongs[0], mappedSongs);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:pb-32 pb-24 border-none">
      <div className="mb-8 mt-4 sm:mt-8">
        <h1 className="text-black dark:text-white text-3xl sm:text-4xl font-bold text-center flex items-center justify-center gap-3">
          <FaMusic className="text-black dark:text-foreground" /> Your Playlists
        </h1>
      </div>

      <form 
        onSubmit={handleCreatePlaylist} 
        className="flex gap-3 max-w-xl mx-auto mb-10 bg-white dark:bg-card p-2 rounded-xl shadow-sm border border-gray-100 dark:border-border focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white transition-shadow outline-none"
      >
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="Give your new playlist a name..."
          className="flex-1 px-4 py-2 bg-transparent text-black dark:text-white outline-none placeholder-gray-400 w-full"
        />
        <button
          type="submit"
          disabled={creating || !newPlaylistName.trim()}
          className="px-5 sm:px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
        >
          <FaPlus size={14} /> <span className="hidden sm:inline">{creating ? "Creating..." : "Create"}</span>
        </button>
      </form>

      {loading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
        </div>
      )}
      
      {error && (
        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg mb-8 max-w-xl mx-auto border border-red-100 dark:border-red-900/50">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {playlists.length === 0 ? (
            <div className="text-center text-gray-500 my-16 flex flex-col items-center animate-fade-in">
              <div className="w-24 h-24 bg-gray-100 dark:bg-muted rounded-full flex items-center justify-center mb-4 shadow-inner">
                <FaMusic size={32} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-xl font-medium text-gray-800 dark:text-gray-200">No playlists found</p>
              <p className="text-sm mt-2 text-gray-500 max-w-sm">Create your first playlist above to start saving your favorite tracks.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5">
              {playlists.map((playlist) => {
                const isExpanded = expandedId === playlist.id;
                const mappedSongs = getMappedSongs(playlist.songs);
                const isCurrentPlayingList = mappedSongs.some(s => s.id === currentSong?.id) && isPlaying;
                
                return (
                  <div 
                    key={playlist.id} 
                    className={`bg-white dark:bg-card rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${
                      isExpanded 
                        ? 'border-gray-900 dark:border-white shadow-md ring-1 ring-black/5 dark:ring-white/5' 
                        : 'border-gray-100 dark:border-border hover:border-gray-300 dark:hover:border-accent hover:shadow-md'
                    }`}
                  >
                    {/* Playlist Header */}
                    <div 
                      className={`flex items-center justify-between p-4 sm:p-5 cursor-pointer relative transition-colors ${
                        isExpanded ? 'bg-gray-50 dark:bg-gray-700/30' : ''
                      }`}
                      onClick={() => toggleExpand(playlist.id)}
                    >
                      {/* Left side: Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                          mappedSongs.length > 0 
                            ? 'from-gray-800 to-black dark:from-gray-200 dark:to-white text-white dark:text-black shadow-lg shadow-black/10' 
                            : 'from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 shadow-sm'
                        } shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                          <FaMusic size={22} className={isCurrentPlayingList ? "animate-pulse" : ""} />
                        </div>
                        
                        <div className="flex flex-col min-w-0 pr-4">
                          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                            {playlist.name}
                          </h2>
                          <p className="text-sm text-gray-500 font-medium tracking-wide">
                            {mappedSongs.length} {mappedSongs.length === 1 ? 'TRACK' : 'TRACKS'}
                          </p>
                        </div>
                      </div>

                      {/* Right side: Actions */}
                      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                        {mappedSongs.length > 0 && (
                          <button
                            onClick={(e) => handlePlayPlaylist(playlist, e)}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md flex-shrink-0
                              ${isCurrentPlayingList 
                                ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 shadow-black/30' 
                                : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                              }`}
                            title={isCurrentPlayingList ? "Playing from playlist..." : "Play Playlist"}
                          >
                            {isCurrentPlayingList ? (
                              <div className="flex gap-1 justify-center items-center h-4">
                                <span className="w-1 h-3 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1 h-4 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1 h-3 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                              </div>
                            ) : (
                              <FaPlay size={14} className="ml-1" />
                            )}
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlaylistToDelete(playlist);
                          }}
                          className="w-10 h-10 rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-muted text-gray-400 hover:text-black dark:hover:text-white flex items-center justify-center transition-colors"
                          title="Delete Playlist"
                        >
                          <FaTrash size={15} />
                        </button>

                        <div className={`w-8 h-8 flex items-center justify-center text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-black dark:text-white' : ''}`}>
                          <FaChevronDown />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content: Songs List */}
                    <div 
                      className={`transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="border-t border-gray-100 dark:border-border/50 bg-gray-50/80 dark:bg-background/40 p-3 sm:p-5">
                        {mappedSongs.length === 0 ? (
                          <div className="text-center py-10 text-gray-500">
                            <div className="w-16 h-16 bg-gray-200 dark:bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                              <FaMusic className="text-gray-400" size={24} />
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">This playlist is empty</p>
                            <p className="text-xs mt-1 mb-5 max-w-xs mx-auto text-gray-400">Add songs from the new music releases.</p>
                            <Link 
                              to="/newMusic" 
                              state={{ fromPlaylist: true }}
                              className="inline-flex items-center gap-2 px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 shadow-sm"
                            >
                              <FaPlus size={12} /> Add Songs
                            </Link>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 sm:gap-2">
                            {mappedSongs.map((song, index) => {
                              const isCurrentPlaying = currentSong?.id === song.id && isPlaying;
                              return (
                                <div 
                                  key={song.id} 
                                  className="group flex items-center justify-between p-2 sm:p-3 hover:bg-white dark:hover:bg-muted rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-border hover:shadow-sm"
                                >
                                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                     <span className="text-sm font-medium text-gray-400 w-4 sm:w-6 text-center tabular-nums hidden sm:block">
                                        {index + 1}
                                     </span>
                                     <div className="relative shrink-0">
                                       <img 
                                        src={song.posterUrl} 
                                        alt={song.title} 
                                        className="w-12 h-12 object-cover rounded-lg shadow-sm"
                                       />
                                       {isCurrentPlaying && (
                                         <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center backdrop-blur-[1px]">
                                           <div className="flex gap-0.5">
                                             <div className="w-1 h-3 bg-white animate-[pulse_1s_ease-in-out_infinite]" />
                                             <div className="w-1 h-2 bg-white animate-[pulse_1s_ease-in-out_infinite_200ms]" />
                                             <div className="w-1 h-4 bg-white animate-[pulse_1s_ease-in-out_infinite_400ms]" />
                                           </div>
                                         </div>
                                       )}
                                     </div>
                                     <div className="flex flex-col truncate pr-2">
                                       <span className={`font-semibold text-sm sm:text-base truncate ${isCurrentPlaying ? 'text-black dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                          {song.title}
                                       </span>
                                       <span className="text-xs sm:text-sm text-gray-500 truncate mt-0.5 opacity-80">
                                          {song.artist}
                                       </span>
                                     </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                                    <button
                                      onClick={() => playSong(song, mappedSongs)}
                                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-800 hover:text-black hover:bg-gray-200 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-700 transition-all"
                                      title={isCurrentPlaying ? "Pause" : "Play track"}
                                    >
                                      {isCurrentPlaying ? <FaPause size={12} /> : <FaPlay size={12} className="ml-0.5" />}
                                    </button>
                                    <button
                                      onClick={(e) => handleRemoveSong(playlist.id, song.id, e)}
                                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                      title="Remove from playlist"
                                    >
                                      <FaTimes size={14} />
                                    </button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Custom Delete Confirmation Modal */}
      {playlistToDelete && (
        <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center p-4 transition-all">
          <div className="bg-white dark:bg-background rounded-2xl shadow-2xl border border-gray-200 dark:border-border w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Playlist?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Are you sure you want to delete <span className="font-semibold text-black dark:text-white">"{playlistToDelete.name}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-card/50 px-6 py-4 flex gap-3 justify-end border-t border-gray-100 dark:border-border">
              <button
                onClick={() => setPlaylistToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg hover:bg-gray-50 dark:hover:bg-accent transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePlaylist}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
