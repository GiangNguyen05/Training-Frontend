import { useState, useEffect, useRef } from "react";
import { Song, PlayerStatus, Volume } from "../types/index.ts";
import { getNextSong, getPrevSong } from "../utils/helpers";

// Interface — kiểu trả về của hook
interface UsePlayerReturn {
  currentSong: Song | null;
  status: PlayerStatus;
  progress: number;
  volume: Volume;
  selectSong: (song: Song) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (percent: number) => void;
  changeVolume: (v: Volume) => void;
}

export function usePlayer(songs: Song[]): UsePlayerReturn {
  // useState với generic
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("stopped");
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<Volume>(80);

  // useRef — giữ interval ID, không gây re-render
  const intervalRef = useRef<number | null>(null);

  // useEffect — chạy/dừng progress bar theo status
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (status === "playing" && currentSong) {
      intervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Tự chuyển bài khi hết — Type Narrowing đảm bảo currentSong không null
            setCurrentSong(getNextSong(songs, currentSong.id));
            return 0;
          }
          return prev + 100 / currentSong.duration;
        });
      }, 1000);
    }

    // Cleanup — dừng interval khi unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, currentSong, songs]);

  // --- Actions ---

  function selectSong(song: Song) {
    setCurrentSong(song);
    setStatus("playing");
    setProgress(0);
  }

  function play() {
    // Type Narrowing — kiểm tra null trước khi dùng
    if (!currentSong) return;
    setStatus("playing");
  }

  function pause() {
    setStatus("paused");
  }

  function next() {
    if (!currentSong) return; // Type Narrowing
    setCurrentSong(getNextSong(songs, currentSong.id));
    setProgress(0);
  }

  function prev() {
    if (!currentSong) return; // Type Narrowing
    setCurrentSong(getPrevSong(songs, currentSong.id));
    setProgress(0);
  }

  function seek(percent: number) {
    setProgress(percent);
  }
  function changeVolume(v: Volume) {
    setVolume(v);
  }

  return {
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
  };
}
