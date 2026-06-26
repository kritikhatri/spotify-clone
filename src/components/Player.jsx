import React, { useContext } from "react";
import { AudioContext } from "../context/AudioContext";
import { 
  FiShuffle, 
  FiSkipBack, 
  FiPlay, 
  FiPause, 
  FiSkipForward, 
  FiRepeat, 
  FiHeart, 
  FiVolume2, 
  FiVolumeX, 
  FiList 
} from "react-icons/fi";
import { FaHeart, FaMicrophone } from "react-icons/fa";
import "./Player.css";

const Player = ({ isRightPanelOpen, setIsRightPanelOpen }) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    likedSongs,
    playPause,
    nextSong,
    prevSong,
    seek,
    toggleMute,
    changeVolume,
    toggleShuffle,
    toggleRepeat,
    toggleLikeSong,
  } = useContext(AudioContext);

  if (!currentSong) return null;

  const isLiked = likedSongs.some((s) => s.id === currentSong.id);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleProgressChange = (e) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e) => {
    changeVolume(Number(e.target.value));
  };

  const activeBorderColor = currentSong?.themeColor 
    ? currentSong.themeColor.replace("0.8", "0.35") 
    : "var(--border-glass)";

  return (
    <div className="player" style={{ borderColor: activeBorderColor }}>
      {/* Track Information (Left Panel) */}
      <div className="player-left">
        <img
          src={currentSong.image}
          alt={currentSong.title}
          className="player-album-cover"
        />
        <div className="player-song-details">
          <span className="player-song-title">{currentSong.title}</span>
          <span className="player-song-artist">{currentSong.artist}</span>
        </div>
        <button
          className={`player-like-btn ${isLiked ? "liked" : ""}`}
          onClick={() => toggleLikeSong(currentSong)}
        >
          {isLiked ? <FaHeart /> : <FiHeart />}
        </button>
      </div>

      {/* Playback Controls & Scrubber (Center Panel) */}
      <div className="player-center">
        <div className="player-controls">
          <button
            className={`control-btn shuffle ${isShuffle ? "active" : ""}`}
            onClick={toggleShuffle}
            title="Shuffle"
          >
            <FiShuffle />
            {isShuffle && <span className="active-dot"></span>}
          </button>
          <button className="control-btn" onClick={prevSong} title="Previous">
            <FiSkipBack />
          </button>
          <button className="play-pause-btn" onClick={playPause} title={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <FiPause className="icon-pause" /> : <FiPlay className="icon-play" />}
          </button>
          <button className="control-btn" onClick={nextSong} title="Next">
            <FiSkipForward />
          </button>
          <button
            className={`control-btn repeat ${isRepeat !== "none" ? "active" : ""}`}
            onClick={toggleRepeat}
            title={`Repeat: ${isRepeat}`}
          >
            <FiRepeat />
            {isRepeat !== "none" && (
              <span className="active-dot">
                {isRepeat === "one" && <span className="repeat-one-indicator">1</span>}
              </span>
            )}
          </button>
        </div>

        <div className="player-scrubber-container">
          <span className="time-display">{formatTime(currentTime)}</span>
          <div className="progress-bar-wrapper">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleProgressChange}
              className="progress-slider"
              style={{
                background: `linear-gradient(to right, var(--spotify-green) 0%, var(--spotify-green) ${
                  duration ? (currentTime / duration) * 100 : 0
                }%, #4d4d4d ${duration ? (currentTime / duration) * 100 : 0}%, #4d4d4d 100%)`,
              }}
            />
          </div>
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Utility Buttons & Volume Control (Right Panel) */}
      <div className="player-right">
        <button 
          className={`utility-btn ${isRightPanelOpen ? "active" : ""}`} 
          title="Lyrics" 
          onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
        >
          <FaMicrophone />
        </button>
        <button className="utility-btn" title="Queue">
          <FiList />
        </button>
        <div className="volume-control">
          <button className="utility-btn volume" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
            {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            style={{
              background: `linear-gradient(to right, var(--spotify-green) 0%, var(--spotify-green) ${
                isMuted ? 0 : volume * 100
              }%, #4d4d4d ${isMuted ? 0 : volume * 100}%, #4d4d4d 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;