import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNotes } from "../context/NotesContext";

export default function NoteCard({ note, onEdit }) {
  const { deleteNote } = useNotes();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="note-card" style={{ background: note.color }}>
      <div className="note-card-head">
        <h3>{note.title}</h3>
        <div className="note-card-actions">
          <button className="icon-btn" onClick={() => onEdit(note)} aria-label="Sửa ghi chú">
            <Pencil size={15} />
          </button>
          <button
            className="icon-btn danger"
            onClick={() => setConfirming(true)}
            aria-label="Xoá ghi chú"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <p>{note.content}</p>

      {confirming && (
        <div className="confirm-bar">
          <span>Xoá ghi chú này?</span>
          <button className="btn tiny danger" onClick={() => deleteNote(note.id)}>
            Xoá
          </button>
          <button className="btn tiny ghost" onClick={() => setConfirming(false)}>
            Huỷ
          </button>
        </div>
      )}
    </div>
  );
}
