import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AudioContext } from "../context/AudioContext";
import { searchCategories } from "../data/song";
import { FaPlay, FaPause, FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import SongCard from "../components/SongCard";
import Header from "../components/Header";
import "./Search.css";c

const Search = () => {
  const { playSong, playPause, currentSong, isPlaying, likedSongs, toggleLikeSong } = useContext(AudioContext);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const searchTimeoutRef = useRef(null);

  const formatDuration = (ms) => {
    if (!ms) return "0:30";
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=25`
        );
        const data = await res.json();
        
        if (data.results) {
          const playableTracks = data.results.filter((track) => track.previewUrl);
          const formatted = playableTracks.map((track) => ({
            id: track.trackId,
            title: track.trackName,
            artist: track.artistName,
            album: track.collectionName || "Single",
            image: track.artworkUrl100 
              ? track.artworkUrl100.replace("100x100bb", "500x500bb") 
              : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
            audio: track.previewUrl,
            duration: formatDuration(track.trackTimeMillis),
            themeColor: "rgba(29, 185, 84, 0.8)",
            lyrics: `[Live iTunes API Stream]\n\nYou are listening to a 30-second preview of "${track.trackName}" by ${track.artistName}.\n\nBuy the full track on Apple Music or stream album "${track.collectionName || "Single"}".`,
            isApiSong: true
          }));
          setSearchResults(formatted);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("iTunes Search API Error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setSearchResults([]);
  };

  const handlePlaySearchResult = (e, track) => {
    e.stopPropagation();
    const isCurrent = currentSong && currentSong.id === track.id;
    if (isCurrent) {
      playPause();
    } else {
      playSong(track, searchResults);
    }
  };

  const topResult = searchResults[0];
  const listResults = searchResults.slice(0, 4);

  return (
    <div className="search-container">
      {/* Header with Search Box */}
      <Header searchQuery={query} setSearchQuery={setQuery} />

      <div className="search-body">
        {isLoading && (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        )}

        {!query && !isLoading && (
          <div className="browse-section">
            <h2 className="section-title">Browse all</h2>
            <div className="categories-grid">
              {searchCategories.map((cat, i) => (
                <div
                  key={i}
                  className="category-card"
                  style={{ backgroundColor: cat.color }}
                  onClick={() => setQuery(cat.title)}
                  role="button"
                  tabIndex={0}
                >
                  <span className="category-title">{cat.title}</span>
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="category-img"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {query && searchResults.length > 0 && !isLoading && (
          <div className="search-results-section">
            <div className="search-results-top-row">
              {topResult && (
                <div className="top-result-container">
                  <h2>Top Result</h2>
                  <div 
                    className="top-result-card"
                    onClick={(e) => handlePlaySearchResult(e, topResult)}
                  >
                    <img
                      src={topResult.image}
                      alt={topResult.title}
                      className="top-result-img"
                    />
                    <h3 className="top-result-name">{topResult.title}</h3>
                    <div className="top-result-info">
                      <span className="top-result-artist">{topResult.artist}</span>
                      <span className="badge">Song</span>
                    </div>
                    <button 
                      className={`top-result-play ${
                        currentSong && currentSong.id === topResult.id && isPlaying ? "playing" : ""
                      }`}
                      onClick={(e) => handlePlaySearchResult(e, topResult)}
                    >
                      {currentSong && currentSong.id === topResult.id && isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                  </div>
                </div>
              )}

              <div className="songs-result-container">
                <h2>Songs</h2>
                <div className="songs-list">
                  {listResults.map((track) => {
                    const isCurrent = currentSong && currentSong.id === track.id;
                    const isLiked = likedSongs.some((s) => s.id === track.id);

                    return (
                      <div
                        key={track.id}
                        className={`search-song-row ${isCurrent ? "active" : ""}`}
                        onClick={(e) => handlePlaySearchResult(e, track)}
                      >
                        <div className="song-row-left">
                          <img
                            src={track.image}
                            alt={track.title}
                            className="song-row-img"
                          />
                          <div className="song-row-details">
                            <span className="song-row-title">{track.title}</span>
                            <span className="song-row-artist">{track.artist}</span>
                          </div>
                        </div>
                        <div className="song-row-right">
                          <button
                            className={`row-like-btn ${isLiked ? "liked" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLikeSong(track);
                            }}
                          >
                            {isLiked ? <FaHeart /> : <FiHeart />}
                          </button>
                          <span className="song-row-duration">{track.duration}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="all-matches-section">
              <h2>All Matches</h2>
              <div className="search-grid-list">
                {searchResults.slice(4).map((track) => (
                  <SongCard key={track.id} song={track} customQueue={searchResults} />
                ))}
              </div>
            </div>
          </div>
        )}

        {query && searchResults.length === 0 && !isLoading && (
          <div className="no-results-state">
            <h2>No results found for "{query}"</h2>
            <p>Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;