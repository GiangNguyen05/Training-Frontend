# Lộ trình học ReactJS — Cơ bản đến Nâng cao

## Thứ tự học quan trọng

```
HTML/CSS → JavaScript cơ bản → ES6+ → React cơ bản → React trung cấp → React nâng cao
```

## Giai đoạn 1 — Nền tảng Web cơ bản (4–6 tuần)

**Mục tiêu:** Tự xây được 1 trang web tĩnh đơn giản có tương tác.

- **HTML5** — Cấu trúc trang web, thẻ, form
- **CSS3** — Flexbox, Grid, responsive design
- **JavaScript cơ bản** — Biến, hàm, vòng lặp, điều kiện
- **DOM & Events** — Thao tác giao diện bằng JS

---

## Giai đoạn 2 — JavaScript ES6+ (2–3 tuần)

**Mục tiêu:** React viết hoàn toàn bằng ES6+. Bỏ qua phần này sẽ bị "mù chữ" khi đọc code React.

### Arrow function

Cú pháp hàm rút gọn.

```js
// Cách cũ
function cong(a, b) {
  return a + b;
}

// Arrow function
const cong = (a, b) => a + b;
```

### Destructuring

Gán biến từ object/array.

```js
const nguoi = { ten: "Giang", tuoi: 24 };
const { ten, tuoi } = nguoi; // ten = 'Giang', tuoi = 24

const mang = [1, 2, 3];
const [a, b] = mang; // a = 1, b = 2
```

### Promise & async/await

Xử lý bất đồng bộ (gọi API, đọc file...).

```js
// Promise
fetch("https://api.example.com/data")
  .then((res) => res.json())
  .then((data) => console.log(data));

// async/await (dễ đọc hơn)
async function layDuLieu() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();
  console.log(data);
}
```

### map, filter, reduce

Xử lý mảng hiện đại — dùng rất nhiều trong React.

```js
const so = [1, 2, 3, 4, 5];

so.map((x) => x * 2); // [2, 4, 6, 8, 10]   — biến đổi từng phần tử
so.filter((x) => x > 2); // [3, 4, 5]           — lọc phần tử
so.reduce((t, x) => t + x, 0); // 15              — gộp thành 1 giá trị
```

### Import / Export modules

Chia code thành nhiều file nhỏ rồi dùng lại ở nơi khác.

```js
// mathUtils.js — Named export
export const PI = 3.14;
export function cong(a, b) {
  return a + b;
}

// nguoi.js — Default export (mỗi file chỉ có 1)
export default function xinChao(ten) {
  return `Xin chào ${ten}!`;
}
```

```js
// Nơi khác dùng lại
import { cong, PI } from "./mathUtils.js"; // Named import — cần dấu {}
import xinChao from "./nguoi.js"; // Default import — không cần {}
import * as Math from "./mathUtils.js"; // Import tất cả
```

|                | Named export        | Default export     |
| -------------- | ------------------- | ------------------ |
| Số lượng       | Bao nhiêu cũng được | Chỉ 1 per file     |
| Cú pháp export | `export const x`    | `export default x` |
| Cú pháp import | `import { x }`      | `import x`         |
| Tên khi import | Phải đúng tên gốc   | Đặt tên tùy ý      |

> **Quy tắc thực tế:** Component → dùng `default`. Helper function / hằng số → dùng `named`.

### Spread & Rest

Cú pháp `...` — dùng rất nhiều trong React.

```js
// Spread — trải mảng/object ra
const a = [1, 2, 3];
const b = [...a, 4, 5]; // [1, 2, 3, 4, 5]

const nguoi = { ten: "Giang" };
const moiNguoi = { ...nguoi, tuoi: 24 }; // { ten: 'Giang', tuoi: 24 }

// Rest — gom các tham số còn lại
function tong(...so) {
  return so.reduce((t, x) => t + x, 0);
}
tong(1, 2, 3, 4); // 10
```

---

## Giai đoạn 3 — React cơ bản (4–6 tuần)

**Mục tiêu:** Xây dựng được app todo-list, weather app đơn giản gọi API.

### JSX

Viết HTML bên trong JavaScript.

```jsx
function ChaoMung() {
  const ten = "Giang";
  return (
    <div className="container">
      <h1>Xin chào {ten}!</h1>
      <p>Đây là JSX.</p>
    </div>
  );
}
```

### Components

Khối xây dựng giao diện — mỗi component là 1 hàm trả về JSX.

```jsx
function NutBam({ nhan, mau }) {
  return <button style={{ background: mau }}>{nhan}</button>;
}

function App() {
  return (
    <div>
      <NutBam nhan="Lưu" mau="green" />
      <NutBam nhan="Xóa" mau="red" />
    </div>
  );
}
```

### Props

Truyền dữ liệu từ component cha xuống component con.

```jsx
// Component con nhận props
function Chao({ ten, tuoi }) {
  return (
    <p>
      Xin chào {ten}, {tuoi} tuổi!
    </p>
  );
}

// Component cha truyền props xuống
function App() {
  return <Chao ten="Giang" tuoi={24} />;
}
```

**3 quy tắc cốt lõi của props:**

1. **Chỉ đi 1 chiều** — cha truyền xuống con, không chiều ngược lại
2. **Read-only** — con chỉ đọc, không được sửa props
3. **Truyền được mọi kiểu dữ liệu** — string, number, array, function...

|                 | Props                 | State              |
| --------------- | --------------------- | ------------------ |
| Ai tạo?         | Component cha         | Chính component đó |
| Sửa được không? | ❌ Không              | ✅ Có              |
| Dùng khi nào?   | Nhận dữ liệu từ ngoài | Lưu dữ liệu nội bộ |

### State & useState

Dữ liệu thay đổi bên trong component.

```jsx
import { useState } from "react";

function DemSo() {
  const [dem, setDem] = useState(0); // giá trị ban đầu = 0

  return (
    <div>
      <p>Số đếm: {dem}</p>
      <button onClick={() => setDem(dem + 1)}>Tăng</button>
      <button onClick={() => setDem(dem - 1)}>Giảm</button>
    </div>
  );
}
```

### useEffect

Chạy code sau khi component render — dùng để gọi API, lắng nghe sự kiện...

```jsx
import { useState, useEffect } from "react";

function DanhSach() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Chạy 1 lần khi component mount
    fetch("https://api.example.com/items")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []); // [] = chỉ chạy 1 lần

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>{item.ten}</li>
      ))}
    </ul>
  );
}
```

### Render list & key

```jsx
const sanPham = [
  { id: 1, ten: "Áo" },
  { id: 2, ten: "Quần" },
  { id: 3, ten: "Giày" },
];

function DanhSach() {
  return (
    <ul>
      {sanPham.map((sp) => (
        <li key={sp.id}>{sp.ten}</li> // key giúp React phân biệt từng item
      ))}
    </ul>
  );
}
```

### Event handling

```jsx
function Form() {
  const [ten, setTen] = useState("");

  function xuLySubmit(e) {
    e.preventDefault();
    alert(`Xin chào ${ten}!`);
  }

  return (
    <form onSubmit={xuLySubmit}>
      <input
        value={ten}
        onChange={(e) => setTen(e.target.value)}
        placeholder="Nhập tên..."
      />
      <button type="submit">Gửi</button>
    </form>
  );
}
```

### Conditional rendering

```jsx
function TrangThai({ dangTai, loi, data }) {
  if (dangTai) return <p>Đang tải...</p>;
  if (loi) return <p>Lỗi: {loi}</p>;

  return <p>Dữ liệu: {data}</p>;
}

// Cách viết ngắn với &&
function ThongBao({ coThongBao }) {
  return <div>{coThongBao && <p>Bạn có tin nhắn mới!</p>}</div>;
}
```

---

## Giai đoạn 4 — React trung cấp (4–5 tuần)

**Mục tiêu:** Xây dựng được web app nhiều trang, có đăng nhập, gọi API thật.

- **useContext** — Chia sẻ state không cần truyền qua nhiều tầng props
- **useReducer** — Quản lý state phức tạp, nhiều actions
- **React Router** — Điều hướng giữa các trang (`/home`, `/about`, `/login`)
- **Custom hooks** — Tái sử dụng logic giữa nhiều components
- **Gọi API (fetch/axios)** — Lấy dữ liệu từ backend thật
- **Form handling** — Controlled components, validation

---

## Giai đoạn 5 — React nâng cao (4–6 tuần)

**Mục tiêu:** Sẵn sàng đi làm thực tế, hiểu codebase dự án lớn.

- **Redux Toolkit** — Quản lý state toàn cục cho app lớn
- **React Query (TanStack Query)** — Cache & đồng bộ dữ liệu server
- **Performance** — `memo`, `useMemo`, `useCallback` tránh render thừa
- **TypeScript cơ bản** — Thêm kiểu dữ liệu cho React, bắt lỗi sớm
- **Next.js** — SSR, SSG, fullstack React — framework phổ biến nhất hiện nay
- **Testing** — Jest, React Testing Library

---

## Giai đoạn 6 — Thực chiến & Đi làm (liên tục)

- Xây **3–5 dự án thực tế** trên GitHub (portfolio)
- Đóng góp **open source** để có kinh nghiệm làm việc nhóm
- Ôn **câu hỏi phỏng vấn** React thường gặp
- Nắm **Git flow** — branch, PR, code review
