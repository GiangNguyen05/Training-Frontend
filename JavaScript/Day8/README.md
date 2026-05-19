# JavaScript CRUD Blog App

## Mục tiêu bài học

Xây dựng ứng dụng CRUD blog đơn giản bằng:

- HTML
- JavaScript
- Fetch API
- JSON Server

---

## Kiến thức sử dụng

### DOM Manipulation

```js
document.querySelector();
```

### Event Listener

```js
addEventListener();
```

### Async Await

```js
async/await
```

### Fetch API

```js
fetch();
```

### REST API

- GET
- POST
- DELETE

### Event Delegation

```js
event bubbling
```

---

## Cấu trúc dữ liệu

Ví dụ blog object:

```js
{
  id: 1,
  title: "JS Basic",
  author: "Giang",
  content: "Learning JS"
}
```

---

## Khởi tạo DOM

```js
const newTbody = document.querySelector("#list tbody");
const blogs = document.querySelector("#blogsForm");
```

### Ý nghĩa

#### `newTbody`

Dùng để render danh sách blog vào table.

#### `blogs`

Form thêm blog mới.

---

## GET Data — Hiển thị danh sách blog

### Function

```js
const tableList = async () => {
  const res = await fetch("http://localhost:8000/blogs");
  const data = await res.json();

  newTbody.innerHTML = "";

  data.forEach((e) => {
    newTbody.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.title}</td>
        <td>${e.author}</td>
        <td>${e.content}</td>
      </tr>
    `;
  });
};
```

---

## Luồng hoạt động GET

```txt
Client
   ↓
fetch()
   ↓
API Server
   ↓
JSON data
   ↓
render HTML
```

---

## Giải thích

### `fetch()`

```js
const res = await fetch("http://localhost:8000/blogs");
```

Gửi request đến server.

### `await`

Chờ API trả dữ liệu.

### `res.json()`

```js
const data = await res.json();
```

Chuyển dữ liệu JSON thành JavaScript object.

---

## Render dữ liệu

```js
data.forEach((e) => {
```

Lặp qua từng blog.

---

## Template Literal

```js
`
<tr>
  <td>${e.title}</td>
</tr>
`;
```

Dùng để render HTML động.

---

## POST Data — Thêm blog mới

### Event Submit

```js
blogs.addEventListener("submit", async (e) => {
```

Bắt sự kiện submit form.

---

## `preventDefault()`

```js
e.preventDefault();
```

Ngăn browser reload trang.

---

## Lấy dữ liệu form

```js
const newBlogs = {
  title: document.querySelector("#title").value,
  author: document.querySelector("#author").value,
  content: document.querySelector("#content").value,
};
```

---

## Gửi dữ liệu lên server

```js
const res = await fetch("http://localhost:8000/blogs", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newBlogs),
});
```

---

## Giải thích

### `method: "POST"`

Tạo dữ liệu mới.

### `headers`

Thông báo dữ liệu gửi lên là JSON.

### `JSON.stringify()`

Chuyển object thành JSON string.

---

## Reset form

```js
blogs.reset();
```

Xóa dữ liệu sau khi submit thành công.

---

## Reload dữ liệu

```js
tableList();
```

Render lại danh sách mới nhất.

---

## DELETE Data — Xóa blog

### Event Delegation

```js
newTbody.addEventListener("click", async (e) => {
```

Không add event cho từng button.

Thay vào đó:

- bắt sự kiện ở parent
- kiểm tra button được click

---

## Kiểm tra button delete

```js
if (e.target.classList.contains("btnDel"))
```

---

## Lấy ID

```js
const id = e.target.getAttribute("data-id");
```

---

## Xác nhận xóa

```js
confirm("Bạn có chắc chắn muốn xóa blog này không?");
```

---

## Gửi request DELETE

```js
await fetch(`http://localhost:8000/blogs/${id}`, {
  method: "DELETE",
});
```

---

## Xóa row khỏi UI

```js
e.target.closest("tr").remove();
```

---

## REST API sử dụng

| Method | URL        | Chức năng     |
| ------ | ---------- | ------------- |
| GET    | /blogs     | Lấy danh sách |
| POST   | /blogs     | Thêm blog     |
| DELETE | /blogs/:id | Xóa blog      |

---

## Async Await Flow

```txt
await fetch()
      ↓
response
      ↓
response.json()
      ↓
render UI
```

---

## Các lỗi thường gặp

### 1. Sai URL API

Sai:

```js
fetch(" http://localhost:8000/blogs");
```

Có dấu cách đầu chuỗi.

---

### 2. Không chạy JSON Server

Cần chạy:

```bash
npx json-server db.json --watch
```

---

### 3. Không có `preventDefault()`

Trang sẽ reload khi submit form.

---

### 4. Không bắt lỗi

Nên dùng:

```js
try catch
```

---

## Improve code

### Không nên dùng

```js
innerHTML +=
```

Vì:

- chậm
- render lại nhiều lần

---

## Tốt hơn

```js
let html = "";

data.forEach((e) => {
  html += `<tr></tr>`;
});

newTbody.innerHTML = html;
```

---

## Validate form

```js
if (!title || !author || !content) {
  alert("Vui lòng nhập đầy đủ");
}
```

---

## Refactor nên làm

### Tách function render

```js
renderBlogs(data);
```

### Tách API

```txt
api.js
ui.js
main.js
```

---

## Kiến thức frontend thực tế học được

- DOM
- Fetch API
- Async Await
- CRUD
- REST API
- Event Delegation
- Dynamic Rendering

---

## Bài tập nên làm thêm

### CRUD đầy đủ

- PUT
- PATCH

### Search blog

### Pagination

### Loading state

### Edit blog

### Toast notification

---

## Tech Stack tiếp theo nên học

Sau bài này nên học:

- Vite
- React
- Component
- State management
- Modular architecture

---

## Tổng kết

Project này giúp hiểu:

- cách frontend làm việc với backend
- cách render UI động
- cách dùng async/await
- cách thao tác DOM
- cách hoạt động của REST API

Đây là nền tảng cực quan trọng trước khi học React.
