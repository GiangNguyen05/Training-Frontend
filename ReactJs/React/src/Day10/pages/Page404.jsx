import { Link } from "react-router-dom";
import "../styles/page.css";

export default function Page404() {
  return (
    <div className="page center">
      <p style={{ fontSize: "3rem" }}>😵</p>
      <h2>404 — Không tìm thấy trang</h2>
      <Link to="/" className="btn">
        Về trang chủ
      </Link>
    </div>
  );
}
