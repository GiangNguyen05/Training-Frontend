# Notes App

> React 18 · Vite · Context API · react-hook-form · CRUD · Authentication · localStorage

---

## Tổng quan dự án

Notes App là ứng dụng ghi chú đơn trang (SPA) được xây dựng với React 18. Người dùng phải đăng nhập trước khi truy cập tính năng ghi chú. Sau khi xác thực thành công, người dùng có thể tạo, xem, sửa và xoá ghi chú cá nhân.

**Công nghệ sử dụng**

| Công nghệ       | Mục đích                 |
| --------------- | ------------------------ |
| React           | UI framework             |
| Vite            | Build tool, dev server   |
| react-hook-form | Quản lý và validate form |
| lucide-react    | Icon                     |

**Tính năng chính**

- Trang đăng nhập với validate client-side và server-side error
- Toggle ẩn/hiện mật khẩu
- Ghi chú CRUD đầy đủ (Create, Read, Update, Delete)
- Tìm kiếm ghi chú theo tiêu đề hoặc nội dung
- Xác nhận trước khi xoá
- Lưu trữ bền vững qua localStorage — dữ liệu không mất khi F5 hoặc tắt tab
- Responsive 2 cột (desktop) / 1 cột (mobile)

---

## 2. Cấu trúc thư mục

```
notes-app/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── context/
    │   ├── AuthContext.jsx
    │   ├── NotesContext.jsx
    │   └── notesReducer.js
    ├── hooks/
    │   ├── useLocalStorage.js
    │   └── useNoteSearch.js
    ├── components/
    │   ├── LoginPage.jsx
    │   ├── Header.jsx
    │   ├── NoteForm.jsx
    │   ├── NoteList.jsx
    │   └── NoteCard.jsx
    └── styles/
        └── index.css
```

**Nguyên tắc tổ chức**

- `context/` — tất cả state dùng chung toàn app, không đặt logic ở component
- `hooks/` — custom hook tái sử dụng được, tách logic khỏi UI
- `components/` — mỗi file là một component duy nhất, không trộn lẫn
- `styles/` — CSS tập trung một chỗ, dùng CSS variables để dễ đổi theme

---

## Tài khoản

**Tài khoản demo**

| Tên đăng nhập | Mật khẩu |
| ------------- | -------- |
| Giang         | 000000   |

---

## Kiến trúc ứng dụng

### Provider Tree

```
<AuthProvider>            ← quản lý trạng thái đăng nhập
  <AppRouter>             ← quyết định render trang nào
    <LoginPage />         ← nếu chưa đăng nhập
    — hoặc —
    <NotesProvider>       ← quản lý danh sách ghi chú
      <NotesPage>
        <Header />
        <NoteForm />
        <NoteList>
          <NoteCard />
        </NoteList>
      </NotesPage>
    </NotesProvider>
  </AppRouter>
</AuthProvider>
```

### Lý do NotesProvider nằm bên trong AppRouter

`NotesProvider` chỉ được mount sau khi người dùng đăng nhập thành công. Khi đăng xuất, `NotesProvider` unmount và toàn bộ state ghi chú bị xoá sạch khỏi bộ nhớ. Đây là cách cô lập dữ liệu theo session mà không cần xử lý thủ công.

Nếu đặt `NotesProvider` ngoài `AppRouter`, ghi chú của phiên trước sẽ còn sót lại khi người dùng đăng xuất và người khác đăng nhập vào.

---

## Authentication — Đăng nhập / Đăng xuất

### AuthContext.jsx

**Giải thích thiết kế**

- `user` là `null` khi chưa đăng nhập, là object `{ username }` khi đã đăng nhập. `AppRouter` dùng giá trị này để điều hướng.
- `login()` trả về `{ ok, message }` thay vì throw error — giúp component xử lý cả trường hợp thành công và thất bại mà không cần try/catch.
- `logout()` chỉ đơn giản là set `user` về `null`, React tự re-render và điều hướng về trang đăng nhập.

### AppRouter — điều hướng dựa trên auth state

```jsx
function AppRouter() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <NotesProvider>
      <NotesPage />
    </NotesProvider>
  );
}
```

### LoginPage.jsx — form đăng nhập

**Hai tầng lỗi khác nhau**

| Loại lỗi    | Nguồn                       | Hiển thị                                        |
| ----------- | --------------------------- | ----------------------------------------------- |
| Client-side | react-hook-form (`errors`)  | Ngay dưới từng input, hiện khi blur hoặc submit |
| Server-side | Kết quả trả về từ `login()` | Banner đỏ phía trên nút submit                  |

Tách biệt hai loại lỗi này giúp UX rõ ràng hơn: lỗi nhập thiếu/sai định dạng hiện tại chỗ, lỗi sai tài khoản hiện tổng thể.

---

## Notes — Quản lý ghi chú (CRUD)

### notesReducer.js

Reducer thuần (pure function), không có side effect, dễ test độc lập.

Đặt reducer ở file riêng (`notesReducer.js`) thay vì inline trong context vì:

- Dễ viết unit test (import và gọi trực tiếp, không cần render component)
- Context file chỉ lo phần React (Provider, hook), không trộn lẫn logic

### NotesContext.jsx

Context chỉ expose 3 action function rõ ràng thay vì expose `dispatch` thô ra ngoài. Component con không cần biết cấu trúc action object, chỉ gọi `addNote(data)` là xong.

### CRUD — nơi thực hiện từng thao tác

**Create — Thêm ghi chú mới**

- File: `NoteForm.jsx`
- Khi `editingNote` là `null`, form ở chế độ tạo mới
- Submit gọi `addNote(data)` từ context
- Sau khi thêm thành công, `reset()` làm sạch form

**Read — Hiển thị danh sách**

- File: `NoteList.jsx`
- Đọc `notes` từ `useNotes()`, truyền qua `useNoteSearch()` để lọc
- Render danh sách `NoteCard`
- Hiển thị trạng thái rỗng khi không có ghi chú nào khớp

**Update — Sửa ghi chú**

- File: `NoteCard.jsx` (nút bút chì) → `App.jsx` (set `editingNote`) → `NoteForm.jsx` (form sửa)
- Khi `editingNote` có giá trị, `NoteForm` nhận `defaultValues` từ ghi chú đó
- Submit gọi `updateNote(id, data)`
- Prop `key={editingNote?.id ?? "new"}` trên `NoteForm` đảm bảo form re-mount hoàn toàn khi chuyển giữa các ghi chú khác nhau, tránh lỗi giá trị cũ còn đọng lại

**Delete — Xoá ghi chú**

- File: `NoteCard.jsx`
- Bấm icon thùng rác lần 1: hiện confirm bar (tránh xoá nhầm)
- Bấm "Xoá" trong confirm bar: gọi `deleteNote(id)`
- Bấm "Huỷ": ẩn confirm bar, không làm gì

---

## React Hook Form — Validate form

Dự án dùng `react-hook-form` ở hai nơi: `LoginPage` và `NoteForm`. Cả hai dùng chung pattern nhưng với mục đích khác nhau.

### Pattern chung

```jsx
const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
  defaultValues: { ... }
});
```

| API             | Vai trò                                                              |
| --------------- | -------------------------------------------------------------------- |
| `register`      | Gắn input vào form, khai báo validation rules                        |
| `handleSubmit`  | Wrapper của `onSubmit`, chỉ gọi callback khi tất cả field hợp lệ     |
| `reset`         | Làm sạch hoặc set lại giá trị form                                   |
| `errors`        | Object chứa lỗi của từng field                                       |
| `isSubmitting`  | `true` trong khi đang chạy async submit, dùng để disable nút         |
| `defaultValues` | Giá trị mặc định — quan trọng khi dùng form cho cả Create lẫn Update |

### Validation rules trong NoteForm

```jsx
// Tiêu đề
{...register("title", {
  required: "Vui lòng nhập tiêu đề",
  maxLength: { value: 60, message: "Tối đa 60 ký tự" },
})}

// Nội dung
{...register("content", {
  required: "Vui lòng nhập nội dung",
  minLength: { value: 3, message: "Tối thiểu 3 ký tự" },
})}
```

### Validation rules trong LoginPage

```jsx
// Tên đăng nhập
{...register("username", {
  required: "Vui lòng nhập tên đăng nhập",
  minLength: { value: 3, message: "Tối thiểu 3 ký tự" },
})}

// Mật khẩu
{...register("password", {
  required: "Vui lòng nhập mật khẩu",
  minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
})}
```

### Vì sao chọn react-hook-form thay vì controlled input?

React Hook Form dùng `ref` thay vì `state` để theo dõi giá trị input. Điều này có nghĩa là form không re-render mỗi lần người dùng gõ một ký tự — chỉ re-render khi cần (submit, lỗi thay đổi). Với form nhỏ thì sự khác biệt không rõ, nhưng đây là thói quen tốt cho form lớn hoặc form có nhiều field phức tạp.

---

## Custom Hooks

### useNoteSearch.js

Hook này nhận vào `notes` và trả ra `filteredNotes` đã được lọc. `NoteList` chỉ cần gọi hook và render kết quả — không cần biết bên trong lọc như thế nào.

`useMemo` đảm bảo việc lọc chỉ tính lại khi `notes` hoặc `query` thay đổi, không tính lại mỗi lần component render vì lý do khác.

---

## LocalStorage — Lưu trữ

### Vấn đề cần giải quyết

`useReducer` và `useState` lưu dữ liệu trong bộ nhớ RAM của trình duyệt. Khi người dùng F5 hoặc đóng tab, toàn bộ state bị xoá và app trở về dữ liệu mẫu mặc định. localStorage cho phép ghi dữ liệu xuống đĩa của trình duyệt, tồn tại qua các phiên làm việc.

### useLocalStorage.js — hook tái sử dụng

Hook này tách biệt hoàn toàn logic localStorage ra khỏi context, có thể tái sử dụng cho bất kỳ state nào cần lưu xuống đĩa. Cả đọc lẫn ghi đều được bọc `try/catch` để xử lý trường hợp JSON bị corrupt hoặc storage quota bị đầy.

### Tích hợp vào NotesContext

Thay vì dùng `useLocalStorage` hook trực tiếp (vì `useReducer` cần kiểm soát state), `NotesContext` dùng hai kỹ thuật riêng:

**1. Hàm khởi tạo `initState` — đọc localStorage một lần duy nhất khi mount**

```js
const STORAGE_KEY = "notes_app_data";

function initState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("[NotesContext] Không đọc được localStorage:", err);
  }
  return SEED_NOTES; // fallback nếu chưa có dữ liệu
}
```

Hàm này được truyền vào tham số thứ 3 của `useReducer`:

```js
// Trước — đọc SEED_NOTES mỗi lần render
const [notes, dispatch] = useReducer(notesReducer, SEED_NOTES);

// Sau — chỉ gọi initState() một lần khi mount
const [notes, dispatch] = useReducer(notesReducer, null, initState);
```

Đây là pattern quan trọng: nếu truyền `SEED_NOTES` trực tiếp vào tham số thứ 2 thì giá trị đó vẫn được tính mỗi lần render (dù không dùng). Dùng hàm `initState` ở tham số thứ 3 đảm bảo logic khởi tạo nặng (đọc localStorage, JSON.parse) chỉ chạy đúng một lần.

**2. `useEffect` theo dõi `notes` — ghi localStorage sau mỗi thay đổi**

```js
useEffect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.warn("[NotesContext] Không ghi được localStorage:", err);
  }
}, [notes]);
```

Mỗi khi `notes` thay đổi do ADD / UPDATE / DELETE, effect này tự động chạy và ghi snapshot mới nhất xuống localStorage.

### Sơ đồ hoạt động

```
Lần đầu mở app
  initState() đọc localStorage
       ↓ có dữ liệu          ↓ không có
  load notes cũ         dùng SEED_NOTES
       ↓
  Người dùng thêm / sửa / xoá ghi chú
       ↓
  notesReducer trả về state mới
       ↓
  useEffect[notes] kích hoạt
       ↓
  localStorage.setItem(JSON.stringify(notes))
       ↓
  F5 / đóng tab / mở lại → initState() đọc lại → dữ liệu còn nguyên
```

### Lưu ý: localStorage và phạm vi dữ liệu

localStorage lưu theo **origin** (domain + port), không theo user. Trong app demo này, mọi tài khoản đăng nhập trên cùng một trình duyệt đều chia sẻ chung một kho ghi chú. Để cô lập dữ liệu theo user, key cần được tạo động theo username:

```js
// Thay vì key cố định:
const STORAGE_KEY = "notes_app_data";

// Dùng key theo user:
const STORAGE_KEY = `notes_app_data_${username}`;
```

---

## Luồng dữ liệu toàn app

```
Người dùng nhập form đăng nhập
        ↓
LoginPage.handleSubmit (react-hook-form validate)
        ↓
AuthContext.login() kiểm tra tài khoản
        ↓ ok: true
AuthContext.user được set → AppRouter re-render
        ↓
NotesProvider mount
  └─ initState() đọc localStorage → khôi phục ghi chú cũ (hoặc SEED_NOTES)
        ↓
NotesPage hiển thị
        ↓
─────────────────── CRUD LOOP ───────────────────
NoteForm submit → NotesContext.addNote / updateNote
NoteCard xoá    → NotesContext.deleteNote
  └─ useEffect[notes] → localStorage.setItem (tự động sau mỗi thay đổi)
NoteList render ← NotesContext.notes (qua useNoteSearch)
─────────────────────────────────────────────────
        ↓
Header logout → AuthContext.logout()
        ↓
AuthContext.user = null → AppRouter re-render → LoginPage
NotesProvider unmount → state RAM bị xoá
  └─ Dữ liệu vẫn còn trong localStorage, sẵn sàng cho lần đăng nhập sau
```

---

## Danh sách file và vai trò

| File                           | Loại        | Vai trò                                                                                                   |
| ------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------- |
| `src/main.jsx`                 | Entry point | Mount React app vào `#root`                                                                               |
| `src/App.jsx`                  | Component   | Ghép `AuthProvider` + `AppRouter`, điều hướng Login ↔ Notes                                               |
| `src/context/AuthContext.jsx`  | Context     | Lưu `user` state, cung cấp `login()` và `logout()`, export `useAuth()`                                    |
| `src/context/NotesContext.jsx` | Context     | Lưu `notes` state qua `useReducer`, đồng bộ localStorage, cung cấp 3 action function, export `useNotes()` |
| `src/hooks/useLocalStorage.js` | Hook        | Đọc/ghi localStorage an toàn, có try/catch, tái sử dụng được                                              |
| `src/context/notesReducer.js`  | Logic       | Reducer thuần xử lý ADD / UPDATE / DELETE, chứa màu sắc và dữ liệu mẫu                                    |
| `src/hooks/useLocalStorage.js` | Hook        | Đọc/ghi localStorage an toàn, có try/catch, tái sử dụng được                                              |
| `src/hooks/useNoteSearch.js`   | Hook        | Nhận `notes`, trả về danh sách đã lọc + state ô tìm kiếm                                                  |
| `src/components/LoginPage.jsx` | Component   | Form đăng nhập với react-hook-form, toggle mật khẩu, hiển thị 2 tầng lỗi                                  |
| `src/components/Header.jsx`    | Component   | Logo app, tên người dùng đang đăng nhập, nút Đăng xuất                                                    |
| `src/components/NoteForm.jsx`  | Component   | Form dùng chung cho Create và Update, dùng react-hook-form                                                |
| `src/components/NoteList.jsx`  | Component   | Ô tìm kiếm + lưới ghi chú, trạng thái rỗng                                                                |
| `src/components/NoteCard.jsx`  | Component   | Hiển thị 1 ghi chú, nút sửa/xoá, confirm bar trước khi xoá                                                |
| `src/styles/index.css`         | Style       | Toàn bộ CSS, dùng CSS variables, không phụ thuộc thư viện ngoài                                           |
