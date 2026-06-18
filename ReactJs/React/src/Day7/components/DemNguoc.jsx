import { useState, useRef } from 'react'
function DemNguoc() {
  const [giay, setGiay] = useState(10);
  const [daBD, setDaBD] = useState(false);
  const timerRef = useRef(null); // Lưu timer ID
  const inputRef = useRef(null); // Trỏ đến DOM input

  function batDau() {
    setDaBD(true);
    timerRef.current = setInterval(() => {
      setGiay((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setDaBD(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function reset() {
    clearInterval(timerRef.current); // Hủy timer qua ref
    setGiay(10);
    setDaBD(false);
    inputRef.current.focus(); // Focus input qua ref
  }

  return (
    <div className="timer">
      <input ref={inputRef} className="timer-input" placeholder="Ghi chú..." />
      <div className="timer-row">
        <span className={`count ${giay <= 3 ? "red" : ""}`}>{giay}s</span>
        <button onClick={batDau} disabled={daBD}>
          Bắt đầu
        </button>
        <button onClick={reset}>Reset & Focus</button>
      </div>
    </div>
  );
}
export default DemNguoc;
