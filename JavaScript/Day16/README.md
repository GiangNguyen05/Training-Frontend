# Tài liệu — ES6 Demo App (JS)

## Tổng quan

File JavaScript này là phần logic của một **demo app** minh họa các tính năng ES6 và ES2022. Toàn bộ code chia làm 4 nhóm chức năng:

| Nhóm               | Functions                          | Mục đích                |
| ------------------ | ---------------------------------- | ----------------------- |
| **Helpers**        | `out`, `line`, `fakeDelay`, `show` | Tiện ích dùng chung     |
| **Class & Object** | `es6Add`, `renderEs6`, `es6Remove` | CRUD danh sách học sinh |
| **Destructuring**  | `runDestructure`, `runSpread`      | Demo tách dữ liệu       |
| **Promise/Async**  | `setFetchMode`, `runFetch`         | Demo bất đồng bộ        |

---

## Helper Functions

### `out(id, lines)`

**Mục đích:** Ghi nội dung ra phần tử HTML (output console giả lập).

```js
function out(id, lines) {
  document.getElementById(id).innerHTML = lines
    .map((l) => `<div>${l}</div>`)
    .join("");
}
```

**Tham số:**

| Tham số | Kiểu       | Mô tả                                 |
| ------- | ---------- | ------------------------------------- |
| `id`    | `string`   | ID của phần tử HTML cần ghi           |
| `lines` | `string[]` | Mảng các dòng text (có thể chứa HTML) |

**Cách hoạt động:**

1. Tìm phần tử HTML theo `id`.
2. Map mỗi phần tử trong `lines` thành `<div>...</div>`.
3. Join tất cả lại và gán vào `innerHTML`.

**Ví dụ:**

```js
out("es6-out", ["<span>Dòng 1</span>", "<span>Dòng 2</span>"]);
// → <div><span>Dòng 1</span></div><div><span>Dòng 2</span></div>
```

---

### `line(text, cls)`

**Mục đích:** Tạo chuỗi HTML `<span>` với màu sắc tương ứng loại nội dung — giả lập màu syntax highlight trong console.

```js
function line(text, cls = "") {
  const colors = {
    key: "#93c5fd", // Xanh dương nhạt — tên biến/key
    val: "#fde68a", // Vàng nhạt       — giá trị
    muted: "#6b7280", // Xám             — comment
    err: "#f87171", // Đỏ              — lỗi
    ok: "#86efac", // Xanh lá         — thành công
  };
  return `<span style="color:${colors[cls] || "#86efac"}">${text}</span>`;
}
```

**Tham số:**

| Tham số | Kiểu     | Mặc định | Mô tả                                        |
| ------- | -------- | -------- | -------------------------------------------- |
| `text`  | `string` | —        | Nội dung cần hiển thị                        |
| `cls`   | `string` | `""`     | Loại màu: `key`, `val`, `muted`, `err`, `ok` |

**Bảng màu:**

| `cls`   | Màu               | Dùng cho              |
| ------- | ----------------- | --------------------- |
| `key`   | `#93c5fd` xanh    | Tên biến, tên field   |
| `val`   | `#fde68a` vàng    | Giá trị               |
| `muted` | `#6b7280` xám     | Comment, ghi chú      |
| `err`   | `#f87171` đỏ      | Thông báo lỗi         |
| `ok`    | `#86efac` xanh lá | Thành công (mặc định) |

**Ví dụ:**

```js
line("name", "key"); // <span style="color:#93c5fd">name</span>
line('"An"', "val"); // <span style="color:#fde68a">"An"</span>
line("// comment", "muted"); // <span style="color:#6b7280">// comment</span>
```

> `out` và `line` thường dùng kết hợp với nhau — `line` tạo từng dòng màu, `out` đẩy tất cả ra màn hình.

---

### `fakeDelay(ms, fail)`

**Mục đích:** Giả lập độ trễ mạng bằng `setTimeout` + `Promise`. Dùng để demo async/await mà không cần server thật.

```js
function fakeDelay(ms, fail = false) {
  return new Promise((res, rej) =>
    setTimeout(() => (fail ? rej(new Error("Network Error")) : res()), ms),
  );
}
```

**Tham số:**

| Tham số | Kiểu      | Mặc định | Mô tả                              |
| ------- | --------- | -------- | ---------------------------------- |
| `ms`    | `number`  | —        | Số millisecond chờ                 |
| `fail`  | `boolean` | `false`  | `true` = reject (giả lập lỗi mạng) |

**Trả về:** `Promise<void>`

- Resolve sau `ms` ms nếu `fail = false`
- Reject với `Error("Network Error")` nếu `fail = true`

**Ví dụ:**

```js
await fakeDelay(800); // Chờ 800ms, thành công
await fakeDelay(800, true); // Chờ 800ms, throw Error("Network Error")
```

---

### `show(id)`

**Mục đích:** Điều hướng giữa các section trong app — ẩn section hiện tại, hiện section mới, cập nhật trạng thái active cho nút nav.

```js
function show(id) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));

  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));

  document.getElementById("s-" + id)?.classList.add("active");
  document.querySelector(`[onclick="show('${id}')"]`)?.classList.add("active");
}
```

**Tham số:**

| Tham số | Kiểu     | Mô tả                                           |
| ------- | -------- | ----------------------------------------------- |
| `id`    | `string` | ID của section muốn hiện (không có prefix `s-`) |

**Cách hoạt động:**

1. Xoá class `active` khỏi **tất cả** `.section` → ẩn hết.
2. Xoá class `active` khỏi **tất cả** `.nav-btn` → bỏ highlight tất cả nút.
3. Tìm `#s-{id}` và thêm `active` → hiện section đó.
4. Tìm nút nav có `onclick="show('{id}')"` và thêm `active` → highlight nút đó.

**Ví dụ:**

```js
show("destructure");
// → Hiện #s-destructure, highlight nút nav tương ứng
```

---

## Class Student

**Mục đích:** Blueprint (khuôn mẫu) tạo object học sinh. Dùng ES6 class kết hợp ES2022 private method.

```js
class Student {
  constructor(id, name, score) {
    this.id = id;
    this.name = name;
    this.score = score;
    this.grade = this.#calcGrade(); // ES2022: gọi private method ngay trong constructor
  }

  #calcGrade() {
    // ES2022: private method — chỉ gọi được trong class
    if (this.score >= 9) return "A";
    if (this.score >= 7) return "B";
    if (this.score >= 5) return "C";
    return "F";
  }

  info() {
    // ES6: public method
    return `${this.name} — ${this.score} điểm (${this.grade})`;
  }
}
```

### `constructor(id, name, score)`

Chạy tự động khi gọi `new Student(...)`. Nhận 3 tham số, gán vào `this`, tự tính `grade` qua private method.

| Thuộc tính   | Kiểu     | Nguồn                  |
| ------------ | -------- | ---------------------- |
| `this.id`    | `number` | Tham số truyền vào     |
| `this.name`  | `string` | Tham số truyền vào     |
| `this.score` | `number` | Tham số truyền vào     |
| `this.grade` | `string` | Tính từ `#calcGrade()` |

### `#calcGrade()` — ES2022 Private Method

Tính xếp loại dựa vào `this.score`. **Chỉ gọi được từ bên trong class** — bên ngoài gọi sẽ gặp `SyntaxError`.

```
score >= 9  → "A"
score >= 7  → "B"
score >= 5  → "C"
score < 5   → "F"
```

### `info()` — ES6 Public Method

Trả về chuỗi mô tả học sinh dùng ES6 template literal.

```js
new Student(1, "An", 8.5).info();
// → "An — 8.5 điểm (B)"
```

---

## ES6 Class & Object Functions

### `es6Add()`

**Mục đích:** Đọc dữ liệu từ form, tạo `Student` mới, thêm vào mảng, render lại danh sách và hiện output console.

```js
function es6Add() {
  const name = document.getElementById("es6-name").value.trim();
  const score = parseFloat(document.getElementById("es6-score").value);
  if (!name || isNaN(score)) return; // Validate — dừng nếu input rỗng

  const s = new Student(es6Id++, name, score); // ES6: tạo instance mới
  es6Students.push(s); // Thêm vào mảng state

  const { id, name: n, score: sc, grade } = s; // ES6: destructuring

  renderEs6(); // Cập nhật DOM
  out("es6-out", [
    /* log ra console */
  ]);

  document.getElementById("es6-name").value = ""; // Xoá form
  document.getElementById("es6-score").value = "";
}
```

**Luồng xử lý:**

```
Đọc input → Validate → new Student() → push vào mảng
→ renderEs6() → out() hiện log → Xoá input
```

**State dùng:**

- `es6Students[]` — mảng lưu danh sách học sinh
- `es6Id` — bộ đếm id tự tăng (`let es6Id = 1`)

**Tính năng ES được dùng:**

- ES6: `new Student()`, destructuring `{ id, name: n, ... }`, template literal
- ES2022: `#calcGrade()` private method (gọi gián tiếp qua constructor)

---

### `renderEs6()`

**Mục đích:** Đồng bộ mảng `es6Students[]` với DOM — vẽ lại toàn bộ danh sách học sinh.

```js
function renderEs6() {
  const list = document.getElementById("es6-list");

  if (!es6Students.length) {
    list.innerHTML = '<div class="empty">Trống</div>';
    return;
  }

  list.innerHTML = es6Students
    .map(
      (s, i) => `
      <div class="list-item">
        <span class="list-num">${String(i + 1).padStart(2, "0")}</span>
        <div class="list-main">
          <div class="list-title">${s.name}</div>
          <div class="list-sub">${s.score} điểm · Xếp loại ${s.grade}</div>
        </div>
        <button class="btn outline sm" onclick="es6Remove(${s.id})">✕</button>
      </div>`,
    )
    .join("");
}
```

**Cách hoạt động:**

1. Nếu mảng rỗng → hiện "Trống".
2. Map từng `Student` thành HTML string.
3. `padStart(2, "0")` → số thứ tự 2 chữ số: `01`, `02`...
4. Join tất cả và gán vào `innerHTML`.

> Mỗi nút `✕` gắn `onclick="es6Remove(s.id)"` để xoá đúng học sinh khi click.

---

### `es6Remove(id)`

**Mục đích:** Xoá học sinh khỏi mảng theo `id`, render lại danh sách.

```js
function es6Remove(id) {
  const i = es6Students.findIndex((s) => s.id === id); // Tìm vị trí
  if (i !== -1) es6Students.splice(i, 1); // Xoá khỏi mảng
  renderEs6(); // Cập nhật DOM
}
```

**Tại sao dùng `findIndex` + `splice` thay vì `filter`?**

- `filter` tạo mảng mới — không sửa `es6Students` gốc.
- `findIndex` + `splice` sửa trực tiếp mảng gốc — phù hợp vì `es6Students` là state shared.

---

## ES6 Destructuring & Spread Functions

### `runDestructure()`

**Mục đích:** Đọc JSON từ input, dùng ES6 object destructuring để tách `name`, `score` và gom phần còn lại vào `...rest`. Hiện kết quả ra console.

```js
function runDestructure() {
  try {
    const raw =
      document.getElementById("d-json").value ||
      '{"name":"An","score":8.5,"class":"12A"}';

    const obj = JSON.parse(raw); // Parse JSON string → object

    // ES6: Object destructuring với default value + rest
    const { name = "Unknown", score = 0, ...rest } = obj;

    out("d-out", [
      line(`// Object destructuring + rest`, "muted"),
      `${line("name", "key")}: ${line(`"${name}"`, "val")}`,
      `${line("score", "key")}: ${line(score, "val")}`,
      `${line("...rest", "key")}: ${line(JSON.stringify(rest), "val")}`,
    ]);
  } catch {
    out("d-out", [line("// JSON không hợp lệ", "err")]);
  }
}
```

**Các tính năng ES6 được demo:**

| Cú pháp                | Ý nghĩa                                   |
| ---------------------- | ----------------------------------------- |
| `const { name } = obj` | Lấy field `name` từ object                |
| `name = "Unknown"`     | Giá trị mặc định nếu `name` không tồn tại |
| `...rest`              | Gom tất cả field còn lại vào object mới   |

**Ví dụ với input `{"name":"An","score":8.5,"class":"12A"}`:**

```
name:    "An"
score:   8.5
...rest: {"class":"12A"}
```

**Xử lý lỗi:** Bọc trong `try/catch` — nếu JSON không hợp lệ hiện thông báo lỗi.

---

### `runSpread()`

**Mục đích:** Đọc danh sách tên từ input (cách nhau bằng dấu phẩy), demo ES6 array destructuring với rest và spread operator.

```js
function runSpread() {
  const raw = document.getElementById("s-input").value || "An, Bình, Chi";
  const names = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // ES6: Array destructuring + rest
  const [first, second, ...others] = names;

  out("s-out", [
    line(`// Array destructuring + rest`, "muted"),
    `${line("first", "key")}: ${line(`"${first}"`, "val")}`,
    `${line("second", "key")}: ${line(`"${second}"`, "val")}`,
    `${line("...others", "key")}: ${line(JSON.stringify(others), "val")}`,
    line(`// Spread để merge`, "muted"),
    `${line("merged", "key")}: ${line(JSON.stringify([...names, "Dũng", "Em"]), "val")}`,
  ]);
}
```

**Các tính năng ES6 được demo:**

| Cú pháp                                    | Ý nghĩa                             |
| ------------------------------------------ | ----------------------------------- |
| `const [first, second, ...others] = names` | Lấy 2 phần tử đầu, gom phần còn lại |
| `[...names, "Dũng", "Em"]`                 | Spread mảng cũ + thêm phần tử mới   |

**Ví dụ với input `"An, Bình, Chi, Dũng"`:**

```
first:     "An"
second:    "Bình"
...others: ["Chi", "Dũng"]
merged:    ["An", "Bình", "Chi", "Dũng", "Dũng", "Em"]
```

---

## ES6 Promise & Async Functions

### `setFetchMode(m, btn)`

**Mục đích:** Lưu chế độ fetch hiện tại vào biến `fetchMode` và cập nhật trạng thái active cho tab button.

```js
let fetchMode = "ok"; // State: "ok" | "fail" | "multi"

function setFetchMode(m, btn) {
  fetchMode = m; // Lưu chế độ mới

  document
    .querySelectorAll("#s-promise-es6 .tab")
    .forEach((t) => t.classList.remove("active")); // Bỏ active tất cả tab

  btn.classList.add("active"); // Active tab được chọn
}
```

**Các chế độ:**

| `fetchMode` | Mô tả                                               |
| ----------- | --------------------------------------------------- |
| `"ok"`      | Giả lập request thành công sau 800ms                |
| `"fail"`    | Giả lập request thất bại (Network Error)            |
| `"multi"`   | Giả lập 3 requests chạy song song với `Promise.all` |

---

### `runFetch()` — async function

**Mục đích:** Demo async/await và Promise.all. Chạy theo `fetchMode` hiện tại, hiện từng bước thực thi ra console.

```js
async function runFetch() {
  const btn = document.getElementById("fetch-btn");
  btn.disabled = true; // Khoá nút trong lúc chờ
  btn.textContent = "⏳";
  const logs = [];

  try {
    if (fetchMode === "multi") {
      // Promise.all — 3 requests chạy CÙNG LÚC
      logs.push(line(`// Promise.all — 3 requests song song`, "muted"));
      const [r1, r2, r3] = await Promise.all([
        fakeDelay(400),
        fakeDelay(600),
        fakeDelay(300),
      ]);
      logs.push(line(`✓ Tất cả xong!`, "ok"));
    } else {
      // Một request thường — thành công hoặc thất bại
      const fail = fetchMode === "fail";
      await fakeDelay(800, fail); // Chờ 800ms

      logs.push(line(`✓ Response OK`, "ok"));
      logs.push(
        `${line("data", "key")}: ${line('{ id:1, name:"An" }', "val")}`,
      );
    }
  } catch (err) {
    logs.push(line(`✗ catch: ${err.message}`, "err")); // Bắt lỗi
  } finally {
    logs.push(line(`// finally — luôn chạy`, "muted")); // Luôn chạy
    btn.disabled = false;
    btn.textContent = "▶ Run";
  }

  out("fetch-out", logs); // Hiện toàn bộ log
}
```

**Luồng thực thi theo từng chế độ:**

**Mode `ok`:**

```
btn disabled → await fakeDelay(800) → log "✓ OK" → finally → btn enabled
```

**Mode `fail`:**

```
btn disabled → await fakeDelay(800, true) → throw Error → catch log lỗi → finally → btn enabled
```

**Mode `multi`:**

```
btn disabled → Promise.all([400ms, 600ms, 300ms]) chạy song song
→ chờ cái lâu nhất (600ms) → log "✓ Tất cả xong!" → finally → btn enabled
```

**Tính năng ES được demo:**

| Tính năng           | Dùng ở đâu                                    |
| ------------------- | --------------------------------------------- |
| `async function`    | Khai báo hàm async                            |
| `await`             | Chờ `fakeDelay()` resolve                     |
| `try/catch/finally` | Xử lý lỗi, luôn reset UI                      |
| `Promise.all`       | Chạy 3 requests song song                     |
| Array destructuring | `const [r1, r2, r3] = await Promise.all(...)` |

---

## Luồng dữ liệu tổng thể

```
User tương tác (click, nhập form)
        │
        ▼
Function đọc DOM (getElementById, value)
        │
        ▼
Xử lý logic (tạo object, filter, async...)
        │
        ├─ Cập nhật STATE (es6Students[], fetchMode)
        │
        ├─ Cập nhật DOM (renderEs6(), show())
        │
        └─ Hiện output log (out() + line())
```

### Quan hệ giữa các functions

```
show()          ← Điều hướng sections

es6Add()
  ├─ new Student()     ← Tạo object
  ├─ es6Students.push  ← Cập nhật state
  ├─ renderEs6()       ← Cập nhật DOM
  └─ out() + line()    ← Hiện log

runDestructure() → out() + line()
runSpread()      → out() + line()

runFetch()
  ├─ fakeDelay()  ← Giả lập API call
  └─ out() + line() ← Hiện log
```

### State (biến toàn cục)

| Biến          | Kiểu        | Mô tả                  |
| ------------- | ----------- | ---------------------- |
| `es6Students` | `Student[]` | Danh sách học sinh     |
| `es6Id`       | `number`    | ID tự tăng cho Student |
| `fetchMode`   | `string`    | Chế độ fetch hiện tại  |
