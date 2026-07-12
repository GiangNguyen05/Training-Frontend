import { configureStore } from "@reduxjs/toolkit";
import { booksApi } from "../features/booksApi";

export const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(booksApi.middleware),
});
