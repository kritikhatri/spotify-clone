import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AudioContext } from "../context/AudioContext";
import { artists as defaultArtists } from "../data/song";
import AlbumRow from "../components/AlbumRow";
import Header from "../components/Header";
import { FaPlay, FaPause } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const { songs, albums, playSong, playArtistSongs, currentSong, isPlaying, playPause } = useContext(AudioContext);
  const [greeting, setGreeting] = useState("Good evening");
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting("Good morning");
    else if (hrs < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const quickMixItems = albums.slice(0, 6);

  const handleQuickMixPlay = (e, album) => {
    e.stopPropagation();
    if (album.tracks && album.tracks.length > 0) {
      const firstTrack = album.tracks[0];
      const isCurrent = currentSong && currentSong.id === firstTrack.id;
      if (isCurrent) {
        playPause();
      } else {
        playSong(firstTrack, album.tracks);
      }
    }
  };

  const handleQuickMixClick = (album) => {
    navigate(`/album/${album.id}`);
  };

  const [isArtistsExpanded, setIsArtistsExpanded] = useState(false);

  const visibleArtists = isArtistsExpanded ? defaultArtists : defaultArtists.slice(0, 4);

  return (
    <div className="home-container">
      {/* Top Header Navigation */}
      <Header />
      
      {/* Greeting Banner */}
      <div className="home-hero">
        <h1 className="greeting-text">{greeting}</h1>
        
        {/* Filters */}
        <div className="filter-pills">
          {["All", "Music", "Podcasts"].map((pill) => (
            <button
              key={pill}
              className={`pill-btn ${activeFilter === pill ? "active" : ""}`}
              onClick={() => setActiveFilter(pill)}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Quick Mix 2x3 Grid */}
        <div className="quick-grid">
          {quickMixItems.map((item) => {
            const isPlayingThisAlbum = 
              currentSong && 
              item.tracks.some((t) => t.id === currentSong.id) && 
              isPlaying;

            const cardGlow = item.themeColor 
              ? `0 6px 18px ${item.themeColor.replace("0.8", "0.22")}` 
              : "0 6px 18px rgba(0, 0, 0, 0.35)";

            return (
              <div 
                key={item.id} 
                className="quick-card"
                onClick={() => handleQuickMixClick(item)}
                style={{ "--quick-glow-color": cardGlow }}
              >
                <img src={item.cover} alt={item.name} className="quick-card-img" />
                <div className="quick-card-details">
                  <span className="quick-card-title">{item.name}</span>
                  <button 
                    className={`quick-play-btn ${isPlayingThisAlbum ? "playing" : ""}`}
                    onClick={(e) => handleQuickMixPlay(e, item)}
                  >
                    {isPlayingThisAlbum ? <FaPause /> : <FaPlay />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Rows */}
      <div className="home-content-rows">
        <AlbumRow title="Made For You" songs={songs} />
        <AlbumRow title="Trending Now" songs={[...songs].reverse()} />
        <AlbumRow title="Recently Played" songs={songs.slice(5).concat(songs.slice(0, 5))} />

        {/* Popular Artists Circular Row */}
        <section className="artists-section">
          <div className="section-header">
            <h2>Popular Artists</h2>
            <span 
              className="show-all"
              onClick={() => setIsArtistsExpanded(!isArtistsExpanded)}
              role="button"
              tabIndex={0}
            >
              {isArtistsExpanded ? "Show less" : "Show all"}
            </span>
          </div>
          <div className={`artists-container ${isArtistsExpanded ? "expanded" : ""}`}>
            {visibleArtists.map((artist) => (
              <div 
                key={artist.id} 
                className="artist-card"
                onClick={() => playArtistSongs(artist.name)}
              >
                <div className="artist-image-wrapper">
                  <img src={artist.avatar} alt={artist.name} className="artist-avatar-img" />
                </div>
                <h4>{artist.name}</h4>
                <p>Artist</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;