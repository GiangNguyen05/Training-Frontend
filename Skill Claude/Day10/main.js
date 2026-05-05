// ── STATE ──
const docs = [];
let msgs = []; // current chat history for API
let loading = false;
let histOpen = false;
let curSessId = null;
const LS = "rag_sessions_v2";

// ── LOCAL STORAGE ──
const getSessions = () => {
  try {
    return JSON.parse(localStorage.getItem(LS) || "[]");
  } catch {
    return [];
  }
};
const putSessions = (s) => {
  try {
    localStorage.setItem(LS, JSON.stringify(s));
  } catch {
    toast("Bộ nhớ đầy, không lưu được", "err");
  }
};

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function saveChat() {
  if (!curSessId) return;
  const sessions = getSessions();
  const i = sessions.findIndex((s) => s.id === curSessId);
  if (i === -1) return;
  sessions[i].msgs = msgs;
  sessions[i].updatedAt = Date.now();
  // auto-title from first user message
  if (sessions[i].title === "Cuộc hội thoại mới") {
    const first = msgs.find((m) => m.role === "user");
    if (first) {
      const raw = first.content
        .replace(/CONTEXT:[\s\S]*?CÂU HỎI:\s*/, "")
        .trim();
      sessions[i].title = raw.slice(0, 38) + (raw.length > 38 ? "…" : "");
    }
  }
  putSessions(sessions);
  renderHist();
}

function newChat() {
  const sess = {
    id: genId(),
    title: "Cuộc hội thoại mới",
    msgs: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const sessions = getSessions();
  sessions.unshift(sess);
  putSessions(sessions);
  curSessId = sess.id;
  msgs = [];
  const c = document.getElementById("chat-msgs");
  c.innerHTML = "";
  c.appendChild(makeWelcome());
  renderHist();
}

function loadSess(id) {
  const sessions = getSessions();
  const sess = sessions.find((s) => s.id === id);
  if (!sess) return;
  curSessId = id;
  msgs = [...sess.msgs];
  const c = document.getElementById("chat-msgs");
  c.innerHTML = "";
  if (!sess.msgs.length) {
    c.appendChild(makeWelcome());
  } else {
    sess.msgs.forEach((m) => {
      if (m.role === "user") {
        const display = m.content
          .replace(/CONTEXT:[\s\S]*?CÂU HỎI:\s*/, "")
          .trim();
        addMsg("user", display, []);
      } else {
        addMsg("assistant", m.content, m.sources || []);
      }
    });
    c.scrollTop = c.scrollHeight;
  }
  renderHist();
}

function delSess(e, id) {
  e.stopPropagation();
  const sessions = getSessions().filter((s) => s.id !== id);
  putSessions(sessions);
  if (curSessId === id) newChat();
  else renderHist();
  toast("Đã xóa cuộc hội thoại");
}

function renderHist() {
  const c = document.getElementById("hlist");
  const sessions = getSessions();
  if (!sessions.length) {
    c.innerHTML =
      '<div class="hempty">Chưa có lịch sử.<br>Bắt đầu chat để lưu.</div>';
    return;
  }
  c.innerHTML = "";
  sessions.forEach((s) => {
    const el = document.createElement("div");
    el.className = "hitem" + (s.id === curSessId ? " on" : "");
    const d = new Date(s.updatedAt);
    const dt =
      d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }) +
      " " +
      d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const q = s.msgs.filter((m) => m.role === "user").length;
    el.innerHTML = `<div class="hitem-title" title="${s.title}">${s.title}</div><div class="hitem-meta">${dt} · ${q} câu</div><button class="hdel" onclick="delSess(event,'${s.id}')">×</button>`;
    el.onclick = () => loadSess(s.id);
    c.appendChild(el);
  });
}

function toggleHist() {
  histOpen = !histOpen;
  document.getElementById("hist-panel").classList.toggle("on", histOpen);
  document.getElementById("hist-btn").classList.toggle("on", histOpen);
}

// ── TABS ──
function switchTab(tab) {
  document
    .querySelectorAll(".ntab")
    .forEach((t, i) => t.classList.toggle("on", ["docs", "about"][i] === tab));
  document.querySelectorAll(".dpview").forEach((v) => v.classList.remove("on"));
  document.getElementById("dpview-" + tab).classList.add("on");
}

// ── DROP ZONE ──
const dz = document.getElementById("dropzone");
dz.addEventListener("dragover", (e) => {
  e.preventDefault();
  dz.classList.add("over");
});
dz.addEventListener("dragleave", () => dz.classList.remove("over"));
dz.addEventListener("drop", (e) => {
  e.preventDefault();
  dz.classList.remove("over");
  handleFiles(e.dataTransfer.files);
});

async function handleFiles(files) {
  for (const f of files) {
    if (f.size > 5 * 1024 * 1024) {
      toast("File quá lớn (max 5MB): " + f.name, "err");
      continue;
    }
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["txt", "md", "pdf"].includes(ext)) {
      toast("Chỉ hỗ trợ .txt .md .pdf", "err");
      continue;
    }
    if (docs.find((d) => d.name === f.name)) {
      toast("File đã tồn tại", "err");
      continue;
    }
    const doc = {
      name: f.name,
      ext,
      size: f.size,
      chunks: [],
      status: "processing",
    };
    docs.push(doc);
    renderDocs();
    try {
      const txt = ext === "pdf" ? await readPDF(f) : await readTxt(f);
      doc.chunks = chunk(txt, f.name);
      doc.status = "ready";
      renderDocs();
      updateBadge();
      toast(f.name + " — " + doc.chunks.length + " chunks", "ok");
    } catch {
      doc.status = "error";
      renderDocs();
      toast("Lỗi đọc: " + f.name, "err");
    }
  }
}

const readTxt = (f) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = (e) => res(e.target.result);
    r.onerror = rej;
    r.readAsText(f, "UTF-8");
  });

const readPDF = (f) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = (e) => {
      try {
        const s = new TextDecoder("latin1").decode(
          new Uint8Array(e.target.result),
        );
        let txt = "";
        const sr = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
        let m;
        while ((m = sr.exec(s)) !== null) {
          const tr = /\(([^)\\]|\\.)*\)/g;
          let t;
          while ((t = tr.exec(m[1])) !== null) {
            const c = t[0]
              .slice(1, -1)
              .replace(/\\n/g, "\n")
              .replace(/\\r/g, "\r")
              .replace(/\\t/g, "\t")
              .replace(/\\\\/g, "\\")
              .replace(/\\(.)/g, "$1");
            if (c.trim().length > 2) txt += c + " ";
          }
        }
        if (txt.trim().length < 50)
          txt = s.replace(/[^\x20-\x7E\n]/g, " ").replace(/\s+/g, " ");
        res(txt.trim() || "Không đọc được PDF.");
      } catch (e) {
        rej(e);
      }
    };
    r.onerror = rej;
    r.readAsArrayBuffer(f);
  });

function chunk(text, src, size = 500, lap = 50) {
  const out = [];
  let s = 0;
  while (s < text.length) {
    let e = s + size;
    if (e < text.length) {
      const b = text.lastIndexOf(".", e);
      if (b > s + size * 0.6) e = b + 1;
    }
    const c = text.slice(s, e).trim();
    if (c.length > 20) out.push({ text: c, src, i: out.length });
    s = e - lap;
    if (s >= text.length) break;
  }
  return out;
}

// ── RETRIEVAL ──
const tok = (t) =>
  t
    .toLowerCase()
    .replace(/[^\w\sÀ-ỹ]/g, " ")
    .split(/\s+/)
    .filter((x) => x.length > 1);
const toTF = (ts) => {
  const f = {};
  ts.forEach((t) => (f[t] = (f[t] || 0) + 1));
  const n = ts.length;
  Object.keys(f).forEach((k) => (f[k] /= n));
  return f;
};
function cosine(a, b) {
  const ks = new Set([...Object.keys(a), ...Object.keys(b)]);
  let d = 0,
    na = 0,
    nb = 0;
  for (const k of ks) {
    const av = a[k] || 0,
      bv = b[k] || 0;
    d += av * bv;
    na += av * av;
    nb += bv * bv;
  }
  return na && nb ? d / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}
function retrieve(q, k = 5) {
  const all = docs.filter((d) => d.status === "ready").flatMap((d) => d.chunks);
  if (!all.length) return [];
  const qt = tok(q),
    qtf = toTF(qt);
  return all
    .map((c) => {
      const kw =
        qt.filter((t) => c.text.toLowerCase().includes(t)).length /
        (qt.length || 1);
      return { ...c, score: cosine(qtf, toTF(tok(c.text))) * 0.5 + kw * 0.5 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .filter((c) => c.score > 0.01);
}

// ── CHAT ──
async function send() {
  const inp = document.getElementById("chat-input");
  const q = inp.value.trim();
  if (!q || loading) return;
  if (!docs.filter((d) => d.status === "ready").length) {
    toast("Chưa có tài liệu!", "err");
    return;
  }

  // create session if none
  if (!curSessId) {
    const s = {
      id: genId(),
      title: "Cuộc hội thoại mới",
      msgs: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const sessions = getSessions();
    sessions.unshift(s);
    putSessions(sessions);
    curSessId = s.id;
  }

  inp.value = "";
  inp.style.height = "auto";
  const w = document.getElementById("welcome");
  if (w) w.remove();
  loading = true;
  document.getElementById("send-btn").disabled = true;

  addMsg("user", q, []);
  const chunks = retrieve(q, 5);
  const ctx = chunks.length
    ? chunks.map((c, i) => `[${i + 1}] (${c.src})\n${c.text}`).join("\n\n")
    : "";
  const sources = [...new Set(chunks.map((c) => c.src))];
  const tyEl = showTyping();

  const sys = `Bạn là AI assistant về RAG. Trả lời dựa trên CONTEXT bên dưới. Nếu không có thông tin, nói rõ. Trả lời tiếng Việt, ngắn gọn, chính xác. Trích dẫn nguồn [số].`;
  const uc = ctx
    ? `CONTEXT:\n${ctx}\n\nCÂU HỎI: ${q}`
    : `Không có tài liệu liên quan.\n\nCÂU HỎI: ${q}`;
  msgs.push({ role: "user", content: uc });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: sys,
        messages: msgs,
      }),
    });
    const data = await res.json();
    const ans =
      data.content?.map((b) => b.text || "").join("") || "Không có phản hồi.";
    msgs.push({ role: "assistant", content: ans, sources });
    tyEl.remove();
    addMsg("assistant", ans, sources);
    saveChat();
  } catch {
    tyEl.remove();
    addMsg("assistant", "Lỗi kết nối API. Thử lại nhé.", []);
    msgs.pop();
  }
  loading = false;
  document.getElementById("send-btn").disabled = false;
}

function addMsg(role, text, sources) {
  const c = document.getElementById("chat-msgs");
  const w = document.createElement("div");
  w.className = "mwrap " + role;
  const lb = document.createElement("div");
  lb.className = "mlabel";
  lb.textContent = role === "user" ? "Bạn" : "AI Agent";
  const b = document.createElement("div");
  b.className = "mbubble";
  b.style.whiteSpace = "pre-wrap";
  b.textContent = text;
  w.appendChild(lb);
  w.appendChild(b);
  if (sources && sources.length) {
    const r = document.createElement("div");
    r.className = "src-row";
    sources.forEach((s) => {
      const ch = document.createElement("span");
      ch.className = "src-chip";
      ch.textContent = "📄 " + s;
      r.appendChild(ch);
    });
    w.appendChild(r);
  }
  c.appendChild(w);
  c.scrollTop = c.scrollHeight;
}

function showTyping() {
  const c = document.getElementById("chat-msgs");
  const w = document.createElement("div");
  w.className = "mwrap assistant";
  const lb = document.createElement("div");
  lb.className = "mlabel";
  lb.textContent = "AI Agent";
  const t = document.createElement("div");
  t.className = "typing";
  t.innerHTML =
    '<div class="tdot"></div><div class="tdot"></div><div class="tdot"></div>';
  w.appendChild(lb);
  w.appendChild(t);
  c.appendChild(w);
  c.scrollTop = c.scrollHeight;
  return w;
}

function makeWelcome() {
  const d = document.createElement("div");
  d.className = "welcome";
  d.id = "welcome";
  d.innerHTML = `<div class="w-icon">🔍</div><h3>Hỏi về tài liệu của bạn</h3><p>Tải file lên rồi đặt câu hỏi — AI sẽ tìm kiếm và trả lời chính xác.</p>`;
  return d;
}

function useSug(btn) {
  document.getElementById("chat-input").value = btn.textContent;
  send();
}
function onKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
}
function autoH(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 100) + "px";
}

// ── DOC LIST ──
function renderDocs() {
  const c = document.getElementById("fitems");
  c.innerHTML = "";
  if (!docs.length) {
    c.innerHTML =
      '<div style="text-align:center;padding:1.5rem;font-family:var(--mono);font-size:10px;color:var(--ink-3)">Chưa có tài liệu</div>';
    return;
  }
  docs.forEach((d, i) => {
    const el = document.createElement("div");
    el.className = "fitem";
    const ic = ["pdf", "txt", "md"].includes(d.ext) ? d.ext : "other";
    const sz =
      d.size < 1024
        ? d.size + "B"
        : d.size < 1048576
          ? Math.round(d.size / 1024) + "KB"
          : Math.round((d.size / 1048576) * 10) / 10 + "MB";
    const st =
      d.status === "processing"
        ? "xử lý..."
        : d.status === "ready"
          ? "sẵn sàng"
          : "lỗi";
    el.innerHTML = `<div class="ficon ${ic}">.${d.ext}</div><div class="finfo"><div class="fname" title="${d.name}">${d.name}</div><div class="fmeta">${sz}${d.chunks?.length ? " · " + d.chunks.length + " chunks" : ""}</div></div><span class="fstatus ${d.status}">${st}</span><button class="fdel" onclick="delDoc(${i})">×</button>`;
    c.appendChild(el);
  });
}

function delDoc(i) {
  docs.splice(i, 1);
  renderDocs();
  updateBadge();
  toast("Đã xóa");
}
function updateBadge() {
  document.getElementById("doc-badge").textContent =
    docs.filter((d) => d.status === "ready").length + " tài liệu";
}

function toast(msg, type = "") {
  const t = document.createElement("div");
  t.className = "toast " + (type === "ok" ? "ok" : type === "err" ? "err" : "");
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── INIT ──
renderDocs();
updateBadge();
renderHist();
