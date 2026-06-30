import { createContext, useContext, useReducer } from "react";
import { notesReducer, SEED_NOTES } from "./notesReducer";

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [notes, dispatch] = useReducer(notesReducer, SEED_NOTES);

  const addNote = (data) => dispatch({ type: "ADD", payload: data });
  const updateNote = (id, data) => dispatch({ type: "UPDATE", payload: { id, data } });
  const deleteNote = (id) => dispatch({ type: "DELETE", payload: { id } });

  const value = { notes, addNote, updateNote, deleteNote };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error("useNotes phải được dùng bên trong <NotesProvider>");
  }
  return ctx;
}
