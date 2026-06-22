import { Link } from "react-router-dom";
import "../styles/page.css";

export const BAI_HAT = [
  { id: 1, ten: "Nơi này có anh", ca_si: "Sơn Tùng M-TP", the_loai: "V-Pop" },
  { id: 2, ten: "Chạy ngay đi", ca_si: "Sơn Tùng M-TP", the_loai: "V-Pop" },
  { id: 3, ten: "Blinding Lights", ca_si: "The Weeknd", the_loai: "Pop" },
  { id: 4, ten: "Shape of You", ca_si: "Ed Sheeran", the_loai: "Pop" },
];

export default function Songs() {
  return (
    <div className="page">
      <h2>Danh sách bài hát</h2>
      <div className="list">
        {BAI_HAT.map((bh) => (
          // Link đến dynamic route /bai-hat/:id
          <Link key={bh.id} to={`/bai-hat/${bh.id}`} className="card">
            <div className="thumb">🎵</div>
            <div>
              <p className="ten">{bh.ten}</p>
              <p className="sub">
                {bh.ca_si} · {bh.the_loai}
              </p>
            </div>
            <span className="arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
