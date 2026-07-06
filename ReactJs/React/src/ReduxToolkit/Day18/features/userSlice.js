import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//Tạo thunk
export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return res.json(); //dữ liệu này sẽ thành action.payload khi fulfilled
});

const usersSlice = createSlice({
  name: "users",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
