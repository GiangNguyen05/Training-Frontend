# Notes App

> React 18 · Vite · Context API · react-hook-form · CRUD · Authentication

---

## Tổng quan dự án

**Công nghệ sử dụng**

| Công nghệ       | Phiên bản | Mục đích                 |
| --------------- | --------- | ------------------------ |
| React           | 18.x      | UI framework             |
| Vite            | 5.x       | Build tool, dev server   |
| react-hook-form | 7.x       | Quản lý và validate form |
| lucide-react    | 0.383.x   | Icon                     |

**Tính năng chính**

- Trang đăng nhập với validate client-side và server-side error
- Toggle ẩn/hiện mật khẩu
- Ghi chú CRUD đầy đủ (Create, Read, Update, Delete)
- Tìm kiếm ghi chú theo tiêu đề hoặc nội dung
- Xác nhận trước khi xoá
- Responsive 2 cột (desktop) / 1 cột (mobile)

---

## Cấu trúc thư mục

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

### Tại sao NotesProvider nằm bên trong AppRouter?

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

Không cần React Router. Toàn bộ điều hướng chỉ là một điều kiện `if` đọc từ context — đủ cho app một luồng tuyến tính như thế này.

### LoginPage.jsx — form đăng nhập

```jsx
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm({
  defaultValues: { username: "", password: "" },
});

const onSubmit = async (data) => {
  setServerError("");
  await new Promise((r) => setTimeout(r, 500)); // giả lập network delay
  const result = login(data);
  if (!result.ok) {
    setServerError(result.message);
  }
};
```

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

```js
export function notesReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [
        {
          id: crypto.randomUUID(),
          ...action.payload,
          color: COLORS[state.length % COLORS.length],
          createdAt: Date.now(),
        },
        ...state,
      ];
    case "UPDATE":
      return state.map((note) =>
        note.id === action.payload.id
          ? { ...note, ...action.payload.data }
          : note,
      );
    case "DELETE":
      return state.filter((note) => note.id !== action.payload.id);
    default:
      return state;
  }
}
```

Đặt reducer ở file riêng (`notesReducer.js`) thay vì inline trong context vì:

- Dễ viết unit test (import và gọi trực tiếp, không cần render component)
- Context file chỉ lo phần React (Provider, hook), không trộn lẫn logic

### NotesContext.jsx

```jsx
export function NotesProvider({ children }) {
  const [notes, dispatch] = useReducer(notesReducer, SEED_NOTES);

  const addNote = (data) => dispatch({ type: "ADD", payload: data });
  const updateNote = (id, data) =>
    dispatch({ type: "UPDATE", payload: { id, data } });
  const deleteNote = (id) => dispatch({ type: "DELETE", payload: { id } });

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
}
```

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

## Custom Hook

- useNoteSearch.js

Hook này nhận vào `notes` và trả ra `filteredNotes` đã được lọc. `NoteList` chỉ cần gọi hook và render kết quả — không cần biết bên trong lọc như thế nào.

`useMemo` đảm bảo việc lọc chỉ tính lại khi `notes` hoặc `query` thay đổi, không tính lại mỗi lần component render vì lý do khác.

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
NotesProvider mount, NotesPage hiển thị
        ↓
─────────────────── CRUD LOOP ───────────────────
NoteForm submit → NotesContext.addNote / updateNote
NoteCard xoá    → NotesContext.deleteNote
NoteList render ← NotesContext.notes (qua useNoteSearch)
─────────────────────────────────────────────────
        ↓
Header logout → AuthContext.logout()
        ↓
AuthContext.user = null → AppRouter re-render → LoginPage
NotesProvider unmount → toàn bộ notes bị xoá khỏi memory
```

---

## Danh sách file và vai trò

| File                           | Loại      | Vai trò                                                                             |
| ------------------------------ | --------- | ----------------------------------------------------------------------------------- |
| `src/context/AuthContext.jsx`  | Context   | Lưu `user` state, cung cấp `login()` và `logout()`, export `useAuth()`              |
| `src/context/NotesContext.jsx` | Context   | Lưu `notes` state qua `useReducer`, cung cấp 3 action function, export `useNotes()` |
| `src/context/notesReducer.js`  | Logic     | Reducer thuần xử lý ADD / UPDATE / DELETE, chứa màu sắc và dữ liệu mẫu              |
| `src/hooks/useNoteSearch.js`   | Hook      | Nhận `notes`, trả về danh sách đã lọc + state ô tìm kiếm                            |
| `src/components/MainNote.jsx`  | Component | Ghép `AuthProvider` + `AppRouter`, điều hướng Login ↔ Notes                         |
| `src/components/LoginPage.jsx` | Component | Form đăng nhập với react-hook-form, toggle mật khẩu, hiển thị 2 tầng lỗi            |
| `src/components/Header.jsx`    | Component | Logo app, tên người dùng đang đăng nhập, nút Đăng xuất                              |
| `src/components/NoteForm.jsx`  | Component | Form dùng chung cho Create và Update, dùng react-hook-form                          |
| `src/components/NoteList.jsx`  | Component | Ô tìm kiếm + lưới ghi chú, trạng thái rỗng                                          |
| `src/components/NoteCard.jsx`  | Component | Hiển thị 1 ghi chú, nút sửa/xoá, confirm bar trước khi xoá                          |
| `src/styles/noteApp.css`       | Style     | Toàn bộ CSS, dùng CSS variables, không phụ thuộc thư viện ngoài                     |
