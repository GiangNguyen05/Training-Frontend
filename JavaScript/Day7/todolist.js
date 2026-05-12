// FAKE API  (giả lập server 800ms delay)
const db = [
  { id: 1, text: "Học JavaScript", done: false },
  { id: 2, text: "Làm bài tập async", done: true },
];
let nextId = 3;

const API = {
  getAll: () => new Promise((res) => setTimeout(() => res([...db]), 800)),

  create: (text) =>
    new Promise((res) =>
      setTimeout(() => {
        const todo = { id: nextId++, text, done: false };
        db.push(todo);
        res(todo);
      }, 800),
    ),

  update: (id, changes) =>
    new Promise((res, rej) =>
      setTimeout(() => {
        const i = db.findIndex((t) => t.id === id);
        if (i === -1) return rej(new Error("Không tìm thấy todo"));
        Object.assign(db[i], changes);
        res({ ...db[i] });
      }, 800),
    ),

  delete: (id) =>
    new Promise((res, rej) =>
      setTimeout(() => {
        const i = db.findIndex((t) => t.id === id);
        if (i === -1) return rej(new Error("Không tìm thấy todo"));
        db.splice(i, 1);
        res({ ok: true });
      }, 800),
    ),
};

// STATE
let todos = [];
let filter = "all";
let useAsync = true; // true = async/await | false = sync (instant, no API)

// LOG
function log(msg, cls = "l-muted") {
  const box = document.getElementById("log-box");
  const d = document.createElement("div");
  d.className = "log-line " + cls;
  const t = new Date().toLocaleTimeString("vi", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  d.textContent = `[${t}] ${msg}`;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

// RENDER
function render() {
  const list = document.getElementById("todo-list");
  const filtered =
    filter === "all"
      ? todos
      : filter === "done"
        ? todos.filter((t) => t.done)
        : todos.filter((t) => !t.done);

  document.getElementById("count").textContent =
    `${todos.filter((t) => !t.done).length} việc chưa xong`;

  if (!filtered.length) {
    list.innerHTML = `<div class="empty">
      <span class="empty-icon">✦</span>
      ${filter === "done" ? "Chưa hoàn thành việc nào." : "Danh sách trống."}
    </div>`;
    return;
  }

  // Giữ lại DOM item nếu đang edit
  const editing = list.querySelector(".edit-input");
  const editingId = editing ? parseInt(editing.dataset.id) : null;

  list.innerHTML = "";
  filtered.forEach((todo) => {
    const item = document.createElement("div");
    item.className = "todo-item" + (todo.done ? " done" : "");
    item.dataset.id = todo.id;

    if (todo.id === editingId) {
      // Edit mode
      item.innerHTML = `
        <div class="check-box ${todo.done ? "checked" : ""}"></div>
        <input class="edit-input" data-id="${todo.id}" value="${escHtml(todo.text)}"
          onkeydown="if(event.key==='Enter') saveEdit(${todo.id}); if(event.key==='Escape') cancelEdit()">
        <div class="actions">
          <button class="icon-btn save" onclick="saveEdit(${todo.id})" title="Lưu">✓</button>
          <button class="icon-btn" onclick="cancelEdit()" title="Huỷ">✕</button>
        </div>`;
      setTimeout(() => item.querySelector(".edit-input").focus(), 0);
    } else {
      item.innerHTML = `
        <div class="check-box ${todo.done ? "checked" : ""}" onclick="toggleTodo(${todo.id})"></div>
        <span class="todo-text">${escHtml(todo.text)}</span>
        <div class="actions">
          <button class="icon-btn" onclick="startEdit(${todo.id})" title="Sửa">✎</button>
          <button class="icon-btn danger" onclick="deleteTodo(${todo.id})" title="Xoá">✕</button>
        </div>`;
    }
    list.appendChild(item);
  });
}

function escHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// API STATUS UI
function setApiStatus(state, msg) {
  const dot = document.getElementById("api-dot");
  const label = document.getElementById("api-label");
  dot.className =
    "dot" +
    (state === "loading" ? " loading" : state === "error" ? " error" : "");
  label.textContent = msg;
}

// TOAST
let toastTimer;
function toast(msg, isError = false) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "show" + (isError ? " error" : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.className = ""), 2500);
}

// MODE TOGGLE
function toggleMode() {
  useAsync = !useAsync;
  document.getElementById("mode-text").textContent = useAsync
    ? "async/await"
    : "sync (no API)";
  setApiStatus(
    "ready",
    useAsync ? "Fake API sẵn sàng · delay 800ms" : "Sync mode — không dùng API",
  );
  log(`Đổi sang chế độ: ${useAsync ? "async/await" : "sync"}`, "l-muted");
  toast(useAsync ? "Chế độ: Async/Await" : "Chế độ: Sync (no API)");
}

// LOAD (async)
async function loadTodos() {
  log("loadTodos() — gọi API.getAll()", "l-async");
  setApiStatus("loading", "Đang tải dữ liệu...");
  try {
    todos = await API.getAll();
    log(`✓ Nhận ${todos.length} todos từ server`, "l-async");
    setApiStatus("ready", `Fake API sẵn sàng · ${todos.length} items`);
    render();
  } catch (err) {
    log(`✗ Lỗi: ${err.message}`, "l-err");
    setApiStatus("error", "Lỗi kết nối API");
  }
}

// THÊM TODO
async function addTodo() {
  const input = document.getElementById("add-input");
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  const btn = document.getElementById("add-btn");
  const btnText = document.getElementById("add-btn-text");

  if (useAsync) {
    // ── ASYNC/AWAIT ──
    log(`addTodo("${text}") — async/await bắt đầu`, "l-async");
    btn.disabled = true;
    btnText.textContent = "⏳";
    setApiStatus("loading", "Đang lưu...");
    input.value = "";

    try {
      log("await API.create() — đang chờ server (800ms)...", "l-async");
      const newTodo = await API.create(text);
      todos.push(newTodo);
      log(`✓ Server trả về: id=${newTodo.id}`, "l-async");
      setApiStatus("ready", `Fake API sẵn sàng · ${todos.length} items`);
      render();
      toast("Đã thêm ✓");
    } catch (err) {
      log(`✗ Lỗi: ${err.message}`, "l-err");
      setApiStatus("error", "Lỗi khi thêm");
      toast(err.message, true);
    } finally {
      btn.disabled = false;
      btnText.textContent = "+ Thêm";
    }
  } else {
    // ── SYNC ──
    log(`addTodo("${text}") — sync, không gọi API`, "l-sync");
    const todo = { id: nextId++, text, done: false };
    todos.push(todo);
    log(`✓ Thêm ngay lập tức: id=${todo.id}`, "l-sync");
    input.value = "";
    render();
    toast("Đã thêm ✓");
  }
}

// TOGGLE DONE
async function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  const newDone = !todo.done;

  if (useAsync) {
    log(`toggleTodo(${id}) — await API.update()`, "l-async");
    const item = document.querySelector(`.todo-item[data-id="${id}"]`);
    if (item) item.classList.add("loading-item");
    setApiStatus("loading", "Đang cập nhật...");

    try {
      const updated = await API.update(id, { done: newDone });
      const i = todos.findIndex((t) => t.id === id);
      todos[i] = updated;
      log(`✓ Cập nhật done=${updated.done}`, "l-async");
      setApiStatus("ready", `Fake API sẵn sàng · ${todos.length} items`);
      render();
    } catch (err) {
      log(`✗ Lỗi: ${err.message}`, "l-err");
      setApiStatus("error", "Lỗi cập nhật");
      toast(err.message, true);
    }
  } else {
    log(`toggleTodo(${id}) — sync`, "l-sync");
    todo.done = newDone;
    log(`✓ done=${newDone}`, "l-sync");
    render();
  }
}

// SỬA TODO
function startEdit(id) {
  log(`startEdit(${id}) — bật edit mode`, "l-muted");
  render(); // re-render với editingId
  const list = document.getElementById("todo-list");
  // Trick: set flag trên DOM rồi re-render
  const item = list.querySelector(`.todo-item[data-id="${id}"]`);
  if (!item) return;
  // Replace span với input
  const span = item.querySelector(".todo-text");
  const actions = item.querySelector(".actions");
  const text = span.textContent;
  span.outerHTML = `<input class="edit-input" data-id="${id}" value="${escHtml(text)}"
    onkeydown="if(event.key==='Enter') saveEdit(${id}); if(event.key==='Escape') cancelEdit()">`;
  actions.innerHTML = `
    <button class="icon-btn save" onclick="saveEdit(${id})" title="Lưu">✓</button>
    <button class="icon-btn" onclick="cancelEdit()" title="Huỷ">✕</button>`;
  item.querySelector(".edit-input").focus();
}

function cancelEdit() {
  log("cancelEdit() — huỷ sửa", "l-muted");
  render();
}

async function saveEdit(id) {
  const input = document.querySelector(`.edit-input[data-id="${id}"]`);
  if (!input) return;
  const newText = input.value.trim();
  if (!newText) {
    toast("Nội dung không được trống", true);
    return;
  }

  if (useAsync) {
    log(`saveEdit(${id}) — await API.update()`, "l-async");
    input.disabled = true;
    setApiStatus("loading", "Đang lưu...");

    try {
      const updated = await API.update(id, { text: newText });
      const i = todos.findIndex((t) => t.id === id);
      todos[i] = updated;
      log(`✓ Đã lưu: "${newText}"`, "l-async");
      setApiStatus("ready", `Fake API sẵn sàng · ${todos.length} items`);
      render();
      toast("Đã lưu ✓");
    } catch (err) {
      log(`✗ Lỗi: ${err.message}`, "l-err");
      setApiStatus("error", "Lỗi lưu");
      toast(err.message, true);
      input.disabled = false;
    }
  } else {
    log(`saveEdit(${id}) — sync`, "l-sync");
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.text = newText;
      log(`✓ Đã lưu: "${newText}"`, "l-sync");
    }
    render();
    toast("Đã lưu ✓");
  }
}

// XOÁ TODO
async function deleteTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  if (useAsync) {
    log(`deleteTodo(${id}) — await API.delete()`, "l-async");
    const item = document.querySelector(`.todo-item[data-id="${id}"]`);
    if (item) item.classList.add("loading-item");
    setApiStatus("loading", "Đang xoá...");

    try {
      await API.delete(id);
      todos = todos.filter((t) => t.id !== id);
      log(`✓ Đã xoá id=${id}`, "l-async");
      setApiStatus("ready", `Fake API sẵn sàng · ${todos.length} items`);
      render();
      toast("Đã xoá");
    } catch (err) {
      log(`✗ Lỗi: ${err.message}`, "l-err");
      setApiStatus("error", "Lỗi xoá");
      toast(err.message, true);
      render();
    }
  } else {
    log(`deleteTodo(${id}) — sync`, "l-sync");
    todos = todos.filter((t) => t.id !== id);
    log(`✓ Đã xoá id=${id}`, "l-sync");
    render();
    toast("Đã xoá");
  }
}

// FILTER
function setFilter(f, btn) {
  filter = f;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  render();
}

// LOG BOX TOGGLE
function toggleLog() {
  const box = document.getElementById("log-box");
  box.classList.toggle("open");
}

// INIT
loadTodos();
