import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Search, X } from "lucide-react";
import { searchSongs, queryCleared } from "../features/songs/songsSlice";

const DEBOUNCE_MS = 300;

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const pendingPromise = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      dispatch(queryCleared());
      return;
    }

    const debounceTimer = setTimeout(() => {
      pendingPromise.current = dispatch(searchSongs(query));
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(debounceTimer);
      pendingPromise.current?.abort();
    };
  }, [query, dispatch]);

  return (
    <div className="search-bar">
      <Search size={16} className="search-icon" />
      <input
        type="text"
        placeholder="Tìm bài hát hoặc nghệ sĩ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          className="clear-btn"
          onClick={() => setQuery("")}
          aria-label="Xoá tìm kiếm"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
