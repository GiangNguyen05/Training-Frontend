# Traning JS

## Mục lục

1. [Bức tranh tổng thể](#1-bức-tranh-tổng-thể)
2. [ES6 — Nền tảng của JavaScript hiện đại](#2-es6--nền-tảng-của-javascript-hiện-đại)
3. [So sánh trực tiếp — Cùng bài toán, khác cách viết](#3-so-sánh-trực-tiếp--cùng-bài-toán-khác-cách-viết)
4. [ES6 vs ES2022–2025 theo từng chủ đề](#4-es6-vs-es20222025-theo-từng-chủ-đề)
5. [Tóm tắt](#5-tóm-tắt)

---

## 1. Bức tranh tổng thể

JavaScript dùng tên **ECMAScript (ES)** cho chuẩn ngôn ngữ. Từ ES2016 trở đi, mỗi năm ra một phiên bản mới.

```
ES5   (2009)  — Nền tảng cũ, chạy mọi trình duyệt
ES6   (2015)  — Cuộc cách mạng lớn nhất, thay đổi cách viết JS hoàn toàn
ES2016 (2016) — Nhỏ: Array.includes(), ** (exponentiation)
ES2017 (2017) — async/await, Object.entries/values
ES2018 (2018) — Rest/Spread cho Object, Promise.finally()
ES2019 (2019) — Array.flat(), Object.fromEntries()
ES2020 (2020) — Optional chaining ?., Nullish coalescing ??
ES2021 (2021) — String.replaceAll(), Promise.any(), ||=, &&=
ES2022 (2022) — Class Private #, Array.at(), top-level await
ES2023 (2023) — toSorted(), findLast(), immutable arrays
ES2024 (2024) — Object.groupBy(), Promise.withResolvers()
ES2025 (2025) — Iterator helpers, Set methods, Promise.try()
```

**Điểm mấu chốt:**

- **ES6** là bước nhảy vọt lớn nhất — thêm hàng chục tính năng cốt lõi cùng một lúc.
- **ES2022–2025** là các cải tiến nhỏ hàng năm — vá lỗ hổng, tiện hơn, an toàn hơn.
- ES6 là **nền tảng bắt buộc phải biết**. ES2022–2025 là **nâng cao**.

---

## 2. ES6 — Nền tảng của JavaScript hiện đại

ES6 ra đời năm 2015, thêm hơn 30 tính năng lớn cùng lúc. Đây là những tính năng **dùng hàng ngày**:

### `let` / `const` — thay `var`

```js
// ES5 — var có nhiều vấn đề
var name = "Sơn Tùng";
var name = "Karik"; // Khai báo lại được — dễ bug

// ES6 — let và const
let artist = "Sơn Tùng"; // Có thể gán lại
const title = "Hãy Trao"; // Không thể gán lại
const title = "Khác"; // ❌ SyntaxError
```

---

### Arrow Function `=>`

```js
// ES5
var songs = items.filter(function (s) {
  return s.liked === true;
});

// ES6 — ngắn hơn, this không bị thay đổi
const songs = items.filter((s) => s.liked === true);
const titles = items.map((s) => s.title);
```

---

### Template Literal

```js
const title = "Hãy Trao";
const artist = "Sơn Tùng";

// ES5
var info = title + " — " + artist;

// ES6
const info = `${title} — ${artist}`;
const html = `
  <div class="song">
    <h2>${title}</h2>
    <p>${artist}</p>
  </div>
`;
```

---

### Destructuring

```js
const song = { title: "Hãy Trao", artist: "Sơn Tùng", year: 2019 };

// ES5
var title = song.title;
var artist = song.artist;

// ES6 — Object destructuring
const { title, artist, year } = song;

// Array destructuring
const [first, second] = ["Hãy Trao", "Người Lạ"];

// Trong tham số hàm
function showSong({ title, artist }) {
  return `${title} — ${artist}`;
}
```

---

### Default Parameters

```js
// ES5
function add(title, artist) {
  artist = artist || "Unknown";
}

// ES6
function add(title, artist = "Unknown", year = 2024) {
  return { title, artist, year };
}

add("Bài hát A"); // { title: "Bài hát A", artist: "Unknown", year: 2024 }
add("Bài hát B", "Karik"); // { title: "Bài hát B", artist: "Karik",   year: 2024 }
```

---

### Rest / Spread `...`

```js
// Rest — gom các tham số còn lại thành mảng
function addSongs(playlist, ...songs) {
  return [...playlist, ...songs]; // Spread — trải mảng ra
}

const current = ["Hãy Trao", "Người Lạ"];
const result = addSongs(current, "Chạy Ngay", "Có Chắc");
// ["Hãy Trao", "Người Lạ", "Chạy Ngay", "Có Chắc"]

// Spread với object
const song = { title: "Hãy Trao", year: 2019 };
const updated = { ...song, year: 2020, liked: true }; // Override year
// { title: "Hãy Trao", year: 2020, liked: true }
```

---

### Class (ES6 cơ bản)

```js
// ES6 — class cú pháp
class Song {
  constructor(title, artist) {
    this.title = title;
    this.artist = artist;
    this.liked = false; // Tất cả properties đều PUBLIC
  }

  info() {
    return `${this.title} — ${this.artist}`;
  }
}

// Kế thừa
class PremiumSong extends Song {
  constructor(title, artist, quality) {
    super(title, artist); // Gọi constructor của Song
    this.quality = quality;
  }
}
```

---

### Promise

```js
// ES6 — Promise thay Callback hell
function fetchSong(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, title: "Hãy Trao" });
      else reject(new Error("ID không hợp lệ"));
    }, 500);
  });
}

fetchSong(1)
  .then((song) => console.log(song.title))
  .catch((err) => console.error(err.message));
```

---

### Module `import` / `export`

```js
// song.js
export class Song { ... }
export function createSong(title) { ... }
export default Playlist;

// main.js
import Playlist, { Song, createSong } from "./song.js";
```

---

### Các tính năng khác của ES6

```js
// Symbol — kiểu nguyên thủy duy nhất, không bao giờ trùng
const id = Symbol("id");

// Map / Set
const map = new Map();
map.set("key", "value");

const set = new Set([1, 2, 2, 3]); // { 1, 2, 3 } — không trùng

// Generator function
function* count() {
  yield 1;
  yield 2;
  yield 3;
}

// Shorthand property
const title = "Hãy Trao";
const song = { title }; // Thay vì { title: title }

// Computed property
const field = "artist";
const obj = { [field]: "Sơn Tùng" }; // { artist: "Sơn Tùng" }
```

---

## 3. So sánh trực tiếp — Cùng bài toán, khác cách viết

Quản lý danh sách bài hát — viết bằng ES6 rồi cải tiến lên ES2022–2025:

```js
// ════════════════════════════════
// ES6 (2015)
// ════════════════════════════════

class Playlist {
  constructor() {
    this._songs = []; // _ là convention "private" — thực ra vẫn truy cập được!
    this._nextId = 1;
  }

  add(title, artist) {
    const song = { id: this._nextId++, title, artist, liked: false };
    this._songs.push(song);
    return this;
  }

  remove(id) {
    this._songs = this._songs.filter((s) => s.id !== id); // Mutate _songs
    return this;
  }

  getLast() {
    return this._songs[this._songs.length - 1]; // Dài dòng
  }

  getSorted() {
    return [...this._songs].sort((a, b) => a.title.localeCompare(b.title)); // Spread để tránh mutate
  }

  getByArtist() {
    return this._songs.reduce((acc, song) => {
      // Dùng reduce để nhóm
      const key = song.artist;
      acc[key] = acc[key] || [];
      acc[key].push(song);
      return acc;
    }, {});
  }
}

// Truy cập được từ ngoài — không an toàn!
const p = new Playlist();
p.add("Hãy Trao", "Sơn Tùng");
p._songs = []; // ❌ Có thể xoá sạch từ ngoài!
p._nextId = 0; // ❌ Có thể reset id từ ngoài!

// ════════════════════════════════
// ES2022–2025 — cải tiến
// ════════════════════════════════

class Playlist {
  #songs = []; // ES2022: Private thật sự, không thể truy cập từ ngoài
  #nextId = 1;

  add(title, artist) {
    this.#songs.push({ id: this.#nextId++, title, artist, liked: false });
    return this;
  }

  remove(id) {
    this.#songs = this.#songs.filter((s) => s.id !== id);
    return this;
  }

  get last() {
    return this.#songs.at(-1); // ES2022: at() thay [length - 1]
  }

  get sorted() {
    return this.#songs.toSorted(
      (
        a,
        b, // ES2023: toSorted() — không mutate
      ) => a.title.localeCompare(b.title),
    );
  }

  get byArtist() {
    return Object.groupBy(this.#songs, (s) => s.artist); // ES2024: groupBy() thay reduce()
  }
}

const p = new Playlist();
p.add("Hãy Trao", "Sơn Tùng");
p.#songs = []; // ❌ SyntaxError — không thể từ ngoài
p.#nextId = 0; // ❌ SyntaxError
```

---

## 4. ES6 vs ES2022–2025 theo từng chủ đề

### Class & Private

```js
// ES6 — "Private" bằng convention, thực ra vẫn public
class Song {
  constructor() {
    this._id = 1; // _ chỉ là "thoả thuận", không enforce
    this._title = "";
  }
}
const s = new Song();
s._id = 999; // ✅ Được — không có gì ngăn cản

// ES2022 — Private thật sự
class Song {
  #id = 1;
  #title = "";
}
const s = new Song();
s.#id = 999; // ❌ SyntaxError — không thể từ ngoài
```

---

### Lấy phần tử cuối mảng

```js
const songs = ["Hãy Trao", "Người Lạ", "Chạy Ngay"];

// ES6
songs[songs.length - 1]; // "Chạy Ngay" — dài dòng
songs[songs.length - 2]; // "Người Lạ"

// ES2022
songs.at(-1); // "Chạy Ngay" — gọn
songs.at(-2); // "Người Lạ"
```

---

### Thao tác mảng không mutate

```js
const songs = ["Hãy Trao", "Người Lạ", "Chạy Ngay"];

// ES6 — sort() mutate gốc, phải spread thủ công
const sorted = [...songs].sort(); // Phải nhớ spread!
songs.reverse(); // ❌ Mutate songs gốc luôn!

// ES2023 — immutable sẵn
const sorted = songs.toSorted(); // songs gốc không đổi
const reversed = songs.toReversed(); // songs gốc không đổi
const updated = songs.with(1, "Pháo"); // Thay index 1, không mutate
```

---

### Nhóm dữ liệu

```js
const songs = [
  { title: "Hãy Trao", artist: "Sơn Tùng" },
  { title: "Người Lạ", artist: "Karik" },
  { title: "Có Chắc", artist: "Sơn Tùng" },
];

// ES6 — reduce() phức tạp
const grouped = songs.reduce((acc, s) => {
  acc[s.artist] = acc[s.artist] || [];
  acc[s.artist].push(s);
  return acc;
}, {});

// ES2024 — một dòng
const grouped = Object.groupBy(songs, (s) => s.artist);
```

---

### Xử lý lỗi

```js
// ES6 — mất thông tin lỗi gốc khi wrap
try {
  await fetch("/api/songs");
} catch (err) {
  throw new Error("Không thể tải"); // Lỗi gốc bị mất!
}

// ES2022 — giữ lại lỗi gốc
try {
  await fetch("/api/songs");
} catch (err) {
  throw new Error("Không thể tải", { cause: err }); // Giữ lỗi gốc
}
```

---

### Promise

```js
// ES6 — tạo Promise
const promise = new Promise((resolve, reject) => {
  // resolve/reject bị kẹt trong closure
  setTimeout(() => resolve("xong"), 1000);
});

// ES2024 — withResolvers() expose ra ngoài
const { promise, resolve, reject } = Promise.withResolvers();
setTimeout(() => resolve("xong"), 1000); // Gọi từ ngoài thoải mái

// ES2025 — Promise.try() bọc cả sync lẫn async
Promise.try(() => syncOrAsyncFunction()) // Không cần biết sync hay async
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
```

---

### Tập hợp Set

```js
const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);

// ES6 — phải viết thủ công
const intersection = new Set([...a].filter((x) => b.has(x))); // { 3, 4 }
const union = new Set([...a, ...b]); // { 1,2,3,4,5,6 }
const difference = new Set([...a].filter((x) => !b.has(x))); // { 1, 2 }

// ES2025 — có sẵn method
a.intersection(b); // { 3, 4 }
a.union(b); // { 1, 2, 3, 4, 5, 6 }
a.difference(b); // { 1, 2 }
a.symmetricDifference(b); // { 1, 2, 5, 6 }
```

---

## 5. Tóm tắt

### ES6 — Nền tảng, bắt buộc phải biết

```
let / const         → thay var
Arrow function      → cú pháp gọn, this không bị mất
Template literal    → `${var}` thay nối chuỗi +
Destructuring       → lấy giá trị từ object/array gọn
Default params      → tham số có giá trị mặc định
Rest / Spread ...   → gom hoặc trải array/object
Class               → OOP cú pháp rõ ràng (nhưng private chưa thật)
Promise             → thay callback hell
import / export     → module system
```

### ES2022–2025 — Cải tiến, giải quyết điểm yếu của ES6

```
#private (2022)         → Private thật sự, ES6 chỉ có _convention
Array.at() (2022)       → Lấy index âm gọn hơn
Error cause (2022)      → Giữ lỗi gốc khi wrap
toSorted/toReversed (2023) → Immutable, ES6 sort() mutate gốc
findLast (2023)         → Tìm từ cuối, ES6 chỉ có findFirst
Object.groupBy (2024)   → Thay reduce() phức tạp của ES6
Promise.withResolvers (2024) → Expose resolve/reject ra ngoài
Set methods (2025)      → Thay spread + filter thủ công của ES6
Promise.try (2025)      → Thống nhất sync/async error handling
Iterator helpers (2025) → Lazy, ES6 phải spread thành mảng trước
```
