import { Music } from "lucide-react";

export default function SongRow({ song }) {
  return (
    <li className="song-row">
      <div className="song-icon">
        <Music size={16} strokeWidth={2} />
      </div>
      <div className="song-info">
        <p className="song-title">{song.title}</p>
        <p className="song-artist">{song.artist}</p>
      </div>
    </li>
  );
}
