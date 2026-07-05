# `useSelector` và `useDispatch`

- Trong React-Redux, component **không bao giờ chạm trực tiếp vào Store**. Mọi tương tác chỉ đi qua đúng 2 cánh cửa: `useSelector` (để **đọc**) và `useDispatch` (để **gửi yêu cầu thay đổi**).

```
                     ┌─────────────────────┐
     useSelector ──► │                     │
     (đọc ra)        │   STORE             │
                     │  (tủ hồ sơ trung tâm)│
     useDispatch ──► │                     │
     (gửi yêu cầu)   └─────────────────────┘
```

---

## `useSelector` — Cánh cửa ĐỌC

### Nó dùng để làm gì?

`useSelector` cho phép component **lấy ra đúng phần dữ liệu nó cần** từ Store — không phải lấy toàn bộ, chỉ lấy phần liên quan.

### Cú pháp

```javascript
const duLieu = useSelector((state) => state.tenPhanState);
```

Trong đó `state` là **toàn bộ** dữ liệu đang có trong Store, còn hàm bạn truyền vào (gọi là **selector**) quyết định "tôi muốn lấy phần nào".

### Ví dụ cụ thể

Giả sử Store hiện có:

```javascript
{
  cart: [
    { name: "Áo thun", price: 150000 },
    { name: "Mũ lưỡi trai", price: 90000 }
  ],
  user: { name: "Giang", isLoggedIn: true }
}
```

```javascript
import { useSelector } from "react-redux";

function CartIcon() {
  // Chỉ lấy phần "cart", không quan tâm "user"
  const cart = useSelector((state) => state.cart);
  return <span>🛒 {cart.length}</span>;
}

function WelcomeBanner() {
  // Chỉ lấy phần "user"
  const userName = useSelector((state) => state.user.name);
  return <p>Chào, {userName}!</p>;
}
```

### Đặc điểm quan trọng

| Đặc điểm                            | Ý nghĩa                                                                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Chỉ đọc, không sửa**              | `useSelector` tuyệt đối không thay đổi state — nó chỉ lấy ra để hiển thị                                                              |
| **Tự động re-render**               | Khi phần state mà selector trả về thay đổi, component tự cập nhật ngay                                                                |
| **Chỉ theo dõi phần liên quan**     | `CartIcon` chỉ re-render khi `cart` đổi. Nếu `user` đổi mà `cart` không đổi, `CartIcon` **không** re-render — giúp app chạy nhanh hơn |
| **Có thể tính toán trong selector** | Selector không bắt buộc trả nguyên `state.cart` — có thể trả về giá trị đã tính, ví dụ tổng tiền                                      |

```javascript
// Selector có thể tính toán trước khi trả về
const total = useSelector((state) =>
  state.cart.reduce((sum, item) => sum + item.price, 0),
);
```

---

## `useDispatch` — Cánh cửa GỬI YÊU CẦU

### Nó dùng để làm gì?

`useDispatch` trả về một hàm gọi là `dispatch`. Gọi `dispatch(action)` giống như **gửi một phiếu yêu cầu** tới Store: "Tôi muốn thay đổi thế này". Bản thân `dispatch` **không tự sửa state** — nó chỉ chuyển phiếu yêu cầu đến Reducer, Reducer mới là bên thực sự tạo ra state mới.

### Cú pháp

```javascript
const dispatch = useDispatch();

dispatch({ type: "cart/addItem", payload: { name: "Áo thun", price: 150000 } });
```

Nếu dùng Redux Toolkit (cách viết phổ biến hiện nay), bạn thường gọi qua **action creator** có sẵn thay vì tự viết object:

```javascript
import { useDispatch } from "react-redux";
import { addItem } from "../features/cart/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addItem(product)); // Gửi phiếu yêu cầu: "thêm sản phẩm này"
  };

  return <button onClick={handleAdd}>Thêm vào giỏ</button>;
}
```

### Đặc điểm quan trọng

| Đặc điểm                                  | Ý nghĩa                                                                                                                                                    |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Chỉ gửi yêu cầu, không tự sửa**         | `dispatch` không biết cách sửa state — nó chỉ chuyển tiếp cho Reducer xử lý                                                                                |
| **Luôn cần một `action`**                 | Action phải có `type` (mô tả "tôi muốn làm gì") và có thể kèm `payload` (dữ liệu đi cùng)                                                                  |
| **Không trả về giá trị mới ngay lập tức** | Sau khi `dispatch`, state trong Store cập nhật, rồi React tự động re-render các component đang `useSelector` phần đó — bạn không cần tự cập nhật giao diện |

---

## Kết hợp

Rất nhiều component sẽ dùng **cả hai** cùng lúc: đọc dữ liệu hiện tại (`useSelector`) và cho phép người dùng thay đổi nó (`useDispatch`).

```javascript
import { useSelector, useDispatch } from "react-redux";
import { removeItem } from "../features/cart/cartSlice";

function CartPanel() {
  const cart = useSelector((state) => state.cart); // ĐỌC: giỏ hàng hiện tại
  const dispatch = useDispatch(); // GỬI: cho phép xoá

  return (
    <ul>
      {cart.map((item, i) => (
        <li key={i}>
          {item.name}
          <button onClick={() => dispatch(removeItem(i))}>Xoá</button>
        </li>
      ))}
    </ul>
  );
}
```

**Luồng xảy ra khi bấm "Xoá":**

```
Bấm nút "Xoá"
      │
      ▼
dispatch(removeItem(i))         ← useDispatch: gửi phiếu yêu cầu
      │
      ▼
Reducer xử lý, tạo giỏ mới
      │
      ▼
Store cập nhật state.cart
      │
      ▼
useSelector((state) => state.cart) phát hiện thay đổi
      │
      ▼
CartPanel tự động re-render với danh sách mới
```

---

## Bảng so sánh

|                                       | `useSelector`                         | `useDispatch`                                                                      |
| ------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| **Vai trò**                           | Đọc dữ liệu từ Store                  | Gửi yêu cầu thay đổi tới Store                                                     |
| **Trả về**                            | Giá trị dữ liệu (số, mảng, object...) | Một hàm `dispatch`                                                                 |
| **Có làm component re-render không?** | Có — khi dữ liệu được chọn thay đổi   | Không tự re-render; chỉ _gây ra_ thay đổi khiến `useSelector` ở nơi khác re-render |
| **Có sửa state không?**               | Không, tuyệt đối chỉ đọc              | Không trực tiếp — chỉ chuyển tiếp cho Reducer                                      |
| **Ẩn dụ**                             | "Xin xem hồ sơ"                       | "Nộp phiếu yêu cầu"                                                                |

---

## Lỗi thường gặp cần tránh

**❌ Lấy nguyên cả `state` thay vì chỉ phần cần:**

```javascript
const state = useSelector((state) => state); // Component sẽ re-render mỗi khi BẤT KỲ phần nào của state đổi
```

✅ Nên chỉ lấy đúng phần cần dùng, để component không re-render thừa.

**❌ Tự ý sửa dữ liệu lấy ra từ `useSelector`:**

```javascript
const cart = useSelector((state) => state.cart);
cart.push(newItem); // ❌ Sai — không được sửa trực tiếp
```

✅ Muốn thay đổi, luôn phải đi qua `dispatch(action)`.
