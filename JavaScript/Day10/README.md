# Tranning JS

## 1. Tổng quan

Ứng dụng **Playlist** cho phép quản lý danh sách bài hát với đầy đủ chức năng **thêm, sửa, xoá**. Mục tiêu chính là minh họa cách sử dụng ba kỹ thuật JavaScript quan trọng trong thực tế:

| Kỹ thuật        | Vai trò trong ứng dụng                        |
| --------------- | --------------------------------------------- |
| **Fetch API**   | Giao tiếp với server (GET, POST, PUT, DELETE) |
| **DOM**         | Hiển thị và cập nhật giao diện                |
| **Async/Await** | Xử lý bất đồng bộ khi gọi API                 |

Ứng dụng dùng **Fake API** — một object JavaScript giả lập server thật với độ trễ 600–900ms, giúp thấy rõ luồng async mà không cần backend.

---

## 2. Cấu trúc ứng dụng

```
playlist-app.html
│
├── HTML
│   ├── Status bar        — hiển thị trạng thái API (loading / ok / error)
│   ├── Form thêm bài     — 4 input: title, artist, album, year
│   └── Song list         — danh sách bài hát (render từ JS)
│
├── CSS
│   ├── Variables         — màu sắc, font, spacing
│   ├── Animations        — slideDown, slideOut, shimmer
│   └── States            — editing, loading-state, removing
│
└── JavaScript
    ├── Fake API           — fakeFetch(), fakeResponse(), delay()
    ├── State              — songs[], editingId, nextId
    ├── UI Helpers         — setStatus(), toast(), render(), esc()
    └── CRUD Actions       — loadSongs, addSong, saveSong, deleteSong
```

### Dữ liệu một bài hát

```js
{
  id:     1,              // number  — khoá chính
  title:  "Hãy Trao Cho Anh",  // string  — tên bài hát (bắt buộc)
  artist: "Sơn Tùng M-TP",     // string  — ca sĩ
  album:  "Sky Tour",           // string  — tên album
  year:   2019,                 // number  — năm phát hành
}
```

---

## Cốt lõi App

### Fetch API

| Thao tác     | Code                                                                   |
| ------------ | ---------------------------------------------------------------------- |
| GET          | `await fetch(url)`                                                     |
| POST         | `await fetch(url, { method:'POST', body: JSON.stringify(data) })`      |
| PUT          | `await fetch(url+'/id', { method:'PUT', body: JSON.stringify(data) })` |
| DELETE       | `await fetch(url+'/id', { method:'DELETE' })`                          |
| Kiểm tra lỗi | `if (!response.ok) throw new Error(response.status)`                   |
| Parse JSON   | `const data = await response.json()`                                   |

### DOM

| Thao tác     | Code                                            |
| ------------ | ----------------------------------------------- |
| Đọc input    | `document.getElementById('id').value.trim()`    |
| Tìm element  | `document.querySelector('.class[data-id="x"]')` |
| Thay text    | `el.textContent = '...'`                        |
| Thay HTML    | `el.innerHTML = '...'` (nhớ escape!)            |
| Thêm class   | `el.classList.add('loading')`                   |
| Xoá class    | `el.classList.remove('loading')`                |
| Tạo element  | `document.createElement('div')`                 |
| Thêm vào DOM | `parent.appendChild(child)`                     |

### Async/Await

| Khái niệm        | Ý nghĩa                                                   |
| ---------------- | --------------------------------------------------------- |
| `async function` | Hàm trả về Promise, cho phép dùng `await` bên trong       |
| `await`          | Dừng hàm, chờ Promise resolve. Không block cả trang       |
| `try`            | Khối code thực thi, bắt lỗi từ mọi `await` bên trong      |
| `catch(err)`     | Chạy khi có lỗi — xử lý, thông báo cho user               |
| `finally`        | Luôn chạy — dùng để reset UI (tắt loading, enable button) |
