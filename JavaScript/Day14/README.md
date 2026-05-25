# Tranning JS

## Mục lục

ES2022 → ES2025 — JavaScript Features

- [ES2022](#es2022)
  - [Class Private Fields & Methods `#`](#1-class-private-fields--methods-)
  - [Top-level Await](#2-top-level-await)
  - [Array.at()](#3-arrayat)
  - [Object.hasOwn()](#4-objecthasown)
  - [Error Cause](#5-error-cause)
- [ES2023](#es2023)
  - [Array.findLast() / findLastIndex()](#1-arrayfindlast--findlastindex)
  - [Array.toSorted() / toReversed() / toSpliced() / with()](#2-arraytosorted--toreversed--tospliced--with)
  - [Hashbang `#!`](#3-hashbang-)
- [ES2024](#es2024)
  - [Object.groupBy() / Map.groupBy()](#1-objectgroupby--mapgroupby)
  - [Promise.withResolvers()](#2-promisewithresolvers)
  - [String.isWellFormed() / toWellFormed()](#3-stringiswellformed--towellformed)
  - [ArrayBuffer.resize() / transfer()](#4-arraybufferresize--transfer)
- [ES2025](#es2025)
  - [Iterator Helpers](#1-iterator-helpers)
  - [Import Attributes `with`](#2-import-attributes-with)
  - [RegExp Duplicate Named Capture Groups](#3-regexp-duplicate-named-capture-groups)
  - [Promise.try()](#4-promisetry)
  - [Set Methods mới](#5-set-methods-mới)
- [Bảng tổng kết](#bảng-tổng-kết)

---

## ES2022

### 1. Class Private Fields & Methods `#`

**Khái niệm:** Field hoặc method bắt đầu bằng `#` chỉ truy cập được từ **bên trong class**. Bên ngoài không đọc, không ghi, không gọi được — JavaScript throw lỗi ngay tại parse time.

Trước ES2022, để giả lập private thường dùng convention `_property` hoặc closure, nhưng thực chất vẫn truy cập được từ ngoài.

```js
class BankAccount {
  #balance = 0; // Private field
  #owner; // Private field khai báo không có giá trị mặc định

  constructor(owner, initialBalance) {
    this.#owner = owner;
    this.#balance = initialBalance;
  }

  // Private method
  #validate(amount) {
    if (amount <= 0) throw new Error("Số tiền phải lớn hơn 0");
    if (amount > this.#balance) throw new Error("Số dư không đủ");
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Số tiền phải lớn hơn 0");
    this.#balance += amount;
    return this;
  }

  withdraw(amount) {
    this.#validate(amount); // Gọi private method bên trong
    this.#balance -= amount;
    return this;
  }

  get balance() {
    return this.#balance; // Cho phép đọc nhưng không cho ghi trực tiếp
  }

  toString() {
    return `${this.#owner}: ${this.#balance.toLocaleString("vi-VN")} VNĐ`;
  }
}

const acc = new BankAccount("Nguyễn Nam", 1_000_000);

acc.deposit(500_000).withdraw(200_000); // Method chaining
console.log(acc.balance); // 1300000
console.log(acc.toString()); // "Nguyễn Nam: 1.300.000 VNĐ"

// ❌ Không thể truy cập từ ngoài
console.log(acc.#balance); // SyntaxError
acc.#validate(100); // SyntaxError
```

**Kiểm tra field có tồn tại không với `in`:**

```js
class Song {
  #title;
  constructor(title) {
    this.#title = title;
  }

  static isSong(obj) {
    return #title in obj; // Kiểm tra xem obj có private field #title không
  }
}

console.log(Song.isSong(new Song("abc"))); // true
console.log(Song.isSong({ title: "abc" })); // false
```

---

### 2. Top-level Await

**Khái niệm:** Trước ES2022, `await` chỉ dùng được bên trong `async function`. ES2022 cho phép dùng `await` **trực tiếp ở top-level** trong ES Module (file `.mjs` hoặc `type="module"`).

```js
// ❌ Trước ES2022 — phải bọc trong async IIFE
(async () => {
  const response = await fetch("https://api.example.com/songs");
  const songs = await response.json();
  console.log(songs);
})();

// ✅ ES2022 — top-level await trong module
const response = await fetch("https://api.example.com/songs");
const songs = await response.json();
console.log(songs);
```

**Ứng dụng thực tế — load config trước khi app chạy:**

```js
// config.js
const res = await fetch("/api/config");
export const config = await res.json();
// Module khác import config sẽ tự động chờ fetch xong

// main.js
import { config } from "./config.js"; // Đã có dữ liệu, không cần async
console.log(config.apiUrl);
```

**Lưu ý:** Chỉ hoạt động trong **ES Module**. File script thường (`<script>` không có `type="module"`) không dùng được.

---

### 3. Array.at()

**Khái niệm:** Truy cập phần tử theo **index âm** — đếm từ cuối mảng. Giải quyết cú pháp cồng kềnh `arr[arr.length - 1]`.

```js
const songs = ["Hãy Trao", "Người Lạ Ơi", "Chạy Ngay Đi", "Có Chắc Yêu"];

// Trước ES2022
songs[songs.length - 1]; // "Có Chắc Yêu" — dài dòng
songs[songs.length - 2]; // "Chạy Ngay Đi"

// ✅ ES2022 — at()
songs.at(-1); // "Có Chắc Yêu"  — phần tử cuối
songs.at(-2); // "Chạy Ngay Đi" — kế cuối
songs.at(0); // "Hãy Trao"     — phần tử đầu (như songs[0])
songs.at(1); // "Người Lạ Ơi"

// at() cũng dùng được trên String và TypedArray
"Hello".at(-1); // "o"
"Hello".at(-2); // "l"
```

---

### 4. Object.hasOwn()

**Khái niệm:** Kiểm tra object có thuộc tính đó **không kế thừa từ prototype** hay không. Thay thế `Object.prototype.hasOwnProperty.call()` cồng kềnh.

```js
const song = {
  title: "Hãy Trao Cho Anh",
  artist: "Sơn Tùng M-TP",
};

// Trước ES2022
song.hasOwnProperty("title"); // true  — nhưng có thể bị override
Object.prototype.hasOwnProperty.call(song, "title"); // true  — an toàn nhưng dài

// ✅ ES2022
Object.hasOwn(song, "title"); // true
Object.hasOwn(song, "artist"); // true
Object.hasOwn(song, "year"); // false — không tồn tại
Object.hasOwn(song, "toString"); // false — kế thừa từ prototype, không phải own

// Trường hợp hasOwnProperty bị override — lý do nên dùng hasOwn
const obj = Object.create(null); // Không có prototype
obj.name = "test";
// obj.hasOwnProperty("name") → TypeError: obj.hasOwnProperty is not a function
Object.hasOwn(obj, "name"); // ✅ true — vẫn hoạt động
```

---

### 5. Error Cause

**Khái niệm:** Khi throw Error, có thể đính kèm **lỗi gốc** (`cause`) để giữ nguyên stack trace gốc khi wrap lỗi. Cực kỳ hữu ích khi debug.

```js
// Trước ES2022 — mất thông tin lỗi gốc
async function loadSong(id) {
  try {
    const res = await fetch(`/api/songs/${id}`);
    return await res.json();
  } catch (err) {
    throw new Error(`Không thể tải bài hát ${id}`);
    // Lỗi gốc (err) bị mất!
  }
}

// ✅ ES2022 — giữ lại lỗi gốc trong cause
async function loadSong(id) {
  try {
    const res = await fetch(`/api/songs/${id}`);
    return await res.json();
  } catch (err) {
    throw new Error(`Không thể tải bài hát ${id}`, { cause: err });
    //                                               ↑ giữ lỗi gốc
  }
}

// Bắt và xem lỗi
try {
  await loadSong(999);
} catch (err) {
  console.error(err.message); // "Không thể tải bài hát 999"
  console.error(err.cause); // TypeError: Failed to fetch  ← lỗi gốc vẫn còn
}
```

---

## ES2023

### 1. Array.findLast() / findLastIndex()

**Khái niệm:** Tìm phần tử hoặc index **từ cuối mảng** thay vì từ đầu. Trước đây phải `.reverse()` rồi `.find()` — tốn bộ nhớ vì tạo mảng mới.

```js
const songs = [
  { id: 1, title: "Hãy Trao", year: 2019 },
  { id: 2, title: "Chạy Ngay", year: 2018 },
  { id: 3, title: "Người Lạ", year: 2019 },
  { id: 4, title: "Có Chắc", year: 2020 },
];

// Tìm bài hát có year = 2019 — kết quả khác nhau!
songs.find((s) => s.year === 2019); // { id:1, title:"Hãy Trao" }  — tìm từ đầu
songs.findLast((s) => s.year === 2019); // { id:3, title:"Người Lạ" } — tìm từ cuối

songs.findIndex((s) => s.year === 2019); // 0
songs.findLastIndex((s) => s.year === 2019); // 2
```

---

### 2. Array.toSorted() / toReversed() / toSpliced() / with()

**Khái niệm:** Các phương thức **immutable** — trả về mảng mới thay vì sửa mảng gốc. Trước đây `sort()`, `reverse()`, `splice()` đều sửa mảng gốc (mutate), dễ gây bug.

```js
const songs = ["Hãy Trao", "Người Lạ", "Chạy Ngay", "Có Chắc"];

// ── toSorted() ── Sắp xếp, không sửa gốc
const sorted = songs.toSorted();
console.log(sorted); // ["Chạy Ngay", "Có Chắc", "Hãy Trao", "Người Lạ"]
console.log(songs); // ["Hãy Trao", "Người Lạ", "Chạy Ngay", "Có Chắc"] ← không đổi!

// ── toReversed() ── Đảo ngược, không sửa gốc
const reversed = songs.toReversed();
console.log(reversed); // ["Có Chắc", "Chạy Ngay", "Người Lạ", "Hãy Trao"]
console.log(songs); // Vẫn như cũ

// ── toSpliced() ── Thêm/xoá phần tử, không sửa gốc
const spliced = songs.toSpliced(1, 1, "Bài Mới"); // Xoá 1 phần tử tại index 1, thêm "Bài Mới"
console.log(spliced); // ["Hãy Trao", "Bài Mới", "Chạy Ngay", "Có Chắc"]
console.log(songs); // Vẫn như cũ

// ── with() ── Thay thế phần tử tại index, không sửa gốc
const updated = songs.with(2, "Bài Hát Mới"); // Thay index 2
console.log(updated); // ["Hãy Trao", "Người Lạ", "Bài Hát Mới", "Có Chắc"]
console.log(songs); // Vẫn như cũ
```

**So sánh mutate vs immutable:**

```js
// ❌ sort() mutate — sửa gốc, dễ bug
const a = [3, 1, 2];
const b = a.sort();
console.log(a); // [1, 2, 3] — a bị thay đổi!
console.log(b); // [1, 2, 3] — a và b là cùng một mảng

// ✅ toSorted() immutable — an toàn
const a = [3, 1, 2];
const b = a.toSorted();
console.log(a); // [3, 1, 2] — a nguyên vẹn
console.log(b); // [1, 2, 3] — b là mảng mới
```

---

### 3. Hashbang `#!`

**Khái niệm:** Cho phép dùng shebang line `#!/usr/bin/env node` ở đầu file JavaScript để chạy trực tiếp như script trên Unix/Linux.

```js
#!/usr/bin/env node
// script.js — chạy trực tiếp: ./script.js

const args = process.argv.slice(2);
console.log("Hello,", args[0] || "World");
```

```bash
chmod +x script.js
./script.js Nguyen  # Hello, Nguyen
```

---

## ES2024

### 1. Object.groupBy() / Map.groupBy()

**Khái niệm:** Nhóm các phần tử của iterable theo một tiêu chí. Thay thế reduce() phức tạp hay thư viện như Lodash `_.groupBy()`.

```js
const songs = [
  { title: "Hãy Trao", artist: "Sơn Tùng", year: 2019 },
  { title: "Chạy Ngay", artist: "Sơn Tùng", year: 2018 },
  { title: "Người Lạ", artist: "Karik", year: 2017 },
  { title: "Có Chắc", artist: "Sơn Tùng", year: 2020 },
  { title: "Pháo", artist: "Karik", year: 2020 },
];

// ── Object.groupBy() ── Trả về plain object
const byArtist = Object.groupBy(songs, (song) => song.artist);
// {
//   "Sơn Tùng": [{ title:"Hãy Trao",...}, { title:"Chạy Ngay",...}, { title:"Có Chắc",...}],
//   "Karik":    [{ title:"Người Lạ",...}, { title:"Pháo",...}]
// }

console.log(byArtist["Sơn Tùng"].length); // 3

// Nhóm theo thập kỷ
const byDecade = Object.groupBy(
  songs,
  (s) => `${Math.floor(s.year / 10) * 10}s`,
);
// { "2010s": [...], "2020s": [...] }

// ── Map.groupBy() ── Trả về Map — key có thể là bất kỳ kiểu nào
const byYear = Map.groupBy(songs, (song) => song.year);
console.log(byYear.get(2020)); // [{ title:"Có Chắc",...}, { title:"Pháo",...}]

// Trước ES2024 — phải dùng reduce() dài dòng
const byArtistOld = songs.reduce((acc, song) => {
  const key = song.artist;
  acc[key] = acc[key] || [];
  acc[key].push(song);
  return acc;
}, {});
```

---

### 2. Promise.withResolvers()

**Khái niệm:** Tạo Promise và lấy ra `resolve` + `reject` để dùng **bên ngoài** executor. Trước đây phải dùng pattern phức tạp để expose resolve/reject.

```js
// Trước ES2024 — resolve/reject bị kẹt trong closure
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res; // Gán ra ngoài — cồng kềnh
  reject = rej;
});
// Dùng ở nơi khác
resolve("xong");

// ✅ ES2024 — gọn hơn nhiều
const { promise, resolve, reject } = Promise.withResolvers();

// Dùng tự do ở bất kỳ đâu
setTimeout(() => resolve("xong sau 1 giây"), 1000);

const result = await promise;
console.log(result); // "xong sau 1 giây"
```

**Ứng dụng thực tế — chờ user xác nhận:**

```js
function showConfirmDialog(message) {
  const { promise, resolve, reject } = Promise.withResolvers();

  // Tạo dialog
  const dialog = document.createElement("dialog");
  dialog.innerHTML = `
    <p>${message}</p>
    <button id="ok">OK</button>
    <button id="cancel">Huỷ</button>`;

  document.body.appendChild(dialog);
  dialog.showModal();

  dialog.querySelector("#ok").onclick = () => {
    resolve(true);
    dialog.close();
  };
  dialog.querySelector("#cancel").onclick = () => {
    resolve(false);
    dialog.close();
  };

  return promise;
}

// Dùng như async/await bình thường
const confirmed = await showConfirmDialog("Xoá bài hát này?");
if (confirmed) {
  await deleteSong(id);
}
```

---

### 3. String.isWellFormed() / toWellFormed()

**Khái niệm:** Kiểm tra và sửa chuỗi có chứa **lone surrogate** — ký tự Unicode không hợp lệ có thể gây lỗi khi encode URL hoặc gửi lên server.

```js
const valid = "Hello 🎵"; // Chuỗi hợp lệ
const invalid = "Hello \uD800"; // Chứa lone surrogate — không hợp lệ

// isWellFormed() — kiểm tra
valid.isWellFormed(); // true
invalid.isWellFormed(); // false

// toWellFormed() — tự động thay thế ký tự lỗi bằng U+FFFD (replacement character)
invalid.toWellFormed(); // "Hello \uFFFD" — an toàn để dùng tiếp

// Ứng dụng thực tế — validate trước khi encode URL
function safeEncodeURI(str) {
  if (!str.isWellFormed()) {
    str = str.toWellFormed(); // Sửa trước
  }
  return encodeURIComponent(str); // encodeURIComponent sẽ throw nếu có lone surrogate
}
```

---

### 4. ArrayBuffer.resize() / transfer()

**Khái niệm:** Thay đổi kích thước hoặc chuyển quyền sở hữu ArrayBuffer mà không cần copy toàn bộ dữ liệu. Dùng khi xử lý binary data lớn (audio, video, file).

```js
// resize() — thay đổi kích thước (phải khai báo maxByteLength khi tạo)
const buffer = new ArrayBuffer(8, { maxByteLength: 64 });
console.log(buffer.byteLength); // 8

buffer.resize(16);
console.log(buffer.byteLength); // 16 — không copy, chỉ mở rộng

buffer.resize(4);
console.log(buffer.byteLength); // 4 — thu nhỏ

// transfer() — chuyển quyền sở hữu, buffer cũ bị detach
const original = new ArrayBuffer(8);
const view = new Uint8Array(original);
view.set([1, 2, 3, 4, 5, 6, 7, 8]);

const transferred = original.transfer(); // Chuyển sang buffer mới
console.log(original.detached); // true — không dùng được nữa
console.log(new Uint8Array(transferred)); // [1, 2, 3, 4, 5, 6, 7, 8] — dữ liệu vẫn còn
```

---

## ES2025

### 1. Iterator Helpers

**Khái niệm:** Các method như `map`, `filter`, `take`, `drop`, `flatMap`, `reduce`, `forEach`, `some`, `every`, `find` trực tiếp trên **Iterator** — không cần chuyển sang mảng trước. Tiết kiệm bộ nhớ với dữ liệu lớn vì xử lý **lazy** (từng phần tử một).

```js
// Tạo generator — trả về Iterator
function* songGenerator() {
  yield { id: 1, title: "Hãy Trao", year: 2019, plays: 1200 };
  yield { id: 2, title: "Chạy Ngay", year: 2018, plays: 980 };
  yield { id: 3, title: "Người Lạ", year: 2017, plays: 450 };
  yield { id: 4, title: "Có Chắc", year: 2020, plays: 2100 };
  yield { id: 5, title: "Pháo", year: 2020, plays: 1750 };
}

// ✅ ES2025 Iterator Helpers — lazy, không tạo mảng trung gian
const result = songGenerator()
  .filter((s) => s.plays > 500) // Lọc
  .map((s) => s.title) // Lấy title
  .take(3) // Chỉ lấy 3 cái đầu
  .toArray(); // Chuyển thành mảng khi cần

console.log(result); // ["Hãy Trao", "Chạy Ngay", "Có Chắc"]

// Trước ES2025 — phải spread ra mảng trước, tốn bộ nhớ
const result = [...songGenerator()]
  .filter((s) => s.plays > 500)
  .map((s) => s.title)
  .slice(0, 3);

// Các helpers khác
songGenerator().find((s) => s.year === 2020); // { id:4, ... }
songGenerator().some((s) => s.plays > 2000); // true
songGenerator().every((s) => s.plays > 100); // true
songGenerator().reduce((sum, s) => sum + s.plays, 0); // 6480
```

---

### 2. Import Attributes `with`

**Khái niệm:** Khai báo kiểu dữ liệu khi `import` file không phải JavaScript — JSON, CSS, WebAssembly. Trình duyệt và runtime cần biết cách xử lý file đó.

```js
// Import JSON trực tiếp (không cần fetch)
import config from "./config.json" with { type: "json" };
console.log(config.apiUrl); // Dùng như object bình thường

// Import CSS (CSS Module)
import styles from "./button.css" with { type: "css" };
document.adoptedStyleSheets = [styles];

// Import JSON động
const data = await import("./songs.json", { with: { type: "json" } });
console.log(data.default); // Array bài hát

// Trước ES2025 — phải fetch thủ công
const res = await fetch("./config.json");
const config = await res.json();
```

---

### 3. RegExp Duplicate Named Capture Groups

**Khái niệm:** Trong Regular Expression, cho phép **cùng tên group** xuất hiện ở nhiều nhánh `|` (alternation). Hữu ích khi parse dữ liệu có nhiều định dạng ngày tháng khác nhau.

```js
// Trước ES2025 — phải đặt tên khác nhau rất cồng kềnh
const dateRegex =
  /(?<year1>\d{4})-(?<month1>\d{2})|(?<month2>\d{2})\/(?<year2>\d{4})/;

// ✅ ES2025 — cùng tên ở các nhánh khác nhau
const dateRegex =
  /(?<year>\d{4})-(?<month>\d{2})|(?<month>\/\d{2})\/(?<year>\d{4})/;

// Parse nhiều định dạng ngày
function parseDate(str) {
  const match = str.match(
    /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})|(?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{4})/,
  );
  if (!match) return null;

  const { year, month, day } = match.groups;
  // Dù format nào thì year, month, day đều có tên giống nhau
  return new Date(year, month - 1, day);
}

parseDate("2024-12-25"); // → Date object
parseDate("25/12/2024"); // → Date object — cùng tên group, khác nhánh regex
```

---

### 4. Promise.try()

**Khái niệm:** Bọc một function (có thể sync hoặc async) trong Promise. Nếu function throw sync, lỗi sẽ đi vào `.catch()` thay vì crash ra ngoài. Thống nhất cách xử lý lỗi sync và async.

```js
// Vấn đề trước ES2025 — lỗi sync và async xử lý khác nhau
function riskySync() {
  throw new Error("Lỗi sync");
}
async function riskyAsync() {
  throw new Error("Lỗi async");
}

// Lỗi sync KHÔNG bị bắt bởi .catch()
Promise.resolve()
  .then(() => riskySync()) // throw ra ngoài — không vào .catch()!
  .catch((err) => console.error(err)); // Không chạy!

// ✅ ES2025 — Promise.try() bắt cả sync và async
Promise.try(() => riskySync()).catch((err) => console.error(err.message)); // "Lỗi sync" — bắt được!

Promise.try(() => riskyAsync()).catch((err) => console.error(err.message)); // "Lỗi async" — cũng bắt được!

// Ứng dụng thực tế — xử lý callback không biết sync hay async
function runHandler(handler, data) {
  return Promise.try(() => handler(data))
    .then((result) => ({ ok: true, result }))
    .catch((err) => ({ ok: false, error: err.message }));
}

// handler có thể là function thường hoặc async function
runHandler((data) => data.title.toUpperCase(), song); // sync  — OK
runHandler(async (data) => await save(data), song); // async — OK
runHandler((data) => {
  throw new Error("!");
}, song); // sync throw — cũng OK
```

---

### 5. Set Methods mới

**Khái niệm:** ES2025 thêm các phép toán **tập hợp** cho `Set` — union, intersection, difference, symmetricDifference. Trước đây phải viết thủ công hoặc dùng thư viện.

```js
const rock = new Set(["Nirvana", "Radiohead", "Pearl Jam", "Oasis"]);
const brit = new Set(["Oasis", "Radiohead", "Blur", "Pulp"]);

// ── union() ── Hợp — tất cả phần tử của cả hai tập
rock.union(brit);
// Set { "Nirvana", "Radiohead", "Pearl Jam", "Oasis", "Blur", "Pulp" }

// ── intersection() ── Giao — phần tử có trong cả hai tập
rock.intersection(brit);
// Set { "Radiohead", "Oasis" }

// ── difference() ── Hiệu — phần tử trong A nhưng không có trong B
rock.difference(brit);
// Set { "Nirvana", "Pearl Jam" }

brit.difference(rock);
// Set { "Blur", "Pulp" }

// ── symmetricDifference() ── Hiệu đối xứng — phần tử chỉ có ở một trong hai tập
rock.symmetricDifference(brit);
// Set { "Nirvana", "Pearl Jam", "Blur", "Pulp" }

// ── isSubsetOf() / isSupersetOf() / isDisjointFrom() ──
const indie = new Set(["Oasis", "Blur"]);
indie.isSubsetOf(brit); // true  — indie ⊆ brit
brit.isSupersetOf(indie); // true  — brit ⊇ indie
rock.isDisjointFrom(new Set(["Taylor Swift", "Adele"])); // true — không giao nhau

// Trước ES2025 — phải viết thủ công
const intersection = new Set([...rock].filter((x) => brit.has(x)));
```

---

## Bảng tổng kết

| Feature                              | ES   | Dùng để                                     |
| ------------------------------------ | ---- | ------------------------------------------- |
| Class Private `#`                    | 2022 | Bảo vệ dữ liệu nội bộ, encapsulation        |
| Top-level Await                      | 2022 | `await` trực tiếp trong module, load config |
| `Array.at()`                         | 2022 | Truy cập index âm, lấy phần tử cuối gọn hơn |
| `Object.hasOwn()`                    | 2022 | Kiểm tra own property an toàn               |
| `Error cause`                        | 2022 | Giữ lỗi gốc khi wrap error, debug dễ hơn    |
| `findLast/findLastIndex`             | 2023 | Tìm từ cuối mảng                            |
| `toSorted/toReversed/toSpliced/with` | 2023 | Immutable array operations                  |
| `Object.groupBy()`                   | 2024 | Nhóm dữ liệu theo tiêu chí                  |
| `Promise.withResolvers()`            | 2024 | Expose resolve/reject ra ngoài executor     |
| `isWellFormed/toWellFormed`          | 2024 | Kiểm tra và sửa Unicode không hợp lệ        |
| Iterator Helpers                     | 2025 | Xử lý lazy stream dữ liệu lớn               |
| Import Attributes                    | 2025 | Import JSON, CSS trực tiếp                  |
| Duplicate Named Groups               | 2025 | Regex nhiều định dạng cùng tên group        |
| `Promise.try()`                      | 2025 | Thống nhất xử lý lỗi sync và async          |
| Set Methods                          | 2025 | Phép toán tập hợp: union, intersection...   |

### Features hay dùng nhất trong thực tế

```
Hàng ngày:
  arr.at(-1)              → lấy phần tử cuối
  Object.hasOwn()         → kiểm tra property
  class #private          → encapsulation
  toSorted/toReversed     → không mutate mảng gốc

Thường xuyên:
  Object.groupBy()        → nhóm dữ liệu cho UI
  Error cause             → debug khi có nhiều lớp async
  Promise.withResolvers() → dialog, event-driven flow

Khi cần:
  Top-level await         → module init, config loading
  Set methods             → filter danh sách, so sánh tập hợp
  Iterator helpers        → xử lý data lớn, lazy evaluation
  Promise.try()           → middleware, plugin system
```
