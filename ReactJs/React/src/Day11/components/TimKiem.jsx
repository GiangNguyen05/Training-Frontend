import { useState } from "react";
import { useDebounce } from "../hooks/Usedebounce.js";
import { useFetch } from "../hooks/useFetch.js";

// Dùng cả 2 custom hook — useDebounce + useFetch
export default function TimKiem() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query); // Đợi 500ms sau khi ngừng gõ

  // Chỉ gọi API khi có từ khoá, dùng debounced để tránh gọi liên tục
  const url = debounced
    ? `https://jsonplaceholder.typicode.com/users?q=${debounced}`
    : null;

  const { data: users, loading } = useFetch(
    url || "https://jsonplaceholder.typicode.com/users",
  );

  const filtered =
    users?.filter((u) =>
      u.name.toLowerCase().includes(debounced.toLowerCase()),
    ) ?? [];

  return (
    <div>
      <input
        className="input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm theo tên..."
      />
      {loading && <p className="status">Đang tìm...</p>}
      <ul className="list">
        {filtered.map((u) => (
          <li key={u.id} className="item">
            <strong>{u.name}</strong>
            <span>{u.email}</span>
          </li>
        ))}
      </ul>
      {!loading && filtered.length === 0 && (
        <p className="status">Không tìm thấy.</p>
      )}
    </div>
  );
}
