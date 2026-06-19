# useContext

## Khái niệm

### Vấn đề: Prop Drilling

Khi dữ liệu cần truyền từ component cha xuống component con nằm sâu bên trong, dữ liệu phải đi qua **từng tầng trung gian** — dù những tầng đó không hề dùng đến nó.

```
App (có dữ liệu user)
└── Layout       ← không dùng user, chỉ "chuyển hộ"
    └── Sidebar  ← không dùng user, chỉ "chuyển hộ"
        └── UserInfo  ← cuối cùng mới thực sự cần user
```

```jsx
// ❌ Prop Drilling — Layout và Sidebar phải nhận và truyền tiếp user
function App() {
  const user = { ten: "Giang" };
  return <Layout user={user} />;
}
function Layout({ user }) {
  return <Sidebar user={user} />;
} // không dùng, chỉ chuyển
function Sidebar({ user }) {
  return <UserInfo user={user} />;
} // không dùng, chỉ chuyển
function UserInfo({ user }) {
  return <p>{user.ten}</p>;
} // mới thực sự dùng
```

Hệ quả: mỗi tầng trung gian phải sửa code dù không liên quan, code khó đọc, dễ quên truyền thiếu.

### Giải pháp: useContext

`useContext` cho phép **bất kỳ component con nào** lấy dữ liệu trực tiếp từ một "kho dữ liệu chung", không cần đi qua từng tầng trung gian.

```
App ──── "kho dữ liệu chung" chứa user ────┐
└── Layout                                  │
    └── Sidebar                             │
        └── UserInfo ◄────── lấy thẳng ─────┘
```

## Cách hoạt động

useContext gồm 3 mảnh ghép luôn đi cùng nhau:

```
createContext()   →  Tạo ra "kho dữ liệu chung" (Context)
<Context.Provider>  →  Đặt ở component cha — "đổ" dữ liệu vào kho
useContext(Context)  →  Component con lấy dữ liệu ra từ kho
```

### Cơ chế bên trong

```
1. createContext(giaTriMacDinh)
   → Tạo một "đường ống" dữ liệu, ban đầu rỗng

2. <Context.Provider value={duLieu}>...</Context.Provider>
   → Bơm dữ liệu vào đường ống
   → Mọi component nằm BÊN TRONG cặp thẻ Provider đều nhận được dữ liệu này
   → Component nằm NGOÀI Provider không nhận được gì

3. useContext(Context)
   → Component tự "cắm vòi" vào đường ống gần nhất bao quanh nó
   → Lấy đúng giá trị đang được Provider cung cấp
```

### Khi Provider value thay đổi

```
Provider value thay đổi
        │
        ▼
TẤT CẢ component đang dùng useContext(Context) đó
sẽ tự động re-render — dù chúng nằm sâu bao nhiêu tầng
```

Đây là điểm khác biệt cốt lõi so với props: **không cần component trung gian re-render theo, chỉ những component thực sự dùng `useContext` mới re-render.**

---

## Cách dùng — 3 bước

### Bước 1 — Tạo Context

```jsx
import { createContext } from "react";

const UserContext = createContext(null); // null là giá trị mặc định khi chưa có Provider
```

### Bước 2 — Bọc Provider, truyền dữ liệu qua `value`

```jsx
function App() {
  const [user, setUser] = useState({ ten: "Giang" });

  return (
    <UserContext.Provider value={user}>
      <Layout />
    </UserContext.Provider>
  );
}
```

### Bước 3 — Lấy dữ liệu ở component con bất kỳ

```jsx
import { useContext } from "react";

function UserInfo() {
  const user = useContext(UserContext); // Lấy thẳng, không qua props
  return <p>Xin chào {user.ten}</p>;
}

// Layout và Sidebar không cần biết đến user
function Layout() {
  return <Sidebar />;
}
function Sidebar() {
  return <UserInfo />;
}
```

### Truyền cả hàm cập nhật — Context 2 chiều

```jsx
function App() {
  const [user, setUser] = useState({ ten: "Giang" });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Layout />
    </UserContext.Provider>
  );
}

function NutDoiTen() {
  const { user, setUser } = useContext(UserContext);
  return (
    <button onClick={() => setUser({ ten: "Nam" })}>
      Đổi tên (hiện tại: {user.ten})
    </button>
  );
}
```

## Pattern thực tế — Custom Hook bọc Context

Để code sạch hơn, thường tạo 1 custom hook riêng thay vì gọi `useContext(UserContext)` lặp lại mọi nơi:

```jsx
// UserContext.js
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext); // Custom hook — gọn hơn khi dùng
}
```

```jsx
// Dùng ở component khác
import { useUser } from "./UserContext";

function UserInfo() {
  const { user } = useUser(); // Gọn hơn useContext(UserContext)
  return <p>{user.ten}</p>;
}
```

---

## Những điều cần chú ý

### Provider value thay đổi → mọi component dùng context re-render

```jsx
// ❌ Object tạo mới mỗi lần App render → mọi nơi dùng context đều re-render
function App() {
  return (
    <UserContext.Provider value={{ ten: "Giang" }}>
      {" "}
      {/* object mới mỗi render */}
      <Layout />
    </UserContext.Provider>
  );
}

// ✅ Dùng useMemo để giữ ổn định nếu giá trị không đổi
function App() {
  const [user, setUser] = useState({ ten: "Giang" });
  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={value}>
      <Layout />
    </UserContext.Provider>
  );
}
```

### Đặt nhiều Context riêng biệt, không gộp tất cả vào 1 Context lớn

```jsx
// ❌ Một context khổng lồ — value đổi bất kỳ phần nào cũng re-render mọi nơi
const AppContext = createContext({ user, theme, gioHang, ngonNgu });

// ✅ Tách riêng theo mục đích — component chỉ re-render khi đúng phần liên quan đổi
const UserContext = createContext(null);
const ThemeContext = createContext(null);
const CartContext = createContext(null);
```

### useContext không thay thế hoàn toàn props

```
Dữ liệu phải qua 3+ tầng không liên quan  →  Dùng useContext
Dữ liệu toàn app: user, theme, ngôn ngữ   →  Dùng useContext
Dữ liệu chỉ dùng ở 1-2 tầng gần nhau      →  Vẫn dùng props bình thường
```

### Component phải nằm bên trong Provider mới lấy được dữ liệu

```jsx
function App() {
  return (
    <>
      <UserInfo />{" "}
      {/* ❌ Nằm ngoài Provider → user = null (giá trị mặc định) */}
      <UserContext.Provider value={{ ten: "Giang" }}>
        <UserInfo /> {/* ✅ Nằm trong Provider → lấy được dữ liệu */}
      </UserContext.Provider>
    </>
  );
}
```

### Không lạm dụng Context cho state thay đổi liên tục

Context không tối ưu cho dữ liệu **đổi rất nhanh** (ví dụ vị trí chuột, animation) — mọi component dùng context sẽ re-render liên tục. Trường hợp này nên dùng `useState` cục bộ hoặc thư viện quản lý state chuyên dụng (Redux, Zustand).

---

## Tóm tắt

```
createContext()       →  Tạo kho dữ liệu chung
<Context.Provider>    →  Đặt ở cha, bơm dữ liệu vào kho qua value
useContext(Context)   →  Con lấy dữ liệu trực tiếp, không qua props

Cơ chế: value đổi → mọi component dùng useContext đó re-render,
        component trung gian không dùng context thì không re-render
```

| Cần chú ý                           | Lý do                                                           |
| ----------------------------------- | --------------------------------------------------------------- |
| Object trong value → dùng useMemo   | Tránh re-render thừa mỗi lần Provider render                    |
| Tách nhiều Context nhỏ              | Tránh re-render toàn bộ khi chỉ 1 phần dữ liệu đổi              |
| Component phải nằm trong Provider   | Ngoài Provider → nhận giá trị mặc định, không phải dữ liệu thật |
| Không dùng cho dữ liệu đổi liên tục | Gây re-render hàng loạt — dùng Redux/Zustand thay thế           |
