# Song Search Demo — Dùng `createAsyncThunk`

Demo tìm bài hát **thể hiện rõ** từng lưu ý đã nêu trong Day19.

## Cấu trúc thư mục

```
song-search-demo/
├── index.html
├── package.json
└── src/
    ├── index.jsx                   # Bọc App bằng <Provider store={store}>
    ├── App.jsx
    ├── App.css
    │
    ├── app/
    │   └── store.js                # Tủ hồ sơ trung tâm
    │
    ├── features/
    │   └── songs/
    │       └── songsSlice.js       # Thunk + entity adapter + xử lý các lưu ý
    │
    ├── api/
    │   └── musicApi.js             # Mock API mô phỏng lỗi HTTP + abort
    │
    └── components/
        ├── SearchBar.jsx           # Debounce + huỷ request cũ (LƯU Ý #1, #4)
        ├── ResultsList.jsx         # Đọc dữ liệu đã chuẩn hoá (LƯU Ý #6)
        └── SongRow.jsx
```

## Đối chiếu từng lưu ý với vị trí trong code

| #   | Lưu ý                                       | Nằm ở đâu trong code                                                                                                                   |
| --- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Race condition                              | `SearchBar.jsx` — huỷ (`.abort()`) request cũ trong cleanup của `useEffect` khi query đổi hoặc unmount                                 |
| 2   | `fetch` không tự bắt lỗi HTTP status        | `musicApi.js` giả lập lỗi 400 khi query rỗng; `songsSlice.js` bắt lỗi này và đưa vào `rejectWithValue`                                 |
| 3   | Dùng `rejectWithValue` thay vì lỗi mặc định | `searchSongs` thunk trong `songsSlice.js` — trả về `{ status, message }` có cấu trúc rõ ràng                                           |
| 4   | Tránh gọi API trùng lặp                     | `SearchBar.jsx` — không dispatch khi ô tìm kiếm rỗng; debounce 300ms trước khi gọi                                                     |
| 5   | `extraReducers` không phình to              | Chỉ có 1 thunk trong slice này nên giữ gọn; với slice nhiều thunk hơn, nên tách `status` riêng theo từng thunk                         |
| 6   | Chuẩn hoá dữ liệu                           | `songsSlice.js` dùng `createEntityAdapter` thay vì lưu mảng thô; `ResultsList.jsx` đọc qua `selectAllSongs`                            |
| 7   | Không dispatch thunk ẩn trong reducer       | `queryCleared` chỉ dọn state, không tự gọi thêm thunk nào — việc gọi `searchSongs` luôn nằm rõ ràng ở tầng component (`SearchBar.jsx`) |

## Điểm hay để ý thêm

- `action.meta.aborted` (trong `.addCase(searchSongs.rejected, ...)`) là cách Redux Toolkit tự đánh dấu khi request bị huỷ chủ động — nhờ vậy code phân biệt được "lỗi thật" và "bị huỷ vì có query mới hơn", tránh hiện thông báo lỗi sai cho người dùng.
- `state.lastQuery` được so sánh trong `fulfilled` như một lớp phòng thủ thứ hai — phòng trường hợp abort không kịp chặn response cũ.
