# Trainning JS

## Array

### Tạo mảng

```js
const fruits = ["apple", "banana", "orange"];
const numbers = new Array(3).fill(0); // [0, 0, 0]
const range = Array.from({ length: 5 }, (_, i) => i + 1); // [1, 2, 3, 4, 5]
```

---

### Thêm / Xóa phần tử

```js
const arr = [1, 2, 3];

arr.push(4); // [1, 2, 3, 4]  → thêm vào CUỐI
arr.pop(); // [1, 2, 3]     → xóa phần tử CUỐI
arr.unshift(0); // [0, 1, 2, 3]  → thêm vào ĐẦU
arr.shift(); // [1, 2, 3]     → xóa phần tử ĐẦU

// splice(vị_trí, số_phần_tử_xóa, ...thêm_vào)
arr.splice(1, 1); // [1, 3]       → xóa 1 phần tử tại index 1
arr.splice(1, 0, 99); // [1, 99, 3]   → chèn 99 vào index 1
arr.splice(1, 1, 55); // [1, 55, 3]   → thay thế phần tử index 1
```

---

### Tìm kiếm

```js
const users = [
  { id: 1, name: "An" },
  { id: 2, name: "Bình" },
  { id: 3, name: "Chi" },
];

// indexOf → tìm index, trả về -1 nếu không có
["a", "b", "c"].indexOf("b"); // 1

// includes → kiểm tra có tồn tại không
["a", "b", "c"].includes("b"); // true

// find → trả về PHẦN TỬ đầu tiên thỏa điều kiện
users.find((u) => u.id === 2); // { id: 2, name: "Bình" }

// findIndex → trả về INDEX đầu tiên thỏa điều kiện
users.findIndex((u) => u.id === 2); // 1

// some → có ÍT NHẤT 1 phần tử thỏa không?
users.some((u) => u.name === "An"); // true

// every → TẤT CẢ phần tử có thỏa không?
[2, 4, 6].every((n) => n % 2 === 0); // true
```

---

### Duyệt & Biến đổi

#### `forEach` – duyệt qua từng phần tử

```js
const fruits = ["apple", "banana", "orange"];

fruits.forEach((fruit, index) => {
  console.log(`${index}: ${fruit}`);
});
// 0: apple
// 1: banana
// 2: orange
```

#### `map` – tạo mảng MỚI từ mảng cũ

```js
const prices = [100, 200, 300];
const discounted = prices.map((p) => p * 0.9);
// [90, 180, 270]

const users = [{ name: "An" }, { name: "Bình" }];
const names = users.map((u) => u.name);
// ["An", "Bình"]
```

#### `filter` – lọc phần tử thỏa điều kiện

```js
const scores = [45, 72, 88, 30, 95];
const passed = scores.filter((s) => s >= 50);
// [72, 88, 95]

const products = [
  { name: "Áo", price: 150000 },
  { name: "Quần", price: 350000 },
  { name: "Giày", price: 500000 },
];
const cheap = products.filter((p) => p.price < 400000);
// [{ name: "Áo", ... }, { name: "Quần", ... }]
```

#### `reduce` – gộp mảng thành 1 giá trị

```js
// Cú pháp: reduce((tích_lũy, phần_tử_hiện_tại) => ..., giá_trị_ban_đầu)

const numbers = [1, 2, 3, 4, 5];

// Tính tổng
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15

// Tìm giá trị lớn nhất
const max = numbers.reduce((acc, n) => (n > acc ? n : acc), 0); // 5

// Đếm xuất hiện
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
// { apple: 3, banana: 2, orange: 1 }
```

---

### Sắp xếp

```js
// Số
[3, 1, 4, 1, 5].sort((a, b) => a - b); // tăng dần: [1, 1, 3, 4, 5]
[3, 1, 4, 1, 5].sort((a, b) => b - a); // giảm dần: [5, 4, 3, 1, 1]

// Chuỗi
["Chuối", "Táo", "Bơ"].sort(); // ["Bơ", "Chuối", "Táo"]

// Object theo thuộc tính
const students = [
  { name: "An", gpa: 3.2 },
  { name: "Bình", gpa: 3.8 },
  { name: "Chi", gpa: 3.5 },
];
students.sort((a, b) => b.gpa - a.gpa);
// Bình (3.8) → Chi (3.5) → An (3.2)
```

---

### Kết hợp & Tách

```js
// slice(start, end) → cắt mảng, KHÔNG sửa mảng gốc
const arr = [0, 1, 2, 3, 4];
arr.slice(1, 4); // [1, 2, 3]
arr.slice(-2); // [3, 4] (tính từ cuối)

// concat → nối mảng
[1, 2].concat([3, 4], [5, 6]); // [1, 2, 3, 4, 5, 6]

// flat → làm phẳng mảng lồng nhau
[1, [2, 3], [4, [5, 6]]].flat(); // [1, 2, 3, 4, [5, 6]]
[1, [2, 3], [4, [5, 6]]].flat(2); // [1, 2, 3, 4, 5, 6]

// join → ghép thành chuỗi
["An", "Bình", "Chi"].join(", "); // "An, Bình, Chi"
```

---

### Destructuring & Spread

```js
// Destructuring – giải nén mảng
const [first, second, ...rest] = [10, 20, 30, 40, 50];
// first=10, second=20, rest=[30, 40, 50]

// Bỏ qua phần tử
const [, , third] = [10, 20, 30]; // third = 30

// Spread – trải mảng
const a = [1, 2, 3];
const b = [4, 5, 6];
const merged = [...a, ...b]; // [1, 2, 3, 4, 5, 6]
const copy = [...a]; // copy mảng (không liên kết)

// Truyền mảng vào hàm
Math.max(...[1, 5, 3, 9, 2]); // 9
```

---

### Các trick thực tế

```js
// Xóa trùng lặp
const dup = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(dup)]; // [1, 2, 3]

// Đảo ngược mảng
[1, 2, 3].reverse(); // [3, 2, 1]

// Kiểm tra là mảng
Array.isArray([1, 2]); // true
Array.isArray("abc"); // false

// Làm phẳng + map cùng lúc
[
  [1, 2],
  [3, 4],
].flatMap((x) => x.map((n) => n * 2));
// [2, 4, 6, 8]
```

---

### Tóm tắt nhanh

| Method     | Trả về         | Sửa mảng gốc? |
| ---------- | -------------- | ------------- |
| `map`      | mảng mới       | ❌            |
| `filter`   | mảng mới       | ❌            |
| `reduce`   | 1 giá trị      | ❌            |
| `forEach`  | undefined      | ❌            |
| `push/pop` | length/phần tử | ✅            |
| `splice`   | mảng bị xóa    | ✅            |
| `sort`     | mảng đã sắp    | ✅            |
| `slice`    | mảng mới       | ❌            |
