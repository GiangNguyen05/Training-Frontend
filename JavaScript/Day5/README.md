# DOM trong JavaScript

## DOM là gì?

**DOM (Document Object Model)** là một giao diện lập trình (API) do trình duyệt cung cấp, cho phép JavaScript đọc và thay đổi cấu trúc, nội dung, và giao diện của trang HTML.

Khi trình duyệt tải một trang web, nó phân tích (parse) mã HTML và tạo ra một **cây đối tượng (tree of objects)** trong bộ nhớ — đó chính là DOM. Mỗi thẻ HTML trở thành một **node** trong cây đó.

```
Document
└── <html>
    ├── <head>
    │   └── <title> → "Trang web"
    └── <body>
        ├── <h1>  → "Tiêu đề"
        └── <p>   → "Đoạn văn bản"
```

> **Quan trọng:** DOM không phải là HTML. HTML là văn bản tĩnh, còn DOM là đối tượng sống — có thể thay đổi trong thời gian thực mà không cần tải lại trang.

---

## Các loại Node trong DOM

| Loại Node   | Ví dụ                     | Mô tả                      |
| ----------- | ------------------------- | -------------------------- |
| `Document`  | `document`                | Gốc của toàn bộ cây DOM    |
| `Element`   | `<div>`, `<p>`, `<h1>`    | Các thẻ HTML               |
| `Text`      | `"Hello world"`           | Nội dung văn bản bên trong |
| `Attribute` | `class="btn"`, `id="app"` | Thuộc tính của thẻ         |
| `Comment`   | `<!-- ghi chú -->`        | Ghi chú trong HTML         |

---

## Chọn Phần Tử (Selecting Elements)

### 1 Theo ID

```js
const el = document.getElementById("my-id");
```

### 2 Theo CSS Selector (phổ biến nhất)

```js
// Chọn phần tử đầu tiên khớp
const el = document.querySelector(".card");

// Chọn TẤT CẢ phần tử khớp → trả về NodeList
const els = document.querySelectorAll("p.highlight");
```

### 3 Các cách khác

```js
document.getElementsByClassName("btn"); // Theo class
document.getElementsByTagName("div"); // Theo tên thẻ
```

> **Tip:** Ưu tiên dùng `querySelector` / `querySelectorAll` vì linh hoạt và hỗ trợ mọi CSS selector.

---

## Đọc và Thay Đổi Nội Dung

### 1 textContent — Chỉ văn bản thuần

```js
const h1 = document.querySelector("h1");

// Đọc
console.log(h1.textContent); // "Tiêu đề"

// Ghi (chỉ text, không parse HTML)
h1.textContent = "Tiêu đề mới";
```

### 2 innerHTML — Nội dung HTML

```js
const div = document.querySelector("#app");

// Đọc
console.log(div.innerHTML);

// Ghi (parse HTML → có thể chèn thẻ con)
div.innerHTML = "<strong>Chữ đậm</strong>";
```

> ⚠️ **Cảnh báo bảo mật:** Không dùng `innerHTML` với dữ liệu từ người dùng — có thể bị tấn công XSS. Dùng `textContent` nếu chỉ cần text.

---

## Thay Đổi Thuộc Tính (Attributes)

```js
const img = document.querySelector("img");

// Đọc thuộc tính
img.getAttribute("src"); // "/image.png"

// Đặt thuộc tính
img.setAttribute("alt", "Ảnh mô tả");

// Xóa thuộc tính
img.removeAttribute("disabled");

// Thuộc tính phổ biến có thể truy cập trực tiếp
img.src = "/new-image.png";
img.id = "hero-img";
```

---

## Thay Đổi Style và Class

### 1 Thay đổi style trực tiếp

```js
const box = document.querySelector(".box");

box.style.color = "red";
box.style.fontSize = "18px";
box.style.backgroundColor = "#f0f0f0";
box.style.display = "none"; // Ẩn phần tử
```

### 2 Làm việc với classList (khuyến nghị)

```js
box.classList.add("active"); // Thêm class
box.classList.remove("hidden"); // Xóa class
box.classList.toggle("dark-mode"); // Thêm nếu chưa có, xóa nếu đã có
box.classList.contains("active"); // Kiểm tra → true/false
box.classList.replace("old", "new"); // Thay class cũ bằng class mới
```

---

## Tạo, Thêm và Xóa Phần Tử

### 1 Tạo phần tử mới

```js
const li = document.createElement("li");
li.textContent = "Mục mới";
li.classList.add("item");
```

### 2 Chèn vào DOM

```js
const ul = document.querySelector("ul");

ul.appendChild(li); // Thêm vào cuối
ul.prepend(li); // Thêm vào đầu
ul.insertBefore(li, ul.children[1]); // Chèn trước phần tử thứ 2

// Cách hiện đại (linh hoạt hơn)
ul.insertAdjacentElement("beforeend", li); // Cuối danh sách
ul.insertAdjacentElement("afterbegin", li); // Đầu danh sách
```

### 3 Xóa phần tử

```js
li.remove(); // Xóa chính nó
ul.removeChild(li); // Xóa phần tử con
```

### 4 Clone phần tử

```js
const clone = li.cloneNode(true); // true = clone cả nội dung bên trong
ul.appendChild(clone);
```

---

## Duyệt Cây DOM (Traversal)

```js
const el = document.querySelector(".parent");

// Đi lên
el.parentElement; // Phần tử cha
el.closest(".container"); // Tổ tiên gần nhất khớp selector

// Đi xuống
el.children; // HTMLCollection các phần tử con
el.firstElementChild; // Con đầu tiên
el.lastElementChild; // Con cuối cùng
el.querySelector(".child"); // Tìm cháu theo selector

// Đi ngang
el.nextElementSibling; // Anh/chị tiếp theo
el.previousElementSibling; // Anh/chị trước đó
```

---

## Sự Kiện (Events)

### 1 Lắng nghe sự kiện

```js
const btn = document.querySelector("#my-btn");

btn.addEventListener("click", function (event) {
  console.log("Đã click!");
  console.log(event.target); // Phần tử được click
});
```

### 2 Các sự kiện phổ biến

| Sự kiện            | Khi nào kích hoạt                        |
| ------------------ | ---------------------------------------- |
| `click`            | Click chuột                              |
| `dblclick`         | Double-click                             |
| `mouseover`        | Chuột di vào                             |
| `mouseout`         | Chuột di ra                              |
| `keydown`          | Nhấn phím xuống                          |
| `keyup`            | Nhả phím                                 |
| `input`            | Nội dung input thay đổi                  |
| `change`           | Giá trị thay đổi (blur sau khi thay đổi) |
| `submit`           | Form được submit                         |
| `load`             | Trang / tài nguyên đã tải xong           |
| `DOMContentLoaded` | DOM đã sẵn sàng (chưa cần ảnh/CSS)       |

### 3 Ngăn hành vi mặc định và lan truyền

```js
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Ngăn form reload trang
  event.stopPropagation(); // Ngăn sự kiện lan lên phần tử cha
});
```

### 4 Xóa listener

```js
function handleClick() {
  console.log("click");
}

btn.addEventListener("click", handleClick);
btn.removeEventListener("click", handleClick); // Phải cùng function reference
```

### 5 Event Delegation — Xử lý nhiều phần tử cùng lúc

```js
// Thay vì gán listener cho từng <li>, gán cho <ul>
const ul = document.querySelector("ul");

ul.addEventListener("click", function (event) {
  if (event.target.tagName === "LI") {
    console.log("Bạn click vào:", event.target.textContent);
  }
});
```

> **Lợi ích:** Hiệu quả hơn, hoạt động với cả phần tử được thêm vào sau.

---

## Ví Dụ Thực Tế

### Ví dụ 1: Todo List đơn giản

```html
<input id="input" type="text" placeholder="Nhập công việc..." />
<button id="add-btn">Thêm</button>
<ul id="list"></ul>
```

```js
const input = document.getElementById("input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("list");

addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement("li");
  li.textContent = text;

  // Nút xóa
  const del = document.createElement("button");
  del.textContent = "Xóa";
  del.addEventListener("click", () => li.remove());

  li.appendChild(del);
  list.appendChild(li);
  input.value = "";
});
```

### Ví dụ 2: Đổi chủ đề sáng/tối

```js
const toggleBtn = document.querySelector("#toggle-theme");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleBtn.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Sáng"
    : "🌙 Tối";
});
```

---

## Tóm Tắt Nhanh

| Nhóm           | Phương thức / Thuộc tính                              | Mục đích                       |
| -------------- | ----------------------------------------------------- | ------------------------------ |
| **Chọn**       | `querySelector`, `querySelectorAll`, `getElementById` | Tìm phần tử trong DOM          |
| **Nội dung**   | `textContent`, `innerHTML`                            | Đọc/ghi nội dung               |
| **Thuộc tính** | `getAttribute`, `setAttribute`, `removeAttribute`     | Thao tác thuộc tính HTML       |
| **Style**      | `style.property`, `classList`                         | Thay đổi giao diện             |
| **Tạo/Xóa**    | `createElement`, `appendChild`, `remove`              | Thêm/bớt phần tử               |
| **Duyệt cây**  | `parentElement`, `children`, `nextElementSibling`     | Di chuyển trong cây DOM        |
| **Sự kiện**    | `addEventListener`, `removeEventListener`             | Lắng nghe hành động người dùng |

---

## Lưu Ý Quan Trọng

- **Luôn chờ DOM sẵn sàng** trước khi truy vấn — đặt `<script>` trước `</body>` hoặc dùng `DOMContentLoaded`.
- **Tránh dùng `innerHTML` với dữ liệu người dùng** — nguy cơ XSS.
- **Dùng `classList`** thay vì gán `className` trực tiếp để tránh ghi đè class.
- **Event Delegation** hiệu quả hơn gán listener cho từng phần tử.
- **`querySelector`** trả về `null` nếu không tìm thấy — kiểm tra trước khi dùng.

```js
const el = document.querySelector(".my-el");
if (el) {
  el.textContent = "An toàn!";
}
```
