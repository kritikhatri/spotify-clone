import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AudioContext } from "../context/AudioContext";
import { artists as defaultArtists } from "../data/song";
import { FaPlus, FaPlay } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Header from "../components/Header";
import "./Library.css";

const Library = () => {
  const navigate = useNavigate();
  const { playlists, likedSongs, albums, createPlaylist, playArtistSongs } = useContext(AudioContext);
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreatePlaylist = () => {
    const newId = createPlaylist();
    navigate(`/playlist/${newId}`);
  };

  const allItems = [
    {
      id: "liked-songs-lib",
      name: "Liked Songs",
      type: "Playlist",
      subtype: "Auto",
      cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300",
      isLikedSongs: true,
      onClick: () => navigate("/liked")
    },
    ...playlists.map((pl) => ({
      id: pl.id,
      name: pl.name,
      type: "Playlist",
      subtype: "Custom",
      cover: pl.cover,
      onClick: () => navigate(`/playlist/${pl.id}`)
    })),
    ...albums.map((alb) => ({
      id: alb.id,
      name: alb.name,
      type: "Album",
      subtype: alb.artist,
      cover: alb.cover,
      onClick: () => navigate(`/album/${alb.id}`)
    })),
    ...defaultArtists.map((art) => ({
      id: art.id,
      name: art.name,
      type: "Artist",
      subtype: "Artist",
      cover: art.avatar,
      isArtist: true,
      onClick: () => playArtistSongs(art.name)
    }))
  ];

  const filteredItems = allItems.filter((item) => {
    if (filterType === "Playlists" && item.type !== "Playlist") return false;
    if (filterType === "Albums" && item.type !== "Album") return false;
    if (filterType === "Artists" && item.type !== "Artist") return false;
    
    if (searchQuery.trim() !== "") {
      const matchName = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSubtype = item.subtype.toLowerCase().includes(searchQuery.toLowerCase());
      return matchName || matchSubtype;
    }

    return true;
  });

  return (
    <div className="library-page-container">
      {/* Top Header Navigation */}
      <Header />

      <div className="library-page-body">
        <div className="library-title-row">
          <h1 className="library-page-title">Your Library</h1>
          <button className="library-create-btn-body" onClick={handleCreatePlaylist} title="Create Playlist">
            <FaPlus /> Create Playlist
          </button>
        </div>

        {/* Filter Pills and Search Row */}
        <div className="library-filter-row">
          <div className="library-pills">
            {["All", "Playlists", "Albums", "Artists"].map((pill) => (
              <button
                key={pill}
                className={`library-pill-btn ${filterType === pill ? "active" : ""}`}
                onClick={() => setFilterType(pill)}
              >
                {pill}
              </button>
            ))}
          </div>

          <div className="library-search-box">
            <FiSearch className="lib-search-icon" />
            <input
              type="text"
              placeholder="Search in Library"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="lib-search-input"
            />
          </div>
        </div>

        {/* Grid List of Library Items */}
        {filteredItems.length > 0 ? (
          <div className="library-grid">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`library-card-item ${item.isArtist ? "artist-card-item" : ""}`}
                onClick={item.onClick}
              >
                <div className={`library-card-cover-wrapper ${item.isLikedSongs ? "liked-gradient" : ""}`}>
                  <img
                    src={item.cover}
                    alt={item.name}
                    className="library-card-cover"
                  />
                  <button className="library-card-play-btn">
                    <FaPlay />
                  </button>
                </div>
                <div className="library-card-info">
                  <h4 className="library-card-name">{item.name}</h4>
                  <span className="library-card-type">
                    {item.type} {item.subtype && `• ${item.subtype}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="library-empty-results">
            <h2>No items found in Library</h2>
            <p>Try searching for different keywords or adjust your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
