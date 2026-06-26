# Spotify Clone Premium 🎵

A premium, glassmorphic Spotify-inspired web application built using **React.js** and **Vite**. 
It delivers a state-of-the-art visual experience featuring custom ambient backdrop glows, smooth interactive micro-animations, and full audio controls linked dynamically to the **iTunes Search API**.

👉 **Live Production URL**: [spotify-clone-alpha-swart-82.vercel.app](https://spotify-clone-alpha-swart-82.vercel.app)

---

## ✨ Features

### 🎨 Premium Aesthetics & UX
* **Glassmorphism Design System**: Tailored HSL colors, frosted glass overlays, and delicate glowing borders.
* **Ambient Glow Engine**: Dynamically shifts background ambient backdrops and card shadows based on the current playing album cover's primary colors.
* **Micro-Animations**: Hover-triggered translations, interactive play overlay state scales, and soft fading animations.
* **Fluid Stacking**: Clean z-index stacking layers that ensure components stay responsive and beautiful in any viewport.

### 🔊 Music Playback & Audio Control
* **Fully Functional Player**: Real 30-second music preview streaming loaded dynamically.
* **Seek & Volume Controllers**: Custom sliding range rails for fine-grained playback tracking and volume/mute controls.
* **Play Modes**: Functional **Repeat** (None / Repeat One / Repeat All) and **Shuffle** state controllers.
* **Lyrics Sync Display**: Sliding lyrics/credits panel that updates to show metadata and scrolling preview lyrics.

### 📂 Hybrid Catalog & Dynamic Playlists
* **Hindi & English Catalog Mix**: On startup, logs in with a balanced, pre-shuffled hybrid track list containing Taylor Swift and Bollywood icons (Arijit Singh, Pritam, and A.R. Rahman).
* **Curated Default Playlists**: Pre-constructed **Bollywood Hits** and **Hollywood Hits** playlists, dynamically populated using direct search query API results on startup.
* **Liked Songs Management**: Functional toggle state to save/unsave songs to your custom library.
* **Dynamic Playlist Creation**: Create custom playlists, append tracks, and manage details with persistent data sync to LocalStorage.

---

## 🛠️ Technology Stack

* **Frontend Framework**: [React.js](https://react.dev/) (Hooks, Context API)
* **Build Tooling**: [Vite](https://vitejs.dev/) (fast hot-reloading & bundling)
* **Styling**: Vanilla CSS (maximum flexbox/grid layout control, glassmorphism filters, keyframe animations)
* **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (FontAwesome, Feather)
* **Data Provider**: [iTunes Search API](https://performance-partners.apple.com/search-api)

---

## 📁 Project Structure

```text
spotify-clone/
├── dist/                  # Compiled production files
├── src/
│   ├── assets/            # Local high-res artist avatars
│   ├── components/        # Reusable React components
│   │   ├── AlbumRow.jsx
│   │   ├── Header.jsx
│   │   ├── Player.jsx     # Audio player control bar
│   │   ├── RightPanel.jsx # Lyrics & cover detail drawer
│   │   └── Sidebar.jsx    # Glassmorphic navigation panel
│   ├── context/
│   │   └── AudioContext.jsx # Core React Context (state, playback logic, API calls)
│   ├── data/
│   │   └── song.js        # Default static database & fallback catalog configuration
│   ├── pages/             # Route pages
│   │   ├── Album.jsx      # Dynamic album tracks display
│   │   ├── Home.jsx       # Custom mixes, quick grid, and featured artists
│   │   ├── Library.jsx    # Library aggregator (Playlists, Albums, Artists)
│   │   ├── LikedSongs.jsx # User saved songs list
│   │   ├── Login.jsx      # Authentication landing page
│   │   └── Playlist.jsx   # Custom playlist view and editor
│   ├── App.jsx            # Routing and ambient layout backdrop
│   ├── index.css          # Design tokens, variables, & global reset
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kritikhatri/spotify-clone.git
   cd spotify-clone
   ```

2. **Install all packages**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Compile production bundle**:
   ```bash
   npm run build
   ```

---

## 👩‍💻 Author & Contributions

* **Author**: [Kritika Khatri](https://github.com/kritikhatri)
* Feel free to submit issues or feature requests!
