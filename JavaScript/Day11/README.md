# Tổng kết — Fetch API, Async và Await

- Theo demo App Day10

## Mục lục

1. [Fetch API](#1-fetch-api)
2. [Async](#2-async)
3. [Await](#3-await)
4. [try / catch / finally](#4-try--catch--finally)
5. [Ứng dụng vào Playlist](#5-ứng-dụng-vào-playlist)
6. [Những lỗi hay gặp](#6-những-lỗi-hay-gặp)
7. [Tóm tắt nhanh](#7-tóm-tắt-nhanh)

---

## 1. Fetch API

### Fetch API là gì?

`fetch()` là hàm có sẵn trong trình duyệt, dùng để **gửi HTTP request** đến server và nhận phản hồi. Nó thay thế `XMLHttpRequest` cũ với cú pháp đơn giản hơn và trả về **Promise**.

```js
fetch(url, options);
// Trả về Promise<Response>
```

---

### Cấu trúc đầy đủ

```js
const response = await fetch("http://localhost:3000/playlist", {
  method: "POST", // Loại HTTP request
  headers: { "Content-Type": "application/json" }, // Header — khai báo kiểu dữ liệu
  body: JSON.stringify({ title: "Bài hát A" }), // Body — dữ liệu gửi lên
});
```

**Giải thích từng phần:**

| Phần      | Giá trị                                  | Ghi chú                              |
| --------- | ---------------------------------------- | ------------------------------------ |
| `url`     | `'http://localhost:3000/playlist'`       | Địa chỉ endpoint                     |
| `method`  | `'GET'` `'POST'` `'PUT'` `'DELETE'`      | Mặc định là `GET` nếu không truyền   |
| `headers` | `{ 'Content-Type': 'application/json' }` | Bắt buộc khi gửi JSON                |
| `body`    | `JSON.stringify({ ... })`                | Phải là string, chỉ có ở POST và PUT |

---

### Response object

`fetch()` không trả về dữ liệu ngay mà trả về một **Response object**. Phải gọi thêm `.json()` để lấy dữ liệu:

```js
const response = await fetch("http://localhost:3000/playlist");

response.ok; // true nếu status 200–299, false nếu 400, 404, 500...
response.status; // Mã HTTP: 200, 201, 404, 500...

const data = await response.json(); // Parse body thành JS object/array
```

---

### Bốn method trong ứng dụng Playlist

**GET — lấy toàn bộ danh sách:**

```js
const response = await fetch("http://localhost:3000/playlist");
// Không cần method, headers, body
// Server trả về mảng: [{ id:1, title:"..." }, ...]

const songs = await response.json();
```

**POST — thêm bài hát mới:**

```js
const response = await fetch("http://localhost:3000/playlist", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, artist, album, year }),
  // Không cần truyền id — json-server tự sinh
});

const newSong = await response.json();
// Server trả về object vừa tạo kèm id: { id:5, title:"...", ... }
```

**PUT — cập nhật bài hát:**

```js
const response = await fetch(`http://localhost:3000/playlist/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, artist, album, year }),
  // PUT thay thế TOÀN BỘ object → phải truyền đủ tất cả field
});

const updated = await response.json();
// Server trả về object đã cập nhật
```

**DELETE — xoá bài hát:**

```js
const response = await fetch(`http://localhost:3000/playlist/${id}`, {
  method: "DELETE",
  // Không cần headers hay body
});
// Server trả về {} hoặc { ok: true }
```

---

### Tại sao phải kiểm tra `response.ok`?

`fetch()` **chỉ throw lỗi khi mất mạng hoàn toàn**. Với lỗi HTTP như 404, 500 — nó vẫn resolve bình thường. Nếu không kiểm tra, code sẽ tiếp tục chạy dù server báo lỗi:

```js
// ❌ Sai — server trả 404 nhưng vẫn tiếp tục parse, gây bug ngầm
const response = await fetch("http://localhost:3000/playlist/999");
const data = await response.json(); // Chạy dù 404!

// ✅ Đúng — kiểm tra trước khi parse
const response = await fetch("http://localhost:3000/playlist/999");

if (!response.ok) {
  throw new Error(`HTTP ${response.status}`); // Ném lỗi thủ công
}

const data = await response.json();
```

---

### `JSON.stringify` và `response.json()`

```js
// JSON.stringify — chuyển JS object → string để gửi lên server
const body = JSON.stringify({ title: "Bài hát", year: 2024 });
// → '{"title":"Bài hát","year":2024}'

// response.json() — chuyển string từ server → JS object
const data = await response.json();
// '{"id":5,"title":"Bài hát"}' → { id: 5, title: "Bài hát" }
```

> `body` của fetch **chỉ nhận string**, nên phải `JSON.stringify()` trước khi gửi.
> `response.json()` là **async** vì phải đọc toàn bộ body stream — nên phải `await`.

---

## 2. Async

### `async` là gì?

`async` là từ khoá đặt trước `function` để biến nó thành **async function**. Khi đó hàm có hai đặc điểm:

1. **Luôn trả về Promise** dù bạn không viết `return Promise`.
2. **Cho phép dùng `await`** bên trong thân hàm.

```js
async function loadSongs() {
  // Có thể dùng await ở đây
}
```

---

### Async function luôn trả về Promise

```js
// Khai báo async
async function layTen() {
  return "Sơn Tùng";
}

// Hoàn toàn tương đương với:
function layTen() {
  return Promise.resolve("Sơn Tùng");
}

// Cách gọi — phải dùng .then() hoặc await
layTen().then((name) => console.log(name)); // "Sơn Tùng"

// Hoặc
const name = await layTen(); // "Sơn Tùng"
```

---

### `await` chỉ dùng được bên trong `async`

```js
// ❌ Lỗi SyntaxError — await ngoài async function
function thuong() {
  const songs = await fetch('http://localhost:3000/playlist'); // Lỗi!
}

// ✅ Đúng — khai báo async trước
async function loadSongs() {
  const response = await fetch('http://localhost:3000/playlist'); // OK
}
```

---

### Các cách khai báo async function

```js
// Function declaration
async function loadSongs() { ... }

// Function expression
const loadSongs = async function() { ... }

// Arrow function
const loadSongs = async () => { ... }

// Method trong object
const api = {
  async getAll() { ... }
}
```

---

## 3. Await

### `await` là gì?

`await` đặt trước một **Promise**. Nó **tạm dừng hàm hiện tại**, chờ Promise đó resolve, rồi trả về giá trị kết quả.

```js
const result = await somePromise;
// result = giá trị khi Promise resolve
```

---

### Await không block cả trang

Đây là điểm quan trọng nhất. `await` chỉ dừng **hàm chứa nó** — không dừng JavaScript hay trình duyệt:

```js
async function loadSongs() {
  console.log("1 — Gửi request");

  const response = await fetch("http://localhost:3000/playlist");
  // Hàm loadSongs() dừng ở đây, chờ ~300ms
  // Nhưng trình duyệt vẫn hoạt động — user scroll, click vẫn được

  console.log("2 — Nhận response");

  const songs = await response.json();
  // Dừng thêm vài ms để parse JSON

  console.log("3 — Có dữ liệu:", songs.length);
}

loadSongs();
console.log("4 — Chạy ngay, không chờ loadSongs()");

// Output thực tế:
// 1 — Gửi request
// 4 — Chạy ngay, không chờ loadSongs()   ← không bị block!
//   ... (sau ~300ms) ...
// 2 — Nhận response
// 3 — Có dữ liệu: 4
```

---

### Await nhiều lần trong một hàm

Mỗi `await` chờ xong rồi mới chạy tiếp — theo thứ tự từ trên xuống:

```js
async function deleteSong(id) {
  // await 1 — gọi API xoá, chờ server xác nhận (~300ms)
  const response = await fetch(`http://localhost:3000/playlist/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  // Kích hoạt animation CSS slideOut
  item.classList.add("removing");

  // await 2 — chờ animation CSS chạy xong (220ms)
  // Nếu không await thì DOM xoá ngay, animation không thấy
  await new Promise((resolve) => setTimeout(resolve, 220));

  // Chỉ chạy sau khi cả hai await xong
  songs = songs.filter((s) => s.id !== id);
  render();
}
```

Dòng thời gian:

```
deleteSong(3)
  │
  ├─ await fetch DELETE    ← dừng ~300ms
  │         ↓
  ├─ item.classList.add('removing')   ← animation bắt đầu
  │
  ├─ await delay(220)      ← dừng 220ms chờ animation
  │         ↓
  ├─ songs.filter(...)
  └─ render()
```

---

### Await tuần tự vs song song

Khi await nhiều tác vụ **không phụ thuộc nhau**, chạy tuần tự sẽ lãng phí thời gian:

```js
// ❌ Tuần tự — mất ~900ms (300 + 300 + 300)
async function loadAll() {
  const songs = await fetch("/playlist").then((r) => r.json()); // Chờ 300ms
  const users = await fetch("/users").then((r) => r.json()); // Chờ thêm 300ms
  const blogs = await fetch("/blogs").then((r) => r.json()); // Chờ thêm 300ms
}

// ✅ Song song với Promise.all — mất ~300ms (tất cả chạy cùng lúc)
async function loadAll() {
  const [songs, users, blogs] = await Promise.all([
    fetch("/playlist").then((r) => r.json()),
    fetch("/users").then((r) => r.json()),
    fetch("/blogs").then((r) => r.json()),
  ]);
}
```

**Khi nào dùng tuần tự, khi nào dùng song song:**

```js
// Tuần tự — khi bước sau cần kết quả bước trước
const user = await fetch("/users/1").then((r) => r.json());
const posts = await fetch(`/posts?userId=${user.id}`).then((r) => r.json());
//                                          ↑ cần user.id trước

// Song song — khi các tác vụ độc lập nhau
const [songs, users] = await Promise.all([
  fetch("/playlist").then((r) => r.json()),
  fetch("/users").then((r) => r.json()),
]);
```

---

## 4. try / catch / finally

### Tổng quan

```js
async function addSong() {
  try {
    // Code chạy bình thường
    // Mọi lỗi từ await bên trong đều bị bắt ở đây
    const response = await fetch(API_URL, { ... });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const newSong = await response.json();
    songs.push(newSong);
    render();

  } catch (err) {
    // Chạy khi có lỗi — mất mạng, server lỗi, throw thủ công
    console.error(err.message);
    toast(err.message, 'err');

  } finally {
    // LUÔN chạy — dù thành công hay lỗi
    // Dùng để reset UI, tắt loading, enable button
    btn.disabled = false;
    btn.textContent = '+ Thêm bài hát';
  }
}
```

---

### `try` — khối thực thi chính

Chứa toàn bộ logic. Nếu **bất kỳ dòng nào** throw lỗi (kể cả từ `await`), code nhảy ngay xuống `catch`, bỏ qua các dòng còn lại trong `try`:

```js
try {
  const response = await fetch(API_URL, options); // Nếu lỗi ở đây...
  if (!response.ok) throw new Error('HTTP 404');  // ...hoặc ở đây...
  const data = await response.json();             // ...dòng này không chạy
  songs.push(data);                               // ...dòng này cũng không
}
```

---

### `catch` — xử lý lỗi

Nhận đối tượng `Error` với thuộc tính `.message`:

```js
catch (err) {
  // err.message — mô tả lỗi
  // err.name    — loại lỗi (TypeError, RangeError...)
  // err.stack   — stack trace để debug

  console.error('Lỗi:', err.message);
  toast(err.message, 'err');
  setStatus('error', err.message);
}
```

Các lỗi thường gặp trong ứng dụng Playlist:

| `err.message`      | Nguyên nhân                     |
| ------------------ | ------------------------------- |
| `Failed to fetch`  | json-server chưa chạy, sai port |
| `HTTP 404`         | id không tồn tại trong db.json  |
| `HTTP 500`         | Lỗi nội bộ server               |
| `Unexpected token` | Server không trả về JSON hợp lệ |

---

### `finally` — luôn chạy

Không cần biết thành công hay thất bại, `finally` **luôn chạy**. Dùng để dọn dẹp UI:

```js
async function addSong() {
  btn.disabled = true; // Bật loading trước

  try {
    await fetch(API_URL, options);
    toast("Thêm thành công ✓");
    // btn vẫn disabled nếu không có finally!
  } catch (err) {
    toast(err.message, "err");
    // btn vẫn disabled nếu không có finally!
  } finally {
    btn.disabled = false; // Luôn tắt loading dù kết quả thế nào
  }
}
```

---

## 5. Ứng dụng vào Playlist

Toàn bộ 4 chức năng của ứng dụng đều theo cùng một pattern:

```
async function → setStatus loading
               → try: await fetch → check ok → await .json() → update state → render
               → catch: toast lỗi
               → finally: reset UI
```

### loadSongs — GET

```js
async function loadSongs() {
  setStatus("loading", `GET ${API_URL}`, "GET");

  try {
    const response = await fetch(API_URL); // Không cần options
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    songs = await response.json(); // Gán thẳng vào state
    setStatus("ok", `Đã tải ${songs.length} bài hát`, "GET");
    render();
  } catch (err) {
    setStatus("error", err.message, "GET");
    toast("Không thể kết nối. json-server đã chạy chưa?", "err");
  }
  // Không cần finally — không có loading UI cần reset
}
```

### addSong — POST

```js
async function addSong() {
  if (!title) return; // Validate trước — không cần API
  btn.disabled = true;
  setStatus("loading", `POST ${API_URL}`, "POST");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, artist, album, year }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const newSong = await response.json(); // Server trả về object có id
    songs.push(newSong); // Thêm vào cuối mảng
    render();
    clearForm();
    toast(`Đã thêm "${newSong.title}" ✓`);
  } catch (err) {
    toast("Không thể thêm bài hát", "err");
  } finally {
    btn.disabled = false; // Luôn bật lại nút
    btn.textContent = "+ Thêm bài hát";
  }
}
```

### saveSong — PUT

```js
async function saveSong(id) {
  if (!title) return;
  item.classList.add("shimmer");
  setStatus("loading", `PUT ${API_URL}/${id}`, "PUT");

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, artist, album, year }),
      // PUT thay toàn bộ → phải truyền ĐỦ field
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const updated = await response.json();
    const idx = songs.findIndex((s) => s.id === id);
    songs[idx] = updated; // Thay đúng phần tử, không push thêm
    editingId = null;
    render();
    toast(`Đã lưu "${updated.title}" ✓`);
  } catch (err) {
    toast("Không thể lưu thay đổi", "err");
    item.classList.remove("shimmer");
  }
}
```

### deleteSong — DELETE

```js
async function deleteSong(id) {
  item.classList.add("shimmer");
  setStatus("loading", `DELETE ${API_URL}/${id}`, "DELETE");

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE", // Không cần headers hay body
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    item.classList.add("removing");
    await new Promise((r) => setTimeout(r, 220)); // Chờ animation xong

    songs = songs.filter((s) => s.id !== id); // Xoá khỏi mảng
    render();
    toast(`Đã xoá "${song.title}"`);
  } catch (err) {
    toast("Không thể xoá bài hát", "err");
    item.classList.remove("shimmer");
  }
}
```

---

## 6. Những lỗi hay gặp

### Quên `await` trước fetch

```js
// ❌ Thiếu await — response là Promise, không phải Response
async function loadSongs() {
  const response = fetch(API_URL); // Thiếu await!
  const songs = response.json(); // Lỗi: response.json is not a function
}

// ✅ Đúng
async function loadSongs() {
  const response = await fetch(API_URL);
  const songs = await response.json();
}
```

---

### Quên `await` trước `.json()`

```js
// ❌ Thiếu await — data là Promise, không phải object
async function addSong() {
  const response = await fetch(API_URL, options);
  const data = response.json(); // Thiếu await!
  songs.push(data); // data là Promise, không phải bài hát!
}

// ✅ Đúng
async function addSong() {
  const response = await fetch(API_URL, options);
  const data = await response.json();
  songs.push(data); // { id: 5, title: "..." }
}
```

---

### Không kiểm tra `response.ok`

```js
// ❌ Server trả 404, nhưng code vẫn chạy tiếp gây bug ngầm
async function deleteSong(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  songs = songs.filter((s) => s.id !== id); // Xoá dù server báo 404!
}

// ✅ Kiểm tra trước khi xử lý
async function deleteSong(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  songs = songs.filter((s) => s.id !== id); // Chỉ xoá khi server xác nhận
}
```

---

### Thiếu `finally` — nút bị kẹt

```js
// ❌ Khi API lỗi, nút bị disable mãi mãi
async function addSong() {
  btn.disabled = true;
  try {
    await fetch(API_URL, options);
    btn.disabled = false; // Chỉ chạy khi thành công!
  } catch (err) {
    toast(err.message, "err");
    // btn vẫn disabled — user không thể thêm bài nữa!
  }
}

// ✅ finally đảm bảo nút luôn được bật lại
async function addSong() {
  btn.disabled = true;
  try {
    await fetch(API_URL, options);
  } catch (err) {
    toast(err.message, "err");
  } finally {
    btn.disabled = false; // Luôn chạy
  }
}
```

---

### Dùng `await` ngoài `async function`

```js
// ❌ Lỗi SyntaxError
function loadSongs() {
  const response = await fetch(API_URL); // Không thể dùng await!
}

// ✅ Phải khai báo async
async function loadSongs() {
  const response = await fetch(API_URL);
}
```

---

## 7. Tóm tắt nhanh

### Fetch API

```
fetch(url)                          → GET request
fetch(url, { method: 'POST', ... }) → POST request
fetch(url, { method: 'PUT', ... })  → PUT request
fetch(url, { method: 'DELETE' })    → DELETE request

response.ok     → true nếu status 200-299
response.status → mã HTTP (200, 201, 404, 500...)
response.json() → async, trả về JS object/array
```

### Async / Await

```
async function      → luôn trả về Promise, cho phép dùng await
await somePromise   → dừng hàm, chờ Promise, lấy giá trị
                      (chỉ dùng được bên trong async function)
try { }             → code thực thi, bắt lỗi từ mọi await bên trong
catch (err) { }     → xử lý lỗi, hiện thông báo
finally { }         → luôn chạy, dùng để reset UI
```

### 6 Quy tắc vàng

```
1. fetch không tự throw lỗi HTTP → luôn kiểm tra response.ok
2. response.json() là async → phải await
3. body của fetch phải là string → JSON.stringify() trước khi gửi
4. await chỉ dùng được trong async function
5. finally để reset UI → nút không bao giờ bị kẹt disabled
6. await chỉ dừng hàm chứa nó, không dừng cả trang
```
