import { createContext, useContext, useEffect, useReducer } from "react";
import { notesReducer, SEED_NOTES } from "./notesReducer";

const STORAGE_KEY = "notes_app_data";

const NotesContext = createContext(null);

// ham khoi tao
function initState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("[NotesContext] Không đọc được localStorage:", err);
  }
  return SEED_NOTES;
}

export function NotesProvider({ children }) {
  const [notes, dispatch] = useReducer(notesReducer, null, initState);

  // Đồng bộ notes → localStorage sau mỗi lần state thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (err) {
      console.warn("[NotesContext] Không ghi được localStorage:", err);
    }
  }, [notes]);

  const addNote = (data) => dispatch({ type: "ADD", payload: data });
  const updateNote = (id, data) =>
    dispatch({ type: "UPDATE", payload: { id, data } });
  const deleteNote = (id) => dispatch({ type: "DELETE", payload: { id } });

  const value = { notes, addNote, updateNote, deleteNote };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error("useNotes phải được dùng bên trong <NotesProvider>");
  }
  return ctx;
}
