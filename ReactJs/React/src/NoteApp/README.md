# Notes App

## Công nghệ sử dụng

- **Context API** (`useContext` + `useReducer`) — quản lý state ghi chú toàn cục
- **react-hook-form** — quản lý & validate form (thêm/sửa ghi chú)
- **lucide-react** — bộ icon

## Cấu trúc thư mục

```
notes-app/
└── src/
    ├── main.jsx                  # entry point
    ├── App.jsx                   # ghép layout + provider
    ├── context/
    │   ├── NotesContext.jsx      # NotesProvider + hook useNotes()
    │   └── notesReducer.js       # reducer thuần (ADD / UPDATE / DELETE) + dữ liệu mẫu
    ├── hooks/
    │   └── useNoteSearch.js      # custom hook lọc/tìm kiếm ghi chú
    ├── components/
    │   ├── Header.jsx
    │   ├── NoteForm.jsx          # form thêm/sửa, dùng react-hook-form
    │   ├── NoteList.jsx          # danh sách + ô tìm kiếm
    │   └── NoteCard.jsx          # 1 thẻ ghi chú, có nút sửa/xoá
    └── styles/
        └── index.css             # style toàn cục
```

## Tính năng CRUD

| Hành động  | Nơi xử lý                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| **Create** | `NoteForm` gọi `addNote()` từ context khi submit thành công                                                        |
| **Read**   | `NoteList` đọc `notes` từ context, lọc qua `useNoteSearch`                                                         |
| **Update** | Bấm icon bút chì trên `NoteCard` → `App` set `editingNote` → `NoteForm` load `defaultValues` và gọi `updateNote()` |
| **Delete** | Bấm icon thùng rác trên `NoteCard` → xác nhận → gọi `deleteNote()`                                                 |

## Ghi chú thiết kế

- State được quản lý bằng `useReducer` bên trong `NotesProvider`, tránh việc phải truyền props qua nhiều cấp (prop drilling).
- `NoteForm` dùng chung cho cả tạo mới và chỉnh sửa, phân biệt qua prop `editingNote`.
- Validate ở client bằng rules của `react-hook-form` (`required`, `minLength`, `maxLength`), hiển thị lỗi ngay dưới từng field.
