import { NavLink, Outlet } from "react-router-dom";
import "../styles/layout.css";

export default function Layout() {
  return (
    <div className="app">
      <nav>
        <span className="logo">My MusicApp</span>
        <div className="links">
          <NavLink to="/" end>
            Trang chủ
          </NavLink>
          <NavLink to="/bai-hat">Bài hát</NavLink>
        </div>
      </nav>
      <main>
        <Outlet /> {/* Component con render ở đây */}
      </main>
    </div>
  );
}
