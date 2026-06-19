import LayOut from "./LayOut.jsx";
import { ThemeProvider, useTheme } from "../context/ThemeContext.jsx";
import "../styles/useContext.css";
function AppContent() {
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <h2>useContext — Theme Switcher</h2>
      <LayOut />
    </div>
  );
}
export default function UseContext() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
