// ==========================================
//  DỮ LIỆU (State)
// ==========================================
let todos = [
  { id: 1, text: "Đọc tài liệu về DOM", done: true },
  { id: 2, text: "Thực hành querySelector", done: false },
  { id: 3, text: "Tìm hiểu addEventListener", done: false },
];
let nextId = 4;
let currentFilter = "all";

// ==========================================
//  CHỌN PHẦN TỬ — document.getElementById / querySelector
// ==========================================
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const emptyMsg = document.getElementById("empty-msg");
const statsBar = document.getElementById("stats-bar");
const statsText = document.getElementById("stats-text");
const clearDoneBtn = document.getElementById("clear-done-btn");
const filterBtns = document.querySelectorAll(".filter-btn");

// ==========================================
//  RENDER — Tạo và chèn phần tử vào DOM
// ==========================================
function render() {
  // Lọc danh sách theo filter hiện tại
  const filtered = todos.filter((t) =>
    currentFilter === "all"
      ? true
      : currentFilter === "done"
        ? t.done
        : !t.done,
  );

  // Xóa toàn bộ list cũ
  list.innerHTML = "";

  // Tạo từng <li> và chèn vào <ul>
  filtered.forEach((todo) => {
    // createElement — tạo phần tử mới
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    // Checkbox để tick hoàn thành
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    // Nội dung công việc
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text; // textContent — gán văn bản

    // Nút xóa
    const delBtn = document.createElement("button");
    delBtn.className = "btn-del";
    delBtn.textContent = "×";
    delBtn.setAttribute("aria-label", "Xóa công việc");
    delBtn.addEventListener("click", () => removeTodo(todo.id));

    // appendChild — gắn con vào cha
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  // Cập nhật empty state
  emptyMsg.style.display = filtered.length === 0 ? "block" : "none";

  // Cập nhật stats bar
  const doneCount = todos.filter((t) => t.done).length;
  statsBar.style.display = todos.length > 0 ? "flex" : "none";
  statsText.textContent = doneCount + "/" + todos.length + " hoàn thành";
}

// ==========================================
//  THÊM CÔNG VIỆC
// ==========================================
function addTodo() {
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  todos.push({ id: nextId++, text: text, done: false });
  input.value = "";
  input.focus();
  render();
}

// ==========================================
//  TICK HOÀN THÀNH
// ==========================================
function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) todo.done = !todo.done;
  render();
}

// ==========================================
//  XÓA CÔNG VIỆC
// ==========================================
function removeTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  render();
}

// ==========================================
//  SỰ KIỆN (Events) — addEventListener
// ==========================================

// Click nút Thêm
addBtn.addEventListener("click", addTodo);

// Nhấn Enter trong input
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") addTodo();
});

// Xóa toàn bộ công việc đã hoàn thành
clearDoneBtn.addEventListener("click", function () {
  todos = todos.filter((t) => !t.done);
  render();
});

// Filter buttons — classList để đổi trạng thái active
filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// ==========================================
//  KHỞI CHẠY
// ==========================================
render();
