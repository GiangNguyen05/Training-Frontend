import Sidebar from "./SideBar.jsx";
import "../styles/layOut.css";
// Component trung gian — KHÔNG nhận props theme, chỉ chứa component con
function LayOut() {
  return (
    <div className="layout">
      <p>Layout (không biết gì về theme)</p>
      <Sidebar />
    </div>
  );
}

export default LayOut;
