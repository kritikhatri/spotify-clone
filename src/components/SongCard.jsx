import React, { useContext } from "react";
import { AudioContext } from "../context/AudioContext";
import { FaPlay, FaPause } from "react-icons/fa";
import "./SongCard.css";

function SongCard({ song, customQueue = null }) {
  const { playSong, playPause, currentSong, isPlaying } = useContext(AudioContext);

  const isCurrent = currentSong && currentSong.id === song.id;
  const isPlayingCurrent = isCurrent && isPlaying;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      playPause();
    } else {
      playSong(song, customQueue);
    }
  };

  const cardGlow = song.themeColor 
    ? `0 6px 20px ${song.themeColor.replace("0.8", "0.28")}` 
    : "0 6px 20px rgba(29, 185, 84, 0.2)";

  return (
    <div
      className={`song-card ${isCurrent ? "active" : ""}`}
      onClick={handlePlayClick}
      style={{ "--card-glow-color": cardGlow }}
    >
      <div className="image-container">
        <img
          src={song.image}
          alt={song.title}
          className="song-image"
        />

        <button 
          className={`play-button ${isPlayingCurrent ? "playing" : ""}`}
          onClick={handlePlayClick}
        >
          {isPlayingCurrent ? <FaPause className="pause-icon" /> : <FaPlay className="play-icon" />}
        </button>
      </div>

      <div className="song-card-text">
        <h4 className="song-card-title">{song.title}</h4>
        <p className="song-card-artist">{song.artist}</p>
      </div>
    </div>
  );
}

export default SongCard;
