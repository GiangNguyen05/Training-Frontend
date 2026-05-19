const newTbody = document.querySelector("#list tbody");
const blogs = document.querySelector("#blogsForm");
const btn = document.querySelector("#btnForm");
const tableList = async () => {
  const res = await fetch(" http://localhost:8000/blogs");
  const data = await res.json();
  console.log(data);

  newTbody.innerHTML = "";
  data.forEach((e, index) => {
    newTbody.innerHTML += `
        <tr>
          <td>${e.id}</td>
          <td>${e.title}</td>
          <td>${e.author}</td>
          <td>${e.content}</td>
          <td><button class="btnDel" data-id="${e.id}">Del</button></td>
        </tr>
`;
  });
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
    const res = await fetch("http://localhost:8000/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBlogs),
    });
    if (!res.ok) {
      throw new Error("Gửi dữ liệu thất bại!");
    }
    const data = await res.json();
    console.log("Thành công:", data);
    alert("Đã thêm blog mới thành công!");
    blogs.reset();
    tableList();
  } catch (error) {
    console.error("Lỗi kết nối:", error);
    alert("Có lỗi xảy ra, vui lòng thử lại!");
  }
});
if (newTbody) {
  newTbody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btnDel")) {
      const id = e.target.getAttribute("data-id");
      if (!confirm("Bạn có chắc chắn muốn xóa blog này không?")) return;

      try {
        const res = await fetch(`http://localhost:8000/blogs/${id}`, {
          method: "DELETE",
        });

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
    }
  });
}
