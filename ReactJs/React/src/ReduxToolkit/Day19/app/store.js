import { configureStore } from "@reduxjs/toolkit";
import songReducer from "../features/songSlice.js";

export const store = configureStore({
  reducer: { songs: songReducer },
});
