import React, { useContext } from "react";
import { AudioContext } from "../context/AudioContext";
import { artists as defaultArtists } from "../data/song";
import { FiHeart } from "react-icons/fi";
import { FaHeart, FaMusic } from "react-icons/fa";
import "./RightPanel.css";

const RightPanel = () => {
  const { currentSong, likedSongs, toggleLikeSong } = useContext(AudioContext);

  if (!currentSong) {
    return (
      <div className="right-panel empty">
        <div className="empty-panel-content">
          <FaMusic className="empty-music-icon" />
          <p>Play a song to see details here.</p>
        </div>
      </div>
    );
  }

  const isLiked = likedSongs.some((s) => s.id === currentSong.id);
  
  const artistInfo = defaultArtists.find(
    (a) => a.name && currentSong.artist && a.name.toLowerCase() === currentSong.artist.toLowerCase()
  );

  return (
    <div className="right-panel">
      <div className="right-panel-header">
        <span className="panel-title">{currentSong.album || "Now Playing"}</span>
      </div>

      <div className="right-panel-scrollable">
        <div className="cover-container">
          <img
            src={currentSong.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=350&auto=format&fit=crop&q=80"}
            alt={currentSong.title || "Song Cover"}
            className="right-song-cover"
          />
        </div>

        <div className="right-song-info">
          <div className="text-details">
            <h2 className="song-name">{currentSong.title || "Unknown Title"}</h2>
            <span className="song-artist">{currentSong.artist || "Unknown Artist"}</span>
          </div>
          <button
            className={`like-btn ${isLiked ? "liked" : ""}`}
            onClick={() => toggleLikeSong(currentSong)}
            title={isLiked ? "Remove from Library" : "Save to Liked Songs"}
          >
            {isLiked ? <FaHeart /> : <FiHeart />}
          </button>
        </div>

        {currentSong.lyrics && (
          <div className="lyrics-card">
            <h3>Lyrics</h3>
            <p className="lyrics-text">{currentSong.lyrics}</p>
          </div>
        )}

        {artistInfo && (
          <div className="artist-about-card">
            <div className="artist-about-header">
              <h3>About the Artist</h3>
            </div>
            <div className="artist-profile-banner">
              <img
                src={artistInfo.avatar || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=350&auto=format&fit=crop&q=80"}
                alt={artistInfo.name}
                className="artist-avatar"
              />
              <div className="artist-avatar-overlay">
                <span className="artist-name">{artistInfo.name}</span>
              </div>
            </div>
            <div className="artist-bio-container">
              <p className="artist-bio">{artistInfo.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
