export const COLORS = ["#FFE9A8", "#C9E4FF", "#FFD2D2", "#D8F5D0", "#E6D9FF"];

export const SEED_NOTES = [
  {
    id: "seed-1",
    title: "Ghi chú 1",
    content: "Nội dung ghi chú ",
    color: COLORS[0],
    createdAt: Date.now(),
  },
  {
    id: "seed-2",
    title: "Ghi chú 2",
    content: "Nội dung ghi chú",
    color: COLORS[1],
    createdAt: Date.now(),
  },
];

export function notesReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const newNote = {
        id: crypto.randomUUID(),
        title: action.payload.title,
        content: action.payload.content,
        color: COLORS[state.length % COLORS.length],
        createdAt: Date.now(),
      };
      return [newNote, ...state];
    }

    case "UPDATE":
      return state.map((note) =>
        note.id === action.payload.id
          ? { ...note, ...action.payload.data }
          : note,
      );

    case "DELETE":
      return state.filter((note) => note.id !== action.payload.id);

    default:
      return state;
  }
}
