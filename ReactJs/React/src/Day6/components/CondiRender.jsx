import { useState } from "react";
import "../styles/condiRender.css";

// Cách 1 — if/else: trả về giao diện hoàn toàn khác
function ManHinh({ buoc }) {
  if (buoc === 1) return <div className="step"> Nhập thông tin</div>;
  if (buoc === 2) return <div className="step"> Xác nhận</div>;
  return <div className="step done"> Hoàn tất!</div>;
}

export default function CondiRender() {
  const [daDangNhap, setDaDangNhap] = useState(false);
  const [buoc, setBuoc] = useState(1);
  const [soTin, setSoTin] = useState(3);

  return (
    <div className="wrap">
      <h2>Conditional Rendering</h2>

      {/* Cách 2 — Ternary ? : — một trong hai */}
      <section>
        <p className="label">
          Ternary <code>? :</code>
        </p>
        <button onClick={() => setDaDangNhap(!daDangNhap)}>
          {daDangNhap ? "Đăng xuất" : "Đăng nhập"}
        </button>
        <p className="status">
          {daDangNhap ? " Đã đăng nhập" : " Chưa đăng nhập"}
        </p>
      </section>

      {/* Cách 3 — && — hiện hoặc ẩn */}
      <section>
        <p className="label">
          Toán tử <code>&&</code>
        </p>
        <div className="row">
          <button onClick={() => setSoTin(soTin + 1)}>+1</button>
          <button onClick={() => setSoTin(Math.max(0, soTin - 1))}>-1</button>
          {soTin > 0 && <span className="badge">{soTin} tin mới</span>}
        </div>
      </section>

      {/* Cách 1 — if/else qua component */}
      <section>
        <p className="label">if/else — nhiều bước</p>
        <ManHinh buoc={buoc} />
        <div className="row">
          <button onClick={() => setBuoc(Math.max(1, buoc - 1))}>
            ← Quay lại
          </button>
          <button onClick={() => setBuoc(Math.min(3, buoc + 1))}>
            Tiếp theo →
          </button>
        </div>
      </section>
    </div>
  );
}
