# GMusic

## Chạy thử trên máy

```bash
# 1. Tạo project Vite mới
npm create vite@latest GMusic
cd GMusic

# 2. Cài dependencies
npm install react-router-dom react-hook-form @hookform/resolvers yup axios

# 3. Xóa src/ mặc định của Vite, copy src/ của project này vào
# 4. Chạy
npm run dev
```

**Tài khoản demo:** `g@music.com` / `000000`

---

## Cấu trúc project

---

## Các trang và Routes

| Route           | Trang              | Mô tả                                  |
| --------------- | ------------------ | -------------------------------------- |
| `/auth`         | AuthPage           | Đăng nhập / Đăng ký — form validation  |
| `/`             | HomePage           | Trang chủ — playlist, bài hát, nghệ sĩ |
| `/playlist/:id` | PlaylistDetailPage | Chi tiết playlist theo ID              |
| `/search`       | SearchPage         | Tìm kiếm real-time với debounce        |
| `/library`      | LibraryPage        | Thư viện cá nhân — yêu thích, đã lưu   |
| `/discover`     | DiscoverPage       | Khám phá — bảng xếp hạng, bài mới      |

---

## Kiến thức áp dụng

### useContext

### useReducer — PlayerContext

### React Router

### Custom Hooks

### useMemo

### useCallback

### useRef

### Axios + Pattern chuẩn

### React Hook Form + Yup

---

## Design System

**Màu chủ đạo:**

```
--accent-1: #1db954  (Spotify Green)
--accent-2: #0d9488  (Teal)
```

**Theme:** Dark / Light — toggle bằng nút ☀️/🌙, lưu vào localStorage

**CSS Variables** — toàn bộ màu sắc qua CSS variable theo `data-theme`

---

## Preview files

Các giao diện:

```
auth.html     → Trang đăng nhập/đăng ký
home.html     → Trang chủ với Sidebar
playlist.html → Chi tiết playlist
player.html   → Trang chủ + Player mini
search.html   → Tìm kiếm (gõ thử được luôn)
library.html  → Thư viện (xóa được bài hát)
discover.html → Khám phá + Bảng xếp hạng
```
