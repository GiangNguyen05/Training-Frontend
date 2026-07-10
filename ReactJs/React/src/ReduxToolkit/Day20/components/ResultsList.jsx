import { useSelector } from "react-redux";
import { Loader2, AlertTriangle, SearchX } from "lucide-react";
import { selectAllSongs } from "../features/songs/songsSlice";
import SongRow from "./SongRow";

export default function ResultsList() {
  const songs = useSelector(selectAllSongs);
  const { status, error, lastQuery } = useSelector((state) => state.songs);

  if (status === "idle") {
    return <p className="hint">Gõ tên bài hát hoặc nghệ sĩ để tìm kiếm.</p>;
  }

  if (status === "loading") {
    return (
      <div className="state-box">
        <Loader2 size={16} className="spin" />
        <span>Đang tìm "{lastQuery}"...</span>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="state-box state-error">
        <AlertTriangle size={16} />
        <span>{error}</span>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="state-box">
        <SearchX size={16} />
        <span>Không tìm thấy kết quả cho "{lastQuery}".</span>
      </div>
    );
  }

  return (
    <ul className="song-list">
      {songs.map((song) => (
        <SongRow key={song.id} song={song} />
      ))}
    </ul>
  );
}
