import { useState } from "react";
import { NotesProvider } from "../context/NotesContext";
import Header from "../components/Header";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import "../styles/noteApp.css";
function NotesPage() {
  const [editingNote, setEditingNote] = useState(null);

  return (
    <div className="app">
      <Header />

      <main className="app-main">
        <section className="panel form-panel">
          <h2>{editingNote ? "Sửa ghi chú" : "Ghi chú mới"}</h2>
          <NoteForm
            key={editingNote?.id ?? "new"}
            editingNote={editingNote}
            onDone={() => setEditingNote(null)}
          />
        </section>

        <section className="panel list-panel">
          <h2>Danh sách ghi chú</h2>
          <NoteList onEdit={setEditingNote} />
        </section>
      </main>
    </div>
  );
}

export default function MainNote() {
  return (
    <NotesProvider>
      <NotesPage />
    </NotesProvider>
  );
}
