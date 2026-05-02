import express from "express";
import multer from "multer";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// ===== MEMORY =====
let store = [];

// ===== CHUNK =====
function chunkMarkdown(text) {
  return text
    .split(/\n# |\n## |\n### /)
    .map((t) => t.trim())
    .filter((t) => t.length > 20);
}

// ===== UPLOAD =====
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const text = req.file.buffer.toString("utf-8");

    const chunks = chunkMarkdown(text);

    store = chunks.map((c) => ({ text: c }));

    console.log("✅ STORE:", store.length);

    res.json({ message: "Upload xong" });
  } catch (err) {
    console.error(err);
    res.json({ message: "❌ Lỗi upload" });
  }
});

// ===== SEARCH =====
function search(query) {
  if (store.length === 0) return [];

  return store
    .filter((item) => item.text.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3)
    .map((i) => i.text);
}

// ===== MOCK AI (SMART) =====
function mockAI(question, contextArr) {
  if (!contextArr.length) return "Không tìm thấy";

  const context = contextArr.join(" ");

  // tách keyword
  const keywords = question
    .toLowerCase()
    .split(" ")
    .filter((w) => w.length > 2);

  const sentences = context.split(/[.?!\n]/);

  let best = "";
  let maxScore = 0;

  for (let s of sentences) {
    let score = 0;

    for (let k of keywords) {
      if (s.toLowerCase().includes(k)) score++;
    }

    if (score > maxScore) {
      maxScore = score;
      best = s;
    }
  }

  if (!best) return contextArr[0].slice(0, 200);

  // tránh echo câu hỏi
  if (best.toLowerCase().includes(question.toLowerCase())) {
    return contextArr[0];
  }

  return best.trim();
}

// ===== CHAT =====
app.post("/chat", (req, res) => {
  try {
    if (store.length === 0) {
      return res.json({ reply: "⚠️ Upload file trước" });
    }

    const question = req.body.message;

    const contextArr = search(question);

    const answer = mockAI(question, contextArr);

    console.log("📚 CONTEXT:", contextArr);
    console.log("🤖 ANSWER:", answer);

    res.json({
      reply: answer,
    });
  } catch (err) {
    console.error(err);
    res.json({ reply: "❌ Lỗi hệ thống" });
  }
});

// ===== FRONTEND =====
app.get("/", (req, res) => {
  res.send(`
  <html>
  <body style="font-family:Arial; max-width:600px; margin:auto">

    <h2>🔥 RAG Chat (Mock AI Smart)</h2>

    <input type="file" id="file">
    <button onclick="upload()">Upload</button>

    <div id="chat" style="height:300px; border:1px solid #ccc; margin:10px 0; overflow:auto; padding:10px"></div>

    <input id="msg" placeholder="Nhập câu hỏi..." style="width:70%">
    <button onclick="send()">Send</button>

    <script>
    async function upload() {
      const file = document.getElementById("file").files[0];
      if (!file) return alert("Chọn file");

      const form = new FormData();
      form.append("file", file);

      await fetch("/upload", { method:"POST", body: form });

      alert("✅ Upload xong");
    }

    async function send() {
      const input = document.getElementById("msg");
      const msg = input.value;

      if (!msg) return;

      add("Bạn", msg);
      input.value = "";

      try {
        const res = await fetch("/chat", {
          method:"POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ message: msg })
        });

        const data = await res.json();

        add("AI", data.reply);

      } catch {
        add("AI", "❌ Lỗi server");
      }
    }

    function add(role, text) {
      const div = document.createElement("div");
      div.innerHTML = "<b>" + role + ":</b> " + text;

      const chat = document.getElementById("chat");
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }
    </script>

  </body>
  </html>
  `);
});

// ===== START =====
app.listen(3000, () => console.log("👉 http://localhost:3000"));
