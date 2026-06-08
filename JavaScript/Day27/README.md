# TypeScript — Tổng Kết Kiến Thức Cơ Bản

## 1. TypeScript là gì?

JavaScript nhưng có thêm lớp kiểm tra lỗi **trước khi chạy**.

```
JavaScript  →  chạy  →  lỗi  →  mất thời gian debug
TypeScript  →  gõ code  →  lỗi hiện ngay  →  sửa luôn
```

Trình duyệt không hiểu TypeScript — phải **biên dịch sang JS** trước. Dùng Vite để tự động hoá bước này:

```bash
npm create vite@latest my-app -- --template react-ts
```

---

## 2. Types Cơ Bản

```ts
// Khai báo tường minh
let name: string = "Giang";
let age: number = 24;
let active: boolean = true;
let ids: number[] = [1, 2, 3];

// TypeScript tự suy ra — không cần viết type
let city = "Da Nang"; // string
let score = 9.5; // number

city = 123; //  Error — đã là string rồi, không gán number được
```

---

## 3. Interface

Mô tả **hình dạng** của một object. Dùng ở mọi nơi có dữ liệu phức tạp.

```ts
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // ? = không bắt buộc
}

const user: User = { id: 1, name: "Giang", email: "g@mail.com" };

//  Thiếu trường bắt buộc → báo lỗi ngay
const user2: User = { id: 2, name: "An" }; // Error: 'email' is missing

//  Sai tên trường → bắt typo
console.log(user.nmae); // Error: 'nmae' does not exist
```

---

## 4. Type

Linh hoạt hơn interface — dùng cho union, danh sách giá trị cố định.

```ts
// Union — nhiều kiểu có thể
type ID = string | number;
type Answer = string | null | undefined;

// Danh sách cố định — chỉ được chọn trong danh sách
type Status = "idle" | "loading" | "success" | "error";
type Role = "admin" | "user" | "moderator";

let status: Status = "loading"; //
let status2: Status = "pending"; //  Error
```

**Quy tắc nhớ nhanh:**

- `interface` → mô tả object có nhiều trường
- `type` → union `|`, danh sách giá trị cố định

---

## 5. Functions

```ts
// Khai báo rõ: nhận gì → trả về gì
function greet(name: string, title?: string): string {
  return title ? `Hello ${title} ${name}` : `Hello ${name}`;
}

greet("Giang"); //  "Hello Giang"
greet("Giang", "Mr."); //  "Hello Mr. Giang"
greet(123); //  Error: number không phải string

// Giá trị mặc định
function createUser(name: string, role: Role = "user") {
  return { name, role };
}

// Hàm async — khai báo kiểu trả về với Promise<T>
async function getPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts");
  return res.json() as Promise<Post[]>;
}
```

---

## 6. Array Methods với TypeScript

```ts
interface Product { id: number; name: string; price: number; inStock: boolean }

const products: Product[] = [...]

const names     = products.map(p => p.name)        // string[]
const available = products.filter(p => p.inStock)  // Product[]
const found     = products.find(p => p.id === 1)   // Product | undefined

// find trả về undefined nếu không tìm thấy → phải kiểm tra
if (found) {
  console.log(found.name)   //  chắc chắn là Product ở đây
}
```

---

## 7. Generics

`<T>` là placeholder — TypeScript tự điền kiểu thật khi bạn gọi hàm.

```ts
// Không có Generic — phải viết lại cho từng kiểu
function getFirst(arr: number[]): number {
  return arr[0];
}
function getFirst(arr: string[]): string {
  return arr[0];
}

// Có Generic — 1 hàm dùng được tất cả
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

getFirst([1, 2, 3]); // T = number
getFirst(["a", "b"]); // T = string
```

**Pattern phổ biến nhất — ApiResponse wrapper:**

```ts
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  return res.json() as Promise<ApiResponse<T>>;
}

// TypeScript tự biết data là gì
const res = await fetchApi<Post[]>("/api/posts");
console.log(res.data[0].title); //  data là Post[]

// Generic với ràng buộc — T phải có trường id
function findById<T extends { id: number }>(
  items: T[],
  id: number,
): T | undefined {
  return items.find((item) => item.id === id);
}
```

---

## 8. TypeScript với React

### Props

```tsx
interface CardProps {
  title: string
  price: number
  status?: "sale" | "new" | "sold"  // không bắt buộc, chỉ 3 giá trị
  onBuy: (id: number) => void       // hàm có tham số
  children: React.ReactNode         // JSX bên trong
}

function Card({ title, price, status = "new", onBuy, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{price.toLocaleString("vi-VN")} đ</p>
      <span>{status}</span>
      <button onClick={() => onBuy(1)}>Mua</button>
      {children}
    </div>
  )
}

<Card title="Laptop" price={25000000} onBuy={(id) => console.log(id)}>
  <p>Thông tin thêm</p>
</Card>

<Card title="Laptop" onBuy={() => {}} />  //  Error: 'price' is missing
```

### useState

```tsx
// TS tự suy ra — không cần khai báo
const [count, setCount] = useState(0); // number
const [name, setName] = useState(""); // string

// Phải khai báo khi null hoặc mảng rỗng
const [user, setUser] = useState<User | null>(null);
const [posts, setPosts] = useState<Post[]>([]);

// Trạng thái cố định
const [status, setStatus] = useState<Status>("idle");
setStatus("loading"); //
setStatus("pending"); //  Error
```

### useEffect & Async

```tsx
//  Sai — không dùng async trực tiếp
useEffect(async () => {
  await fetchData();
}, []);

//  Đúng
useEffect(() => {
  async function load() {
    try {
      const res = await fetch("/api/posts");
      const data = (await res.json()) as Post[];
      setPosts(data);
    } catch {
      setError("Không tải được");
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);
```

### useRef

```tsx
const inputRef = useRef<HTMLInputElement>(null);

// ?. vì current có thể null lúc component chưa mount
inputRef.current?.focus();

return <input ref={inputRef} />;
```

### Events — Bảng tra nhanh

| Element      | Event    | Type                                     |
| ------------ | -------- | ---------------------------------------- |
| `<input>`    | onChange | `React.ChangeEvent<HTMLInputElement>`    |
| `<textarea>` | onChange | `React.ChangeEvent<HTMLTextAreaElement>` |
| `<select>`   | onChange | `React.ChangeEvent<HTMLSelectElement>`   |
| `<form>`     | onSubmit | `React.FormEvent<HTMLFormElement>`       |
| `<button>`   | onClick  | `React.MouseEvent<HTMLButtonElement>`    |

```tsx
// onSubmit — luôn cần e.preventDefault()
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}

// onChange — lấy giá trị từ e.target.value
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value);
}
```

### Custom Hook

```tsx
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json() as Promise<T>)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Dùng ở bất kỳ component nào
const { data: posts, loading, error } = useFetch<Post[]>("/api/posts");
```

---

## 9. Type Narrowing

Khi biến có thể là nhiều kiểu → TypeScript bắt bạn **kiểm tra trước khi dùng**.

```ts
// 3 cách xử lý null/undefined hay dùng nhất

// Cách 1: if — rõ ràng nhất
if (user) {
  console.log(user.name);
}

// Cách 2: optional chaining — gọn
console.log(user?.name);

// Cách 3: nullish coalescing — hiển thị giá trị mặc định
console.log(user?.name ?? "Khách");
```

---

## 10. Lỗi Thường Gặp

| #   | Lỗi                          | Nguyên nhân          | Fix                               |
| --- | ---------------------------- | -------------------- | --------------------------------- |
| 1   | `Object is possibly null`    | Chưa kiểm tra null   | Dùng `if`, `?.`, `??`             |
| 2   | `Type X not assignable to Y` | Gán sai kiểu         | Kiểm tra interface, dùng `as`     |
| 3   | `Property X does not exist`  | Sai tên trường       | Hover để xem tên đúng             |
| 4   | `Argument not assignable`    | Sai tham số hàm      | Kiểm tra thứ tự và kiểu           |
| 5   | `Cannot find name`           | Quên import          | Thêm import đầu file              |
| 6   | `useEffect async`            | Dùng async trực tiếp | Tạo function bên trong            |
| 7   | Dùng `any`                   | Bỏ qua kiểm tra      | Khai báo interface hoặc dùng `as` |

---

## Bảng Tổng Kết

| Khái niệm   | Cú pháp                    | Dùng khi nào                  |
| ----------- | -------------------------- | ----------------------------- |
| Kiểu cơ bản | `let x: string`            | Biến đơn giản                 |
| Interface   | `interface User {}`        | Mô tả object                  |
| Type        | `type Status = "a" \| "b"` | Union, danh sách cố định      |
| Optional    | `age?: number`             | Trường/tham số không bắt buộc |
| Union       | `string \| null`           | Biến có thể nhiều kiểu        |
| Generic     | `function fn<T>()`         | Tái sử dụng cho nhiều kiểu    |
| Array       | `Post[]`                   | Mảng có kiểu                  |
| Promise     | `Promise<Post[]>`          | Hàm async                     |
| Props       | `interface CardProps`      | Component React               |
| State       | `useState<T \| null>`      | State có null hoặc mảng       |
| Ref         | `useRef<HTMLInputElement>` | Trỏ DOM element               |

---

## Checklist — Sẵn Sàng Học React

- [ ] Khai báo được `interface` cho object phức tạp
- [ ] Dùng `type` cho union và trạng thái cố định
- [ ] Viết function có khai báo tham số và kiểu trả về
- [ ] Dùng `useState<T | null>` và `useState<T[]>`
- [ ] Viết `useEffect` với async đúng cách
- [ ] Biết kiểu của `ChangeEvent`, `FormEvent`, `MouseEvent`
- [ ] Xử lý null/undefined bằng `if`, `?.`, `??`
- [ ] Hiểu `<T>` trong Generic là placeholder
- [ ] Không dùng `any` — thay bằng interface hoặc `as`

---

> **Nhớ:** TypeScript báo lỗi sớm để bạn không mất hàng giờ debug sau này. Gặp lỗi đỏ → đọc thông báo → tra bảng trên → fix.
