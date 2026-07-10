import { Music2 } from "lucide-react";
import SearchBar from "./SearchBar";
import ResultsList from "./ResultsList";
import "../styles/mainSong.css";

export default function MainSong() {
  return (
    <div className="page">
      <header className="page-header">
        <Music2 size={22} strokeWidth={1.8} />
        <div>
          <h1>Tìm bài hát</h1>
        </div>
      </header>

      <SearchBar />
      <ResultsList />
    </div>
  );
}
