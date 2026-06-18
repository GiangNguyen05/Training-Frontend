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

### useRef — Truy cập DOM trực tiếp

`useRef` giữ một giá trị **không gây re-render** khi thay đổi, thường dùng để trỏ đến DOM element.

```jsx
import { useRef } from "react";

function AutoFocus() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus(); // Truy cập DOM trực tiếp
  }

  return (
    <>
      <input ref={inputRef} placeholder="Nhập gì đó..." />
      <button onClick={handleClick}>Focus vào input</button>
    </>
  );
}
```

**2 use case chính:**

- Truy cập DOM: focus input, play/pause video, đo kích thước element
- Lưu giá trị không gây re-render: timer ID, giá trị trước đó

---

### Lifting State Up — Chia sẻ state giữa các component

Khi 2 component anh em cần dùng chung dữ liệu → **đưa state lên component cha**, cha truyền xuống qua props.

```jsx
// ❌ Hai component anh em không chia sẻ state được trực tiếp
function NhietKe() { const [nhiet, setNhiet] = useState(0) ... }
function HienThi() { /* không đọc được nhiet của NhietKe */ }

// ✅ Đưa state lên cha
function App() {
  const [nhiet, setNhiet] = useState(0) // State ở cha

  return (
    <>
      <NhietKe nhiet={nhiet} onChange={setNhiet} /> {/* Con 1 */}
      <HienThi nhiet={nhiet} />                     {/* Con 2 */}
    </>
  )
}
```

Đây là pattern nền tảng — hiểu rõ trước khi học `useContext` ở giai đoạn sau.

---

## Giai đoạn 4 — React Trung Cấp (4–5 tuần)

**Mục tiêu:** Xây dựng web app nhiều trang, có đăng nhập, gọi API thật, quản lý state phức tạp.

---

### 1. useContext — Chia sẻ state không qua props

**Vấn đề — Prop drilling:**

Khi state cần truyền qua quá nhiều tầng component trung gian không cần dùng nó:

```
App (có state user)
└── Layout
    └── Sidebar
        └── UserInfo  ← cần user, nhưng Layout và Sidebar phải "chuyển tiếp"
```

```jsx
// ❌ Prop drilling — Layout và Sidebar truyền user mà không dùng
function App() {
  const [user] = useState({ ten: "Giang" });
  return <Layout user={user} />;
}
function Layout({ user }) {
  return <Sidebar user={user} />; // Không dùng user, chỉ chuyển tiếp
}
function Sidebar({ user }) {
  return <UserInfo user={user} />; // Không dùng user, chỉ chuyển tiếp
}
function UserInfo({ user }) {
  return <p>{user.ten}</p>; // Mới thực sự dùng
}
```

**Giải pháp — useContext:**

```jsx
import { createContext, useContext, useState } from "react";

// Bước 1 — Tạo context
const UserContext = createContext(null);

// Bước 2 — Bọc Provider ở cha, truyền value
function App() {
  const [user] = useState({ ten: "Giang" });
  return (
    <UserContext.Provider value={user}>
      <Layout /> {/* Không cần truyền user xuống nữa */}
    </UserContext.Provider>
  );
}

// Bước 3 — Đọc ở bất kỳ component con nào cần
function UserInfo() {
  const user = useContext(UserContext); // Lấy trực tiếp — không qua props
  return <p>{user.ten}</p>;
}

// Layout và Sidebar không cần biết đến user
function Layout() {
  return <Sidebar />;
}
function Sidebar() {
  return <UserInfo />;
}
```

**Khi nào dùng useContext:**

```
Lifting State Up đang qua 3+ tầng trung gian  → useContext
Dữ liệu toàn cục: user đăng nhập, theme, ngôn ngữ  → useContext
State thay đổi thường xuyên, nhiều component đọc   → Redux (giai đoạn sau)
```

> useContext không thay thế hoàn toàn props. Với dữ liệu chỉ dùng trong 1-2 tầng → vẫn dùng props.

---

### 2. useReducer — Quản lý state phức tạp

Khi state có nhiều actions liên quan, `useState` trở nên rối:

```jsx
// ❌ Nhiều state liên quan, khó quản lý
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [page, setPage] = useState(1);
// Mỗi action phải set nhiều state cùng lúc → dễ quên, dễ sai
```

`useReducer` gom tất cả vào một chỗ:

```jsx
import { useReducer } from "react";

// State ban đầu
const initialState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
};

// Reducer — hàm xử lý từng action
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, items: action.payload };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "NEXT_PAGE":
      return { ...state, page: state.page + 1 };

    default:
      return state;
  }
}

function DanhSach() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, loading, error, page } = state;

  function layDuLieu() {
    dispatch({ type: "FETCH_START" });
    fetch(`/api/items?page=${page}`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "FETCH_SUCCESS", payload: data }))
      .catch((err) => dispatch({ type: "FETCH_ERROR", payload: err.message }));
  }

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.ten}</li>
        ))}
      </ul>
      <button onClick={() => dispatch({ type: "NEXT_PAGE" })}>
        Trang tiếp
      </button>
    </>
  );
}
```

**useState vs useReducer:**

|              | useState                | useReducer                              |
| ------------ | ----------------------- | --------------------------------------- |
| Khi nào dùng | State đơn giản, độc lập | State phức tạp, nhiều actions liên quan |
| Cập nhật     | `setValue(newValue)`    | `dispatch({ type, payload })`           |
| Logic xử lý  | Rải rác trong component | Tập trung trong reducer                 |

---

### 3. React Router — Điều hướng nhiều trang

React mặc định là Single Page App — một trang duy nhất. React Router giả lập nhiều trang mà không reload.

```bash
npm install react-router-dom
```

**Cấu hình cơ bản:**

```jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      {/* Menu điều hướng */}
      <nav>
        <Link to="/">Trang chủ</Link>
        <Link to="/san-pham">Sản phẩm</Link>
        <Link to="/lien-he">Liên hệ</Link>
      </nav>

      {/* Định nghĩa các route */}
      <Routes>
        <Route path="/" element={<TrangChu />} />
        <Route path="/san-pham" element={<SanPham />} />
        <Route path="/san-pham/:id" element={<ChiTietSanPham />} />{" "}
        {/* Dynamic route */}
        <Route path="/lien-he" element={<LienHe />} />
        <Route path="*" element={<Trang404 />} /> {/* Không tìm thấy */}
      </Routes>
    </BrowserRouter>
  );
}
```

**Lấy params từ URL:**

```jsx
function ChiTietSanPham() {
  const { id } = useParams(); // Lấy :id từ URL /san-pham/123

  return <p>Sản phẩm ID: {id}</p>;
}
```

**Chuyển trang bằng code:**

```jsx
function FormDangNhap() {
  const navigate = useNavigate();

  function handleSubmit() {
    // Sau khi đăng nhập thành công
    navigate("/trang-chu"); // Chuyển trang
    navigate(-1); // Quay lại trang trước
    navigate("/login", { replace: true }); // Thay thế history (không back được)
  }
}
```

**Protected Route — Chặn trang khi chưa đăng nhập:**

```jsx
function ProtectedRoute({ children }) {
  const daDangNhap = checkAuth(); // Kiểm tra đăng nhập
  if (!daDangNhap) return <Navigate to="/login" />;
  return children;
}

// Dùng
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>;
```

---

### 4. Custom Hooks — Tái sử dụng logic

Custom hook là hàm bắt đầu bằng `use` — bên trong có thể dùng các hook khác. Dùng để tái sử dụng logic giữa nhiều component.

**Ví dụ — useFetch:**

```jsx
// Trước — logic lặp lại ở mọi component gọi API
function ComponentA() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    /* fetch logic */
  }, []);
}

function ComponentB() {
  const [data, setData] = useState(null); // Lặp lại!
  const [loading, setLoading] = useState(true); // Lặp lại!
  const [error, setError] = useState(null); // Lặp lại!
  useEffect(() => {
    /* fetch logic */
  }, []); // Lặp lại!
}
```

```jsx
// ✅ Tách ra custom hook — dùng lại ở mọi nơi
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Dùng lại ở mọi component
function DanhSachUser() {
  const { data, loading, error } = useFetch("/api/users");
  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;
  return (
    <ul>
      {data.map((u) => (
        <li key={u.id}>{u.ten}</li>
      ))}
    </ul>
  );
}

function DanhSachSanPham() {
  const { data, loading, error } = useFetch("/api/san-pham");
  // Logic giống hệt, không cần viết lại
}
```

**Ví dụ — useLocalStorage:**

```jsx
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  });

  function set(newValue) {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  }

  return [value, set];
}

// Dùng như useState nhưng tự lưu vào localStorage
const [theme, setTheme] = useLocalStorage("theme", "light");
```

**Quy tắc Custom Hook:**

- Tên bắt đầu bằng `use` — bắt buộc
- Bên trong có thể gọi các hook khác
- Return bất cứ thứ gì cần thiết — object, array, giá trị đơn

---

### 5. useCallback & useMemo — Tối ưu hiệu năng

#### useMemo — Cache kết quả tính toán

```jsx
// ❌ Tính lại mỗi lần render dù items không đổi
function DanhSach({ items, boLoc }) {
  const ketQua = items.filter((item) => item.loai === boLoc); // Nặng nếu items dài

  return (
    <ul>
      {ketQua.map((item) => (
        <li key={item.id}>{item.ten}</li>
      ))}
    </ul>
  );
}

// ✅ Chỉ tính lại khi items hoặc boLoc thay đổi
function DanhSach({ items, boLoc }) {
  const ketQua = useMemo(
    () => items.filter((item) => item.loai === boLoc),
    [items, boLoc],
  );

  return (
    <ul>
      {ketQua.map((item) => (
        <li key={item.id}>{item.ten}</li>
      ))}
    </ul>
  );
}
```

#### useCallback — Cache địa chỉ hàm

```jsx
// ❌ xuLy tạo mới mỗi render → Con re-render dù không có gì thay đổi
function Cha() {
  const [dem, setDem] = useState(0);
  const xuLy = () => console.log("click"); // Địa chỉ mới mỗi lần

  return <Con onClick={xuLy} />;
}

// ✅ Giữ nguyên địa chỉ hàm nếu deps không đổi
function Cha() {
  const [dem, setDem] = useState(0);
  const xuLy = useCallback(() => console.log("click"), []); // Địa chỉ cố định

  return <Con onClick={xuLy} />;
}
```

**Khi nào dùng:**

```
useMemo     → Tính toán nặng (filter/sort mảng lớn, parse dữ liệu phức tạp)
useCallback → Hàm truyền vào component con có React.memo
Chưa có vấn đề hiệu năng thực sự → Không cần dùng
```

---

### 6. Gọi API thực tế — Axios & Pattern chuẩn

```bash
npm install axios
```

**Tại sao Axios hơn fetch:**

- Tự parse JSON
- Interceptor — xử lý token, lỗi tập trung
- Timeout dễ cấu hình
- Xử lý lỗi rõ ràng hơn

**Cấu hình instance:**

```jsx
// api/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
});

// Tự động đính kèm token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Xử lý lỗi tập trung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn → redirect về login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
```

**Dùng trong component:**

```jsx
import api from "./api/axiosInstance";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);
}
```

---

### 7. Form nâng cao — Validation

Validation thủ công nhanh chóng trở nên cồng kềnh. Dùng **React Hook Form** hoặc **Formik**.

```bash
npm install react-hook-form
```

```jsx
import { useForm } from "react-hook-form";

function FormDangKy() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    console.log(data); // { ten: 'Giang', email: '...', matKhau: '...' }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("ten", { required: "Vui lòng nhập tên" })}
        placeholder="Họ tên"
      />
      {errors.ten && <p>{errors.ten.message}</p>}

      <input
        {...register("email", {
          required: "Vui lòng nhập email",
          pattern: { value: /\S+@\S+\.\S+/, message: "Email không hợp lệ" },
        })}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        {...register("matKhau", {
          required: "Vui lòng nhập mật khẩu",
          minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
        })}
        placeholder="Mật khẩu"
      />
      {errors.matKhau && <p>{errors.matKhau.message}</p>}

      <button type="submit">Đăng ký</button>
    </form>
  );
}
```

---

## Checklist hoàn thành Giai đoạn 4

```
□ Hiểu prop drilling, giải quyết bằng useContext
□ Dùng useReducer cho state phức tạp nhiều actions
□ Cấu hình React Router: Routes, Link, useParams, useNavigate
□ Xây Protected Route chặn trang chưa đăng nhập
□ Viết Custom Hook tái sử dụng logic (useFetch, useLocalStorage)
□ Dùng useMemo và useCallback đúng chỗ — không lạm dụng
□ Cấu hình Axios instance với interceptor
□ Xây form validation với React Hook Form
```

**Dự án thực hành đề xuất:**

1. App ghi chú — useContext (theme sáng/tối), React Router, CRUD
2. App quản lý sản phẩm — useReducer, Axios, React Hook Form
3. App clone đơn giản (Twitter feed, Trello board) — kết hợp tất cả

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
