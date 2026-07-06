# Xử lý Async với `createAsyncThunk` trong Redux

## Vấn đề: Reducer không được phép "chờ"

Nhắc lại nguyên tắc cũ: **Reducer là hàm thuần (pure function)** — nhận state cũ + action, trả về state mới, **ngay lập tức**, không có "chờ đợi" hay "gọi mạng".

```javascript
// Reducer chỉ có thể làm việc này — không thể "chờ" gì cả
(state, action) => stateMoi;
```

Nhưng gọi API thì luôn cần chờ:

```javascript
fetch("/api/products").then((res) => res.json()); // Cần chờ vài trăm ms
```

**Câu hỏi:** Vậy việc gọi API — vốn cần thời gian chờ — nên đặt ở đâu, nếu Reducer không được phép chờ?

**Trả lời:** Đó chính là việc của `createAsyncThunk`.

---

## `createAsyncThunk` là gì?

Hãy quay lại ẩn dụ "công ty với tủ hồ sơ trung tâm". `createAsyncThunk` giống như việc thuê một **nhân viên giao liên** — người này:

1. Nhận yêu cầu: _"Đi lấy danh sách sản phẩm từ kho tổng (server)"_
2. Đi ra ngoài, **chờ** kho tổng phản hồi (có thể mất vài giây)
3. Khi có kết quả, **tự động gửi 1 trong 3 loại phiếu yêu cầu** về cho nhân viên xử lý (Reducer):
   - Đang đi lấy hàng → phiếu `pending`
   - Lấy thành công → phiếu `fulfilled` (kèm dữ liệu)
   - Lấy thất bại → phiếu `rejected` (kèm lỗi)

```
dispatch(fetchProducts())
        │
        ▼
"Nhân viên giao liên" đi gọi API
        │
   ┌────┴────┐
   │ ĐANG CHỜ │ → tự động dispatch action "...pending"
   └────┬────┘
        │
   ┌────▼─────────────┐
   │ Có kết quả từ server │
   └────┬─────────────┘
        │
  ┌─────┴──────┐
  ▼            ▼
Thành công   Thất bại
  │            │
"...fulfilled" "...rejected"
(kèm dữ liệu)  (kèm lỗi)
```

---

## Viết code: `createAsyncThunk`

### Tạo thunk (nhân viên giao liên)

```javascript
// features/products/productsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Tên "products/fetchAll" dùng để đặt tên cho 3 action tự sinh ra bên dưới
export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Không lấy được danh sách sản phẩm");
  return res.json(); // Giá trị này sẽ nằm trong action.payload của "fulfilled"
});
```

`createAsyncThunk` tự động tạo ra **3 loại action** dựa trên tên bạn đặt (`"products/fetchAll"`):

| Action tự sinh ra             | Khi nào được gửi            |
| ----------------------------- | --------------------------- |
| `products/fetchAll/pending`   | Ngay khi bắt đầu gọi API    |
| `products/fetchAll/fulfilled` | Khi API trả về thành công   |
| `products/fetchAll/rejected`  | Khi API lỗi hoặc bị từ chối |

### Xử lý 3 loại action đó trong Reducer

Đây là phần khác biệt so với Reducer thông thường — dùng `extraReducers`:

```javascript
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Các action đồng bộ (không liên quan API) viết ở đây, như bình thường
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload; // Dữ liệu trả về từ API
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
```

### Gọi thunk từ component

```javascript
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";

function ProductList() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts()); // Gọi thunk giống hệt gọi 1 action bình thường
  }, [dispatch]);

  if (status === "loading") return <p>Đang tải...</p>;
  if (status === "failed") return <p>Lỗi: {error}</p>;

  return (
    <ul>
      {items.map((p) => (
        <li key={p.name}>{p.name}</li>
      ))}
    </ul>
  );
}
```

**Điều quan trọng:** Từ góc nhìn component, gọi `dispatch(fetchProducts())` **không khác gì** gọi `dispatch(addItem(...))` ở các bài trước — vẫn chỉ là `dispatch(action)`. Toàn bộ phần "chờ đợi API" được thunk giấu kín bên trong.

---

## Truyền tham số vào thunk

Muốn gọi API với tham số (ví dụ lấy chi tiết 1 sản phẩm theo `id`):

```javascript
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (productId) => {
    // Tham số truyền vào khi dispatch
    const res = await fetch(`/api/products/${productId}`);
    return res.json();
  },
);

// Gọi từ component:
dispatch(fetchProductById("sp-001"));
```

Nếu cần nhiều hơn 1 tham số, gom vào 1 object:

```javascript
dispatch(fetchProductById({ id: "sp-001", includeReviews: true }));
```

---

## Bảng tổng kết

| Khái niệm                                 | Vai trò                                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `createAsyncThunk("ten/action", asyncFn)` | Tạo ra 1 thunk — "nhân viên giao liên" đi gọi API và tự báo cáo kết quả                                             |
| `pending`                                 | Trạng thái "đang gọi API", dùng để hiện loading                                                                     |
| `fulfilled`                               | Gọi thành công, `action.payload` chứa dữ liệu trả về                                                                |
| `rejected`                                | Gọi thất bại, `action.error.message` chứa lý do lỗi                                                                 |
| `extraReducers`                           | Nơi Reducer "lắng nghe" 3 action tự sinh ra ở trên, vì chúng không được khai báo trong `reducers` như action thường |

---

## So sánh: Action thường vs Async Thunk

|                            | Action thường (`reducers`)     | Async Thunk (`extraReducers`)                   |
| -------------------------- | ------------------------------ | ----------------------------------------------- |
| Dữ liệu có sẵn ngay?       | Có                             | Không — cần chờ API                             |
| Số action sinh ra          | 1                              | 3 (`pending`, `fulfilled`, `rejected`)          |
| Khai báo ở đâu trong slice | `reducers`                     | `extraReducers`                                 |
| Ví dụ                      | "Thêm vào giỏ", "Xoá sản phẩm" | "Tải danh sách sản phẩm từ server", "Đăng nhập" |

**Ghi nhớ cốt lõi:** `createAsyncThunk` không phá vỡ nguyên tắc "Reducer là hàm thuần" — nó chỉ tách phần "chờ đợi, gọi API" ra khỏi Reducer, rồi tự động biến kết quả (thành công hay thất bại) thành các action bình thường để Reducer xử lý như mọi khi.
