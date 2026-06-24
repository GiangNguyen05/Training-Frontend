import { useState, useEffect, useRef } from "react";

// Custom Hook — đóng gói toàn bộ logic đếm ngược
export function useDemNguoc(giayBatDau = 10) {
  const [giay, setGiay] = useState(giayBatDau);
  const [daBD, setDaBD] = useState(false);
  const timerRef = useRef(null);

  // Bắt đầu đếm
  function batDau() {
    if (daBD) return;
    setDaBD(true);
  }

  // Reset về ban đầu
  function reset() {
    clearInterval(timerRef.current);
    setGiay(giayBatDau);
    setDaBD(false);
  }

  // Effect chạy khi daBD = true
  useEffect(() => {
    if (!daBD) return;

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

    return () => clearInterval(timerRef.current);
  }, [daBD]);

  return { giay, daBD, batDau, reset };
}
