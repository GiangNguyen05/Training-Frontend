const docs = [];
let chatHistory = [];
let isLoading = false;

function switchTab(tab) {
  document.querySelectorAll(".nav-tab").forEach((t, i) => {
    t.classList.toggle("active", ["upload", "about"][i] === tab);
  });
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  document.getElementById("view-" + tab).classList.add("active");
}

const dropZone = document.getElementById("drop-zone");
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});
dropZone.addEventListener("dragleave", () =>
  dropZone.classList.remove("drag-over"),
);
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  handleFiles(e.dataTransfer.files);
});

async function handleFiles(files) {
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      showToast("File quá lớn (max 5MB): " + file.name, "error");
      continue;
    }
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["txt", "md", "pdf"].includes(ext)) {
      showToast("Chỉ hỗ trợ .txt .md .pdf", "error");
      continue;
    }
    if (docs.find((d) => d.name === file.name)) {
      showToast("File đã tồn tại: " + file.name, "error");
      continue;
    }
    const docObj = {
      name: file.name,
      ext,
      size: file.size,
      chunks: [],
      status: "processing",
    };
    docs.push(docObj);
    renderFileList();
    try {
      const text = ext === "pdf" ? await readPDF(file) : await readText(file);
      docObj.chunks = chunkText(text, file.name);
      docObj.status = "ready";
      renderFileList();
      updateDocCount();
      showToast(
        file.name + " — đã nạp " + docObj.chunks.length + " chunks",
        "success",
      );
    } catch (e) {
      docObj.status = "error";
      renderFileList();
      showToast("Lỗi đọc file: " + file.name, "error");
    }
  }
}

async function readText(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = (e) => res(e.target.result);
    r.onerror = rej;
    r.readAsText(file, "UTF-8");
  });
}

async function readPDF(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = (e) => {
      try {
        const str = new TextDecoder("latin1").decode(
          new Uint8Array(e.target.result),
        );
        let text = "";
        const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
        let match;
        while ((match = streamRegex.exec(str)) !== null) {
          const textRegex = /\(([^)\\]|\\.)*\)/g;
          let tm;
          while ((tm = textRegex.exec(match[1])) !== null) {
            const cleaned = tm[0]
              .slice(1, -1)
              .replace(/\\n/g, "\n")
              .replace(/\\r/g, "\r")
              .replace(/\\t/g, "\t")
              .replace(/\\\\/g, "\\")
              .replace(/\\(.)/g, "$1");
            if (cleaned.trim().length > 2) text += cleaned + " ";
          }
        }
        if (text.trim().length < 50)
          text = str.replace(/[^\x20-\x7E\n]/g, " ").replace(/\s+/g, " ");
        res(text.trim() || "Không thể đọc nội dung PDF này.");
      } catch (e) {
        rej(e);
      }
    };
    r.onerror = rej;
    r.readAsArrayBuffer(file);
  });
}

function chunkText(text, source, size = 500, overlap = 50) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + size;
    if (end < text.length) {
      const b = text.lastIndexOf(".", end);
      if (b > start + size * 0.6) end = b + 1;
    }
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 20)
      chunks.push({ text: chunk, source, index: chunks.length });
    start = end - overlap;
    if (start >= text.length) break;
  }
  return chunks;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\sÀ-ỹ]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function cosineSimilarity(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0,
    na = 0,
    nb = 0;
  for (const k of keys) {
    const av = a[k] || 0,
      bv = b[k] || 0;
    dot += av * bv;
    na += av * av;
    nb += bv * bv;
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

function toTF(tokens) {
  const freq = {};
  tokens.forEach((t) => (freq[t] = (freq[t] || 0) + 1));
  const total = tokens.length;
  Object.keys(freq).forEach((k) => (freq[k] /= total));
  return freq;
}

function retrieve(query, topK = 5) {
  const allChunks = docs
    .filter((d) => d.status === "ready")
    .flatMap((d) => d.chunks);
  if (!allChunks.length) return [];
  const qTokens = tokenize(query);
  const qTF = toTF(qTokens);
  const scored = allChunks.map((chunk) => {
    const cTF = toTF(tokenize(chunk.text));
    const kwBonus =
      qTokens.filter((t) => chunk.text.toLowerCase().includes(t)).length /
      (qTokens.length || 1);
    return {
      ...chunk,
      score: cosineSimilarity(qTF, cTF) * 0.5 + kwBonus * 0.5,
    };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((c) => c.score > 0.01);
}

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const query = input.value.trim();
  if (!query || isLoading) return;
  if (!docs.filter((d) => d.status === "ready").length) {
    showToast("Chưa có tài liệu. Hãy tải file lên trước!", "error");
    return;
  }

  input.value = "";
  input.style.height = "auto";
  const welcome = document.getElementById("chat-welcome");
  if (welcome) welcome.style.display = "none";
  isLoading = true;
  document.getElementById("send-btn").disabled = true;

  appendMsg("user", query);
  const chunks = retrieve(query, 5);
  const context = chunks.length
    ? chunks.map((c, i) => `[${i + 1}] (${c.source})\n${c.text}`).join("\n\n")
    : "";
  const sources = [...new Set(chunks.map((c) => c.source))];
  const typingEl = showTyping();

  const systemPrompt = `Bạn là AI assistant thông minh chuyên về RAG (Retrieval-Augmented Generation). 
Bạn trả lời dựa trên tài liệu được cung cấp trong phần CONTEXT.
Nếu context không có thông tin liên quan, hãy nói rõ và không bịa đặt thêm.
Trả lời bằng tiếng Việt, ngắn gọn, chính xác. Khi trích dẫn, ghi rõ nguồn từ [số].`;

  const userContent = context
    ? `CONTEXT:\n${context}\n\nCÂU HỎI: ${query}`
    : `Không có tài liệu liên quan.\n\nCÂU HỎI: ${query}`;
  chatHistory.push({ role: "user", content: userContent });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: chatHistory,
      }),
    });
    const data = await res.json();
    const answer =
      data.content?.map((b) => b.text || "").join("") || "Không có phản hồi.";
    chatHistory.push({ role: "assistant", content: answer });
    typingEl.remove();
    appendMsg("assistant", answer, sources);
  } catch (e) {
    typingEl.remove();
    appendMsg("assistant", "Lỗi kết nối API. Vui lòng thử lại.", []);
    chatHistory.pop();
  }

  isLoading = false;
  document.getElementById("send-btn").disabled = false;
}

function appendMsg(role, text, sources = []) {
  const container = document.getElementById("chat-messages");
  const wrap = document.createElement("div");
  wrap.className = "msg-wrap " + role;
  const label = document.createElement("div");
  label.className = "msg-label";
  label.textContent = role === "user" ? "Bạn" : "AI Agent";
  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.style.whiteSpace = "pre-wrap";
  bubble.textContent = text;
  wrap.appendChild(label);
  wrap.appendChild(bubble);
  if (sources.length) {
    const row = document.createElement("div");
    row.className = "sources-row";
    sources.forEach((s) => {
      const chip = document.createElement("span");
      chip.className = "source-chip";
      chip.textContent = "📄 " + s;
      row.appendChild(chip);
    });
    wrap.appendChild(row);
  }
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById("chat-messages");
  const wrap = document.createElement("div");
  wrap.className = "msg-wrap assistant";
  const label = document.createElement("div");
  label.className = "msg-label";
  label.textContent = "AI Agent";
  const ind = document.createElement("div");
  ind.className = "typing-indicator";
  ind.innerHTML =
    '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  wrap.appendChild(label);
  wrap.appendChild(ind);
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
  return wrap;
}

function sendSuggestion(btn) {
  document.getElementById("chat-input").value = btn.textContent;
  sendMessage();
}
function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}
function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}

function renderFileList() {
  const container = document.getElementById("file-items");
  container.innerHTML = "";
  if (!docs.length) {
    container.innerHTML =
      '<div style="text-align:center;padding:2rem;font-family:var(--mono);font-size:11px;color:var(--ink-3)">Chưa có tài liệu nào</div>';
    return;
  }
  docs.forEach((doc, i) => {
    const el = document.createElement("div");
    el.className = "file-item";
    const iconClass = ["pdf", "txt", "md"].includes(doc.ext)
      ? doc.ext
      : "other";
    const size =
      doc.size < 1024
        ? doc.size + "B"
        : doc.size < 1024 * 1024
          ? Math.round(doc.size / 1024) + "KB"
          : Math.round((doc.size / 1024 / 1024) * 10) / 10 + "MB";
    const statusText =
      doc.status === "processing"
        ? "xử lý..."
        : doc.status === "ready"
          ? "sẵn sàng"
          : "lỗi";
    el.innerHTML = `<div class="file-icon ${iconClass}">.${doc.ext}</div><div class="file-info"><div class="file-name" title="${doc.name}">${doc.name}</div><div class="file-meta">${size}${doc.chunks?.length ? " · " + doc.chunks.length + " chunks" : ""}</div></div><span class="file-status ${doc.status}">${statusText}</span><button class="file-del" onclick="deleteDoc(${i})">×</button>`;
    container.appendChild(el);
  });
}

function deleteDoc(i) {
  docs.splice(i, 1);
  renderFileList();
  updateDocCount();
  showToast("Đã xóa tài liệu");
}

function updateDocCount() {
  const ready = docs.filter((d) => d.status === "ready").length;
  document.getElementById("doc-count").textContent = ready + " tài liệu";
  const warn = document.getElementById("no-docs-warning");
  if (warn) warn.style.display = ready === 0 ? "block" : "none";
}

function showToast(msg, type = "") {
  const t = document.createElement("div");
  t.className = "toast " + type;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

renderFileList();
updateDocCount();
