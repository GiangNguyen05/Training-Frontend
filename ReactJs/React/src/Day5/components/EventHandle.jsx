import { useState } from "react";
import "../styles/eventHandle.css";

export default function App() {
  const [items, setItems] = useState(["Học React", "Làm dự án"]);
  const [input, setInput] = useState("");
  const [hover, setHover] = useState(null);

  // onSubmit — thêm item
  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setItems([...items, input.trim()]);
    setInput("");
  }

  // onClick — xóa item, truyền tham số index
  function handleXoa(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  return (
    <div className="wrap">
      <h2>Todo List</h2>

      {/* onSubmit + onChange */}
      <form className="form" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setInput("")}
          placeholder="Nhập công việc ..."
        />
        <button type="submit">Thêm</button>
      </form>

      {/* onClick + onMouseEnter/Leave — truyền tham số */}
      <ul>
        {items.map((item, i) => (
          <li
            key={i}
            className={hover === i ? "hovered" : ""}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span>{item}</span>
            <button onClick={() => handleXoa(i)}>✕</button>
          </li>
        ))}
      </ul>

      {items.length === 0 && <p className="empty">Không còn việc gì!</p>}
    </div>
  );
}
