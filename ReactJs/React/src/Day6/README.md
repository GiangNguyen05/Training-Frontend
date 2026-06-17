# Conditional Rendering trong React

## Conditional rendering

**Hiển thị hoặc ẩn giao diện dựa trên điều kiện.**

Giống như cuộc sống thực:

```
Nếu đã đăng nhập   → Hiện trang chủ
Nếu chưa đăng nhập → Hiện trang login

Nếu đang tải       → Hiện spinner
Nếu có lỗi         → Hiện thông báo lỗi
Nếu có dữ liệu     → Hiện nội dung
```

## Bốn cách viết

### Cách 1 — `if/else` (logic phức tạp, nhiều nhánh)

```jsx
function TrangChu({ daDangNhap }) {
  if (daDangNhap) {
    return <p>Chào mừng trở lại!</p>;
  }
  return <p>Vui lòng đăng nhập.</p>;
}
```

Dùng khi: trả về **toàn bộ giao diện khác nhau** tùy điều kiện.

### Cách 2 — Toán tử `? :` (ternary)

```jsx
// Điều kiện ? Nếu đúng : Nếu sai
<p>{daDangNhap ? "Đăng xuất" : "Đăng nhập"}</p>
```

Dùng khi: **một trong hai** thứ được hiển thị.

```jsx
function NutDangNhap({ daDangNhap }) {
  return <button>{daDangNhap ? "Đăng xuất" : "Đăng nhập"}</button>;
}
```

### Cách 3 — Toán tử `&&` (hiện hoặc không hiện)

```jsx
// Điều kiện && JSX  →  Đúng thì hiện, sai thì không hiện gì
{
  coThongBao && <div className="badge">3 tin mới</div>;
}
```

Dùng khi: **hiện hoặc không hiện**, không có trường hợp thứ ba.

```jsx
function Header({ coThongBao, soLuong }) {
  return (
    <header>
      <h1>Logo</h1>
      {coThongBao && <span>{soLuong} tin mới</span>}
    </header>
  );
}
```

> ⚠️ **Bẫy với số 0:** `{soLuong && <span>{soLuong}</span>}` khi `soLuong = 0` sẽ render ra số `0` thay vì ẩn đi.
> Fix: `{soLuong > 0 && <span>{soLuong}</span>}` hoặc `{!!soLuong && ...}`

### Cách 4 — Early return (thoát sớm)

```jsx
function DanhSach({ items }) {
  if (!items) return <p>Đang tải...</p>;
  if (items.length === 0) return <p>Không có dữ liệu.</p>;

  // Chỉ đến đây khi có dữ liệu
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.ten}</li>
      ))}
    </ul>
  );
}
```

Dùng khi: **nhiều trạng thái khác nhau** cần xử lý lần lượt — dễ đọc hơn if/else lồng nhau.

## Chọn cách nào

```
Toàn bộ giao diện khác nhau     →  if/else
Một trong hai thứ               →  ? :
Hiện hoặc không hiện            →  &&
Nhiều trạng thái (loading/error/data)  →  Early return
```

## Ví dụ thực tế — Loading / Error / Data

Pattern này xuất hiện ở hầu hết mọi app:

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  // Early return xử lý từng trạng thái
  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {user.isAdmin && <span>⭐ Admin</span>} {/* && */}
    </div>
  );
}
```

## Tóm tắt

| Cách         | Cú pháp                 | Dùng khi                         |
| ------------ | ----------------------- | -------------------------------- |
| if/else      | `if (dk) return A`      | Giao diện hoàn toàn khác nhau    |
| Ternary      | `dk ? A : B`            | Một trong hai thứ                |
| &&           | `dk && A`               | Hiện hoặc không hiện             |
| Early return | `if (!data) return ...` | Nhiều trạng thái, xử lý lần lượt |
