# RTK Query

## RTK Query là gì

RTK Query là một **module con nằm trong Redux Toolkit**, chuyên dùng để giải quyết đúng 1 bài toán: **lấy dữ liệu từ server và cache lại**. Nó không thay thế Redux — nó là một lớp được xây trên nền Redux, tự động sinh ra slice, thunk, reducer, và cả React hook cho bạn.

Nếu `createAsyncThunk` giống như việc bạn **tự thuê và huấn luyện 1 nhân viên giao liên** (tự viết `pending/fulfilled/rejected`, tự quản lý `status`, tự cache nếu muốn), thì RTK Query giống như **thuê nguyên một phòng ban logistics đã có sẵn quy trình** — bạn chỉ cần khai báo "tôi cần lấy dữ liệu gì, từ đâu", phần còn lại (loading, cache, tự động gọi lại khi cần, huỷ request cũ...) đã có sẵn.

---

## Cách hoạt động

### Bước 1 — Định nghĩa "API slice"

Thay vì viết `createAsyncThunk` + `extraReducers` như trước, bạn định nghĩa 1 lần duy nhất toàn bộ các endpoint (API) mà app cần gọi:

```javascript
// features/api/musicApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const musicApi = createApi({
  reducerPath: "musicApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Song"], // dùng để tự động làm mới cache — nói ở phần sau
  endpoints: (builder) => ({
    getSongs: builder.query({
      query: (genre) => `/songs?genre=${genre}`,
      providesTags: ["Song"],
    }),
    addSong: builder.mutation({
      query: (newSong) => ({
        url: "/songs",
        method: "POST",
        body: newSong,
      }),
      invalidatesTags: ["Song"], // thêm bài mới -> tự động gọi lại getSongs
    }),
  }),
});

// RTK Query TỰ SINH RA các React hook này — bạn không cần viết tay
export const { useGetSongsQuery, useAddSongMutation } = musicApi;
```

### Bước 2 — Đăng ký vào store

```javascript
// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { musicApi } from "../features/api/musicApi";

export const store = configureStore({
  reducer: {
    [musicApi.reducerPath]: musicApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(musicApi.middleware),
});
```

### Bước 3 — Dùng thẳng trong component, không cần `useSelector`/`useDispatch`/`useEffect`

```javascript
import { useGetSongsQuery } from "../features/api/musicApi";

function Playlist({ genre }) {
  const { data: songs, isLoading, isError, error } = useGetSongsQuery(genre);

  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Lỗi: {error.message}</p>;

  return (
    <ul>
      {songs.map((song) => (
        <li key={song.id}>{song.title}</li>
      ))}
    </ul>
  );
}
```

**So sánh trực tiếp với cách viết `createAsyncThunk` trước đây:**

| Việc phải làm                                  | `createAsyncThunk`                       | RTK Query                                  |
| ---------------------------------------------- | ---------------------------------------- | ------------------------------------------ |
| Viết thunk gọi API                             | Tự viết                                  | Chỉ khai báo `query: (arg) => url`         |
| Viết `reducers`/`extraReducers`                | Tự viết `pending/fulfilled/rejected`     | Không cần — tự sinh                        |
| Quản lý `status`/`error` trong state           | Tự viết                                  | Có sẵn qua `isLoading`, `isError`, `error` |
| Gọi API trong component                        | `useEffect` + `dispatch` + `useSelector` | 1 dòng: `useGetSongsQuery()`               |
| Cache — gọi lại component khác không fetch lại | Tự viết logic kiểm tra                   | Có sẵn, tự động                            |

---

## Cơ chế cache — phần "phép màu" của RTK Query

Đây là điểm khác biệt lớn nhất so với `createAsyncThunk`. Khi 2 component khác nhau cùng gọi `useGetSongsQuery("lofi")`, RTK Query **chỉ gọi API 1 lần** — component thứ 2 dùng lại dữ liệu đã cache, không gọi lại API.

```
Component A: useGetSongsQuery("lofi")  ──┐
                                          ├──► Chỉ 1 request thật sự được gửi đi
Component B: useGetSongsQuery("lofi")  ──┘     (2 component dùng chung 1 cache)
```

### Tự động làm mới cache bằng `tags`

Đây là cơ chế thay thế cho việc bạn phải tự nhớ "gọi lại API sau khi thêm dữ liệu mới":

- `providesTags: ["Song"]` trên `getSongs` → nói với RTK Query: _"kết quả này thuộc nhóm 'Song'"_
- `invalidatesTags: ["Song"]` trên `addSong` → nói: _"sau khi thêm bài hát, mọi cache thuộc nhóm 'Song' đã lỗi thời"_

Kết quả: sau khi gọi `addSong`, RTK Query **tự động gọi lại** `getSongs` ở mọi nơi đang hiển thị nó — bạn không cần tự `dispatch(fetchSongs())` lại thủ công.

---

## Khi nào dùng RTK Query, khi nào dùng `createAsyncThunk`

### Nên dùng RTK Query khi:

- Dữ liệu đến từ **REST API hoặc GraphQL**, và mục tiêu chính là **lấy về để hiển thị** (danh sách sản phẩm, chi tiết bài viết, profile người dùng...)
- App có nhiều nơi cùng cần 1 loại dữ liệu — muốn tránh gọi API trùng lặp
- Cần các tính năng "miễn phí" đi kèm: cache tự động, tự động gọi lại (refetch) khi quay lại tab, polling định kỳ, tự huỷ request cũ khi tham số đổi (đã xử lý sẵn race condition)
- Muốn giảm lượng boilerplate — không cần viết `extraReducers` tay

### Nên dùng `createAsyncThunk` khi:

- Logic async **không đơn thuần là "gọi API lấy dữ liệu"** — ví dụ: xử lý luồng nghiệp vụ phức tạp gồm nhiều bước, cần dispatch nhiều action khác nhau xen kẽ, hoặc cần custom sâu vào từng bước `pending/fulfilled/rejected` theo logic riêng của app
- Dữ liệu trả về cần được **biến đổi/tính toán phức tạp** trước khi lưu vào state, theo cách không phù hợp với model "cache theo endpoint" của RTK Query
- Dự án đã có sẵn nhiều `createAsyncThunk` viết tay, việc chuyển hẳn sang RTK Query chưa đáng công sức (chuyển đổi dần, không bắt buộc phải chọn 1 trong 2 cho toàn bộ app)
- Cần kiểm soát rất chi tiết thời điểm gọi API (không muốn có cache tự động, muốn tự quản lý toàn bộ vòng đời request)

### Bảng quyết định nhanh

| Tình huống                                          | Chọn                                              |
| --------------------------------------------------- | ------------------------------------------------- |
| Danh sách sản phẩm, hiển thị dữ liệu từ server      | RTK Query                                         |
| Form đăng nhập — gửi 1 lần, không cần cache         | Cả 2 đều được, RTK Query (`mutation`) vẫn gọn hơn |
| Luồng nghiệp vụ nhiều bước, tự custom logic state   | `createAsyncThunk`                                |
| Cần tính năng polling, tự refetch khi focus lại tab | RTK Query                                         |
| Dữ liệu tính toán phức tạp trước khi lưu vào store  | `createAsyncThunk`                                |

**Quan trọng:** 2 công cụ này **không loại trừ nhau** trong cùng 1 dự án. RTK Query dùng cho phần "lấy dữ liệu hiển thị", `createAsyncThunk` vẫn có chỗ đứng cho các luồng nghiệp vụ đặc thù.

---

## Những điều cần biết thêm về RTK Query

### `query` vs `mutation`

- **`query`** — dùng để **đọc** dữ liệu (GET). Tự động cache.
- **`mutation`** — dùng để **thay đổi** dữ liệu (POST/PUT/DELETE). Không cache kết quả, nhưng có thể `invalidatesTags` để làm mới các `query` liên quan.

### Trạng thái trả về từ hook

`useGetSongsQuery` trả về nhiều giá trị hữu ích hơn chỉ `data`:

```javascript
const {
  data, // dữ liệu trả về (undefined nếu chưa có)
  isLoading, // true chỉ ở lần fetch ĐẦU TIÊN
  isFetching, // true ở MỌI lần đang fetch (kể cả refetch nền)
  isError,
  error,
  refetch, // hàm gọi lại API thủ công khi cần
} = useGetSongsQuery(genre);
```

Phân biệt `isLoading` và `isFetching` khá quan trọng: `isLoading` chỉ dùng để hiện skeleton/spinner lần đầu; `isFetching` dùng khi muốn hiện chỉ báo "đang làm mới" mà vẫn giữ dữ liệu cũ hiển thị.

### Bỏ qua gọi API có điều kiện — `skip`

```javascript
const { data } = useGetSongsQuery(genre, {
  skip: !genre, // không gọi API nếu chưa chọn genre
});
```

### Cache không tồn tại vĩnh viễn

Mặc định, RTK Query giữ cache trong **60 giây** sau khi component cuối cùng dùng nó unmount, rồi tự xoá để tránh giữ dữ liệu cũ vô thời hạn trong bộ nhớ. Có thể chỉnh qua `keepUnusedDataFor`.

### Không cần Redux DevTools để debug riêng

Vì RTK Query build trên Redux, mọi cache và trạng thái vẫn hiện đầy đủ trong Redux DevTools như một slice bình thường — dễ debug bằng công cụ đã quen thuộc.

---

## Tóm tắt

| Khái niệm                                      | Ý nghĩa                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| `createApi`                                    | Định nghĩa 1 "API slice" — nơi khai báo toàn bộ endpoint                 |
| `endpoints.query`                              | Endpoint đọc dữ liệu, tự động cache                                      |
| `endpoints.mutation`                           | Endpoint thay đổi dữ liệu                                                |
| `providesTags` / `invalidatesTags`             | Cơ chế tự động làm mới cache liên quan sau khi có thay đổi               |
| Hook tự sinh (`useXxxQuery`, `useXxxMutation`) | Thay thế hoàn toàn cho `useEffect` + `dispatch` + `useSelector` thủ công |
| `isLoading` vs `isFetching`                    | Phân biệt "lần đầu tải" và "đang làm mới nền"                            |

**Ghi nhớ cốt lõi:** RTK Query không phải một Redux khác — nó là lớp tiện ích được xây trên chính Redux Toolkit, giải quyết đúng bài toán data-fetching mà `createAsyncThunk` vẫn phải tự tay xử lý từng bước một.
