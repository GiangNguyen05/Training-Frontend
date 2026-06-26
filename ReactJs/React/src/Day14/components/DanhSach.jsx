import userService from "../api/services/userService.js";
import { useApi } from "../hooks/useApi.js";

//GET
export default function DanhSachUser() {
  const { data: users, loading, error } = useApi(() => userService.getAll());

  if (loading) return <p className="status">Đang tải...</p>;
  if (error) return <p className="status error">{error}</p>;

  return (
    <ul className="list">
      {users.slice(0, 5).map((u) => (
        <li key={u.id} className="item">
          <strong>{u.name}</strong>
          <span>{u.email}</span>
        </li>
      ))}
    </ul>
  );
}
