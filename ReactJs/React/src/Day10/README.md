# React Router

## React Router

React mặc định chỉ có **một trang duy nhất** — khi bạn bấm vào link, trang không reload, chỉ thay đổi nội dung hiển thị. Đây gọi là **Single Page Application (SPA)**.

**React Router** là thư viện giúp React giả lập nhiều trang — khi URL thay đổi, React Router hiển thị đúng component tương ứng mà không reload trang.

```
URL /          → Hiển thị component <TrangChu />
URL /san-pham  → Hiển thị component <SanPham />
URL /lien-he   → Hiển thị component <LienHe />
```

## Cài đặt

```bash
npm install react-router-dom
```

## Các khái niệm cốt lõi

### BrowserRouter

Bọc toàn bộ app — cung cấp khả năng điều hướng cho mọi component bên trong.

```jsx
import { BrowserRouter } from "react-router-dom";

function main() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
```

> Thường đặt ở `main.jsx` — bọc ngoài cùng, chỉ cần 1 lần.

### Routes và Route

`Routes` là nơi khai báo danh sách trang. `Route` định nghĩa URL nào → component nào.

```jsx
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TrangChu />} />
      <Route path="/san-pham" element={<SanPham />} />
      <Route path="/lien-he" element={<LienHe />} />
      <Route path="*" element={<Trang404 />} />
    </Routes>
  );
}
```

`path="*"` bắt tất cả URL không khớp → dùng cho trang 404.

---

### Link

Thay thế thẻ `<a href>` — chuyển trang mà **không reload**. Dùng thay cho `<a>` trong mọi trường hợp điều hướng nội bộ.

```jsx
import { Link } from "react-router-dom";

function Menu() {
  return (
    <nav>
      <Link to="/">Trang chủ</Link>
      <Link to="/san-pham">Sản phẩm</Link>
      <Link to="/lien-he">Liên hệ</Link>
    </nav>
  );
}
```

```
<a href="/san-pham">   →  Reload trang  ❌
<Link to="/san-pham">  →  Không reload  ✅
```

---

### NavLink

Giống `Link` nhưng tự động thêm class `active` khi URL đang khớp — dùng cho menu điều hướng.

```jsx
import { NavLink } from "react-router-dom";

<NavLink
  to="/san-pham"
  className={({ isActive }) => (isActive ? "menu-active" : "")}
>
  Sản phẩm
</NavLink>;
```

---

### Dynamic Route — URL có tham số

Khi cần hiển thị trang chi tiết (chi tiết sản phẩm, chi tiết bài viết...), URL có thể chứa tham số động.

```jsx
// Khai báo route với :id
<Route path="/san-pham/:id" element={<ChiTietSanPham />} />

// URL /san-pham/1  → id = "1"
// URL /san-pham/42 → id = "42"
```

**Lấy tham số trong component:**

```jsx
import { useParams } from "react-router-dom";

function ChiTietSanPham() {
  const { id } = useParams(); // Lấy :id từ URL
  return <p>Đang xem sản phẩm ID: {id}</p>;
}
```

---

### useNavigate — Chuyển trang bằng code

Khi cần chuyển trang sau khi xử lý xong logic (sau đăng nhập, sau submit form...), không dùng `Link` mà dùng `useNavigate`.

```jsx
import { useNavigate } from "react-router-dom";

function FormDangNhap() {
  const navigate = useNavigate();

  function handleSubmit() {
    // Xử lý đăng nhập xong...
    navigate("/trang-chu"); // Chuyển đến trang khác
    navigate(-1); // Quay lại trang trước
    navigate("/login", { replace: true }); // Chuyển và xóa trang hiện tại khỏi history
  }
}
```

---

### Nested Routes — Route lồng nhau

Khi nhiều trang dùng chung layout (có cùng Sidebar, Header...) nhưng nội dung giữa khác nhau.

```jsx
// Layout dùng chung <Outlet /> để render nội dung con
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet /> {/* Component con sẽ render ở đây */}
      </main>
    </div>
  );
}

// Khai báo nested routes
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<TongQuan />} /> {/* /dashboard */}
  <Route path="users" element={<DanhSachUser />} /> {/* /dashboard/users */}
  <Route path="report" element={<BaoCao />} /> {/* /dashboard/report */}
</Route>;
```

`index` là route mặc định khi URL khớp đúng với cha (`/dashboard`).

---

### Protected Route — Bảo vệ trang chưa đăng nhập

Chặn người dùng chưa đăng nhập truy cập vào trang cần xác thực.

```jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const daDangNhap = !!localStorage.getItem("token");

  if (!daDangNhap) return <Navigate to="/login" replace />;
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

## Cấu trúc app thực tế

```jsx
// main.jsx
<BrowserRouter>
  <App />
</BrowserRouter>

// App.jsx
<Routes>
  <Route path="/"      element={<TrangChu />} />
  <Route path="/login" element={<DangNhap />} />

  {/* Trang cần đăng nhập */}
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }>
    <Route index        element={<TongQuan />} />
    <Route path="users" element={<DanhSachUser />} />
  </Route>

  <Route path="*" element={<Trang404 />} />
</Routes>
```

## Câu hỏi và trả lời thường gặp

**Q: Khác gì giữa `Link` và `<a href>`?**
`<a href>` làm reload toàn bộ trang — xóa hết state, gọi lại mọi API từ đầu. `Link` chỉ thay đổi URL và component hiển thị, giữ nguyên mọi state đang có.

---

**Q: Khi nào dùng `Link`, khi nào dùng `useNavigate`?**
Người dùng tự bấm để chuyển trang → `Link`. Code tự động chuyển trang sau khi xử lý xong logic → `useNavigate`.

**Q: `navigate(-1)` là gì?**
Quay lại trang trước trong lịch sử trình duyệt — giống bấm nút back. Số âm là lùi lại, số dương là tiến tới.

**Q: Khác gì giữa `navigate('/login')` và `navigate('/login', { replace: true })`?**
Không có `replace`: lịch sử giữ trang hiện tại → người dùng có thể bấm Back quay lại.
Có `replace`: xóa trang hiện tại khỏi lịch sử → bấm Back sẽ không quay lại được. Thường dùng sau khi đăng nhập để người dùng không back về trang login nữa.

**Q: `path="*"` hoạt động như thế nào?**
`*` khớp với bất kỳ URL nào không khớp với route nào phía trên. Đặt ở cuối cùng để làm trang 404.

**Q: `<Outlet />` để làm gì?**
Là placeholder — chỗ trống trong component layout cha, nơi component con sẽ được render vào khi URL khớp với nested route con. Không có `<Outlet />`, component con không biết render ở đâu.

**Q: `index` route là gì?**
Là route mặc định của một nested route khi URL khớp chính xác với cha. Ví dụ `/dashboard` sẽ render `index` route, `/dashboard/users` sẽ render `users` route.

## Tóm tắt

| Thành phần         | Vai trò                                  |
| ------------------ | ---------------------------------------- |
| `BrowserRouter`    | Bọc toàn app, cung cấp tính năng routing |
| `Routes` + `Route` | Khai báo URL → Component                 |
| `Link`             | Chuyển trang khi người dùng bấm          |
| `NavLink`          | Như `Link` nhưng tự thêm class active    |
| `useParams`        | Lấy tham số động từ URL                  |
| `useNavigate`      | Chuyển trang bằng code                   |
| `Outlet`           | Render component con trong nested route  |
| `Navigate`         | Redirect đến URL khác ngay lập tức       |
| `path="*"`         | Bắt tất cả URL không khớp → trang 404    |
