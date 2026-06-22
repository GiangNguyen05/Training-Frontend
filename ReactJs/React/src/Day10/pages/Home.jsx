import { Link } from "react-router-dom";
import "../styles/page.css";

export default function Home() {
  return (
    <div className="page">
      <h1>Thư viện âm nhạc</h1>
      <p>Bài hát yêu thích của tôi</p>
      <Link to="/bai-hat" className="btn">
        Bài hát →
      </Link>
    </div>
  );
}
