import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AudioContext } from "../context/AudioContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiSearch, FiX } from "react-icons/fi";
import "./Header.css";

const Header = ({ searchQuery = "", setSearchQuery = null }) => {
  const { logoutUser, currentUser } = useContext(AudioContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const userLetter = currentUser ? currentUser.charAt(0).toUpperCase() : "U";

  const isSearchPage = location.pathname === "/search";

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <header className="spotify-header">
      {/* Navigation Arrows & Search Input */}
      <div className="header-left">
        <div className="header-nav-arrows">
          <button className="arrow-btn" onClick={() => navigate(-1)} title="Go Back">
            <FaChevronLeft />
          </button>
          <button className="arrow-btn" onClick={() => navigate(1)} title="Go Forward">
            <FaChevronRight />
          </button>
        </div>

        {isSearchPage && setSearchQuery && (
          <div className="header-search-wrapper">
            <FiSearch className="search-bar-icon" />
            <input
              type="text"
              placeholder="What do you want to play?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-header"
              autoFocus
            />
            {searchQuery && (
              <button className="clear-btn-header" onClick={() => setSearchQuery("")} title="Clear search">
                <FiX />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Profile actions with dropdown */}
      <div className="header-right" ref={dropdownRef}>
        <button className="premium-badge-header">Explore Premium</button>
        
        <div className="profile-container">
          <button 
            className="user-profile-badge-header" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Profile"
          >
            {userLetter}
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-user-info">
                <span className="dropdown-user-email" title={currentUser}>{currentUser || "Guest User"}</span>
              </div>
              <hr className="dropdown-divider" />
              <button className="dropdown-item" onClick={() => navigate("/library")}>
                Account
              </button>
              <button className="dropdown-item" onClick={() => navigate("/library")}>
                Profile
              </button>
              <button className="dropdown-item" onClick={() => navigate("/library")}>
                Settings
              </button>
              <hr className="dropdown-divider" />
              <button className="dropdown-item logout-btn-item" onClick={handleLogoutClick}>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
