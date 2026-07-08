import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { searchSongsApi } from "../../api/musicApi";

// -> update/xoá theo id sau này không cần lặp mảng để tìm
const songsAdapter = createEntityAdapter();
export const searchSongs = createAsyncThunk(
  "songs/search",
  async (query, { signal, rejectWithValue }) => {
    try {
      const results = await searchSongsApi(query, { signal });
      return results;
    } catch (err) {
      if (err?.name === "AbortError") {
        throw err;
      }
      return rejectWithValue({
        status: err?.status ?? 0,
        message: err?.message ?? "Đã có lỗi xảy ra khi tìm kiếm",
      });
    }
  },
);

const songsSlice = createSlice({
  name: "songs",
  initialState: songsAdapter.getInitialState({
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    lastQuery: "",
  }),
  reducers: {
    queryCleared: (state) => {
      songsAdapter.removeAll(state);
      state.status = "idle";
      state.error = null;
      state.lastQuery = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchSongs.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.lastQuery = action.meta.arg;
      })
      .addCase(searchSongs.fulfilled, (state, action) => {
        if (action.meta.arg !== state.lastQuery) return;
        state.status = "succeeded";
        songsAdapter.setAll(state, action.payload);
      })
      .addCase(searchSongs.rejected, (state, action) => {
        if (action.meta.aborted) return;

        state.status = "failed";
        state.error = action.payload?.message ?? action.error.message;
      });
  },
});

export const { queryCleared } = songsSlice.actions;

// Selector chuẩn để lấy danh sách bài hát từ state đã chuẩn hoá
export const { selectAll: selectAllSongs } = songsAdapter.getSelectors(
  (state) => state.songs,
);

export default songsSlice.reducer;
