import NutDoiTheme from "./NutDoiTheme.jsx";
import "../styles/sideBar.css";
// Component trung gian — KHÔNG nhận props theme, chỉ chứa component con
function Sidebar() {
  return (
    <div className="sidebar">
      <p>Sidebar (không biết gì về theme)</p>
      <NutDoiTheme />
    </div>
  );
}

export default Sidebar;
