# Điểm cần chú ý khi dùng `createAsyncThunk`

## Race condition — request cũ trả về sau request mới

Nếu user gõ tìm kiếm liên tục, mỗi lần gõ dispatch 1 thunk mới. Request đầu tiên có thể **trả về sau** request thứ 2 (do mạng chậm), làm dữ liệu cũ đè lên dữ liệu mới.

```javascript
//Không kiểm soát — request cũ có thể ghi đè kết quả mới
.addCase(searchProducts.fulfilled, (state, action) => {
  state.results = action.payload;
})
```

**Cách xử lý:** dùng `requestId` có sẵn trong `action.meta`, hoặc hủy request cũ bằng `AbortController` kết hợp `signal` trong thunk, hoặc dùng thư viện RTK Query (xử lý sẵn vấn đề này).

```javascript
export const searchProducts = createAsyncThunk(
  "products/search",
  async (query, { signal }) => {
    const res = await fetch(`/api/search?q=${query}`, { signal });
    return res.json();
  },
);
```

## `rejected` không tự bắt lỗi HTTP status (4xx, 5xx)

`fetch` **không throw error** khi server trả về 404/500 — chỉ throw khi lỗi mạng thật sự. Nếu không tự kiểm tra `res.ok`, action sẽ nhảy vào `fulfilled` dù server trả lỗi.

```javascript
// Sai lầm phổ biến — lỗi 404/500 vẫn vào "fulfilled"
async () => {
  const res = await fetch("/api/users");
  return res.json();
};
```

```javascript
// Phải tự kiểm tra
async () => {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};
```

## Nên dùng `rejectWithValue` thay vì để lỗi tự nhiên

Mặc định, `action.error.message` chỉ là message của `Error` — không đủ chi tiết (mã lỗi, field nào sai...). Dùng `rejectWithValue` để trả về đúng payload lỗi từ server.

```javascript
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data); // data có thể chứa { field: "email", message: "..." }
    return data;
  }
);

// Trong extraReducers:
.addCase(login.rejected, (state, action) => {
  state.error = action.payload ?? action.error.message; // payload ưu tiên nếu có
})
```

## Gọi thunk trùng lặp — không kiểm tra trạng thái trước khi gọi lại

`useEffect` chạy lại nhiều lần (do re-render, StrictMode chạy 2 lần ở dev...) dễ khiến API bị gọi trùng.

```javascript
// Không kiểm tra status, dễ gọi API nhiều lần thừa
useEffect(() => {
  dispatch(fetchUsers());
}, [dispatch]);
```

```javascript
// Kiểm tra status trước khi gọi
useEffect(() => {
  if (status === "idle") dispatch(fetchUsers());
}, [status, dispatch]);
```

## 5. `extraReducers` phình to khi có nhiều thunk

Nếu 1 slice có 5-6 thunk, `extraReducers` sẽ có 15-18 case (`pending/fulfilled/rejected` × số thunk) — code dễ rối. Cân nhắc:

- Tách `status` theo từng thunk riêng nếu chúng độc lập nhau (`fetchStatus`, `updateStatus`, `deleteStatus`) thay vì dùng chung 1 `status` cho cả slice.
- Với slice quá nhiều async logic, cân nhắc chuyển sang **RTK Query** — được thiết kế riêng cho data-fetching, tự động xử lý cache, loading, refetch, tránh phải viết tay `pending/fulfilled/rejected` mỗi lần.

## Đừng lưu dữ liệu API "thô" — chuẩn hoá trước khi lưu vào state

Nếu API trả về mảng lồng nhau phức tạp, lưu thẳng vào `state.items` khiến việc update/xoá từng item sau này rất khó (phải lặp mảng để tìm). Cân nhắc chuẩn hoá theo dạng `{ byId: {}, allIds: [] }` (RTK có sẵn `createEntityAdapter` hỗ trợ việc này).

## Không dispatch thunk bên trong reducer đồng bộ

Reducer (kể cả trong `reducers` hay logic gọi từ component ngay sau 1 action khác) không nên tự ý trigger thêm 1 async thunk khác một cách ẩn — sẽ khó theo dõi luồng dữ liệu. Việc gọi thunk tiếp theo nên nằm rõ ràng ở tầng component hoặc middleware, không giấu trong reducer.

## Tóm gọn ưu tiên xử lý

| Ưu tiên    | Vấn đề                                                                       |
| ---------- | ---------------------------------------------------------------------------- |
| Cao        | Race condition khi search/filter liên tục                                    |
| Cao        | Không check `res.ok` → lỗi HTTP lọt vào `fulfilled`                          |
| Trung bình | Không dùng `rejectWithValue` → thiếu chi tiết lỗi                            |
| Trung bình | Gọi API trùng do không check `status` trước                                  |
| Thấp hơn   | `extraReducers` phình to, dữ liệu chưa chuẩn hoá — ảnh hưởng khi app lớn dần |
