import { useState } from "react";
import MainList from "./MainList.jsx";
import TabButton from "./TabButton.jsx";
import members from "../../../data.js";
import "../styles/style.css";

function Main() {
  const [list, setList] = useState(members);
  const addMember = () => {
    const name = prompt("Enter member name:");
    if (!name) return; // Nếu không nhập tên thì thoát luôn
    const newMember = {
      imgSrc: prompt("Enter image URL:"),
      title: name,
      description: prompt("Enter member description:"),
    };
    setList([...list, newMember]);
  };
  const delMember = () => {
    // const nameToDelete = prompt("Enter member name to delete:");
    // setList(list.filter((member) => member.title !== nameToDelete));
    setList(list.slice(0, -1)); // Xóa thành viên cuối cùng trong danh sách
  };
  return (
    <section className="container">
      <h1 className="title-list">List Member</h1>
      <ul className="list">
        {list.map((member, index) => (
          <MainList
            key={index}
            imgSrc={member.imgSrc}
            title={member.title}
            description={member.description}
          />
        ))}
      </ul>
      <div className="btn-group">
        <TabButton onSelect={addMember}>AddMember</TabButton>
        <TabButton onSelect={delMember}>DelMember</TabButton>
      </div>
    </section>
  );
}
export default Main;
