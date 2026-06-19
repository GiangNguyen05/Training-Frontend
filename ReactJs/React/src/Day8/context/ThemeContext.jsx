import { createContext, useContext, useState } from "react";

// Tạo Context
const ThemeContext = createContext(null);

// Provider — bọc ở App, bơm dữ liệu vào value
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook — gọn hơn khi gọi useContext(ThemeContext) ở mọi nơi
export function useTheme() {
  return useContext(ThemeContext);
}
