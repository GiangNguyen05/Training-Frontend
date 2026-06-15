# Render List & Key trong React

## Render List

Trong thực tế, dữ liệu luôn đến dưới dạng **danh sách** — danh sách sản phẩm, tin nhắn, bình luận...

React dùng **`array.map()`** để biến mảng dữ liệu thành mảng JSX:

```jsx
const sanPham = ["Áo", "Quần", "Giày"];

// map() — duyệt từng phần tử, trả về JSX
return (
  <ul>
    {sanPham.map((ten) => (
      <li>{ten}</li>
    ))}
  </ul>
);

// Kết quả:
// <ul>
//   <li>Áo</li>
//   <li>Quần</li>
//   <li>Giày</li>
// </ul>
```

Thực tế dữ liệu thường là **mảng object**:

```jsx
const sanPham = [
  { id: 1, ten: "Áo thun", gia: 150000 },
  { id: 2, ten: "Quần jean", gia: 450000 },
  { id: 3, ten: "Giày", gia: 890000 },
];

return (
  <ul>
    {sanPham.map((sp) => (
      <li key={sp.id}>
        {sp.ten} — {sp.gia.toLocaleString()} đ
      </li>
    ))}
  </ul>
);
```

---

## Key là gì và tại sao bắt buộc

Khi bạn chạy code trên mà không có `key`, React sẽ cảnh báo:

```
Warning: Each child in a list should have a unique "key" prop.
```

**Key là định danh duy nhất** giúp React phân biệt từng item trong danh sách.

### Vấn đề khi không có key

Hình dung React như một người quản lý danh sách. Danh sách ban đầu:

```
Vị trí 1 → Áo thun
Vị trí 2 → Quần jean
Vị trí 3 → Giày
```

Bạn thêm "Mũ" vào **đầu** danh sách. Không có key, React so sánh theo **vị trí**:

```
Vị trí 1: "Áo thun" → "Mũ"      → Khác → Cập nhật
Vị trí 2: "Quần jean" → "Áo thun" → Khác → Cập nhật
Vị trí 3: "Giày" → "Quần jean"  → Khác → Cập nhật
Vị trí 4: Không có → "Giày"     → Tạo mới
```

→ 4 thao tác DOM, 3 cái thừa. Với danh sách dài → cực chậm.

### Khi có key

```
key="mu":   Không có cũ → Tạo mới
key="ao":   Đã có, di chuyển vị trí
key="quan": Đã có, di chuyển vị trí
key="giay": Đã có, di chuyển vị trí
```

→ 1 thao tác tạo mới + di chuyển. Nhanh và chính xác.

---

## Key phải như thế nào

### Dùng ID từ dữ liệu

```jsx
{
  sanPham.map((sp) => <li key={sp.id}>{sp.ten}</li>);
}
```

ID từ database là lựa chọn tốt nhất — duy nhất và ổn định.

### ❌ Không dùng index làm key

```jsx
// ❌ Sai khi list có thể thêm/xóa/sắp xếp
{
  sanPham.map((sp, index) => <li key={index}>{sp.ten}</li>);
}
```

**Tại sao sai?** Index là vị trí, không phải danh tính. Khi xóa item đầu tiên, mọi index bị lệch → React nhầm item → bug state.

```
Trước xóa:           Sau xóa "Áo thun":
index=0 → Áo thun    index=0 → Quần jean (React nghĩ vẫn là Áo thun)
index=1 → Quần jean  index=1 → Giày     (React nghĩ vẫn là Quần jean)
index=2 → Giày
```

**Chỉ dùng index khi** danh sách tĩnh, không bao giờ thêm/xóa/sắp xếp.

### Không dùng Math.random()

```jsx
// ❌ Key thay đổi mỗi render → React tạo lại toàn bộ mỗi lần
<li key={Math.random()}>{sp.ten}</li>
```

---

## Key phải duy nhất trong cùng danh sách

Key chỉ cần duy nhất **trong cùng một list** — không cần duy nhất toàn bộ app:

```jsx
// ✅ Hai danh sách riêng, key có thể trùng nhau
<ul>
  {danhSach1.map(item => <li key={item.id}>{item.ten}</li>)}
</ul>
<ul>
  {danhSach2.map(item => <li key={item.id}>{item.ten}</li>)}
</ul>
```

---

## Render có điều kiện trong list

```jsx
const sanPham = [
  { id: 1, ten: "Áo thun", conHang: true },
  { id: 2, ten: "Quần jean", conHang: false },
  { id: 3, ten: "Giày", conHang: true },
];

return (
  <ul>
    {sanPham.map((sp) => (
      <li key={sp.id}>
        {sp.ten}
        {!sp.conHang && <span> — Hết hàng</span>}
      </li>
    ))}
  </ul>
);
```

---

## Tách component khi list phức tạp

Khi mỗi item có nhiều nội dung, tách ra component riêng:

```jsx
// ❌ Nhồi nhét tất cả trong map — khó đọc
{
  sanPham.map((sp) => (
    <div key={sp.id}>
      <img src={sp.anh} />
      <h3>{sp.ten}</h3>
      <p>{sp.gia} đ</p>
      <button>Mua</button>
    </div>
  ));
}

// ✅ Tách component — sạch và tái sử dụng được
function TheSanPham({ sp }) {
  return (
    <div>
      <img src={sp.anh} />
      <h3>{sp.ten}</h3>
      <p>{sp.gia} đ</p>
      <button>Mua</button>
    </div>
  );
}

{
  sanPham.map((sp) => <TheSanPham key={sp.id} sp={sp} />);
}
```

> **Quan trọng:** `key` đặt trên component ngoài cùng trong `map()`, không đặt bên trong component con.

---

## Tóm tắt

|                  | Nên                            | Không nên               |
| ---------------- | ------------------------------ | ----------------------- |
| **Key là gì**    | ID từ database                 | Index, Math.random()    |
| **Key ở đâu**    | Phần tử ngoài cùng trong map() | Bên trong component con |
| **Key duy nhất** | Trong cùng 1 list              | Toàn bộ app             |

**3 điều cần nhớ:**

1. Luôn có `key` khi dùng `map()` — không có thì React chạy sai
2. Key phải **ổn định** và **duy nhất** — dùng ID từ dữ liệu
3. Danh sách phức tạp → tách component riêng, đặt `key` trên component đó
