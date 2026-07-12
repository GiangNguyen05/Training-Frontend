import { useGetBooksQuery, useAddBookMutation } from "../features/booksApi";

export default function BookList() {
  const { data: books, isLoading } = useGetBooksQuery();
  const [addBook] = useAddBookMutation();

  const handleAdd = () => {
    addBook({ title: "Sách mới", author: "Tác giả A" });
    // Không cần tự gọi lại getBooks — invalidatesTags đã lo việc đó
  };

  if (isLoading) return <p>Đang tải...</p>;

  return (
    <div>
      <button onClick={handleAdd}>Thêm sách</button>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} — {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}
