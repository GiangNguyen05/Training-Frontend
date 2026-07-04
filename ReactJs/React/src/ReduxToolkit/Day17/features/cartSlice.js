import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addItem: (state, action) => {
      state.push(action.payload);
    },
    removeItem: (state, action) => {
      state.splice(action.payload, 1);
    },
  },
});

export const { addItem, removeItem } = cartSlice.actions;

export const selectCartTotal = (state) =>
  state.cart.reduce((sum, item) => sum + item.price, 0);

export default cartSlice.reducer;
