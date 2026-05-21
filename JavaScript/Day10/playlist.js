// Lấy base URL từ input (người dùng có thể đổi)
function getBaseUrl() {
  return document.getElementById("base-url").value.trim().replace(/\/$/, "");
}

// STATE

let songs = [];
let editingId = null;

// UI HELPERS

function setStatus(state, text, method = "GET") {
  const dot = document.getElementById("dot");
  const txt = document.getElementById("status-text");
  const badge = document.getElementById("http-badge");

  dot.className =
    "dot" +
    (state === "loading" ? " loading" : state === "error" ? " error" : "");
  txt.textContent = text;

  const m = method.toLowerCase();
  badge.className = `http-badge ${m === "get" ? "" : m}`;
  badge.textContent = method;
}

let _toastTimer;
function toast(msg, type = "ok") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = `show ${type}`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => (el.className = ""), 2800);
}

function updateCount() {
  document.getElementById("track-count").textContent =
    `${songs.length} track${songs.length !== 1 ? "s" : ""}`;
}

function clearForm() {
  ["f-title", "f-artist", "f-album", "f-year"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("f-title").focus();
}

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// RENDER

function render() {
  const list = document.getElementById("song-list");
  updateCount();

  if (!songs.length) {
    list.innerHTML = `<div class="empty">
      <span class="empty-big">EMPTY</span>
      Chưa có bài hát nào trong playlist.<br>
      Thêm bài hát đầu tiên!
    </div>`;
    return;
  }

  list.innerHTML = "";

  songs.forEach((song, i) => {
    const item = document.createElement("div");
    item.className = "song-item" + (song.id === editingId ? " editing" : "");
    item.dataset.id = song.id;

    if (song.id === editingId) {
      // ── Edit mode ──
      item.innerHTML = `
        <span class="song-num">${String(i + 1).padStart(2, "0")}</span>
        <div>
          <input class="inline-edit" id="e-title"  value="${esc(song.title)}"
            onkeydown="onEditKey(event,${song.id})">
          <input class="inline-edit-sm" id="e-album" value="${esc(song.album)}"
            placeholder="album..." onkeydown="onEditKey(event,${song.id})">
        </div>
        <input class="inline-edit-sm" id="e-artist" value="${esc(song.artist)}"
          placeholder="ca sĩ..." style="align-self:center"
          onkeydown="onEditKey(event,${song.id})">
        <input class="inline-edit-sm" id="e-year" value="${esc(String(song.year || ""))}"
          placeholder="năm" style="align-self:center;width:56px"
          onkeydown="onEditKey(event,${song.id})">
        <div class="song-actions">
          <button class="icon-btn save-btn"   onclick="saveSong(${song.id})"  title="Lưu (Enter)">✓</button>
          <button class="icon-btn cancel-btn" onclick="cancelEdit()"          title="Huỷ (Esc)">✕</button>
        </div>`;
      setTimeout(() => document.getElementById("e-title")?.focus(), 0);
    } else {
      // ── View mode ──
      item.innerHTML = `
        <span class="song-num">${String(i + 1).padStart(2, "0")}</span>
        <div>
          <div class="song-title">${esc(song.title)}</div>
          <div class="song-sub">${esc(song.album || "—")}</div>
        </div>
        <span class="song-artist">${esc(song.artist || "—")}</span>
        <span class="song-year">${song.year || "—"}</span>
        <div class="song-actions">
          <button class="icon-btn edit-btn" onclick="startEdit(${song.id})"  title="Sửa">✎</button>
          <button class="icon-btn del-btn"  onclick="deleteSong(${song.id})" title="Xoá">✕</button>
        </div>`;
    }

    list.appendChild(item);
  });
}

// LOAD  —  GET /playlist

async function loadSongs() {
  setStatus("loading", `GET ${getBaseUrl()}`, "GET");

  try {
    // await fetch — chờ server phản hồi
    const response = await fetch(getBaseUrl());

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // await .json() — chờ parse body
    songs = await response.json();

    setStatus("ok", `Đã tải ${songs.length} bài hát từ server`, "GET");
    render();
  } catch (err) {
    setStatus("error", `Lỗi kết nối: ${err.message}`, "GET");
    toast(
      "Không thể kết nối backend. Kiểm tra json-server đã chạy chưa?",
      "err",
    );
    songs = [];
    render();
  }
}

// THÊM  —  POST /playlist

async function addSong() {
  const title = document.getElementById("f-title").value.trim();
  const artist = document.getElementById("f-artist").value.trim();
  const album = document.getElementById("f-album").value.trim();
  const year = parseInt(document.getElementById("f-year").value) || null;

  if (!title) {
    toast("Vui lòng nhập tên bài hát", "err");
    document.getElementById("f-title").focus();
    return;
  }

  const btn = document.getElementById("add-btn");
  const btnTxt = document.getElementById("add-btn-text");
  btn.disabled = true;
  btnTxt.textContent = "⏳ Đang lưu...";
  setStatus("loading", `POST ${getBaseUrl()}`, "POST");

  try {
    // await fetch POST — gửi dữ liệu lên json-server
    const response = await fetch(getBaseUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, artist, album, year }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // json-server trả về object vừa tạo (kèm id tự sinh)
    const newSong = await response.json();

    songs.push(newSong);
    render();
    clearForm();
    setStatus("ok", `201 Created — "${newSong.title}"`, "POST");
    toast(`Đã thêm "${newSong.title}" ✓`);
  } catch (err) {
    setStatus("error", `Lỗi POST: ${err.message}`, "POST");
    toast("Không thể thêm bài hát", "err");
  } finally {
    // finally — luôn reset nút dù thành công hay lỗi
    btn.disabled = false;
    btnTxt.textContent = "+ Thêm bài hát";
  }
}

// SỬA  —  PUT /playlist/:id

function startEdit(id) {
  editingId = id;
  render();
}

function cancelEdit() {
  editingId = null;
  render();
}

function onEditKey(e, id) {
  if (e.key === "Enter") saveSong(id);
  if (e.key === "Escape") cancelEdit();
}

async function saveSong(id) {
  const title = document.getElementById("e-title")?.value.trim();
  const artist = document.getElementById("e-artist")?.value.trim();
  const album = document.getElementById("e-album")?.value.trim();
  const year = parseInt(document.getElementById("e-year")?.value) || null;

  if (!title) {
    toast("Tên bài hát không được trống", "err");
    return;
  }

  const item = document.querySelector(`.song-item[data-id="${id}"]`);
  if (item) item.classList.add("shimmer");
  setStatus("loading", `PUT ${getBaseUrl()}/${id}`, "PUT");

  try {
    // await fetch PUT — cập nhật bản ghi theo id
    const response = await fetch(`${getBaseUrl()}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, artist, album, year }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // json-server trả về object đã cập nhật
    const updated = await response.json();

    // Cập nhật đúng phần tử trong mảng
    const idx = songs.findIndex((s) => s.id === id);
    if (idx !== -1) songs[idx] = updated;

    editingId = null;
    render();
    setStatus("ok", `200 OK — Đã cập nhật "${updated.title}"`, "PUT");
    toast(`Đã lưu "${updated.title}" ✓`);
  } catch (err) {
    setStatus("error", `Lỗi PUT: ${err.message}`, "PUT");
    toast("Không thể lưu thay đổi", "err");
    if (item) item.classList.remove("shimmer");
  }
}

// XOÁ  —  DELETE /playlist/:id

async function deleteSong(id) {
  const song = songs.find((s) => s.id === id);
  if (!song) return;

  const item = document.querySelector(`.song-item[data-id="${id}"]`);
  if (item) item.classList.add("shimmer");
  setStatus("loading", `DELETE ${getBaseUrl()}/${id}`, "DELETE");

  try {
    // await fetch DELETE
    const response = await fetch(`${getBaseUrl()}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // Chờ animation CSS xong rồi mới xoá khỏi state
    if (item) {
      item.classList.remove("shimmer");
      item.classList.add("removing");
      await new Promise((r) => setTimeout(r, 220));
    }

    songs = songs.filter((s) => s.id !== id);
    render();
    setStatus("ok", `200 OK — Đã xoá "${song.title}"`, "DELETE");
    toast(`Đã xoá "${song.title}"`);
  } catch (err) {
    setStatus("error", `Lỗi DELETE: ${err.message}`, "DELETE");
    toast("Không thể xoá bài hát", "err");
    if (item) item.classList.remove("shimmer");
  }
}

// INIT

loadSongs();
