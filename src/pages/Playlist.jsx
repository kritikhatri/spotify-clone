import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AudioContext } from "../context/AudioContext";
import { FaPlay, FaPause, FaClock, FaTrash } from "react-icons/fa";
import { FiSearch, FiX, FiHeart } from "react-icons/fi";
import Header from "../components/Header";
import "./Playlist.css";

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    playlists,
    currentSong,
    isPlaying,
    likedSongs,
    playSong,
    playPause,
    removeSongFromPlaylist,
    addSongToPlaylist,
    updatePlaylistDetails,
    deletePlaylist,
    toggleLikeSong
  } = useContext(AudioContext);

  const playlist = playlists.find((pl) => pl.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (playlist) {
      setEditName(playlist.name);
      setEditDesc(playlist.description);
    }
  }, [playlist, id]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&media=music&limit=6`
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
              ? track.artworkUrl100.replace("100x100bb", "300x300bb") 
              : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80",
            audio: track.previewUrl,
            duration: track.trackTimeMillis 
              ? `${Math.floor(track.trackTimeMillis / 60000)}:${
                  Math.floor((track.trackTimeMillis % 60000) / 1000) < 10 ? "0" : ""
                }${Math.floor((track.trackTimeMillis % 60000) / 1000)}`
              : "0:30",
            themeColor: "rgba(29, 185, 84, 0.8)",
            lyrics: `[Live iTunes API Stream]\n\nPreviewing "${track.trackName}" by ${track.artistName}.`,
            isApiSong: true
          }));
          setSearchResults(formatted);
        }
      } catch (err) {
        console.error("iTunes API search error in playlist", err);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  if (!playlist) {
    return (
      <div className="playlist-page-empty">
        <h2>Playlist not found</h2>
        <button onClick={() => navigate("/")} className="pill-btn active">
          Go back Home
        </button>
      </div>
    );
  }

  const isCurrentPlaylistPlaying = 
    isPlaying && 
    currentSong && 
    playlist.songs.some((s) => s.id === currentSong.id);

  const handlePlayPlaylist = () => {
    if (playlist.songs.length === 0) return;
    
    const isCurrentPlayingInPlaylist = currentSong && playlist.songs.some((s) => s.id === currentSong.id);
    if (isCurrentPlayingInPlaylist) {
      playPause();
    } else {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    if (editName.trim()) {
      updatePlaylistDetails(playlist.id, editName, editDesc);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      deletePlaylist(playlist.id);
      navigate("/");
    }
  };

  const handleRowClick = (song) => {
    playSong(song, playlist.songs);
  };

  return (
    <div className="playlist-container">
      {/* Navigation Header */}
      <Header />

      {/* Playlist Details Banner */}
      <div className="gradient-header" style={{ "--header-gradient-color": "rgb(40, 40, 40)" }}>
        <img
          src={playlist.cover}
          alt={playlist.name}
          className="playlist-banner-img"
          onClick={() => setIsEditing(true)}
          title="Click to edit details"
        />

        <div className="playlist-banner-details">
          <span className="banner-label">Playlist</span>
          
          {isEditing ? (
            <form onSubmit={handleSaveDetails} className="edit-playlist-form">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="edit-name-input"
                placeholder="Playlist Name"
                maxLength={40}
                required
                autoFocus
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="edit-desc-textarea"
                placeholder="Add an optional description"
                maxLength={120}
              />
              <div className="edit-form-buttons">
                <button type="submit" className="save-details-btn">Save Changes</button>
                <button type="button" className="cancel-details-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="banner-title editable" onClick={() => setIsEditing(true)} title="Click to Rename">
                {playlist.name}
              </h1>
              <p className="banner-description editable" onClick={() => setIsEditing(true)} title="Click to Edit Description">
                {playlist.description || "No description provided. Click to add one."}
              </p>
            </>
          )}

          <div className="banner-meta">
            <span className="user-name">Kritika Khatri</span>
            <span className="bullet">•</span>
            <span className="song-count">
              {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
            </span>
          </div>
        </div>
      </div>

      {/* Playlist Body */}
      <div className="playlist-body">
        {/* Play & Delete Bar */}
        <div className="playlist-actions-row">
          {playlist.songs.length > 0 && (
            <button className="banner-play-btn" onClick={handlePlayPlaylist}>
              {isCurrentPlaylistPlaying ? <FaPause /> : <FaPlay />}
            </button>
          )}
          <button className="delete-playlist-action" onClick={handleDelete} title="Delete Playlist">
            <FaTrash />
          </button>
        </div>

        {/* Tracks Table */}
        {playlist.songs.length > 0 ? (
          <table className="track-table">
            <thead>
              <tr>
                <th style={{ width: "50px", textAlign: "center" }}>#</th>
                <th>Title</th>
                <th>Album</th>
                <th style={{ width: "120px", textAlign: "right" }}><FaClock /></th>
              </tr>
            </thead>
            <tbody>
              {playlist.songs.map((song, index) => {
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
                          className={`row-like-btn ${isLiked ? "liked" : ""}`}
                          onClick={() => toggleLikeSong(song)}
                        >
                          <FiHeart />
                        </button>
                        <span className="duration-text">{song.duration}</span>
                        <button
                          className="row-trash-btn"
                          onClick={() => removeSongFromPlaylist(playlist.id, song.id)}
                          title="Remove from Playlist"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-playlist-notice">
            <p>This playlist is empty. Search below to add some tracks!</p>
          </div>
        )}

        <hr className="playlist-divider" />

        {/* Add Songs Search Box */}
        <div className="playlist-search-section">
          <h3>Let's find something for your playlist</h3>
          <div className="playlist-search-box">
            <FiSearch className="search-box-icon" />
            <input
              type="text"
              placeholder="Search for songs to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="playlist-search-input"
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery("")}>
                <FiX />
              </button>
            )}
          </div>

          <div className="playlist-search-results">
            {isSearching && <div className="searching-text">Searching iTunes catalog...</div>}
            
            {!isSearching && searchResults.map((track) => {
              const inPlaylist = playlist.songs.some((s) => s.id === track.id);
              
              return (
                <div key={track.id} className="search-add-row">
                  <div className="search-add-left">
                    <img src={track.image} alt={track.title} className="search-add-img" />
                    <div className="search-add-details">
                      <span className="search-add-title">{track.title}</span>
                      <span className="search-add-artist">{track.artist}</span>
                    </div>
                  </div>
                  <div className="search-add-right">
                    <span className="search-add-album">{track.album}</span>
                    {inPlaylist ? (
                      <button className="add-track-btn added" disabled>
                        Added
                      </button>
                    ) : (
                      <button
                        className="add-track-btn"
                        onClick={() => addSongToPlaylist(playlist.id, track)}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
