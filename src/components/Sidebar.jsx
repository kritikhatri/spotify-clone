import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AudioContext } from "../context/AudioContext";
import { FaHome, FaSearch, FaPlus, FaHeart } from "react-icons/fa";
import { BiLibrary } from "react-icons/bi";
import "./Sidebar.css";

const Sidebar = () => {
  const { playlists, createPlaylist } = useContext(AudioContext);
  const navigate = useNavigate();

  const handleCreatePlaylist = () => {
    const newId = createPlaylist();
    navigate(`/playlist/${newId}`);
  };

  return (
    <div className="sidebar">
      {/* Navigation Card */}
      <div className="sidebar-card nav-section">
        <Link to="/" className="sidebar-logo">
          <svg viewBox="0 0 167.5 167.5" className="spotify-icon">
            <path
              fill="#1db954"
              d="M83.7 0C37.5 0 0 37.5 0 83.7c0 46.3 37.5 83.7 83.7 83.7 46.3 0 83.7-37.5 83.7-83.7C167.5 37.5 130 0 83.7 0zM121.5 120.8c-1.6 2.5-4.8 3.2-7.3 1.7-19.9-12.2-45-14.9-74.6-8.2-2.9.7-5.8-1.2-6.4-4.1-.7-2.9 1.2-5.8 4.1-6.4 32.4-7.4 60.1-4.2 82.5 9.5 2.5 1.6 3.2 4.9 1.7 7.5zm11-22.8c-2 3.2-6.2 4.2-9.4 2.2-22.8-14-57.5-18-84.4-9.9-3.6 1.1-7.4-1-8.5-4.6-1.1-3.6 1-7.4 4.6-8.5 30.7-9.3 69.2-4.9 95.5 11.3 3.2 2 4.2 6.1 2.2 9.5zm.9-24C106.1 57.8 61.2 56.3 35.3 64.1c-4.2 1.3-8.6-1.1-9.9-5.3-1.3-4.2 1.1-8.6 5.3-9.9 29.8-9 79.7-7.3 111.4 11.5 3.8 2.2 5 7.1 2.8 10.9-2.2 3.8-7.1 5.1-10.9 2.8z"
            />
          </svg>
          <span className="logo-text">Spotify</span>
        </Link>

        <nav className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            end
          >
            <FaHome className="nav-icon" />
            <span className="nav-text">Home</span>
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <FaSearch className="nav-icon" />
            <span className="nav-text">Search</span>
          </NavLink>
        </nav>
      </div>

      {/* Library Card */}
      <div className="sidebar-card library-section">
        <div className="library-header">
          <div className="library-title">
            <BiLibrary className="library-icon" />
            <span>Your Library</span>
          </div>
          <button
            className="add-playlist-btn"
            title="Create Playlist"
            onClick={handleCreatePlaylist}
          >
            <FaPlus />
          </button>
        </div>

        <div className="library-content">
          {/* Liked Songs Entry */}
          <NavLink
            to="/liked"
            className={({ isActive }) =>
              isActive ? "library-item active" : "library-item"
            }
          >
            <div className="liked-badge">
              <FaHeart className="liked-badge-icon" />
            </div>
            <div className="item-info">
              <span className="item-name">Liked Songs</span>
              <span className="item-type">Playlist • Auto</span>
            </div>
          </NavLink>

          {/* User Playlists List */}
          {playlists.map((pl) => (
            <NavLink
              key={pl.id}
              to={`/playlist/${pl.id}`}
              className={({ isActive }) =>
                isActive ? "library-item active" : "library-item"
              }
            >
              <img
                src={pl.cover}
                alt={pl.name}
                className="playlist-thumbnail"
              />
              <div className="item-info">
                <span className="item-name">{pl.name}</span>
                <span className="item-type">Playlist • Custom</span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;