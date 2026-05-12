# Tài liệu TodoList — Async/Await trong JavaScript

## Mục lục

1. [Tổng quan ứng dụng](#1-tổng-quan-ứng-dụng)
2. [Cấu trúc dự án](#2-cấu-trúc-dự-án)
3. [Fake API](#3-fake-api)
4. [Đồng bộ vs Bất đồng bộ](#4-đồng-bộ-vs-bất-đồng-bộ)
5. [Async/Await — Giải thích chi tiết](#5-asyncawait--giải-thích-chi-tiết)
6. [Các chức năng chính](#6-các-chức-năng-chính)
7. [Xử lý lỗi](#7-xử-lý-lỗi)
8. [Luồng thực thi](#8-luồng-thực-thi)
9. [Bảng tổng kết](#9-bảng-tổng-kết)

---

## 1. Tổng quan ứng dụng

Ứng dụng TodoList đơn giản minh họa sự khác biệt giữa **đồng bộ (sync)** và **bất đồng bộ (async)** trong JavaScript thông qua các thao tác thêm, sửa, xoá todo.

**Tính năng:**

- Thêm todo mới
- Sửa nội dung todo
- Xoá todo
- Đánh dấu hoàn thành
- Lọc theo trạng thái
- Chuyển đổi giữa Sync mode và Async/Await mode

---

## 2. Cấu trúc dự án

```
todolist/
├── index.html       ← Giao diện + toàn bộ logic
│
├── Phần API (fake)  ← Giả lập server, delay 800ms
├── Phần State       ← Mảng todos[], filter, useAsync flag
├── Phần Render      ← Hiển thị danh sách lên DOM
└── Phần Actions     ← addTodo, saveEdit, deleteTodo, toggleTodo
```

Dự án dùng **1 file HTML duy nhất**, không cần framework hay build tool. Toàn bộ logic nằm trong thẻ `<script>`.

---

## 3. Fake API

Vì không có server thật, ứng dụng dùng một **Fake API** giả lập độ trễ mạng bằng `setTimeout` + `Promise`.

```js
const API = {
  // Lấy tất cả todo (delay 800ms)
  getAll: () =>
    new Promise((resolve) => {
      setTimeout(() => resolve([...db]), 800);
    }),

  // Tạo todo mới (delay 800ms)
  create: (text) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const todo = { id: nextId++, text, done: false };
        db.push(todo);
        resolve(todo);
      }, 800);
    }),

  // Cập nhật todo (delay 800ms)
  update: (id, changes) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const i = db.findIndex((t) => t.id === id);
        if (i === -1) return reject(new Error("Không tìm thấy todo"));
        Object.assign(db[i], changes);
        resolve({ ...db[i] });
      }, 800);
    }),

  // Xoá todo (delay 800ms)
  delete: (id) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const i = db.findIndex((t) => t.id === id);
        if (i === -1) return reject(new Error("Không tìm thấy todo"));
        db.splice(i, 1);
        resolve({ ok: true });
      }, 800);
    }),
};
```

**Tại sao dùng Fake API?**

Trong thực tế, mọi thao tác với server đều tốn thời gian (vài trăm ms đến vài giây). Fake API giúp bạn:

- Thấy được luồng async thực sự (loading, delay, kết quả)
- Luyện tập xử lý bất đồng bộ mà không cần server thật
- Dễ dàng mô phỏng lỗi để test error handling

---

## 4. Đồng bộ vs Bất đồng bộ

### Đồng bộ (Sync)

Code chạy từng dòng một, dòng sau phải chờ dòng trước hoàn thành. Không gọi API.

```js
// SYNC — thêm todo ngay lập tức, không có delay
function addTodoSync(text) {
  const todo = { id: nextId++, text, done: false };

  todos.push(todo); // Xong ngay
  render(); // Render ngay
  console.log("Xong!"); // Chạy ngay sau push
}

// Thứ tự thực thi:
// 1. todos.push(todo)  ← chạy
// 2. render()          ← chạy
// 3. console.log(...)  ← chạy
// → Tổng thời gian: ~0ms
```

### Bất đồng bộ (Async)

Code không chờ tác vụ chậm. JavaScript tiếp tục chạy, khi tác vụ xong thì nhận kết quả.

```js
// ASYNC — gọi API, chờ server, rồi mới cập nhật
async function addTodoAsync(text) {
  const todo = { id: nextId++, text, done: false };

  console.log("Bắt đầu gọi API...");

  const saved = await API.create(text); // Dừng ở đây, chờ 800ms

  todos.push(saved); // Chạy sau khi API trả về
  render();

  console.log("Xong!");
}

// Thứ tự thực thi:
// 1. console.log("Bắt đầu gọi API...")  ← chạy ngay
// 2. await API.create(text)              ← dừng lại, chờ 800ms
//    (trong 800ms, JavaScript làm việc khác được)
// 3. todos.push(saved)                   ← chạy sau 800ms
// 4. render()                            ← chạy
// 5. console.log("Xong!")               ← chạy
// → Tổng thời gian: ~800ms
```

### So sánh trực quan

```
SYNC:
────────────────────────────────
addTodo → push → render → done
[0ms]    [0ms]  [0ms]    [~0ms]

ASYNC:
────────────────────────────────────────────────────────
addTodo → gọi API ··· (chờ 800ms) ··· → push → render → done
[0ms]    [0ms]                          [800ms]           [~802ms]
                ↑
         JavaScript vẫn có thể xử lý việc khác ở đây
```

---

## 5. Async/Await — Giải thích chi tiết

### 5.1 Async/Await là gì?

`async/await` là cú pháp JavaScript (ra mắt ES2017) giúp viết code bất đồng bộ trông giống như code đồng bộ. Bên dưới nó vẫn dùng **Promise**.

```js
// Trước đây — Promise với .then()
function layTodo() {
  return API.getAll()
    .then((data) => {
      todos = data;
      render();
    })
    .catch((err) => {
      console.error(err);
    });
}

// Bây giờ — async/await, dễ đọc hơn nhiều
async function layTodo() {
  try {
    const data = await API.getAll();
    todos = data;
    render();
  } catch (err) {
    console.error(err);
  }
}
```

Cả hai đoạn code trên làm **y chang nhau**, chỉ khác về cách viết.

---

### 5.2 Từ khoá `async`

Khi thêm `async` trước function, hai điều xảy ra:

**1. Hàm luôn trả về một Promise:**

```js
async function xinChao() {
  return "Hello";
}

// Tương đương:
function xinChao() {
  return Promise.resolve("Hello");
}

// Cách dùng:
xinChao().then((val) => console.log(val)); // "Hello"
```

**2. Cho phép dùng `await` bên trong:**

```js
async function layDuLieu() {
  const result = await API.getAll(); // Chỉ dùng được trong async function
  return result;
}
```

> `await` **không thể dùng** bên ngoài `async function` (ở top-level thông thường). Nếu dùng sai sẽ gặp lỗi `SyntaxError`.

---

### 5.3 Từ khoá `await`

`await` đặt trước một Promise. Nó **tạm dừng hàm hiện tại** và chờ Promise đó resolve, rồi trả về giá trị.

```js
async function vi_du() {
  console.log("1 — trước await");

  const result = await API.create("Học JS"); // Dừng ở đây ~800ms

  console.log("2 — sau await, result =", result);
  // result = { id: 3, text: "Học JS", done: false }
}

vi_du();
console.log("3 — ngoài hàm, chạy ngay");

// Output thực tế:
// 1 — trước await
// 3 — ngoài hàm, chạy ngay    ← Không bị block!
// 2 — sau await, result = ...  ← Sau ~800ms
```

**Điểm quan trọng:** `await` chỉ dừng **hàm đó**, không dừng toàn bộ chương trình. JavaScript vẫn tiếp tục chạy code khác trong lúc chờ.

---

### 5.4 try / catch / finally

Khi dùng `async/await`, xử lý lỗi bằng `try/catch` quen thuộc — không cần `.catch()` của Promise.

```js
async function addTodo(text) {
  try {
    // Mọi lỗi trong khối này đều bị bắt
    const saved = await API.create(text); // Nếu API lỗi → nhảy xuống catch
    todos.push(saved);
    render();
  } catch (err) {
    // Chạy khi có lỗi (network error, server error, v.v.)
    console.error("Lỗi:", err.message);
    toast("Không thể thêm todo", true);
  } finally {
    // Luôn chạy dù thành công hay thất bại
    btn.disabled = false;
    btn.textContent = "+ Thêm";
  }
}
```

Trong ứng dụng TodoList, `finally` được dùng để **luôn tắt trạng thái loading** dù kết quả ra sao:

```js
async function addTodo(text) {
  btn.disabled = true; // Bật loading
  btn.textContent = "⏳";

  try {
    await API.create(text);
    // ... xử lý thành công
  } catch (err) {
    // ... xử lý lỗi
  } finally {
    btn.disabled = false; // Tắt loading — LUÔN chạy
    btn.textContent = "+ Thêm";
  }
}
```

> Nếu không có `finally`, khi API lỗi thì nút sẽ bị disable mãi mãi — đây là lỗi UI phổ biến.

---

### 5.5 Await tuần tự vs song song

Đây là điểm dễ nhầm nhất khi dùng async/await.

**Tuần tự (chậm) — mỗi await chờ cái trước:**

```js
async function tuanTu() {
  const user = await API.getUser(1); // Chờ 500ms
  const posts = await API.getPosts(1); // Chờ thêm 500ms
  const orders = await API.getOrders(1); // Chờ thêm 500ms
  // Tổng: ~1500ms
}
```

**Song song (nhanh) — dùng Promise.all:**

```js
async function songSong() {
  const [user, posts, orders] = await Promise.all([
    API.getUser(1), // Cả 3 bắt đầu cùng lúc
    API.getPosts(1),
    API.getOrders(1),
  ]);
  // Tổng: ~500ms (bằng cái chậm nhất)
}
```

**Quy tắc:**

- Dùng **tuần tự** khi bước sau phụ thuộc vào kết quả bước trước
- Dùng **Promise.all** khi các tác vụ độc lập nhau

```js
// ✅ Đúng khi dùng tuần tự — posts phụ thuộc vào user.id
const user = await API.getUser(1);
const posts = await API.getPosts(user.id); // Cần user.id

// ✅ Đúng khi dùng song song — 3 list không phụ thuộc nhau
const [work, personal, shopping] = await Promise.all([
  API.fetchList("work"),
  API.fetchList("personal"),
  API.fetchList("shopping"),
]);
```

---

### 5.6 Async/Await trong thực tế của ứng dụng

Dưới đây là toàn bộ hàm `addTodo` thực tế trong ứng dụng, với giải thích từng dòng:

```js
async function addTodo() {
  // Lấy giá trị từ input
  const input = document.getElementById("add-input");
  const text = input.value.trim();
  if (!text) return; // Không làm gì nếu input rỗng

  // Tham chiếu nút Add để disable trong lúc chờ
  const btn = document.getElementById("add-btn");

  // ── Bắt đầu async ──────────────────────────────────────────
  btn.disabled = true;
  btn.textContent = "⏳";
  input.value = ""; // Xoá input ngay, không cần chờ API

  try {
    // await dừng hàm này lại, chờ API.create() hoàn thành (~800ms)
    // Trong lúc chờ, người dùng vẫn có thể scroll, click nơi khác
    const newTodo = await API.create(text);

    // Dòng này chỉ chạy SAU KHI API trả về kết quả
    todos.push(newTodo);
    render();
    toast("Đã thêm ✓");
  } catch (err) {
    // Nếu API.create() bị reject (lỗi mạng, server 500, v.v.)
    toast(err.message, true);
  } finally {
    // Luôn chạy dù thành công hay thất bại
    btn.disabled = false;
    btn.textContent = "+ Thêm";
  }
}
```

---

## 6. Các chức năng chính

### 6.1 Thêm todo

| Mode  | Cách hoạt động                                | Thời gian |
| ----- | --------------------------------------------- | --------- |
| Sync  | Push thẳng vào mảng, render ngay              | ~0ms      |
| Async | Gọi `API.create()`, chờ, nhận kết quả, render | ~800ms    |

```js
// Sync
const todo = { id: nextId++, text, done: false };
todos.push(todo);
render();

// Async
const saved = await API.create(text);
todos.push(saved);
render();
```

---

### 6.2 Sửa todo

Quy trình gồm 2 bước:

**Bước 1 — `startEdit(id)`**: Chuyển todo sang edit mode (đổi `<span>` thành `<input>`). Đây là thao tác **đồng bộ**, không cần API.

**Bước 2 — `saveEdit(id)`**: Lưu giá trị mới. Đây là thao tác **bất đồng bộ** (trong Async mode).

```js
async function saveEdit(id) {
  const input = document.querySelector(`.edit-input[data-id="${id}"]`);
  const newText = input.value.trim();

  if (!newText) {
    toast("Nội dung không được trống", true);
    return;
  }

  try {
    input.disabled = true; // Khoá input trong lúc chờ

    // Gọi API cập nhật, chờ kết quả
    const updated = await API.update(id, { text: newText });

    // Cập nhật mảng todos với dữ liệu mới từ server
    const i = todos.findIndex((t) => t.id === id);
    todos[i] = updated;

    render();
    toast("Đã lưu ✓");
  } catch (err) {
    toast(err.message, true);
    input.disabled = false; // Mở lại input nếu lỗi
  }
}
```

---

### 6.3 Xoá todo

```js
async function deleteTodo(id) {
  // Hiệu ứng shimmer trên item đang xoá
  const item = document.querySelector(`.todo-item[data-id="${id}"]`);
  item.classList.add("loading-item");

  try {
    await API.delete(id); // Chờ server xác nhận xoá

    // Chỉ xoá khỏi mảng SAU KHI server xác nhận
    todos = todos.filter((t) => t.id !== id);

    render();
    toast("Đã xoá");
  } catch (err) {
    item.classList.remove("loading-item"); // Xoá hiệu ứng nếu lỗi
    toast(err.message, true);
  }
}
```

> **Lưu ý:** Trong ứng dụng thực tế, nên xoá khỏi UI trước (optimistic update) rồi gọi API. Nếu API lỗi thì thêm lại. Cách này giúp UI phản hồi ngay, cảm giác nhanh hơn.

---

### 6.4 Toggle trạng thái done

```js
async function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  const newDone = !todo.done;

  try {
    const updated = await API.update(id, { done: newDone });

    const i = todos.findIndex((t) => t.id === id);
    todos[i] = updated;

    render();
  } catch (err) {
    toast(err.message, true);
  }
}
```

---

## 7. Xử lý lỗi

### Nguyên tắc xử lý lỗi với async/await

```
async function → try/catch → finally
     ↓               ↓           ↓
  await API()    Bắt lỗi    Dọn dẹp UI
                 Hiện toast  (luôn chạy)
```

### Các loại lỗi thường gặp

| Lỗi              | Nguyên nhân      | Xử lý                     |
| ---------------- | ---------------- | ------------------------- |
| Network error    | Mất mạng         | Hiện thông báo, cho retry |
| 404 Not Found    | ID không tồn tại | Xoá khỏi UI local         |
| 500 Server Error | Server lỗi       | Hiện thông báo, rollback  |
| Timeout          | Server quá chậm  | Huỷ request, thông báo    |

### Ví dụ xử lý lỗi đầy đủ

```js
async function addTodo(text) {
  try {
    const saved = await API.create(text);
    todos.push(saved);
    render();
  } catch (err) {
    if (err.message.includes("Network")) {
      toast("Mất kết nối mạng. Vui lòng thử lại.", true);
    } else if (err.message.includes("500")) {
      toast("Lỗi server. Vui lòng thử lại sau.", true);
    } else {
      toast(err.message, true);
    }
  } finally {
    btn.disabled = false;
    btn.textContent = "+ Thêm";
  }
}
```

---

## 8. Luồng thực thi

### Thêm todo (Async mode)

```
Người dùng nhập text → click "+ Thêm"
         │
         ▼
  addTodo() được gọi
         │
         ▼
  btn.disabled = true  ← UI update ngay (sync)
  input.value = ""     ← UI update ngay (sync)
         │
         ▼
  await API.create(text)
         │
         ├── JavaScript tiếp tục chạy việc khác
         │   (xử lý click, scroll, animation...)
         │
         │   ~800ms sau...
         │
         ▼
  Nhận kết quả: { id: 3, text: "...", done: false }
         │
         ▼
  todos.push(saved)
  render()
  toast("Đã thêm ✓")
         │
         ▼
  [finally] btn.disabled = false
```

### Sửa todo (Async mode)

```
Click ✎ → startEdit(id)    ← sync, đổi span → input
                │
                ▼
       Người dùng chỉnh text
                │
                ▼
       Click ✓ → saveEdit(id)
                │
                ▼
       input.disabled = true  ← sync
                │
                ▼
       await API.update(id, { text })
                │   ~800ms
                ▼
       todos[i] = updated
       render()
       toast("Đã lưu ✓")
```

---

## 9. Bảng tổng kết

### Khi nào dùng sync, khi nào dùng async?

| Thao tác               | Sync hay Async? | Lý do                         |
| ---------------------- | --------------- | ----------------------------- |
| Lọc danh sách (filter) | **Sync**        | Dữ liệu đã có sẵn trên client |
| Cập nhật UI            | **Sync**        | Thao tác DOM không cần chờ    |
| Validate form          | **Sync**        | Không cần gọi server          |
| Gọi API                | **Async**       | Phải chờ network              |
| Đọc/ghi file           | **Async**       | I/O chậm                      |
| Truy vấn database      | **Async**       | Phải chờ DB                   |

### Tóm tắt async/await

| Khái niệm        | Ý nghĩa                                                                         |
| ---------------- | ------------------------------------------------------------------------------- |
| `async function` | Hàm luôn trả về Promise, cho phép dùng `await` bên trong                        |
| `await`          | Dừng hàm, chờ Promise resolve, trả về giá trị. Không block toàn bộ chương trình |
| `try/catch`      | Bắt lỗi từ các `await` bên trong `try`                                          |
| `finally`        | Luôn chạy sau `try/catch`, dùng để dọn dẹp (tắt loading, enable button)         |
| `Promise.all`    | Chạy nhiều async song song, nhanh hơn await tuần tự                             |

### Quy tắc vàng

```
1. Luôn có try/catch khi dùng await
2. Luôn có finally để reset trạng thái UI
3. Dùng Promise.all khi các tác vụ không phụ thuộc nhau
4. await chỉ dừng hàm đó, không dừng cả chương trình
5. async function luôn trả về Promise — nhớ khi gọi từ bên ngoài
```
