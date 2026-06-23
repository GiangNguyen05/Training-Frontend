import { useState } from "react";
import DanhSach from "./DanhSach.jsx";
import TimKiem from "./TimKiem.jsx";
import "../styles/customHook.css";

const TABS = ["Danh sách", "Tìm kiếm"];

export default function CustomHook() {
  const [tab, setTab] = useState(0);

  return (
    <div className="wrap">
      <h2>Custom Hooks Demo</h2>
      <p className="sub">useFetch · useDebounce</p>

      <div className="tabs">
        {TABS.map((t, i) => (
          <button
            key={i}
            className={tab === i ? "active" : ""}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <DanhSach url="https://jsonplaceholder.typicode.com/users" />
      )}
      {tab === 1 && <TimKiem />}
    </div>
  );
}
