import { useState } from "react";
import ThanhTimKiem from "./ThanhTimKiem.jsx";
import DemNguoc from "./DemNguoc.jsx";
import DanhSach from "./DanhSach.jsx";
import "../styles/lRef.css";
const SAN_PHAM = [
  "Áo thun",
  "Quần jean",
  "Giày sneaker",
  "Mũ lưỡi trai",
  "Áo khoác",
];

export default function LRef() {
  const [tuKhoa, setTuKhoa] = useState(""); // Lifted state

  const ketQua = SAN_PHAM.filter((sp) =>
    sp.toLowerCase().includes(tuKhoa.toLowerCase()),
  );

  return (
    <div className="wrap">
      <section>
        <h3>Lifting State Up</h3>
        <p className="note">
          State <code>tuKhoa</code> đặt ở App — cả 2 component con đều dùng được
        </p>
        <ThanhTimKiem onThayDoi={setTuKhoa} />
        <DanhSach items={ketQua} />
      </section>

      <section>
        <h3>useRef</h3>
        <p className="note">
          <code>timerRef</code> lưu timer · <code>inputRef</code> focus DOM
        </p>
        <DemNguoc />
      </section>
    </div>
  );
}
