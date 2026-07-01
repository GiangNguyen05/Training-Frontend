import { StickyNote } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="brand">
        <StickyNote size={22} />
        <span>Notes</span>
      </div>

      <div className="header-right">
        {user && (
          <div className="user-bar">
            <span className="user-name">👤 {user.username}</span>
            <button className="btn ghost small" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
