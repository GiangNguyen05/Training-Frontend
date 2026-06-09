import { PlayerBarProps } from "../types/index.ts";
import { formatTime } from "../utils/helpers.ts";
import "../Styles/PlayerBar.css";
export function PlayerBar({
  song,
  status,
  volume,
  progress,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onVolumeChange,
  onSeek,
}: PlayerBarProps) {
  // Type Narrowing — Nếu chưa chọn bài → hiển thị placeholder
  if (!song) {
    return (
      <div className="player-bar">
        <p className="player-bar-placeholder">Chọn một bài để bắt đầu ▶</p>
      </div>
    );
  }

  return (
    <div className="player-bar">
      {/* Thông tin bài đang phát */}
      <div className="player-bar__info">
        <div>
          <div className="player-bar__title">{song.title}</div>
          <div className="player-bar__artist">{song.artist}</div>
        </div>
      </div>

      {/* Controls + Progress */}
      <div className="player-bar__controls-container">
        {/* Nút điều khiển */}
        <div className="player-bar__buttons">
          <button onClick={onPrev} className="player-bar__btn">
            ⏮
          </button>

          {/* Điều kiện render theo status */}
          {status === "playing" ? (
            <button
              onClick={onPause}
              className="player-bar__btn player-bar__btn--active"
            >
              ⏸
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="player-bar__btn player-bar__btn--active"
            >
              ▶
            </button>
          )}

          <button onClick={onNext} className="player-bar__btn">
            ⏭
          </button>
        </div>

        {/* Progress bar */}
        <div
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            onSeek(Math.max(0, Math.min(100, percent)));
          }}
          className="player-bar__progress-wrapper"
        >
          <div
            style={{ width: `${progress}%` }} // Giữ lại inline style động này vì phần trăm thay đổi liên tục
            className="player-bar__progress-bar"
          />
        </div>

        {/* Thời gian hiện tại / tổng */}
        <div className="player-bar__time">
          {formatTime(Math.floor((song.duration * progress) / 100))} /{" "}
          {formatTime(song.duration)}
        </div>
      </div>

      {/* Volume */}
      <div className="player-bar__volume">
        <span className="player-bar__volume-icon">🔊</span>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onVolumeChange(Number(e.target.value))
          }
          className="player-bar__volume-slider"
        />
        <span className="player-bar__volume-text">{volume}%</span>
      </div>
    </div>
  );
}
