# Lộ trình học Redux Toolkit

## Trước khi học Redux Toolkit — Cần biết gì?

```
✅ useState, useEffect
✅ Props và Lifting State Up
✅ useContext (hiểu tại sao cần quản lý state toàn cục)
✅ Async/await, gọi API cơ bản
```

## Tại sao cần Redux Toolkit?

Khi app lớn, `useContext` bắt đầu có vấn đề:

```
- State thay đổi liên tục (giỏ hàng, thông báo real-time)
  → useContext re-render toàn bộ component dùng nó

- Logic phức tạp rải rác nhiều nơi
  → Khó debug, khó biết ai đang thay đổi state

- Nhiều team cùng làm
  → Không có cấu trúc thống nhất
```

**Redux Toolkit (RTK)** giải quyết bằng cách:

- Một kho state duy nhất — ai cũng đọc/ghi đúng chỗ
- Mọi thay đổi đều có tên rõ ràng — dễ debug
- DevTools mạnh — xem lại từng thay đổi state theo thời gian

---

## Giai đoạn 1 — Hiểu tư duy Redux (1 tuần)

**Mục tiêu:** Không học code trước. Hiểu tư duy trước.

### 3 nguyên tắc cốt lõi

**1. Single Source of Truth**
Toàn bộ state của app nằm trong 1 kho duy nhất gọi là **Store**.

```
Không có Redux:                  Có Redux:
Component A → state riêng        Store (1 kho duy nhất)
Component B → state riêng    →   ↑ ↑ ↑
Component C → state riêng        A B C (đọc từ store)
```

**2. State is Read-Only**
Không ai được sửa state trực tiếp. Muốn thay đổi → phải gửi **Action** (yêu cầu có tên).

```
// ❌ Sửa trực tiếp — bị cấm
store.state.user = { ten: 'Giang' }

// ✅ Gửi action
dispatch({ type: 'user/setUser', payload: { ten: 'Giang' } })
```

**3. Changes via Pure Functions (Reducer)**
Mọi thay đổi state đều đi qua **Reducer** — hàm nhận state cũ + action, trả về state mới.

```
State cũ + Action → Reducer → State mới
```

### Luồng hoạt động đầy đủ

```
User bấm nút
    │
    ▼
dispatch(action)       ← "Tôi muốn làm gì"
    │
    ▼
Reducer xử lý          ← "Được, state mới sẽ là..."
    │
    ▼
Store cập nhật state
    │
    ▼
Component re-render    ← Tự động hiển thị dữ liệu mới
```

---

## Giai đoạn 2 — Cài đặt và cấu hình cơ bản (3-5 ngày)

```bash
npm install @reduxjs/toolkit react-redux
```

### Cấu trúc thư mục chuẩn

```
src/
├── store/
│   ├── index.js           ← Tạo Store tổng
│   └── slices/
│       ├── userSlice.js   ← Slice quản lý User
│       ├── cartSlice.js   ← Slice quản lý Giỏ hàng
│       └── ...
└── components/
    └── ...
```

### Slice — Trái tim của Redux Toolkit

**Slice** = state + reducer + actions được gom vào 1 chỗ.

```js
// store/slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter", // Tên — dùng để tạo action type
  initialState: { value: 0 }, // State ban đầu
  reducers: {
    // Mỗi function = 1 action
    tang: (state) => {
      state.value += 1;
    }, // RTK cho phép "mutate" trực tiếp
    giam: (state) => {
      state.value -= 1;
    }, // (Bên trong dùng Immer tự tạo object mới)
    datGia: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Export actions để dispatch
export const { tang, giam, datGia } = counterSlice.actions;

// Export reducer để gắn vào store
export default counterSlice.reducer;
```

### Store — Kho state tổng

```js
// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer, // Gắn slice vào store
    // cart: cartReducer,     // Thêm slice khác vào đây
  },
});

export default store;
```

### Kết nối Store với React

```jsx
// main.jsx
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {" "}
    {/* Bọc toàn app */}
    <App />
  </Provider>,
);
```

---

## Giai đoạn 3 — Đọc và ghi state trong Component (3-5 ngày)

### useSelector — Đọc state từ Store

```jsx
import { useSelector } from "react-redux";

function HienThiDem() {
  // Chọn đúng phần state cần — không lấy cả store
  const value = useSelector((state) => state.counter.value);

  return <p>Giá trị: {value}</p>;
}
```

### useDispatch — Gửi action để thay đổi state

```jsx
import { useDispatch } from 'react-redux'
import { tang, giam, datGia } from './store/slices/counterSlice'

function NutDieu Khien() {
  const dispatch = useDispatch()

  return (
    <div>
      <button onClick={() => dispatch(tang())}>Tăng</button>
      <button onClick={() => dispatch(giam())}>Giảm</button>
      <button onClick={() => dispatch(datGia(100))}>Đặt = 100</button>
    </div>
  )
}
```

### Lưu ý quan trọng với useSelector

```jsx
// ❌ Lấy cả object → re-render mỗi khi bất kỳ field nào thay đổi
const user = useSelector((state) => state.user);

// ✅ Chỉ lấy field cần dùng → chỉ re-render khi đúng field đó thay đổi
const ten = useSelector((state) => state.user.ten);
const email = useSelector((state) => state.user.email);
```

---

## Giai đoạn 4 — Async với createAsyncThunk (1 tuần)

Đây là phần quan trọng nhất và phức tạp nhất — gọi API bất đồng bộ.

### createAsyncThunk — Gọi API trong Redux

```js
// store/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../api/services/userService";

// Tạo async action — tự động tạo 3 trạng thái: pending, fulfilled, rejected
export const layDanhSachUser = createAsyncThunk(
  "user/layDanhSach", // Tên action
  async (_, { rejectWithValue }) => {
    try {
      const res = await userService.getAll();
      return res.data; // fulfilled — trả về data
    } catch (err) {
      return rejectWithValue(err.response.data.message); // rejected
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    danhSach: [],
    loading: false,
    error: null,
  },
  reducers: {},

  // Xử lý 3 trạng thái của async action
  extraReducers: (builder) => {
    builder
      .addCase(layDanhSachUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(layDanhSachUser.fulfilled, (state, action) => {
        state.loading = false;
        state.danhSach = action.payload;
      })
      .addCase(layDanhSachUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
```

### Dùng trong component

```jsx
function DanhSachUser() {
  const dispatch = useDispatch();
  const { danhSach, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(layDanhSachUser()); // Gọi async action
  }, [dispatch]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <ul>
      {danhSach.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

### 3 trạng thái của createAsyncThunk

```
pending    → Đang gọi API → set loading = true
fulfilled  → API trả về thành công → lưu data, tắt loading
rejected   → API lỗi → lưu error, tắt loading
```

---

## Giai đoạn 5 — RTK Query (1 tuần)

RTK Query là layer tiếp theo — tự động xử lý loading/error/caching, không cần viết `createAsyncThunk` thủ công.

### Khi nào dùng RTK Query thay vì createAsyncThunk?

```
createAsyncThunk  →  Khi cần kiểm soát chi tiết, logic phức tạp
RTK Query         →  CRUD cơ bản, gọi API đơn giản, cần caching
```

### Cấu hình API

```js
// store/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.example.com",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Lấy danh sách user
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["User"], // Cache tag
    }),

    // Tạo user
    createUser: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"], // Tự động refetch getUsers sau khi tạo
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = apiSlice;
```

### Dùng trong component

```jsx
function DanhSachUser() {
  // Tự động gọi API, quản lý loading/error/cache
  const { data: users, isLoading, error } = useGetUsersQuery();

  if (isLoading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi</p>;

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}

function TaoUser() {
  const [createUser, { isLoading }] = useCreateUserMutation();

  async function handleSubmit(data) {
    await createUser(data); // Sau khi xong → tự refetch danh sách
  }
}
```

---

## Giai đoạn 6 — Thực chiến (liên tục)

### Dự án thực hành đề xuất

```
1. App Todo nâng cao
   → 1 slice, createAsyncThunk gọi API thật
   → CRUD đầy đủ

2. App Giỏ hàng
   → 2 slice (products + cart)
   → RTK Query lấy sản phẩm
   → Tính toán selector phức tạp

3. App Clone (Trello, Twitter feed đơn giản)
   → Nhiều slice phối hợp
   → Auth slice (đăng nhập, lưu token)
   → Protected route
```

### Redux DevTools — Bắt buộc phải cài

```
Cài extension: Redux DevTools trên Chrome/Firefox
→ Xem toàn bộ state hiện tại
→ Xem từng action đã dispatch theo thứ tự
→ "Du hành thời gian" — quay lại state trước đó
→ Dễ debug hơn rất nhiều so với console.log
```

---

## Checklist từng giai đoạn

```
Giai đoạn 1 — Tư duy
□ Hiểu Single Source of Truth
□ Hiểu tại sao không sửa state trực tiếp
□ Vẽ được luồng: dispatch → reducer → store → component

Giai đoạn 2 — Cấu hình
□ Tạo được slice với createSlice
□ Tạo được store với configureStore
□ Kết nối Provider vào app

Giai đoạn 3 — Đọc/Ghi state
□ Đọc state với useSelector đúng cách (không lấy cả object)
□ Dispatch action với useDispatch
□ Hiểu tại sao không dispatch trong render

Giai đoạn 4 — Async
□ Tạo được createAsyncThunk
□ Xử lý đủ 3 case: pending/fulfilled/rejected
□ Dùng rejectWithValue để trả lỗi đúng cách

Giai đoạn 5 — RTK Query
□ Cấu hình createApi với baseQuery
□ Viết được query và mutation endpoint
□ Hiểu providesTags và invalidatesTags để cache tự động

Giai đoạn 6 — Thực chiến
□ Hoàn thành ít nhất 2 dự án thực hành
□ Cài và dùng thành thạo Redux DevTools
□ Biết khi nào dùng Redux, khi nào useContext là đủ
```

---

## Khi nào KHÔNG cần Redux?

```
App nhỏ, 1-2 người làm      →  useState + useContext là đủ
State chỉ dùng trong 1 trang  →  useState cục bộ
Chưa có vấn đề về state       →  Đừng dùng Redux sớm

Dùng Redux khi:
  App lớn, nhiều team
  State cần chia sẻ phức tạp giữa nhiều trang
  Cần debug chi tiết lịch sử thay đổi state
  Dữ liệu cần cache và đồng bộ với server
```

> **Nguyên tắc:** Dùng giải pháp đơn giản nhất giải quyết được bài toán. `useState` → `useContext` → `Redux Toolkit` — chuyển lên khi cái dưới không đủ dùng.

---

## Tóm tắt lộ trình

```
Tuần 1     →  Tư duy Redux (3 nguyên tắc, luồng dispatch)
Tuần 2     →  createSlice + configureStore + Provider
Tuần 3     →  useSelector + useDispatch + thực hành
Tuần 4-5   →  createAsyncThunk + gọi API thật
Tuần 6-7   →  RTK Query + caching
Tuần 8+    →  Thực chiến với dự án thật
```
