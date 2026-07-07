import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSongs } from "../features/songSlice.js";
import "../styles/playlist.css";

function PlayList({ genre }) {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.songs);

  useEffect(() => {
    if (status === "idle") dispatch(fetchSongs(genre));
  }, [status, genre, dispatch]);

  if (status === "loading") return <p> Đang tải playlist...</p>;
  if (status === "failed") return <p> {error}</p>;

  return (
    <ul>
      {list.map((song) => (
        <li key={song.id}>{song.title}</li>
      ))}
    </ul>
  );
}

export default PlayList;
