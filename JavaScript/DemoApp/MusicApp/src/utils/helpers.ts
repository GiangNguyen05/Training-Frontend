import { Song } from "../types/index.ts";

// Hàm chuyển giây → "3:32"
// khai báo rõ nhận gì (number), trả về gì (string)
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Hàm lọc theo genre — Generic
// T extends { genre: string } = T phải có trường genre
export function filterByGenre<T extends { genre: string }>(
  items: T[],
  genre: string,
): T[] {
  if (genre === "All") return items;
  return items.filter((item) => item.genre === genre);
}

// Hàm tìm bài tiếp theo
// Array method findIndex
export function getNextSong(songs: Song[], currentId: number): Song {
  const idx = songs.findIndex((s) => s.id === currentId);
  return songs[(idx + 1) % songs.length];
}

// Hàm tìm bài trước
export function getPrevSong(songs: Song[], currentId: number): Song {
  const idx = songs.findIndex((s) => s.id === currentId);
  return songs[(idx - 1 + songs.length) % songs.length];
}
