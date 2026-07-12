# Cấu hình API trong RTK Query

## Cấu trúc tổng thể của `createApi`

```javascript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const musicApi = createApi({
  reducerPath: "musicApi",
  baseQuery: fetchBaseQuery({ ... }),
  tagTypes: ["Song", "Playlist"],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (builder) => ({ ... }),
});
```

Đi lần lượt từng phần.

---

## `reducerPath` — tên slice trong store

```javascript
reducerPath: "musicApi",
```

Đây là "tên ngăn kéo" mà RTK Query dùng để lưu cache trong Redux store. Nếu app có nhiều API slice (ví dụ tách riêng `musicApi` và `userApi`), **mỗi API slice phải có `reducerPath` khác nhau**, nếu không chúng sẽ ghi đè lên nhau.

```javascript
// store.js
export const store = configureStore({
  reducer: {
    [musicApi.reducerPath]: musicApi.reducer, // "musicApi"
    [userApi.reducerPath]: userApi.reducer, // "userApi"
  },
  middleware: (getDefault) =>
    getDefault().concat(musicApi.middleware, userApi.middleware),
});
```

Nếu không khai báo, mặc định là `"api"`.

---

## `baseQuery` — nơi cấu hình cách gọi API

### `fetchBaseQuery` — dùng cho hầu hết trường hợp

```javascript
baseQuery: fetchBaseQuery({
  baseUrl: "https://api.mymusic.com/v1",
  timeout: 10000, // 10 giây, tự huỷ nếu quá lâu
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
}),
```

| Option           | Ý nghĩa                                                       |
| ---------------- | ------------------------------------------------------------- |
| `baseUrl`        | Phần URL gốc, dùng chung cho mọi endpoint bên dưới            |
| `prepareHeaders` | Chạy trước **mỗi** request — nơi gắn token, header dùng chung |
| `timeout`        | Số ms trước khi tự huỷ request nếu server không phản hồi      |
| `credentials`    | `"include"` nếu cần gửi cookie kèm request (cross-origin)     |

**Lưu ý quan trọng:** `prepareHeaders` nhận `getState` — nghĩa là bạn có thể đọc token từ chính Redux store, không cần truyền tay token vào từng request.

### Custom `baseQuery` — khi cần logic phức tạp hơn (ví dụ: tự refresh token)

`fetchBaseQuery` không đủ khi bạn cần logic như: gọi API bị lỗi 401 → tự động refresh token → gọi lại request cũ. Lúc này viết 1 `baseQuery` tuỳ chỉnh bọc quanh `fetchBaseQuery`:

```javascript
const rawBaseQuery = fetchBaseQuery({ baseUrl: "/api" });

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Token hết hạn -> thử refresh
    const refreshResult = await rawBaseQuery(
      "/auth/refresh",
      api,
      extraOptions,
    );
    if (refreshResult.data) {
      api.dispatch(tokenRefreshed(refreshResult.data));
      result = await rawBaseQuery(args, api, extraOptions); // gọi lại request cũ
    } else {
      api.dispatch(loggedOut());
    }
  }

  return result;
};

export const musicApi = createApi({
  baseQuery: baseQueryWithReauth,
  // ...
});
```

---

## `tagTypes` — khai báo các "nhóm cache"

```javascript
tagTypes: ["Song", "Playlist"],
```

Đây chỉ là **danh sách khai báo tên** — giống như khai báo trước các loại "nhãn dán" bạn sẽ dùng để đánh dấu cache. Bắt buộc phải khai báo ở đây trước, thì `providesTags`/`invalidatesTags` bên dưới mới dùng được tên đó (nếu dùng TypeScript, thiếu khai báo sẽ báo lỗi type).

---

## Cấu hình từng `endpoint`

### `query` — endpoint đọc dữ liệu

```javascript
getSongs: builder.query({
  query: (genre) => `/songs?genre=${genre}`,
  // Nếu cần cấu hình chi tiết hơn (method, headers riêng):
  // query: (genre) => ({ url: "/songs", params: { genre } }),

  providesTags: (result, error, genre) =>
    result
      ? [...result.map(({ id }) => ({ type: "Song", id })), { type: "Song", id: "LIST" }]
      : [{ type: "Song", id: "LIST" }],

  transformResponse: (response) => response.data ?? response,
  transformErrorResponse: (response) => response.data?.message ?? "Đã có lỗi xảy ra",
}),
```

| Option                   | Ý nghĩa                                                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `query`                  | Hàm nhận tham số từ hook (`useGetSongsQuery(arg)`), trả về URL hoặc object cấu hình request                                               |
| `providesTags`           | Gắn "nhãn" cho kết quả — dùng để biết khi nào cần làm mới cache                                                                           |
| `transformResponse`      | Biến đổi dữ liệu **trước khi lưu vào cache** — hữu ích khi API trả về bọc trong `{ data: [...], meta: {...} }` mà bạn chỉ cần phần `data` |
| `transformErrorResponse` | Tương tự nhưng cho trường hợp lỗi — chuẩn hoá message lỗi hiển thị cho người dùng                                                         |

### 5.2. Tag theo từng `id` — tại sao không chỉ dùng 1 tag chung?

Cách viết `providesTags` phía trên có vẻ phức tạp hơn `["Song"]` đơn giản, nhưng đây là kỹ thuật **quan trọng** để tránh làm mới cache thừa:

```javascript
// ❌ Đơn giản nhưng kém hiệu quả — MỌI thay đổi liên quan "Song" đều làm mới TOÀN BỘ list
providesTags: ["Song"],

// ✅ Gắn tag theo từng id cụ thể — chỉ làm mới đúng phần bị ảnh hưởng
providesTags: (result) =>
  result
    ? [...result.map(({ id }) => ({ type: "Song", id })), { type: "Song", id: "LIST" }]
    : [{ type: "Song", id: "LIST" }],
```

Khi đó, một `mutation` sửa đúng 1 bài hát chỉ cần khai báo:

```javascript
updateSong: builder.mutation({
  query: ({ id, ...patch }) => ({ url: `/songs/${id}`, method: "PATCH", body: patch }),
  invalidatesTags: (result, error, { id }) => [{ type: "Song", id }], // chỉ làm mới đúng bài hát đó
}),
```

Còn thêm bài mới thì cần làm mới cả list:

```javascript
addSong: builder.mutation({
  query: (newSong) => ({ url: "/songs", method: "POST", body: newSong }),
  invalidatesTags: [{ type: "Song", id: "LIST" }], // chỉ làm mới list, không đụng các bài hát lẻ khác
}),
```

### `mutation` — endpoint thay đổi dữ liệu

```javascript
deleteSong: builder.mutation({
  query: (id) => ({ url: `/songs/${id}`, method: "DELETE" }),
  invalidatesTags: (result, error, id) => [{ type: "Song", id }],
}),
```

`query` cho `mutation` luôn trả về object có `method` (mặc định `GET` nếu không khai báo, nên **bắt buộc khai báo** `method` cho mutation).

---

## Cấu hình hành vi refetch (cấp API slice)

```javascript
export const musicApi = createApi({
  // ...
  refetchOnMountOrArgChange: 30, // giây — coi cache "cũ" nếu quá 30s kể từ lần fetch trước
  refetchOnFocus: true, // tự fetch lại khi người dùng quay lại tab trình duyệt
  refetchOnReconnect: true, // tự fetch lại khi mạng có kết nối trở lại
});
```

| Option                      | Khi nào bật                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `refetchOnMountOrArgChange` | Dữ liệu hay thay đổi (giá cả, số lượng tồn kho) — muốn đảm bảo luôn tương đối mới khi component mount lại |
| `refetchOnFocus`            | Dữ liệu có thể bị người khác sửa trong lúc tab không active (dashboard nhiều người dùng chung)            |
| `refetchOnReconnect`        | App dùng nhiều trên mobile, mạng hay chập chờn                                                            |

Có thể override từng option này ở **cấp từng hook** thay vì áp dụng toàn API:

```javascript
useGetSongsQuery(genre, { refetchOnMountOrArgChange: true });
```

---

## `keepUnusedDataFor` — thời gian giữ cache sau khi không còn ai dùng

```javascript
keepUnusedDataFor: 60, // giây (mặc định)
```

Sau khi component cuối cùng dùng 1 cache unmount, RTK Query giữ lại cache đó thêm 60 giây (đề phòng người dùng quay lại ngay), rồi mới xoá để giải phóng bộ nhớ. Có thể chỉnh riêng theo từng endpoint:

```javascript
getSongs: builder.query({
  query: (genre) => `/songs?genre=${genre}`,
  keepUnusedDataFor: 300, // dữ liệu ít đổi, giữ cache lâu hơn mặc định
}),
```

---

## Query có điều kiện và Lazy Query

### `skip` — không gọi API khi chưa đủ điều kiện

```javascript
const { data } = useGetSongsQuery(genre, { skip: !genre });
```

### `useLazyQuery` — chỉ gọi khi có hành động cụ thể (không tự gọi lúc mount)

```javascript
const [triggerSearch, { data, isLoading }] = useLazySearchSongsQuery();

<button onClick={() => triggerSearch(inputValue)}>Tìm kiếm</button>;
```

Khác với `useGetSongsQuery` (tự gọi ngay khi component mount), `useLazyXxxQuery` trả về 1 hàm `trigger` — chỉ gọi khi bạn tự gọi hàm đó, phù hợp cho nút bấm "Tìm kiếm" thay vì tự động gọi theo mỗi ký tự gõ.

---

## Polling — tự động gọi lại theo chu kỳ

```javascript
const { data } = useGetSongsQuery(genre, {
  pollingInterval: 5000, // gọi lại mỗi 5 giây
});
```

Hữu ích cho dữ liệu cần cập nhật gần real-time (bảng xếp hạng, trạng thái đơn hàng) mà không cần WebSocket.

---

## Bảng tổng hợp toàn bộ option hay dùng

| Cấp            | Option                                                                | Ý nghĩa                                                                         |
| -------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| API slice      | `reducerPath`                                                         | Tên slice trong store, phải unique nếu có nhiều API slice                       |
| API slice      | `baseQuery`                                                           | Cấu hình gốc: `baseUrl`, headers, timeout, hoặc custom logic (refresh token...) |
| API slice      | `tagTypes`                                                            | Khai báo trước tên các nhóm cache sẽ dùng                                       |
| API slice      | `keepUnusedDataFor`                                                   | Thời gian giữ cache sau khi hết người dùng (mặc định 60s)                       |
| API slice      | `refetchOnMountOrArgChange` / `refetchOnFocus` / `refetchOnReconnect` | Khi nào tự động fetch lại                                                       |
| Endpoint       | `query`                                                               | Hàm build request (URL, method, body)                                           |
| Endpoint       | `providesTags` / `invalidatesTags`                                    | Cơ chế tự làm mới cache liên quan                                               |
| Endpoint       | `transformResponse` / `transformErrorResponse`                        | Chuẩn hoá dữ liệu / lỗi trước khi lưu cache                                     |
| Endpoint       | `keepUnusedDataFor`                                                   | Override thời gian giữ cache riêng cho endpoint này                             |
| Hook (lúc gọi) | `skip`                                                                | Bỏ qua gọi API có điều kiện                                                     |
| Hook (lúc gọi) | `pollingInterval`                                                     | Tự gọi lại theo chu kỳ                                                          |
| Hook (lúc gọi) | `useLazyXxxQuery`                                                     | Chỉ gọi khi có hành động cụ thể, không tự gọi lúc mount                         |

**Ghi nhớ cốt lõi:** cấu hình RTK Query chia làm 3 tầng — **tầng API slice** (áp dụng toàn bộ), **tầng endpoint** (áp dụng riêng 1 loại request), và **tầng hook lúc gọi trong component** (áp dụng riêng 1 lần gọi cụ thể). Option ở tầng càng cụ thể sẽ override tầng tổng quát hơn.
