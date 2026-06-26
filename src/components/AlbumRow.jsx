import React, { useState } from "react";
import SongCard from "./SongCard";
import "./AlbumRow.css";

function AlbumRow({ title, songs }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!songs || songs.length === 0) return null;

  const visibleSongs = isExpanded ? songs : songs.slice(0, 5);

  return (
    <section className="album-row">
      <div className="section-header">
        <h2>{title}</h2>
        {songs.length > 5 && (
          <span 
            className="show-all" 
            onClick={() => setIsExpanded(!isExpanded)}
            role="button"
            tabIndex={0}
          >
            {isExpanded ? "Show less" : "Show all"}
          </span>
        )}
      </div>

      <div className={`songs-container ${isExpanded ? "expanded" : ""}`}>
        {visibleSongs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            customQueue={songs}
          />
        ))}
      </div>
    </section>
  );
}

export default AlbumRow;
