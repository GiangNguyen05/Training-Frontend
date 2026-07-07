import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSongs = createAsyncThunk(
  "songs/fetchAll",
  async (genre, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          genre,
        )}&entity=song&limit=20`,
      );

      if (!res.ok) {
        return rejectWithValue("Không lấy được dữ liệu");
      }

      const data = await res.json();

      return data.results.map((song) => ({
        id: song.trackId,
        title: song.trackName,
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const songSlice = createSlice({
  name: "songs",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default songSlice.reducer;
