import { SongCardProps } from "../types/index.ts";
import { formatTime } from "../utils/helpers.ts";
import "../Styles/SongCard.css";

export function SongCard({ song, isActive, onSelect }: SongCardProps) {
  return (
    <div
      onClick={() => onSelect(song)}
      /* Sử dụng template string để cộng thêm class 'is-active' nếu đúng điều kiện */
      className={`song-card ${isActive ? "is-active" : ""}`}
    >
      {/* Tên bài + nghệ sĩ */}
      <div className="song-card__info">
        <div className="song-card__title">{song.title}</div>
        <div className="song-card__artist">
          {song.artist} · {song.genre}
        </div>
      </div>

      {/* Thời lượng */}
      <div className="song-card__duration">{formatTime(song.duration)}</div>
    </div>
  );
}
