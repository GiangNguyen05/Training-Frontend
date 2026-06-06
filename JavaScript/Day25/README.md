# TypeScript Cơ Bản (P3)

## Type Narrowing (Thu hẹp kiểu)

Khi một biến có thể là nhiều kiểu, TypeScript yêu cầu bạn **kiểm tra trước khi dùng**. Đây là thứ bạn sẽ gặp hàng ngày trong React khi xử lý dữ liệu từ API.

```ts
type Response = string | null | undefined;

function showMessage(msg: Response) {
  //  Không được — msg có thể là null hoặc undefined
  console.log(msg.toUpperCase());

  //  Kiểm tra trước rồi mới dùng
  if (msg) {
    console.log(msg.toUpperCase()); // TypeScript biết chắc msg là string ở đây
  }
}
```

### Hay gặp trong React — kiểm tra dữ liệu từ API

```ts
interface User {
  name: string
  avatar?: string    // có thể có hoặc không
}

function Profile({ user }: { user: User | null }) {
  //  Không được — user có thể là null
  return <h1>{user.name}</h1>

  //  Kiểm tra null trước
  if (!user) return <p>Chưa đăng nhập</p>
  return (
    <div>
      <h1>{user.name}</h1>
      {/* avatar có thể undefined — dùng && để kiểm tra */}
      {user.avatar && <img src={user.avatar} />}
    </div>
  )
}
```

---

## Array Types & Object Methods

Trong React bạn sẽ dùng array rất nhiều — render danh sách, filter, map dữ liệu. Cần hiểu cách TypeScript xử lý array.

```ts
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 25000000, inStock: true },
  { id: 2, name: "Mouse", price: 350000, inStock: false },
  { id: 3, name: "Bàn phím", price: 800000, inStock: true },
];

// map — biến đổi từng phần tử, TypeScript biết kiểu trả về
const names: string[] = products.map((p) => p.name);
// ["Laptop", "Mouse", "Bàn phím"]

// filter — lọc phần tử, kết quả vẫn là Product[]
const available: Product[] = products.filter((p) => p.inStock);

// find — tìm một phần tử, kết quả là Product | undefined
const found: Product | undefined = products.find((p) => p.id === 1);

// Phải kiểm tra undefined trước khi dùng
if (found) {
  console.log(found.name); //  "Laptop"
}
```

### Dùng trong React — render danh sách

```tsx
function ProductList({ products }: { products: Product[] }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.name} — {product.price.toLocaleString("vi-VN")} đ
        </li>
      ))}
    </ul>
  );
}
```

---

## Kiểu cho Async / Fetch API

Khi học React bạn sẽ gọi API liên tục. Đây là cách TypeScript xử lý dữ liệu bất đồng bộ.

```ts
interface Post {
  id: number
  title: string
  body: string
}

// Promise<Post[]> — hàm này bất đồng bộ, trả về mảng Post
async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const data = await res.json() as Post[]
  return data
}

// Dùng trong React với useEffect
import { useState, useEffect } from "react"

function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPosts()
      .then(data => setPosts(data))
      .catch(err => setError("Không tải được dữ liệu"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Đang tải...</p>
  if (error) return <p>{error}</p>

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

**3 state quan trọng khi gọi API — luôn cần khai báo đủ:**

| State     | Kiểu             | Vai trò              |
| --------- | ---------------- | -------------------- |
| `data`    | `Post[] \| null` | Lưu dữ liệu trả về   |
| `loading` | `boolean`        | Đang tải hay không   |
| `error`   | `string \| null` | Thông báo lỗi nếu có |

---

## Tóm tắt — Những gì cần nhớ

| Khái niệm                     | Dùng để                                  | Ví dụ                             |
| ----------------------------- | ---------------------------------------- | --------------------------------- |
| `string`, `number`, `boolean` | Khai báo kiểu biến cơ bản                | `let name: string`                |
| `interface`                   | Mô tả hình dạng object                   | `interface User { name: string }` |
| `type`                        | Union types, kiểu đơn giản               | `type Status = "on" \| "off"`     |
| `?`                           | Trường/tham số không bắt buộc            | `age?: number`                    |
| `\|`                          | Hoặc — nhiều kiểu có thể                 | `string \| null`                  |
| `<T>`                         | Generic — tái sử dụng nhiều kiểu         | `useState<User \| null>`          |
| `if (x)`                      | Type Narrowing — kiểm tra trước khi dùng | `if (user) { user.name }`         |
| `Type[]`                      | Mảng có kiểu — dùng với map/filter       | `Product[]`                       |
| `Promise<T>`                  | Kiểu trả về của hàm async                | `async fn(): Promise<Post[]>`     |

---

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
