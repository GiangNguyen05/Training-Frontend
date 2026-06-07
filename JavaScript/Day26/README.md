# TypeScript Cơ Bản (P4)

## TypeScript với React

### Props

Props là dữ liệu truyền từ component cha xuống component con. TypeScript giúp bạn biết chính xác component đó cần gì, không cần đọc code bên trong.

**Từ đơn giản đến phức tạp:**

```tsx
// 1. Props đơn giản
interface TitleProps {
  text: string
  size?: "small" | "medium" | "large"   // chỉ 3 giá trị được phép
}

function Title({ text, size = "medium" }: TitleProps) {
  return <h1 className={`title-${size}`}>{text}</h1>
}

// 2. Props chứa hàm — hay gặp khi xử lý sự kiện
interface ButtonProps {
  label: string
  onClick: () => void                    // hàm không tham số, không trả về gì
  onHover?: (e: React.MouseEvent) => void  // không bắt buộc
  disabled?: boolean
}

// 3. Props chứa object lồng nhau
interface CardProps {
  product: {
    id: number
    name: string
    price: number
  }
  onAddToCart: (id: number) => void      // hàm có tham số
}

function Card({ product, onAddToCart }: CardProps) {
  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.price.toLocaleString("vi-VN")} đ</p>
      <button onClick={() => onAddToCart(product.id)}>Thêm vào giỏ</button>
    </div>
  )
}

// 4. Props với children — bao component khác bên trong
interface LayoutProps {
  children: React.ReactNode    // bất kỳ JSX nào — string, component, array...
  title?: string
}

function Layout({ children, title }: LayoutProps) {
  return (
    <div>
      {title && <h1>{title}</h1>}
      <main>{children}</main>
    </div>
  )
}

// Dùng Layout
<Layout title="Trang chủ">
  <Card product={...} onAddToCart={...} />
</Layout>
```

---

### Hooks với TypeScript

**useState — 4 trường hợp hay gặp:**

```tsx
// Trường hợp 1: Giá trị đơn giản — TS tự suy ra, không cần khai báo
const [count, setCount] = useState(0); // number
const [name, setName] = useState(""); // string
const [open, setOpen] = useState(false); // boolean

// Trường hợp 2: Mảng — phải khai báo rõ vì ban đầu là []
const [items, setItems] = useState<string[]>([]);
const [products, setProducts] = useState<Product[]>([]);

// Trường hợp 3: Object có thể null — hay gặp khi fetch user
interface User {
  id: number;
  name: string;
}
const [user, setUser] = useState<User | null>(null);

// Trường hợp 4: Union type — trạng thái có giá trị cố định
type Status = "idle" | "loading" | "success" | "error";
const [status, setStatus] = useState<Status>("idle");

// Cách dùng
setStatus("loading"); //
setStatus("pending"); // ❌ Error — "pending" không có trong Status
```

**useRef — 2 mục đích chính:**

```tsx
// Mục đích 1: Trỏ đến DOM element — hay dùng để focus input
function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInput() {
    inputRef.current?.focus(); // ?. vì current có thể null lúc đầu
  }

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus</button>
    </div>
  );
}

// Mục đích 2: Giữ giá trị không gây re-render
function Timer() {
  const intervalRef = useRef<number | null>(null);

  function start() {
    intervalRef.current = window.setInterval(() => {
      console.log("tick");
    }, 1000);
  }

  function stop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }

  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

**useEffect — xử lý kiểu đúng cách:**

```tsx
interface Post {
  id: number;
  title: string;
}

function PostDetail({ postId }: { postId: number }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state khi postId thay đổi
    setLoading(true);
    setError(null);

    fetch(`/api/posts/${postId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy bài viết");
        return res.json() as Promise<Post>;
      })
      .then((data) => setPost(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [postId]); // chạy lại khi postId thay đổi

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;
  if (!post) return null;

  return <h1>{post.title}</h1>;
}
```

---

### Xử lý Events đúng cách

Đây là chỗ người mới hay bị nhầm nhất vì có nhiều loại event khác nhau.

```tsx
function Form() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  // Input text → ChangeEvent<HTMLInputElement>
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  // Input number → cũng là ChangeEvent<HTMLInputElement>, parse thêm
  function handleAgeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAge(Number(e.target.value));
  }

  // Textarea → ChangeEvent<HTMLTextAreaElement>
  function handleBioChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    console.log(e.target.value);
  }

  // Select → ChangeEvent<HTMLSelectElement>
  function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
  }

  // Form submit → FormEvent<HTMLFormElement>
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // ngăn reload trang
    console.log({ name, age });
  }

  // Button click → MouseEvent<HTMLButtonElement>
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    console.log("Clicked at:", e.clientX, e.clientY);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleNameChange} />
      <input type="number" onChange={handleAgeChange} />
      <textarea onChange={handleBioChange} />
      <select onChange={handleRoleChange}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Submit</button>
      <button type="button" onClick={handleClick}>
        Click
      </button>
    </form>
  );
}
```

**Bảng tra nhanh Event types:**

| Element      | Event    | Type                                     |
| ------------ | -------- | ---------------------------------------- |
| `<input>`    | onChange | `React.ChangeEvent<HTMLInputElement>`    |
| `<textarea>` | onChange | `React.ChangeEvent<HTMLTextAreaElement>` |
| `<select>`   | onChange | `React.ChangeEvent<HTMLSelectElement>`   |
| `<form>`     | onSubmit | `React.FormEvent<HTMLFormElement>`       |
| `<button>`   | onClick  | `React.MouseEvent<HTMLButtonElement>`    |
| `<div>`      | onClick  | `React.MouseEvent<HTMLDivElement>`       |

---

### Custom Hooks với TypeScript

Custom Hook là hàm tái sử dụng logic — TypeScript giúp Hook của bạn rõ ràng và an toàn.

```tsx
// Hook fetch dữ liệu — dùng được cho bất kỳ API nào
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json() as Promise<T>)
      .then((data) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Dùng hook — TypeScript tự biết kiểu của data
interface Post {
  id: number;
  title: string;
}

function PostList() {
  const { data: posts, loading, error } = useFetch<Post[]>("/api/posts");

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;
  if (!posts) return null;

  return posts.map((post) => <div key={post.id}>{post.title}</div>);
}
```

---

## Generics Chi Tiết

### Tại sao cần Generics?

```ts
// Vấn đề: viết hàm riêng cho từng kiểu — trùng lặp, khó bảo trì
function getFirstNumber(arr: number[]): number {
  return arr[0];
}
function getFirstString(arr: string[]): string {
  return arr[0];
}
function getFirstUser(arr: User[]): User {
  return arr[0];
}

// Giải pháp: 1 hàm Generic dùng được cho tất cả
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

// T tự động là kiểu phù hợp khi gọi
getFirst([1, 2, 3]); // T = number
getFirst(["a", "b"]); // T = string
getFirst([{ id: 1, name: "x" }]); // T = {id: number, name: string}
```

---

### Generics trong thực tế

**API Response wrapper — pattern rất phổ biến:**

```ts
// Hầu hết API thực tế trả về dạng này
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  total?: number;
}

// Dùng cho nhiều loại dữ liệu khác nhau
type UserResponse = ApiResponse<User>;
type ProductResponse = ApiResponse<Product[]>;
type OrderResponse = ApiResponse<Order>;

// Hàm fetch generic — dùng được cho mọi endpoint
async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  return res.json() as Promise<ApiResponse<T>>;
}

// Gọi thực tế — TypeScript tự biết kiểu của response.data
const userRes = await fetchApi<User>("/api/user/1");
console.log(userRes.data.name); //  TypeScript biết data là User

const productsRes = await fetchApi<Product[]>("/api/products");
console.log(productsRes.data[0].price); //  TypeScript biết data là Product[]
```

**Generic với Constraints — giới hạn T phải có trường nào đó:**

```ts
// T phải có trường id — dùng extends để giới hạn
function findById<T extends { id: number }>(
  items: T[],
  id: number,
): T | undefined {
  return items.find((item) => item.id === id);
}

// Dùng được cho bất kỳ array nào có trường id
const user = findById(users, 1); // T = User
const product = findById(products, 5); // T = Product
const order = findById(orders, 10); // T = Order

// ❌ Không được — string[] không có trường id
findById(["a", "b"], 1);
```

---

### Generics hay gặp trong React

```tsx
// useState<T> — bạn đã dùng nhiều rồi
const [user, setUser] = useState<User | null>(null);

// useRef<T> — trỏ đến element cụ thể
const ref = useRef<HTMLInputElement>(null);

// Khi dùng TanStack Query — data tự có kiểu đúng
const { data } = useQuery<Post[]>({
  queryKey: ["posts"],
  queryFn: () => fetch("/api/posts").then((r) => r.json()),
});
// data là Post[] | undefined — không cần cast thủ công
```

---

## Lỗi Thường Gặp & Cách Fix

### Object is possibly 'null' or 'undefined'

Lỗi phổ biến nhất. TypeScript thấy biến có thể không tồn tại nên không cho phép dùng trực tiếp.

```tsx
interface User {
  name: string;
  avatar?: string;
}

const [user, setUser] = useState<User | null>(null);

//  Lỗi: user có thể null
return <h1>{user.name}</h1>;

//  Cách 1: Early return — sạch nhất
if (!user) return <p>Chưa đăng nhập</p>;
return <h1>{user.name}</h1>;

//  Cách 2: Optional chaining
return <h1>{user?.name}</h1>;

//  Cách 3: Nullish coalescing — hiển thị giá trị mặc định
return <h1>{user?.name ?? "Khách"}</h1>;

//  Cách 4: Conditional rendering
return <>{user && <h1>{user.name}</h1>}</>;
```

---

### Type 'X' is not assignable to type 'Y'

TypeScript phát hiện bạn đang gán sai kiểu.

```ts
type Role = "admin" | "user" | "moderator";

interface Member {
  name: string;
  role: Role;
}

//  Lỗi — "superadmin" không có trong Role
const member: Member = { name: "Giang", role: "superadmin" };

//  Lỗi — role từ API về là string, không phải Role
async function getMember() {
  const res = await fetch("/api/member");
  const data = await res.json();
  const member: Member = data; // data.role là string — không match Role
}

//  Fix — cast đúng kiểu khi nhận từ API
const member = (await res.json()) as Member;
```

---

### Property 'X' does not exist on type 'Y'

Truy cập trường không tồn tại — hay gặp khi viết sai tên hoặc dùng sai interface.

```ts
interface User {
  firstName: string;
  lastName: string;
}

const user: User = { firstName: "Van", lastName: "Giang" };

//  Lỗi — không có trường "name"
console.log(user.name);

//  Đúng tên trường
console.log(user.firstName);
console.log(`${user.firstName} ${user.lastName}`);
```

---

### Argument of type 'X' is not assignable to parameter of type 'Y'

Truyền sai kiểu vào hàm.

```ts
function sendEmail(email: string, userId: number) {
  console.log(`Send to ${email}, user ${userId}`);
}

//  Lỗi — đảo ngược thứ tự tham số
sendEmail(123, "user@email.com");

//  Lỗi — truyền object thay vì string
const user = { email: "user@email.com", id: 1 };
sendEmail(user, user.id);

//  Đúng
sendEmail(user.email, user.id);
```

---

### Cannot find name 'X' — lỗi import

```tsx
//  Quên import useState
function Counter() {
  const [count, setCount] = useState(0); // Error: Cannot find name 'useState'
}

//  Import đầy đủ
import { useState, useEffect, useRef } from "react";
```

---

### Lỗi khi dùng async trong useEffect

```tsx
//  Sai — useEffect không nhận async function trực tiếp
useEffect(async () => {
  const data = await fetchPosts(); // TS + React đều không thích cách này
}, []);

//  Đúng — tạo async function bên trong rồi gọi
useEffect(() => {
  async function load() {
    const data = await fetchPosts();
    setPosts(data);
  }
  load();
}, []);
```

---

### Tổng hợp — Bảng tra lỗi nhanh

| Lỗi                             | Nguyên nhân                | Cách fix                          |
| ------------------------------- | -------------------------- | --------------------------------- |
| `Object is possibly null`       | Biến có thể null/undefined | Dùng `if`, `?.`, `??`             |
| `Type X is not assignable to Y` | Gán sai kiểu               | Kiểm tra lại interface, dùng `as` |
| `Property X does not exist`     | Sai tên trường             | Kiểm tra lại interface            |
| `Argument not assignable`       | Truyền sai tham số         | Kiểm tra thứ tự và kiểu tham số   |
| `Cannot find name`              | Quên import                | Thêm import ở đầu file            |
| `useEffect async`               | Dùng async trực tiếp       | Tạo function bên trong rồi gọi    |

---

## Tóm tắt — Checklist trước khi học React

**TypeScript với React:**

- Khai báo Props bằng interface, biết dùng `children: React.ReactNode`
- Dùng `useState` với generic: `useState<Type | null>(null)`
- Biết kiểu của từng Event: `ChangeEvent`, `FormEvent`, `MouseEvent`
- Viết được Custom Hook đơn giản có kiểu rõ ràng

**Generics:**

- Hiểu `<T>` là placeholder, TypeScript tự điền vào khi dùng
- Biết dùng `interface ApiResponse<T>` để wrap dữ liệu API
- Hiểu `T extends { id: number }` để giới hạn Generic

**Lỗi thường gặp:**

- Xử lý được `null/undefined` bằng `if`, `?.`, `??`
- Không dùng `any` — thay bằng `unknown` hoặc khai báo interface
- Biết cách viết `async` đúng trong `useEffect`

## Bước tiếp theo

1. Cài TypeScript vào project Vite: `npm create vite@latest my-app -- --template react-ts`
2. Mở file `.tsx` và thử khai báo interface cho một component
3. Đọc thêm: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — miễn phí, tiếng Anh
4. Playground thử code online không cần cài gì: [typescriptlang.org/play](https://www.typescriptlang.org/play)

- Project vite
  - npm create vite@latest my-app -- --template react-ts
    cd my-app
    npm install
    npm run dev
- ts thuan
  - Cài TypeScript global
    npm install -g typescript
  - Tạo file
    touch index.ts (mac) / ni index.ts / New-Item index.ts(windown)
    Biên dịch sang JS để chạy
    tsc index.ts
    node index.js
