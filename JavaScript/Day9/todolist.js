const API = "http://localhost:8000";
const newTbody = document.querySelector("#list tbody");
const blogs = document.querySelector("#blogsForm");

const escape = (str) =>
  str?.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") ?? "";

const tableList = async () => {
  const res = await fetch(`${API}/blogs`);
  const data = await res.json();

  newTbody.innerHTML = data
    .map(
      (e) => `
    <tr>
      <td>${e.id}</td>
      <td>${escape(e.title)}</td>
      <td>${escape(e.author)}</td>
      <td>${escape(e.content)}</td>
      <td><button class="btnDel" data-id="${e.id}">Del</button></td>
    </tr>
  `,
    )
    .join("");
};

tableList();

blogs.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newBlogs = {
    title: document.querySelector("#title").value,
    author: document.querySelector("#author").value,
    content: document.querySelector("#content").value,
  };
  try {
    const res = await fetch(`${API}/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBlogs),
    });
    if (!res.ok) throw new Error("Gửi dữ liệu thất bại!");
    alert("Đã thêm blog mới thành công!");
    blogs.reset();
    tableList();
  } catch (error) {
    console.error("Lỗi kết nối:", error);
    alert("Có lỗi xảy ra, vui lòng thử lại!");
  }
});

newTbody.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("btnDel")) return;

  const id = e.target.getAttribute("data-id");
  if (!confirm("Bạn có chắc chắn muốn xóa blog này không?")) return;

  try {
    const res = await fetch(`${API}/blogs/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Xóa thành công!");
      e.target.closest("tr").remove();
    } else {
      alert("Không thể xóa blog này!");
    }
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
    alert("Đã xảy ra lỗi kết nối!");
  }
});
