import { useFetch } from "../hooks/useFetch.js";

// Dùng useFetch — không cần viết lại useState + useEffect
export default function DanhSach({ url }) {
  const { data: users, loading, error } = useFetch(url);

  if (loading) return <p className="status">Đang tải...</p>;
  if (error) return <p className="status error">Lỗi: {error}</p>;

  return (
    <ul className="list">
      {users.map((u) => (
        <li key={u.id} className="item">
          <strong>{u.name}</strong>
          <span>{u.email}</span>
        </li>
      ))}
    </ul>
  );
}
