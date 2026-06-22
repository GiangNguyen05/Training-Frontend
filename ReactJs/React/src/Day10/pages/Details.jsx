import { useParams, useNavigate } from "react-router-dom";
import { BAI_HAT } from "./Songs";
import "../styles/page.css";

export default function Details() {
  const { id } = useParams(); // Lấy :id từ URL
  const navigate = useNavigate();
  const baiHat = BAI_HAT.find((bh) => bh.id === Number(id));

  if (!baiHat) return <p>Không tìm thấy bài hát.</p>;

  return (
    <div className="page">
      <button className="back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>
      <div className="detail">
        <div className="big-thumb">🎵</div>
        <h2>{baiHat.ten}</h2>
        <p className="sub">
          {baiHat.ca_si} · {baiHat.the_loai}
        </p>
        <div className="player">
          <button>⏮</button>
          <button className="play">▶</button>
          <button>⏭</button>
        </div>
      </div>
    </div>
  );
}
