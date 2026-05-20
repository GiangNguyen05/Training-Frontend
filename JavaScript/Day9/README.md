# 📘Phân tích chi tiết todolist

## 📋 Mục Lục

1. [Tổng quan ứng dụng làm gì?](#1-tổng-quan)
2. [DOM - Cách JavaScript "nhìn thấy" trang web](#2-dom)
3. [Fetch API - Giao tiếp với máy chủ](#3-fetch-api)
4. [Async / Await - Xử lý tác vụ bất đồng bộ](#4-async--await)
5. [REST API - Ngôn ngữ chung giữa Frontend và Backend](#5-rest-api)
6. [JSON - Định dạng dữ liệu trao đổi](#6-json)
7. [Event Listener - Lắng nghe hành động người dùng](#7-event-listener)
8. [Template Literals - Tạo chuỗi HTML linh hoạt](#8-template-literals)
9. [Event Delegation - Xử lý sự kiện thông minh hơn](#9-event-delegation)
10. [Try / Catch - Xử lý lỗi an toàn](#10-try--catch)
11. [Hằng số (Constants) - Viết code dễ bảo trì](#12-hằng-số)
12. [Sơ đồ luồng hoạt động](#13-sơ-đồ-tổng-quát)

---

## 1. Tổng Quan

Ứng dụng này là một trang quản lý blog đơn giản, cho phép người dùng:

| Hành động         | Mô tả                                      |
| ----------------- | ------------------------------------------ |
| **Xem danh sách** | Tải và hiển thị tất cả bài blog từ máy chủ |
| **Thêm mới**      | Điền form và gửi lên để tạo bài blog mới   |
| **Xóa**           | Nhấn nút "Del" để xóa một bài blog         |

Ứng dụng hoạt động theo mô hình **Client - Server**:

```
Trình duyệt (Client)  <------>  Máy chủ (Server tại localhost:8000)
   [Hiển thị UI]               [Lưu trữ dữ liệu]
```

> 💡 **Hình dung đơn giản:** Trình duyệt là nhân viên phục vụ, máy chủ là nhà bếp. Nhân viên nhận yêu cầu từ khách, truyền vào bếp, bếp xử lý và trả kết quả ra.

---

## 2. DOM

### DOM là gì?

**DOM** _(Document Object Model)_ là cách JavaScript "nhìn" và "chạm" vào các thành phần trên trang web. Khi trình duyệt tải một trang HTML, nó tạo ra một cây cấu trúc các phần tử — gọi là DOM. JavaScript có thể đọc, thay đổi, hoặc xóa bất kỳ phần tử nào trong cây đó.

### Trong code này

```javascript
const newTbody = document.querySelector("#list tbody");
const blogs = document.querySelector("#blogsForm");
```

- `document.querySelector(...)` — Tìm kiếm một phần tử HTML theo **CSS selector**
- `"#list tbody"` — Tìm thẻ `<tbody>` bên trong phần tử có id là `list`
- `"#blogsForm"` — Tìm phần tử có id là `blogsForm` (đây là form nhập liệu)

### Kết quả được lưu vào đâu?

Kết quả được lưu vào **biến** (`const`). Sau đó, ta dùng biến này để thao tác tiếp mà không phải tìm kiếm lại trên DOM nhiều lần — vừa tiết kiệm tài nguyên, vừa dễ đọc.

---

## 3. Fetch API

### Fetch API là gì?

`fetch()` là hàm tích hợp sẵn trong JavaScript, dùng để **gửi yêu cầu (request) đến máy chủ** và **nhận phản hồi (response)** về.

### Trong code này

```javascript
const res = await fetch("http://localhost:8000/blogs");
```

Dòng này nói với trình duyệt:

> "Hãy gửi một yêu cầu đến địa chỉ `http://localhost:8000/blogs` và chờ phản hồi."

Khi cần gửi dữ liệu lên (thêm blog mới), ta cấu hình thêm:

```javascript
const res = await fetch("http://localhost:8000/blogs", {
  method: "POST", // Phương thức HTTP
  headers: { "Content-Type": "application/json" }, // Loại dữ liệu gửi đi
  body: JSON.stringify(newBlogs), // Nội dung gửi lên
});
```

| Thành phần | Vai trò                                         |
| ---------- | ----------------------------------------------- |
| `method`   | Loại hành động (GET / POST / DELETE...)         |
| `headers`  | Thông tin đính kèm (ở đây là khai báo gửi JSON) |
| `body`     | Nội dung thực sự muốn gửi lên                   |

> 💡 **Hình dung:** `fetch()` giống như bạn gọi điện đặt hàng. Bạn gọi đến số điện thoại (URL), nói muốn làm gì (method), và đọc thông tin đơn hàng (body).

---

## 4. Async / Await

### Vấn đề cần giải quyết

JavaScript chạy từng dòng lệnh **từ trên xuống dưới**, rất nhanh. Nhưng khi gọi lên máy chủ, phải **chờ phản hồi** — có thể mất vài trăm mili-giây. Nếu không xử lý đúng, JavaScript sẽ chạy tiếp sang dòng sau trong khi dữ liệu chưa về — gây lỗi.

### Giải pháp: `async` và `await`

```javascript
const tableList = async () => {
  // async: "Hàm này có thể chờ đợi"
  const res = await fetch("..."); // await: "Dừng ở đây, chờ fetch xong"
  const data = await res.json(); // await: "Dừng ở đây, chờ đọc JSON xong"
  // Chỉ chạy tiếp khi data đã có đầy đủ
};
```

- `async` — Đặt trước hàm để báo: "Hàm này có thể chứa các tác vụ chờ đợi."
- `await` — Đặt trước lệnh để báo: "Dừng lại đây, chờ lệnh này hoàn thành rồi mới đi tiếp."

> 💡 **Hình dung:** Bạn order đồ ăn online (`fetch`). `await` giống như bạn ngồi chờ shipper giao hàng xong mới bắt đầu ăn — thay vì cầm đũa ăn không khí trong lúc chờ.

---

## 5. REST API

### REST API là gì?

**REST API** là một bộ quy ước để Frontend (trình duyệt) và Backend (máy chủ) "nói chuyện" với nhau. Mỗi hành động được biểu diễn bằng một **phương thức HTTP** kết hợp với một **URL**.

### Các phương thức HTTP trong code

| Phương thức | URL          | Ý nghĩa                   |
| ----------- | ------------ | ------------------------- |
| `GET`       | `/blogs`     | Lấy danh sách tất cả blog |
| `POST`      | `/blogs`     | Tạo một blog mới          |
| `DELETE`    | `/blogs/:id` | Xóa blog có id tương ứng  |

> _(Mặc định khi chỉ gọi `fetch(url)` không truyền `method`, JavaScript tự dùng `GET`)_

### Ví dụ trong code

```javascript
// GET - Lấy danh sách
fetch("http://localhost:8000/blogs")

// POST - Tạo mới
fetch("http://localhost:8000/blogs", { method: "POST", body: ... })

// DELETE - Xóa blog có id = 5
fetch("http://localhost:8000/blogs/5", { method: "DELETE" })
```

> 💡 **Hình dung:** REST API giống như menu nhà hàng. Mỗi món (URL) có thể được gọi theo kiểu khác nhau — xem thực đơn (GET), đặt món (POST), hủy đơn (DELETE).

---

## 6. JSON

### JSON là gì?

**JSON** _(JavaScript Object Notation)_ là định dạng văn bản dùng để **truyền dữ liệu** giữa Frontend và Backend. Nó trông giống như một đối tượng JavaScript, nhưng thực ra chỉ là **chuỗi ký tự thuần túy**.

### Hai thao tác quan trọng

| Hàm                      | Hướng               | Ví dụ                              |
| ------------------------ | ------------------- | ---------------------------------- |
| `JSON.stringify(object)` | Object → Chuỗi JSON | Chuẩn bị dữ liệu để gửi lên server |
| `res.json()`             | Chuỗi JSON → Object | Đọc dữ liệu server trả về          |

### Trong code

```javascript
// Gửi lên server: chuyển object thành chuỗi JSON
body: JSON.stringify({ title: "Bài 1", author: "Nam", content: "Nội dung..." });
// Kết quả: '{"title":"Bài 1","author":"Nam","content":"Nội dung..."}'

// Nhận về từ server: chuyển chuỗi JSON thành object có thể dùng được
const data = await res.json();
console.log(data[0].title); // "Bài 1"
```

> 💡 **Hình dung:** JSON giống như việc đóng gói hàng vào thùng carton trước khi gửi bưu điện (`stringify`), và mở hộp ra khi nhận được (`json()`).

---

## 7. Event Listener

### Event Listener là gì?

**Event Listener** (Trình lắng nghe sự kiện) là cách để JavaScript **phát hiện và phản ứng** với các hành động của người dùng: click chuột, nhấn phím, submit form...

### Cú pháp cơ bản

```javascript
phần_tử.addEventListener("tên_sự_kiện", hàm_xử_lý);
```

### Trong code

```javascript
// Lắng nghe sự kiện "submit" trên form
blogs.addEventListener("submit", async (e) => {
  e.preventDefault(); // Ngăn form tự reload trang (hành vi mặc định của HTML)
  // ... xử lý thêm blog
});
```

- `"submit"` — Sự kiện xảy ra khi người dùng nhấn nút Submit trên form
- `e` — Đối tượng chứa thông tin về sự kiện (sự kiện "submit" là cái gì, xảy ra ở đâu...)
- `e.preventDefault()` — Chặn hành vi mặc định của trình duyệt (thường là reload trang)

> 💡 **Hình dung:** Event Listener giống như nhân viên lễ tân. Họ luôn "lắng nghe" — khi khách bấm chuông (`sự kiện`), họ thực hiện hành động tương ứng (`hàm xử lý`).

---

## 8. Template Literals

### Template Literals là gì?

**Template Literals** là cách tạo chuỗi văn bản trong JavaScript có thể **nhúng biến và biểu thức** trực tiếp vào bên trong. Dùng dấu backtick (`` ` ``) thay cho dấu nháy thường.

### So sánh cách cũ và mới

```javascript
// ❌ Cách cũ - nối chuỗi thủ công, khó đọc
"<tr><td>" +
  e.id +
  "</td><td>" +
  e.title +
  "</td></tr>"
  // ✅ Template Literals - nhúng biến trực tiếp, dễ đọc
  `<tr><td>${e.id}</td><td>${e.title}</td></tr>`;
```

### Trong code

```javascript
newTbody.innerHTML = data
  .map(
    (e) => `
  <tr>
    <td>${e.id}</td>
    <td>${e.title}</td>
    <td>${e.author}</td>
    <td>${e.content}</td>
    <td><button class="btnDel" data-id="${e.id}">Del</button></td>
  </tr>
`,
  )
  .join("");
```

- `` `...` `` — Chuỗi template, có thể viết nhiều dòng
- `${e.id}` — Chèn giá trị của biến `e.id` vào vị trí đó
- `.map(...)` — Biến mảng dữ liệu thành mảng chuỗi HTML
- `.join("")` — Ghép tất cả chuỗi lại thành một chuỗi duy nhất

> 💡 **Hình dung:** Template Literals giống như mẫu đơn có ô trống. Bạn chỉ cần điền thông tin vào `${}` thay vì phải viết lại toàn bộ câu mỗi lần.

---

## 9. Event Delegation

### Vấn đề cần giải quyết

Các nút "Del" được tạo ra **sau khi trang đã load** (từ dữ liệu máy chủ). Nếu gắn event listener trực tiếp lên từng nút, ta sẽ phải làm điều đó mỗi lần danh sách được tải lại — rất tốn kém và phức tạp.

### Giải pháp: Event Delegation (Ủy quyền sự kiện)

Thay vì gắn listener lên từng nút nhỏ, ta gắn lên **phần tử cha** (`tbody`) — vốn luôn tồn tại. Khi người dùng click, sự kiện "nổi bọt" lên cha, và ta kiểm tra xem có phải nút "Del" không.

```javascript
newTbody.addEventListener("click", async (e) => {
  // Kiểm tra: người dùng có click vào nút Del không?
  if (e.target.classList.contains("btnDel")) {
    const id = e.target.getAttribute("data-id"); // Lấy id từ thuộc tính data-id
    // ... xử lý xóa
  }
});
```

- `e.target` — Phần tử thực sự được click (có thể là bất kỳ thứ gì bên trong `tbody`)
- `classList.contains("btnDel")` — Kiểm tra phần tử đó có class `btnDel` không
- `getAttribute("data-id")` — Lấy giá trị thuộc tính `data-id` (là id của blog cần xóa)

> 💡 **Hình dung:** Thay vì mỗi nhân viên tự nhận điện thoại riêng, cả phòng dùng chung một số máy bàn. Khi có cuộc gọi đến, người trực máy kiểm tra xem cuộc gọi dành cho ai rồi chuyển tiếp.

---

## 10. Try / Catch

### Try / Catch là gì?

Khi làm việc với mạng (gọi API), có rất nhiều thứ có thể **sai**: mất mạng, server lỗi, timeout... `try/catch` giúp ta **bắt lỗi và xử lý** thay vì để ứng dụng bị crash.

### Cú pháp

```javascript
try {
  // Code có thể gây ra lỗi
} catch (error) {
  // Code xử lý khi có lỗi xảy ra
}
```

### Trong code

```javascript
try {
  const res = await fetch("http://localhost:8000/blogs", { method: "POST", ... });

  if (!res.ok) {
    throw new Error("Gửi dữ liệu thất bại!"); // Chủ động tạo lỗi nếu server báo lỗi
  }

  alert("Đã thêm blog mới thành công!");
  tableList(); // Tải lại danh sách

} catch (error) {
  console.error("Lỗi kết nối:", error); // In lỗi ra console để debug
  alert("Có lỗi xảy ra, vui lòng thử lại!"); // Thông báo thân thiện cho người dùng
}
```

- `res.ok` — `true` nếu server phản hồi thành công (HTTP 200-299), `false` nếu lỗi
- `throw new Error(...)` — Chủ động ném ra lỗi để `catch` bắt
- `console.error(...)` — Ghi lỗi vào Developer Console (Ctrl+Shift+I) để lập trình viên debug

> 💡 **Hình dung:** `try/catch` giống như túi airbag trong ô tô. Khi mọi thứ bình thường (`try`), airbag nằm im. Khi có va chạm (`lỗi`), airbag bung ra (`catch`) để bảo vệ người dùng khỏi trải nghiệm tệ.

---

## 11. Hằng Số

### Tại sao cần tách URL ra hằng số?

Trong code gốc, URL `http://localhost:8000` xuất hiện nhiều lần. Nếu sau này địa chỉ server thay đổi (ví dụ khi deploy lên internet), ta phải sửa **từng chỗ một** — dễ bỏ sót, dễ gây lỗi.

### Giải pháp

```javascript
const API = "http://localhost:8000";

// Dùng ở mọi nơi
fetch(`${API}/blogs`);
fetch(`${API}/blogs/${id}`);
```

Bây giờ khi cần thay đổi, chỉ cần **sửa một chỗ duy nhất**.

### Nguyên tắc DRY

Đây là áp dụng của nguyên tắc lập trình **DRY** — _Don't Repeat Yourself_ (Đừng lặp lại chính mình). Mọi thông tin chỉ nên xuất hiện ở **một nơi** trong code.

> 💡 **Hình dung:** Giống như lưu số điện thoại vào danh bạ thay vì nhớ thuộc lòng. Khi số thay đổi, chỉ cần cập nhật danh bạ một lần — không phải thông báo cho từng người.

---

## 12. Sơ Đồ Tổng Quát

Dưới đây là luồng hoạt động đầy đủ của ứng dụng:

```
┌─────────────────────────────────────────────────────────────┐
│                     TRÌNH DUYỆT (Client)                    │
│                                                             │
│  Trang tải xong                                             │
│       │                                                     │
│       ▼                                                     │
│  tableList() ──── GET /blogs ────────────────► SERVER       │
│       │                          ◄── JSON [] ──             │
│       ▼                                                     │
│  Hiển thị bảng danh sách blog                               │
│                                                             │
│  Người dùng điền form & Submit                              │
│       │                                                     │
│       ▼                                                     │
│  blogs.addEventListener("submit") ── POST /blogs ─► SERVER  │
│       │                              ◄── JSON {} ──         │
│       ▼                                                     │
│  Alert "Thành công" → Reset form → Tải lại bảng             │
│                                                             │
│  Người dùng click nút "Del"                                  │
│       │                                                     │
│       ▼                                                     │
│  newTbody.addEventListener("click") ─ DELETE /blogs/:id ─► SERVER │
│       │                               ◄── 200 OK ──         │
│       ▼                                                     │
│  Xóa hàng khỏi bảng ngay lập tức                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📌 Tổng Kết Nhanh

| Khái niệm             | Vai trò trong code                                   |
| --------------------- | ---------------------------------------------------- |
| **DOM**               | Tìm và thao tác các phần tử HTML trên trang          |
| **Fetch API**         | Gửi/nhận dữ liệu với máy chủ qua HTTP                |
| **Async/Await**       | Chờ phản hồi mạng mà không làm đứng trình duyệt      |
| **REST API**          | Quy ước giao tiếp: GET/POST/DELETE + URL             |
| **JSON**              | Định dạng truyền dữ liệu giữa client và server       |
| **Event Listener**    | Phản ứng với hành động người dùng (click, submit...) |
| **Template Literals** | Tạo HTML động có chèn biến, dễ đọc                   |
| **Event Delegation**  | Gắn 1 listener cho nhiều nút con được tạo động       |
| **Try/Catch**         | Xử lý lỗi mạng, tránh crash ứng dụng                 |
| **Escape XSS**        | Vô hiệu hóa mã độc người dùng nhập vào               |
| **Hằng số API**       | Tập trung URL, dễ thay đổi, không lặp lại            |

---
