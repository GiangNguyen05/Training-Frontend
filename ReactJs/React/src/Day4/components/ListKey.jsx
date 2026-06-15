import { useState } from "react";
import "../styles/listKey.css";
import TheSanPham from "./TheSanPham.jsx";

const INITIAL = [
  { id: 1, ten: "Áo thun", gia: 150000, conHang: true },
  { id: 2, ten: "Quần jean", gia: 450000, conHang: false },
  { id: 3, ten: "Giày", gia: 890000, conHang: true },
];

export default function App() {
  const [danhSach, setDanhSach] = useState(INITIAL);
  const [ten, setTen] = useState("");
  const [gia, setGia] = useState("");

  function themMoi() {
    if (!ten || !gia) return;
    setDanhSach([
      { id: Date.now(), ten, gia: Number(gia), conHang: true },
      ...danhSach, // Thêm vào đầu → thấy rõ key hoạt động đúng
    ]);
    setTen("");
    setGia("");
  }

  function xoaItem(id) {
    setDanhSach(danhSach.filter((sp) => sp.id !== id));
  }

  return (
    <div className="wrap">
      <h2>Danh sách sản phẩm</h2>

      {/* Form thêm mới */}
      <div className="form">
        <input
          placeholder="Tên sản phẩm"
          value={ten}
          onChange={(e) => setTen(e.target.value)}
        />
        <input
          placeholder="Giá"
          type="number"
          value={gia}
          onChange={(e) => setGia(e.target.value)}
        />
        <button onClick={themMoi}>Thêm</button>
      </div>

      {/* Render list — key là id duy nhất */}
      {danhSach.map((sp) => (
        <TheSanPham key={sp.id} sp={sp} onXoa={xoaItem} />
      ))}

      {danhSach.length === 0 && <p className="empty">Danh sách trống.</p>}
    </div>
  );
}
