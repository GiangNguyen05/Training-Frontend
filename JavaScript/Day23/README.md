# TypeScript Cơ Bản (P1)

## TypeScript là gì? Tại sao cần học?

Hãy tưởng tượng bạn viết một tin nhắn và có người đọc lại giúp bạn trước khi gửi — TypeScript làm điều đó với code.

**JavaScript thuần:** bạn chỉ biết có lỗi khi chạy chương trình (đôi khi lúc khách hàng đang dùng).

**TypeScript:** báo lỗi ngay khi bạn đang gõ code, trước khi chạy bất cứ thứ gì.

```
JavaScript  →  chạy  →  lỗi  →  tìm bug  →  sửa
TypeScript  →  gõ code  →  lỗi hiện ngay  →  sửa luôn
```

## Types (Kiểu dữ liệu)

Đây là khái niệm cốt lõi của TypeScript. **Type** là cách bạn nói với TypeScript: "biến này chứa loại dữ liệu gì."

### Các type cơ bản

```ts
// String — chuỗi văn bản
let name: string = "Giang";

// Number — số
let age: number = 24;
let price: number = 99.5;

// Boolean — đúng/sai
let isLoggedIn: boolean = true;

// Array — mảng
let colors: string[] = ["red", "green", "blue"];
let scores: number[] = [9, 8, 10];

// Any — bất kỳ kiểu nào (dùng ít thôi, mất đi lợi ích của TS)
let anything: any = "hello";
anything = 42; // không báo lỗi
```

### TypeScript tự suy ra type

Bạn không cần viết type ở mọi nơi. TypeScript đủ thông minh để tự hiểu:

```ts
// Bạn không cần viết ": string" — TS tự biết
let city = "Da Nang";

// Bây giờ nếu bạn làm thế này → TS báo lỗi ngay
city = 123; // ❌ Error: Type 'number' is not assignable to type 'string'
```

---

## Functions (Hàm)

Với TypeScript, bạn khai báo rõ hàm nhận vào cái gì và trả về cái gì.

### Khai báo function

```ts
// JavaScript thuần — không rõ name là gì, trả về gì
function Hello(name) {
  return "Hello " + name;
}

// TypeScript — rõ ràng: name là string, trả về string
function Hello(name: string): string {
  return "Hello " + name;
}
```

### Tại sao quan trọng?

```ts
Hello("Giang"); // ✅ OK
Hello(2805); // ❌ Error: Argument of type 'number' is not assignable to 'string'
```

TypeScript ngăn bạn truyền sai dữ liệu vào hàm — lỗi này rất hay xảy ra trong thực tế.

### Optional parameter (tham số không bắt buộc)

Thêm `?` để đánh dấu tham số có thể có hoặc không:

```ts
function Hello(name: string, title?: string): string {
  if (title) {
    return `Hello ${title} ${name}`;
  }
  return `Hello ${name}`;
}

Hello("Giang"); // ✅ "Hello Giang"
Hello("Giang", "Mr."); // ✅ "Hello Mr. Giang"
```

### Default value (giá trị mặc định)

```ts
function createUser(name: string, role: string = "user") {
  return { name, role };
}

createUser("Giang"); // { name: "Giang", role: "user" }
createUser("Giang", "admin"); // { name: "Giang", role: "admin" }
```

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
