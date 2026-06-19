import { useTheme } from "../context/ThemeContext.jsx";
import "../styles/nut.css";
// Component sâu nhất — lấy thẳng theme qua useContext, không cần props
function NutDoiTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="nut-theme"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? "  Dark" : "  Light"}
    </button>
  );
}

export default NutDoiTheme;
