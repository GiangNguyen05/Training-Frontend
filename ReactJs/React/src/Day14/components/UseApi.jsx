import { useState } from "react";
import DanhSach from "./DanhSach.jsx";
import TaoUser from "./TaoUser.jsx";
import "../styles/useApi.css";

export default function UseApi() {
  const [tab, setTab] = useState("danh-sach");

  return (
    <div className="wrap">
      <h2>Axios Demo</h2>
      <div className="tabs">
        <button
          className={tab === "danh-sach" ? "active" : ""}
          onClick={() => setTab("danh-sach")}
        >
          Danh sách
        </button>
        <button
          className={tab === "tao-moi" ? "active" : ""}
          onClick={() => setTab("tao-moi")}
        >
          Tạo mới
        </button>
      </div>
      {tab === "danh-sach" ? <DanhSach /> : <TaoUser />}
    </div>
  );
}
