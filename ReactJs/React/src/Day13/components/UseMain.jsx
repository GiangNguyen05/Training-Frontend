import { useState, useMemo, useCallback } from "react";
import NutBam from "./NutBam.jsx";
import "../styles/styles.css";

const ITEMS = [
  { id: 1, ten: "Táo", loai: "trai-cay" },
  { id: 2, ten: "Cam", loai: "trai-cay" },
  { id: 3, ten: "Cà rốt", loai: "rau" },
  { id: 4, ten: "Chuối", loai: "trai-cay" },
  { id: 5, ten: "Bắp cải", loai: "rau" },
];

export default function UseMain() {
  const [boLoc, setBoLoc] = useState("tat-ca");
  const [dem, setDem] = useState(0);

  // useMemo — chỉ filter lại khi boLoc hoặc ITEMS thay đổi
  // Bấm Tăng dem không trigger tính toán lại
  const danhSach = useMemo(() => {
    console.log("useMemo: tính toán filter...");
    return boLoc === "tat-ca" ? ITEMS : ITEMS.filter((i) => i.loai === boLoc);
  }, [boLoc]);

  // useCallback — giữ nguyên địa chỉ hàm khi dem thay đổi
  // NutBam nhận onClick sẽ không re-render theo khi dem tăng
  const handleBoLoc = useCallback((loai) => {
    setBoLoc(loai);
  }, []); // Không deps → tạo 1 lần duy nhất

  return (
    <div className="wrap">
      <h2>useCallback + useMemo</h2>
      <p className="hint">Mở Console</p>

      {/* dem thay đổi nhưng NutBam KHÔNG re-render nhờ useCallback */}
      <div className="section">
        <p className="label">State không liên quan</p>
        <div className="row">
          <span className="dem">{dem}</span>
          <button onClick={() => setDem(dem + 1)}>Tăng dem</button>
        </div>
        <p className="note">Bấm Tăng dem</p>
      </div>

      {/* Bộ lọc */}
      <div className="section">
        <p className="label">Bộ lọc</p>
        <div className="row">
          <NutBam label="Tất cả" onClick={() => handleBoLoc("tat-ca")} />
          <NutBam label="Trái cây" onClick={() => handleBoLoc("trai-cay")} />
          <NutBam label="Rau" onClick={() => handleBoLoc("rau")} />
        </div>
      </div>

      {/* Danh sách  */}
      <div className="section">
        <p className="label">Danh sách</p>
        <ul>
          {danhSach.map((item) => (
            <li key={item.id}>{item.ten}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
