import React, { createContext, useState, useEffect, useRef } from "react";
import { songs as defaultSongs, albums as defaultAlbums } from "../data/song";

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem("spotify_current_user") || "";
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("spotify_authenticated") === "true";
  });

  const loginUser = (email, password) => {
    if (email.trim() && password.trim()) {
      const username = email.trim().toLowerCase();
      localStorage.setItem("spotify_current_user", username);
      localStorage.setItem("spotify_authenticated", "true");
      setCurrentUser(username);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    localStorage.removeItem("spotify_current_user");
    localStorage.setItem("spotify_authenticated", "false");
    setIsAuthenticated(false);
    setCurrentUser("");
    setIsPlaying(false);
  };

  const [songs, setSongs] = useState(defaultSongs);
  const [albums, setAlbums] = useState(defaultAlbums);
  const [currentSong, setCurrentSong] = useState(defaultSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState("none"); // "none" | "all" | "one"

  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  // Load user-specific library data
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      setLikedSongs([]);
      setPlaylists([
        {
          id: "playlist-bollywood",
          name: "Bollywood Hits",
          description: "Soulful melodies and high-energy tracks from Hindi cinema.",
          cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80",
          songs: []
        },
        {
          id: "playlist-hollywood",
          name: "Hollywood Hits",
          description: "Top Western hits and chart-toppers.",
          cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
          songs: [defaultSongs[0]]
        }
      ]);
      return;
    }

    const savedLiked = localStorage.getItem(`spotify_liked_songs_${currentUser}`);
    if (savedLiked) {
      setLikedSongs(JSON.parse(savedLiked));
    } else {
      setLikedSongs([]);
    }

    const savedPlaylists = localStorage.getItem(`spotify_playlists_${currentUser}`);
    if (savedPlaylists) {
      let parsed = JSON.parse(savedPlaylists);
      // Clean up old default playlists
      parsed = parsed.filter(
        (pl) => pl.id !== "playlist-chill" && pl.id !== "playlist-focus"
      );

      const hasBollywood = parsed.some(
        (pl) => pl.id === "playlist-bollywood" || pl.name === "Bollywood Hits"
      );
      const hasHollywood = parsed.some(
        (pl) => pl.id === "playlist-hollywood" || pl.name === "Hollywood Hits"
      );

      if (!hasBollywood) {
        parsed.unshift({
          id: "playlist-bollywood",
          name: "Bollywood Hits",
          description: "Soulful melodies and high-energy tracks from Hindi cinema.",
          cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80",
          songs: []
        });
      }
      if (!hasHollywood) {
        parsed.unshift({
          id: "playlist-hollywood",
          name: "Hollywood Hits",
          description: "Top Western hits and chart-toppers.",
          cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
          songs: []
        });
      }
      setPlaylists(parsed);
    } else {
      setPlaylists([
        {
          id: "playlist-bollywood",
          name: "Bollywood Hits",
          description: "Soulful melodies and high-energy tracks from Hindi cinema.",
          cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80",
          songs: []
        },
        {
          id: "playlist-hollywood",
          name: "Hollywood Hits",
          description: "Top Western hits and chart-toppers.",
          cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
          songs: []
        }
      ]);
    }
  }, [currentUser, isAuthenticated]);

  // Sync changes back to LocalStorage
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      localStorage.setItem(`spotify_liked_songs_${currentUser}`, JSON.stringify(likedSongs));
    }
  }, [likedSongs, currentUser, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      localStorage.setItem(`spotify_playlists_${currentUser}`, JSON.stringify(playlists));
    }
  }, [playlists, currentUser, isAuthenticated]);

  const [queue, setQueue] = useState(defaultSongs);
  const [songIndex, setSongIndex] = useState(0);

  const audioRef = useRef(new Audio());

  // Fetch a startup mix of Taylor Swift and Hindi music when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setSongs(defaultSongs);
      setCurrentSong(defaultSongs[0]);
      setQueue(defaultSongs);
      setSongIndex(0);
      setAlbums(defaultAlbums);
      return;
    }

    const fetchStartupMusic = async () => {
      try {
        const artistsToFetch = ["Taylor Swift", "Arijit Singh", "Pritam", "A.R. Rahman"];
        const fetchPromises = artistsToFetch.map((artist, idx) =>
          fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&media=music&limit=6`
          )
            .then((res) => res.json())
            .catch((err) => {
              console.error(`Failed to fetch startup music for ${artist}:`, err);
              return { results: [] };
            })
        );

        const results = await Promise.all(fetchPromises);
        let allTracks = [];

        results.forEach((data, index) => {
          if (data.results && data.results.length > 0) {
            const playableTracks = data.results.filter((track) => track.previewUrl);
            
            const formatted = playableTracks.map((track) => ({
              id: track.trackId,
              title: track.trackName,
              artist: track.artistName,
              album: track.collectionName || "Single",
              image: track.artworkUrl100 
                ? track.artworkUrl100.replace("100x100bb", "500x500bb") 
                : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=350&auto=format&fit=crop&q=80",
              audio: track.previewUrl,
              duration: `${Math.floor(track.trackTimeMillis / 60000)}:${
                Math.floor((track.trackTimeMillis % 60000) / 1000) < 10 ? "0" : ""
              }${Math.floor((track.trackTimeMillis % 60000) / 1000)}`,
              // Assign a warm color for Taylor Swift, and random theme colors for others
              themeColor: index === 0 ? "rgba(232, 62, 140, 0.8)" : getRandomThemeColor(),
              lyrics: `[Live iTunes Catalog Stream]\n\nYou are listening to a 30-second preview of "${track.trackName}" by ${track.artistName}.\n\nAlbum: ${track.collectionName || "Single"}\nRelease Date: ${new Date(track.releaseDate).getFullYear()}`,
              isApiSong: true
            }));
            
            allTracks = [...allTracks, ...formatted];
          }
        });

        if (allTracks.length > 0) {
          // Shuffle the combined tracks so the list is a mixture of Taylor Swift and Hindi songs
          const shuffledTracks = allTracks.sort(() => 0.5 - Math.random());
          setSongs(shuffledTracks);
          setCurrentSong(shuffledTracks[0]);
          setQueue(shuffledTracks);
          setSongIndex(0);

          // Populate Bollywood & Hollywood playlists from fetched tracks
          const bollywoodSongs = allTracks.filter(
            (t) =>
              t.artist === "Arijit Singh" ||
              t.artist === "Pritam" ||
              t.artist === "A.R. Rahman"
          );
          const hollywoodSongs = allTracks.filter((t) => t.artist === "Taylor Swift");

          setPlaylists((prev) => {
            let filtered = prev.filter(
              (pl) => pl.id !== "playlist-chill" && pl.id !== "playlist-focus"
            );

            const bollywoodIdx = filtered.findIndex((pl) => pl.id === "playlist-bollywood");
            if (bollywoodIdx !== -1) {
              filtered[bollywoodIdx] = {
                ...filtered[bollywoodIdx],
                songs: bollywoodSongs
              };
            } else {
              filtered.unshift({
                id: "playlist-bollywood",
                name: "Bollywood Hits",
                description: "Soulful melodies and high-energy tracks from Hindi cinema.",
                cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80",
                songs: bollywoodSongs
              });
            }

            const hollywoodIdx = filtered.findIndex((pl) => pl.id === "playlist-hollywood");
            if (hollywoodIdx !== -1) {
              filtered[hollywoodIdx] = {
                ...filtered[hollywoodIdx],
                songs: hollywoodSongs
              };
            } else {
              filtered.unshift({
                id: "playlist-hollywood",
                name: "Hollywood Hits",
                description: "Top Western hits and chart-toppers.",
                cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
                songs: hollywoodSongs
              });
            }
            return filtered;
          });

          // Group fetched tracks into dynamic albums to show real Bollywood and Hollywood albums
          const albumMap = {};
          allTracks.forEach((track) => {
            const albumName = track.album;
            if (!albumMap[albumName]) {
              albumMap[albumName] = {
                id: `album-${track.id}`,
                name: albumName,
                artist: track.artist,
                cover: track.image,
                year: "2026",
                themeColor: track.themeColor || "rgba(26, 115, 232, 0.8)",
                tracks: []
              };
            }
            albumMap[albumName].tracks.push(track);
          });
          const dynamicAlbums = Object.values(albumMap);
          setAlbums(dynamicAlbums);
        }
      } catch (err) {
        console.error("Failed to fetch startup hybrid music:", err);
      }
    };

    fetchStartupMusic();
  }, [isAuthenticated]);

  const getRandomThemeColor = () => {
    const colors = [
      "rgba(26, 115, 232, 0.8)",
      "rgba(220, 53, 69, 0.8)",
      "rgba(111, 66, 193, 0.8)",
      "rgba(253, 126, 20, 0.8)",
      "rgba(40, 167, 69, 0.8)",
      "rgba(232, 62, 140, 0.8)",
      "rgba(32, 201, 151, 0.8)",
      "rgba(255, 255, 255, 0.15)",
      "rgba(23, 162, 184, 0.8)"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Mount/Unmount single Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const setAudioData = () => {
      setDuration(audio.duration || 0);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      handleSongEnded();
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("durationchange", setAudioData);
    audio.addEventListener("canplay", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("durationchange", setAudioData);
      audio.removeEventListener("canplay", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Update src and load on currentSong change
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;
    const audio = audioRef.current;

    audio.pause();
    
    // Set new source
    audio.src = currentSong.audio;
    audio.load();
    
    // Sync settings
    audio.volume = volume;
    audio.muted = isMuted;
    
    // Reset durations
    setCurrentTime(0);
    setDuration(0);

    // Auto-play if isPlaying state is true
    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Playback error on song switch:", err);
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  // Sync play/pause commands
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (isPlaying) {
      if (!audio.src && currentSong?.audio) {
        audio.src = currentSong.audio;
      }
      audio.play().catch((err) => {
        console.warn("Playback failed on play-state change:", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Control volume and mute
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
  }, [volume, isMuted]);

  // Handler for song ending
  const handleSongEnded = () => {
    if (isRepeat === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      nextSong();
    }
  };

  // Play a specific song and optionally update the queue context
  const playSong = (song, newQueue = null) => {
    if (newQueue) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((s) => s.id === song.id);
      setSongIndex(idx !== -1 ? idx : 0);
    } else {
      const idx = queue.findIndex((s) => s.id === song.id);
      if (idx !== -1) {
        setSongIndex(idx);
      } else {
        const updatedQueue = [...queue, song];
        setQueue(updatedQueue);
        setSongIndex(updatedQueue.length - 1);
      }
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    setCurrentSong(song);
    setIsPlaying(true);
  };

  // Fetch and play all songs of a given artist
  const playArtistSongs = async (artistName) => {
    if (!artistName) return;

    // 1. Search if we already have songs by this artist in our current songs list
    const existing = songs.filter(
      (s) => s.artist && s.artist.toLowerCase() === artistName.toLowerCase()
    );
    if (existing.length > 0) {
      playSong(existing[0], existing);
      return;
    }

    // 2. Otherwise, fetch dynamically from iTunes API
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&media=music&limit=25`
      );
      const data = await res.json();
      
      if (data.results && data.results.length > 0) {
        const playableTracks = data.results.filter((track) => track.previewUrl);
        
        if (playableTracks.length > 0) {
          const formatted = playableTracks.slice(0, 20).map((track) => ({
            id: track.trackId,
            title: track.trackName,
            artist: track.artistName,
            album: track.collectionName || "Single",
            image: track.artworkUrl100 
              ? track.artworkUrl100.replace("100x100bb", "500x500bb") 
              : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=350&auto=format&fit=crop&q=80",
            audio: track.previewUrl,
            duration: `${Math.floor(track.trackTimeMillis / 60000)}:${
              Math.floor((track.trackTimeMillis % 60000) / 1000) < 10 ? "0" : ""
            }${Math.floor((track.trackTimeMillis % 60000) / 1000)}`,
            themeColor: getRandomThemeColor(),
            lyrics: `[Live iTunes Catalog Stream]\n\nYou are listening to a 30-second preview of "${track.trackName}" by ${track.artistName}.\n\nAlbum: ${track.collectionName || "Single"}\nRelease Date: ${new Date(track.releaseDate).getFullYear()}`,
            isApiSong: true
          }));
          
          setSongs(formatted);
          playSong(formatted[0], formatted);
        }
      }
    } catch (err) {
      console.error("Failed to fetch artist songs:", err);
    }
  };

  const playPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const nextSong = () => {
    if (queue.length === 0) return;

    let nextIdx = songIndex;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = songIndex + 1;
      if (nextIdx >= queue.length) {
        if (isRepeat === "all") {
          nextIdx = 0;
        } else {
          setIsPlaying(false);
          if (audioRef.current) audioRef.current.currentTime = 0;
          return;
        }
      }
    }

    setSongIndex(nextIdx);
    setCurrentSong(queue[nextIdx]);
    setIsPlaying(true);
  };

  const prevSong = () => {
    if (!audioRef.current || queue.length === 0) return;

    if (audioRef.current.currentTime > 4) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    let prevIdx = songIndex - 1;
    if (isShuffle) {
      prevIdx = Math.floor(Math.random() * queue.length);
    } else {
      if (prevIdx < 0) {
        if (isRepeat === "all") {
          prevIdx = queue.length - 1;
        } else {
          audioRef.current.currentTime = 0;
          setCurrentTime(0);
          return;
        }
      }
    }

    setSongIndex(prevIdx);
    setCurrentSong(queue[prevIdx]);
    setIsPlaying(true);
  };

  const seek = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const changeVolume = (val) => {
    setVolume(val);
    if (val > 0) setIsMuted(false);
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const toggleRepeat = () => {
    setIsRepeat((prev) => {
      if (prev === "none") return "all";
      if (prev === "all") return "one";
      return "none";
    });
  };

  const toggleLikeSong = (song) => {
    setLikedSongs((prev) => {
      const isLiked = prev.some((s) => s.id === song.id);
      if (isLiked) {
        return prev.filter((s) => s.id !== song.id);
      } else {
        return [...prev, song];
      }
    });
  };

  const createPlaylist = (name = "", desc = "") => {
    const num = playlists.length + 1;
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name: name || `My Playlist #${num}`,
      description: desc || "A brand new custom playlist.",
      cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80",
      songs: []
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
    return newPlaylist.id;
  };

  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.songs.some((s) => s.id === song.id)) return pl;
          return { ...pl, songs: [...pl.songs, song] };
        }
        return pl;
      })
    );
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, songs: pl.songs.filter((s) => s.id !== songId) };
        }
        return pl;
      })
    );
  };

  const updatePlaylistDetails = (playlistId, name, desc) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, name, description: desc };
        }
        return pl;
      })
    );
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
  };

  return (
    <AudioContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loginUser,
        logoutUser,
        songs,
        albums,
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        isRepeat,
        likedSongs,
        playlists,
        queue,
        songIndex,
        playSong,
        playArtistSongs,
        playPause,
        nextSong,
        prevSong,
        seek,
        toggleMute,
        changeVolume,
        toggleShuffle,
        toggleRepeat,
        toggleLikeSong,
        createPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        updatePlaylistDetails,
        deletePlaylist,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
