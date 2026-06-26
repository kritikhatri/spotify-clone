import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AudioContext } from "../context/AudioContext";
import { FaPlay, FaPause, FaClock, FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import Header from "../components/Header";
import "./LikedSongs.css";

const LikedSongs = () => {
  const { likedSongs, playSong, playPause, currentSong, isPlaying, toggleLikeSong } = useContext(AudioContext);
  const navigate = useNavigate();

  const handlePlayLikedSongs = () => {
    if (likedSongs.length === 0) return;
    
    const isCurrentPlayingLiked = currentSong && likedSongs.some((s) => s.id === currentSong.id);
    if (isCurrentPlayingLiked) {
      playPause();
    } else {
      playSong(likedSongs[0], likedSongs);
    }
  };

  const handleRowClick = (song) => {
    playSong(song, likedSongs);
  };

  const isLikedSongsPlaying = 
    isPlaying && 
    currentSong && 
    likedSongs.some((s) => s.id === currentSong.id);

  return (
    <div className="liked-songs-container">
      {/* Top Header Navigation */}
      <Header />

      {/* Gradient Banner Header */}
      <div className="gradient-header" style={{ "--header-gradient-color": "rgb(80, 56, 160)" }}>
        <div className="liked-banner-badge">
          <FaHeart className="banner-heart-icon" />
        </div>
        <div className="liked-banner-details">
          <span className="banner-label">Playlist</span>
          <h1 className="banner-title">Liked Songs</h1>
          <div className="banner-meta">
            <span className="user-name">Kritika Khatri</span>
            <span className="bullet">•</span>
            <span className="song-count">
              {likedSongs.length} {likedSongs.length === 1 ? "song" : "songs"}
            </span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="liked-body">
        {/* Play Action Bar */}
        {likedSongs.length > 0 && (
          <div className="liked-actions">
            <button className="banner-play-btn" onClick={handlePlayLikedSongs}>
              {isLikedSongsPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>
        )}

        {/* Tracklist Table */}
        {likedSongs.length > 0 ? (
          <table className="track-table">
            <thead>
              <tr>
                <th style={{ width: "50px", textAlign: "center" }}>#</th>
                <th>Title</th>
                <th>Album</th>
                <th style={{ width: "100px", textAlign: "right" }}><FaClock /></th>
              </tr>
            </thead>
            <tbody>
              {likedSongs.map((song, index) => {
                const isCurrent = currentSong && currentSong.id === song.id;
                const isPlayingThisRow = isCurrent && isPlaying;

                return (
                  <tr
                    key={song.id}
                    className={`track-row ${isCurrent ? "active" : ""}`}
                    onDoubleClick={() => handleRowClick(song)}
                  >
                    <td style={{ textAlign: "center" }}>
                      <div className="row-number-wrapper">
                        {isPlayingThisRow ? (
                          <div className="equalizer-icon">
                            <span className="equalizer-bar"></span>
                            <span className="equalizer-bar"></span>
                            <span className="equalizer-bar"></span>
                            <span className="equalizer-bar"></span>
                          </div>
                        ) : (
                          <span className="row-index">{index + 1}</span>
                        )}
                        <button 
                          className="row-play-btn"
                          onClick={() => handleRowClick(song)}
                        >
                          {isPlayingThisRow ? <FaPause /> : <FaPlay />}
                        </button>
                      </div>
                    </td>

                    <td>
                      <div className="row-title-details">
                        <img src={song.image} alt={song.title} className="row-song-img" />
                        <div className="row-text-details">
                          <span className="track-title">{song.title}</span>
                          <span className="track-artist">{song.artist}</span>
                        </div>
                      </div>
                    </td>

                    <td>{song.album}</td>

                    <td style={{ textAlign: "right" }}>
                      <div className="row-duration-details">
                        <button
                          className="row-like-btn liked"
                          onClick={() => toggleLikeSong(song)}
                          title="Remove from Liked Songs"
                        >
                          <FaHeart />
                        </button>
                        <span className="duration-text">{song.duration}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-liked-state">
            <div className="empty-liked-badge">
              <FaHeart />
            </div>
            <h2>Songs you like will appear here</h2>
            <p>Save songs by clicking the heart icon in the player or search catalog.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongs;
