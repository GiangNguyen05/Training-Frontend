import { useMemo, useState } from "react";

//  Nhận vào danh sách notes, trả ra danh sách đã lọc + state của ô tìm kiếm.

export function useNoteSearch(notes) {
  const [query, setQuery] = useState("");

  const filteredNotes = useMemo(() => {
    if (!query.trim()) return notes;
    const q = query.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q),
    );
  }, [notes, query]);

  return { query, setQuery, filteredNotes };
}
