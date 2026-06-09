// Interface — hình dạng object bài hát
export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number; // giây
  genre: string;
  url: string;
}

// Type — trạng thái player, chỉ 3 giá trị được phép
export type PlayerStatus = "playing" | "paused" | "stopped";

// Type — volume là number 0-100
export type Volume = number;

// Interface — props của SongCard
export interface SongCardProps {
  song: Song;
  isActive: boolean;
  onSelect: (song: Song) => void;
}

// Interface — props của PlayerBar
export interface PlayerBarProps {
  song: Song | null; // null khi chưa chọn bài
  status: PlayerStatus;
  volume: Volume;
  progress: number; // 0 đến 100
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onVolumeChange: (v: Volume) => void;
  onSeek: (p: number) => void;
}

// Interface — Generic wrapper cho API response
// (Generics)
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}
