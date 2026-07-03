import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cartSlice";

//Tủ hồ sơ trung tâm
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
