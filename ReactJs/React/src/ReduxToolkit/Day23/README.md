# Dùng RTK Query trong Components

## Hai loại hook chính: Query Hook và Mutation Hook

RTK Query tự sinh ra hook dựa theo tên endpoint bạn khai báo:

| Endpoint khai báo                  | Hook tự sinh         | Dùng cho                           |
| ---------------------------------- | -------------------- | ---------------------------------- |
| `builder.query({ getBooks... })`   | `useGetBooksQuery`   | Đọc dữ liệu (GET)                  |
| `builder.mutation({ addBook... })` | `useAddBookMutation` | Thay đổi dữ liệu (POST/PUT/DELETE) |

**Khác biệt cốt lõi:** Query hook **tự động gọi API ngay khi component mount**. Mutation hook **không tự gọi** — nó trả về 1 hàm, bạn phải tự gọi hàm đó khi có sự kiện (bấm nút, submit form...).

---

## Dùng Query Hook — đọc dữ liệu

### Cách dùng cơ bản

```javascript
import { useGetBooksQuery } from "../features/api/booksApi";

function BookList() {
  const { data, isLoading, isError, error } = useGetBooksQuery();

  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Lỗi: {error.message}</p>;

  return (
    <ul>
      {data.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
}
```

### Truyền tham số

Tham số được truyền trực tiếp làm argument đầu tiên của hook — đây chính là giá trị sẽ được đưa vào hàm `query` bạn khai báo trong `createApi`:

```javascript
// Khai báo: getBooksByGenre: builder.query({ query: (genre) => `/books?genre=${genre}` })

function BookList({ genre }) {
  const { data } = useGetBooksByGenreQuery(genre);
  // ...
}
```

**Lưu ý:** nếu `genre` đổi giá trị giữa các lần render, RTK Query **tự động gọi lại API** với tham số mới — không cần tự viết `useEffect` để theo dõi thay đổi.

### Toàn bộ giá trị trả về của Query Hook

```javascript
const {
  data, // Dữ liệu trả về — undefined nếu chưa có
  currentData, // Dữ liệu ứng với tham số HIỆN TẠI (khác `data` khi tham số vừa đổi)
  isLoading, // true CHỈ ở lần fetch đầu tiên (chưa từng có data)
  isFetching, // true ở MỌI lần đang fetch, kể cả refetch nền
  isSuccess, // true khi đã có data hợp lệ
  isError, // true khi có lỗi
  error, // Chi tiết lỗi
  refetch, // Hàm gọi lại API thủ công
} = useGetBooksQuery(genre);
```

### Phân biệt `isLoading` và `isFetching` — điểm dễ nhầm nhất

```javascript
// ❌ Dùng isLoading cho refetch nền -> màn hình bị "giật" mất hết dữ liệu cũ
if (isLoading) return <Spinner />;

// ✅ Dùng isFetching để hiện chỉ báo nhỏ, vẫn giữ dữ liệu cũ hiển thị
return (
  <div>
    {isFetching && <SmallSpinnerCorner />}
    <BookGrid books={data} />
  </div>
);
```

`isLoading` chỉ nên dùng cho **màn hình trắng lần đầu** (chưa có gì để hiện). Khi đã có `data` rồi và đang refetch nền (do đổi tham số, do polling, do focus lại tab...), nên dùng `isFetching` để không làm giao diện giật cục mỗi lần load lại.

---

## Dùng Mutation Hook — thay đổi dữ liệu

### Cách dùng cơ bản

```javascript
import { useAddBookMutation } from "../features/api/booksApi";

function AddBookForm() {
  const [addBook, { isLoading, isError, error }] = useAddBookMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addBook({ title: "Sách mới", author: "Tác giả A" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Đang lưu..." : "Thêm sách"}
      </button>
      {isError && <p>Lỗi: {error.message}</p>}
    </form>
  );
}
```

Chú ý cấu trúc: **query hook trả về 1 object**, còn **mutation hook trả về 1 mảng** `[hàm trigger, object trạng thái]` — giống cú pháp `useState`.

### Đọc kết quả trả về sau khi mutation thành công

Gọi hàm trigger trả về 1 Promise đặc biệt, có thể `.unwrap()` để lấy trực tiếp dữ liệu hoặc bắt lỗi bằng `try/catch`:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const newBook = await addBook({ title: "Sách mới" }).unwrap();
    console.log("Thêm thành công, id mới:", newBook.id);
    navigate(`/books/${newBook.id}`);
  } catch (err) {
    console.error("Thêm thất bại:", err);
  }
};
```

**Không dùng `.unwrap()`** nếu chỉ cần đọc `isError`/`error` từ state trả về của hook (cách ở mục 3.1) — 2 cách đều hợp lệ, tuỳ nhu cầu: cần làm gì đó ngay sau khi thành công (chuyển trang, hiện toast) thì dùng `.unwrap()`; chỉ cần hiển thị trạng thái trong UI thì dùng state trả về là đủ.

---

## `useLazyQuery` — khi không muốn tự gọi lúc mount

Query hook bình thường **tự gọi ngay khi mount** — không phù hợp cho các trường hợp như "chỉ tìm kiếm khi bấm nút", "chỉ tải khi mở dropdown". Lúc này dùng bản `useLazyXxxQuery`:

```javascript
import { useLazySearchBooksQuery } from "../features/api/booksApi";

function SearchBox() {
  const [triggerSearch, { data, isFetching }] = useLazySearchBooksQuery();
  const [keyword, setKeyword] = useState("");

  return (
    <div>
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <button onClick={() => triggerSearch(keyword)}>Tìm kiếm</button>
      {isFetching && <p>Đang tìm...</p>}
      {data?.map((book) => (
        <p key={book.id}>{book.title}</p>
      ))}
    </div>
  );
}
```

---

## Khi nào dùng gì — bảng quyết định nhanh

| Tình huống                                                         | Nên dùng                                         |
| ------------------------------------------------------------------ | ------------------------------------------------ |
| Hiển thị danh sách/dữ liệu ngay khi component mount                | `useGetXxxQuery`                                 |
| Tìm kiếm chỉ khi bấm nút, không tự động gọi theo mỗi ký tự         | `useLazyXxxQuery`                                |
| Submit form, thêm/sửa/xoá dữ liệu                                  | `useXxxMutation`                                 |
| Cần làm gì đó ngay sau khi mutation thành công (điều hướng, toast) | `useXxxMutation` + `.unwrap()` trong `try/catch` |
| Dữ liệu cần cập nhật gần real-time mà không cần WebSocket          | `useGetXxxQuery(arg, { pollingInterval: ... })`  |
| Chỉ gọi API khi đã có đủ điều kiện (ví dụ: đã chọn 1 filter)       | `useGetXxxQuery(arg, { skip: !arg })`            |

---

## Những lưu ý quan trọng khi dùng trong component

### Đừng gọi query hook có điều kiện bằng `if`

Hook trong React phải được gọi **theo đúng thứ tự cố định mỗi lần render** — không được đặt trong `if`.

```javascript
// ❌ Vi phạm Rules of Hooks
if (userId) {
  const { data } = useGetUserQuery(userId);
}
```

```javascript
// ✅ Luôn gọi hook, dùng `skip` để kiểm soát có gọi API hay không
const { data } = useGetUserQuery(userId, { skip: !userId });
```

### Nhiều component cùng gọi 1 query — không cần lo trùng lặp

```javascript
// Component A
useGetBooksQuery("fiction");

// Component B (ở nơi khác trong cây component)
useGetBooksQuery("fiction");
```

Cả 2 component trên **chỉ tạo ra 1 request thật sự** — RTK Query tự nhận diện cùng tham số và dùng chung cache. Đây là lợi ích lớn so với việc mỗi component tự `useEffect` + `fetch` riêng.

### Đừng lưu lại `data` vào `useState` nội bộ nếu không cần thiết

```javascript
// ❌ Thừa thãi — tạo thêm 1 nguồn dữ liệu không đồng bộ với cache
const { data } = useGetBooksQuery();
const [books, setBooks] = useState(data);
useEffect(() => setBooks(data), [data]);
```

```javascript
// ✅ Dùng thẳng `data` từ hook — luôn đồng bộ với cache của RTK Query
const { data: books } = useGetBooksQuery();
```

Việc tự chép `data` sang `useState` khiến bạn mất đi lợi ích tự động cập nhật của RTK Query — khi cache thay đổi (do `invalidatesTags` từ nơi khác), state nội bộ đó sẽ không tự cập nhật theo.

### `data` có thể `undefined` — luôn xử lý trạng thái loading trước khi render

```javascript
// ❌ Lỗi runtime nếu data chưa về kịp
return <ul>{data.map(...)}</ul>;

// ✅ Luôn kiểm tra trước
if (isLoading) return <Spinner />;
return <ul>{data.map(...)}</ul>;
```

### Không cần `useEffect` để "đồng bộ" dữ liệu từ RTK Query vào Redux state khác

Nếu bạn thấy mình đang viết:

```javascript
// ❌ Dấu hiệu đang dùng sai mô hình
useEffect(() => {
  if (data) dispatch(setBooksToSomeOtherSlice(data));
}, [data]);
```

— đây thường là dấu hiệu thiết kế chưa đúng. Cache của RTK Query **chính là nguồn dữ liệu** — component khác cần dùng chung dữ liệu này nên gọi lại đúng hook đó (sẽ dùng chung cache, không gọi lại API) thay vì đi vòng qua 1 slice Redux khác.

---

## Tổng kết

| Khái niệm                            | Ghi nhớ                                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| Query hook                           | Tự gọi khi mount, trả về object `{ data, isLoading, ... }`                         |
| Mutation hook                        | Không tự gọi, trả về mảng `[trigger, { isLoading, ... }]`                          |
| `isLoading`                          | Chỉ dùng cho lần tải đầu tiên, chưa có data                                        |
| `isFetching`                         | Dùng cho mọi lần đang tải, kể cả refetch nền — không làm mất data cũ đang hiển thị |
| `.unwrap()`                          | Dùng khi cần `try/catch` xử lý logic ngay sau mutation (điều hướng, toast)         |
| `skip`                               | Cách đúng để "gọi hook có điều kiện" mà không vi phạm Rules of Hooks               |
| Nhiều component cùng 1 query         | Tự động dùng chung cache, không lo gọi API trùng                                   |
| Không tự chép `data` sang `useState` | Giữ nguyên lợi ích tự động cập nhật cache của RTK Query                            |
