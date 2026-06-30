import { Search, StickyNote } from "lucide-react";
import { useNotes } from "../context/NotesContext";
import { useNoteSearch } from "../hooks/useNoteSearch";
import NoteCard from "./NoteCard";

export default function NoteList({ onEdit }) {
  const { notes } = useNotes();
  const { query, setQuery, filteredNotes } = useNoteSearch(notes);

  return (
    <div>
      <div className="search-bar">
        <Search size={16} />
        <input
          placeholder="Tìm ghi chú..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="empty-state">
          <StickyNote size={28} />
          <p>Không có ghi chú nào. Hãy thêm ghi chú mới ở trên.</p>
        </div>
      ) : (
        <div className="note-grid">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}
