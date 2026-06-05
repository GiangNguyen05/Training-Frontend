# TypeScript Cơ Bản (P2)

## Interface (Khuôn mẫu dữ liệu)

Interface là cách bạn mô tả **hình dạng** của một object — nó có những trường gì, kiểu dữ liệu là gì.

### Vấn đề khi không có interface

```ts
// Không rõ user có những gì, dễ viết sai tên trường
function showProfile(user) {
  console.log(user.nmae); // typo: nmae thay vì name → lỗi lúc runtime
}
```

### Dùng interface để giải quyết

```ts
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // ? = không bắt buộc
}

function showProfile(user: User) {
  console.log(user.name); // ✅ VS Code gợi ý đúng tên trường
  console.log(user.nmae); // ❌ Error ngay lập tức — bắt typo!
}
```

### Dùng interface trong thực tế

```ts
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  category?: string;
}

const laptop: Product = {
  id: 1,
  name: "MacBook Air",
  price: 25000000,
  inStock: true,
};

// Thiếu trường bắt buộc → báo lỗi ngay
const phone: Product = {
  id: 2,
  name: "iPhone",
  // ❌ Error: Property 'price' is missing
  // ❌ Error: Property 'inStock' is missing
};
```

---

## Union Types

Đôi khi một biến có thể là nhiều kiểu khác nhau. Dùng `|` (ký tự "hoặc"):

```ts
// id có thể là number hoặc string
let userId: number | string;

userId = 123; // ✅
userId = "abc-456"; // ✅
userId = true; // ❌ Error
```

### Dùng thực tế — trạng thái loading

```ts
type Status = "loading" | "success" | "error";

function showStatus(status: Status) {
  if (status === "loading") return "Đang tải...";
  if (status === "success") return "Thành công!";
  if (status === "error") return "Có lỗi xảy ra";
}

showStatus("loading"); // ✅
showStatus("success"); // ✅
showStatus("pending"); // ❌ Error: "pending" không nằm trong danh sách cho phép
```

---

## Type vs Interface

Hai cách phổ biến để định nghĩa kiểu dữ liệu. Người mới hay bị nhầm lẫn giữa hai thứ này.

```ts
// Dùng Interface — cho object, class
interface User {
  name: string;
  age: number;
}

// Dùng Type — linh hoạt hơn, dùng được cho cả union, primitive
type Status = "active" | "inactive";
type ID = string | number;
type Point = { x: number; y: number };
```

**Quy tắc đơn giản để nhớ:**

- Dùng `interface` khi mô tả hình dạng của object
- Dùng `type` khi cần union (`|`), hoặc kiểu đơn giản

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
