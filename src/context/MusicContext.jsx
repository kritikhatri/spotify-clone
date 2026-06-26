import {
  createContext,
  useState,
} from "react";

export const MusicContext =
  createContext();

export const MusicProvider = ({
  children,
}) => {
  const [currentSong, setCurrentSong] =
    useState(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};