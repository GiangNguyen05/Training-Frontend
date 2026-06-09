import { useState } from "react";
import { usePlayer } from "./hooks/usePlayer.ts";
import { SongCard } from "./components/SongCard.tsx";
import { PlayerBar } from "./components/PlayerBar.tsx";
import { SONGS } from "./data/songs.ts";
import { filterByGenre } from "./utils/helpers.ts";
import type { Song } from "./types/index.ts";
import "./Styles/App.css";

export default function App() {
  // Custom Hook — toàn bộ logic player
  const {
    currentSong,
    status,
    progress,
    volume,
    selectSong,
    play,
    pause,
    next,
    prev,
    seek,
    changeVolume,
  } = usePlayer(SONGS);

  // useState — lọc genre
  const [activeGenre, setActiveGenre] = useState<string>("All");

  // Array method — lấy danh sách genre không trùng
  const genres: string[] = ["All", ...new Set(SONGS.map((s: Song) => s.genre))];

  // Generic function — lọc bài theo genre
  const filteredSongs: Song[] = filterByGenre(SONGS, activeGenre);

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <h1 className="app-header__title"> MusicApp</h1>
      </div>

      {/* Filter Genre */}
      <div className="genre-filter">
        {genres.map((genre: string) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={`genre-filter__btn ${activeGenre === genre ? "is-active" : ""}`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Danh sách bài hát */}
      <div className="song-list-container">
        <div className="song-list__count">{filteredSongs.length} bài hát</div>

        {/* Array map → render list */}
        {filteredSongs.map((song: Song) => (
          <SongCard
            key={song.id}
            song={song}
            isActive={currentSong?.id === song.id}
            onSelect={selectSong}
          />
        ))}
      </div>

      {/* Player Bar */}
      <PlayerBar
        song={currentSong}
        status={status}
        volume={volume}
        progress={progress}
        onPlay={play}
        onPause={pause}
        onNext={next}
        onPrev={prev}
        onVolumeChange={changeVolume}
        onSeek={seek}
      />
    </div>
  );
}
