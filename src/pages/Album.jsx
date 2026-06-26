import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AudioContext } from "../context/AudioContext";

import { FaPlay, FaPause, FaClock, FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import Header from "../components/Header";
import "./Album.css";

const Album = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentSong, isPlaying, likedSongs, albums, playSong, playPause, toggleLikeSong } = useContext(AudioContext);

  const album = albums.find((alb) => alb.id === id);

  if (!album) {
    return (
      <div className="album-page-empty">
        <h2>Album not found</h2>
        <button onClick={() => navigate("/")} className="pill-btn active">
          Go back Home
        </button>
      </div>
    );
  }

  const isCurrentAlbumPlaying = 
    isPlaying && 
    currentSong && 
    album.tracks.some((s) => s.id === currentSong.id);

  const handlePlayAlbum = () => {
    if (album.tracks.length === 0) return;
    
    const isCurrentPlayingInAlbum = currentSong && album.tracks.some((s) => s.id === currentSong.id);
    if (isCurrentPlayingInAlbum) {
      playPause();
    } else {
      playSong(album.tracks[0], album.tracks);
    }
  };

  const handleRowClick = (song) => {
    playSong(song, album.tracks);
  };

  return (
    <div className="album-container">
      {/* Navigation Header */}
      <Header />

      {/* Album Details Banner with Gradient matching themeColor */}
      <div 
        className="gradient-header" 
        style={{ "--header-gradient-color": album.themeColor || "rgb(40, 40, 40)" }}
      >
        <img
          src={album.cover}
          alt={album.name}
          className="album-banner-img"
        />

        <div className="album-banner-details">
          <span className="banner-label">Album</span>
          <h1 className="banner-title">{album.name}</h1>
          
          <div className="banner-meta">
            <span className="album-artist-name">{album.artist}</span>
            <span className="bullet">•</span>
            <span className="album-year">{album.year}</span>
            <span className="bullet">•</span>
            <span className="song-count">
              {album.tracks.length} {album.tracks.length === 1 ? "song" : "songs"}
            </span>
          </div>
        </div>
      </div>

      {/* Album Body */}
      <div className="album-body" style={{ background: `linear-gradient(180deg, ${(album.themeColor || "rgb(40, 40, 40)").replace("0.8", "0.15")} 0%, #121212 200px)` }}>
        {/* Play Action Bar */}
        <div className="album-actions-row">
          <button className="banner-play-btn" onClick={handlePlayAlbum}>
            {isCurrentAlbumPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>

        {/* Tracks Table */}
        <table className="track-table">
          <thead>
            <tr>
              <th style={{ width: "50px", textAlign: "center" }}>#</th>
              <th>Title</th>
              <th style={{ width: "100px", textAlign: "right" }}><FaClock /></th>
            </tr>
          </thead>
          <tbody>
            {album.tracks.map((song, index) => {
              const isCurrent = currentSong && currentSong.id === song.id;
              const isPlayingThisRow = isCurrent && isPlaying;
              const isLiked = likedSongs.some((s) => s.id === song.id);

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
                      <button className="row-play-btn" onClick={() => handleRowClick(song)}>
                        {isPlayingThisRow ? <FaPause /> : <FaPlay />}
                      </button>
                    </div>
                  </td>

                  <td>
                    <div className="row-title-details">
                      <div className="row-text-details">
                        <span className="track-title">{song.title}</span>
                        <span className="track-artist">{song.artist}</span>
                      </div>
                    </div>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <div className="row-duration-details">
                      <button
                        className={`row-like-btn ${isLiked ? "liked" : ""}`}
                        onClick={() => toggleLikeSong(song)}
                      >
                        <FiHeart />
                      </button>
                      <span className="duration-text">{song.duration}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Album;
