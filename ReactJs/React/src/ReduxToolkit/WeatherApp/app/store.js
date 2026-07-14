import { configureStore } from "@reduxjs/toolkit";
import { weatherApi } from "../features/weatherApi";

export const store = configureStore({
  reducer: { [weatherApi.reducerPath]: weatherApi.reducer },
  middleware: (getDefault) => getDefault().concat(weatherApi.middleware),
});
