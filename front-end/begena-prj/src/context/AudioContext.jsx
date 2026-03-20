import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

const AudioContext = createContext();

export function useAudio() {
  return useContext(AudioContext);
}

export function AudioProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [likedSongs, setLikedSongs] = useState(new Set());
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none"); // "none", "one", "all"
  const audioRef = useRef(null);

  const fetchLikes = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLikedSongs(new Set());
        return;
      }

      const res = await fetch("http://localhost:5000/fav", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const likedIds = new Set(
          data.filter((song) => song !== null).map((song) => song.id),
        );
        setLikedSongs(likedIds);
      }
    } catch (err) {
      console.error("Error fetching likes:", err);
    }
  }, []);

  // Fetch likes on mount and when token might have changed (e.g., focus)
  useEffect(() => {
    fetchLikes();
    window.addEventListener("focus", fetchLikes);
    return () => window.removeEventListener("focus", fetchLikes);
  }, [fetchLikes]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.error("Autoplay prevented:", e);
          setIsPlaying(false);
        });
        

    }
  }, [currentSong]);

  const playSong = (song, songList = []) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      if (songList.length > 0) {
        setPlaylist(songList);
        const idx = songList.findIndex((s) => s.id === song.id);
        setCurrentIndex(idx >= 0 ? idx : 0);
      }
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
    }
  };

  const toggleLike = async (songId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
      }

      const res = await fetch("http://localhost:5000/fav/addtoFav", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ songId }),
      });

      if (res.ok) {
        const data = await res.json();
        setLikedSongs((prev) => {
          const newSet = new Set(prev);
          if (data.removed) {
            newSet.delete(songId);
          } else {
            newSet.add(songId);
          }
          return newSet;
        });
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const toggleShuffle = () => setIsShuffle((prev) => !prev);
  const toggleRepeatMode = () => {
    setRepeatMode((prev) => {
      if (prev === "none") return "all";
      if (prev === "all") return "one";
      return "none";
    });
  };

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;

    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
      // Try to avoid playing the same song again if playlist has more than 1 song
      if (nextIndex === currentIndex && playlist.length > 1) {
        nextIndex = (nextIndex + 1) % playlist.length;
      }
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
      // If we are at the end and repeatMode is none, don't loop back
      if (nextIndex === 0 && repeatMode === "none" && currentIndex !== -1) {
        setIsPlaying(false);
        return;
      }
    }

    setCurrentIndex(nextIndex);
    setCurrentSong(playlist[nextIndex]);
    setIsPlaying(true);
  }, [playlist, currentIndex, isShuffle, repeatMode]);

  const playPrev = useCallback(() => {
    if (playlist.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    setCurrentSong(playlist[prevIndex]);
    setIsPlaying(true);
  }, [playlist, currentIndex]);

  const seekTo = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onEnded = () => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else if (playlist.length > 0) {
      if (repeatMode === "none" && currentIndex === playlist.length - 1) {
        setIsPlaying(false);
      } else {
        playNext();
      }
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        togglePlay,
        playNext,
        playPrev,
        seekTo,
        currentTime,
        duration,
        playlist,
        likedSongs,
        toggleLike,
        isShuffle,
        toggleShuffle,
        repeatMode,
        toggleRepeatMode,
        refreshLikes: fetchLikes,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        src={currentSong?.audioUrl}
        onEnded={onEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      />
    </AudioContext.Provider>
  );
}
