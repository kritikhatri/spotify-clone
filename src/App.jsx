import React, { useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AudioProvider, AudioContext } from "./context/AudioContext";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Library from "./pages/Library.jsx";
import LikedSongs from "./pages/LikedSongs.jsx";
import Playlist from "./pages/Playlist.jsx";
import Album from "./pages/Album.jsx";
import Login from "./pages/Login.jsx";

import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import RightPanel from "./components/RightPanel";

import "./App.css";

function AppContent() {
  const { isAuthenticated, currentSong } = useContext(AudioContext);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  if (!isAuthenticated) {
    return (
      <div className="app-container login-layout">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  const ambientColor = currentSong?.themeColor || "rgba(111, 66, 193, 0.6)";

  return (
    <div className="app-container authenticated-layout">
      {/* Dynamic Ambient Background Mesh */}
      <div className="ambient-backdrop-container">
        <div className="ambient-glow-circle circle-1" style={{ backgroundColor: ambientColor }}></div>
        <div className="ambient-glow-circle circle-2" style={{ backgroundColor: "rgba(29, 185, 84, 0.25)" }}></div>
        <div className="ambient-glow-circle circle-3" style={{ backgroundColor: "rgba(26, 115, 232, 0.25)" }}></div>
      </div>

      {/* Sidebar Panel (Left) */}
      <Sidebar />

      {/* Main Content Pane (Center Scroll) */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="/liked" element={<LikedSongs />} />
          <Route path="/playlist/:id" element={<Playlist />} />
          <Route path="/album/:id" element={<Album />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Right Now Playing Panel (Collapsible) */}
      {isRightPanelOpen && <RightPanel />}

      {/* Media Player Panel (Bottom Control Bar) */}
      <Player 
        isRightPanelOpen={isRightPanelOpen} 
        setIsRightPanelOpen={setIsRightPanelOpen} 
      />
    </div>
  );
}

function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}

export default App;