---
name: building-rag-website
description: >
  Hướng dẫn xây dựng website RAG (Retrieval-Augmented Generation) hoàn chỉnh với chatbox AI,
  hỗ trợ upload dữ liệu, chunking, embedding, vector search và AI response.
  Dùng skill này khi người dùng đề cập đến: RAG, chatbot AI, vector database, embedding,
  semantic search, retrieval pipeline, knowledge base, AI agent tìm kiếm dữ liệu,
  hệ thống hỏi-đáp thông minh, hoặc muốn AI trả lời dựa trên tài liệu/dữ liệu tùy chỉnh.
  Skill này chứa kiến trúc chuẩn, code mẫu JS đầy đủ, AI adapter pattern đa provider,
  chunking rules, lỗi phổ biến và checklist — ưu tiên dùng skill này thay vì tự tổng hợp.
---

# Building RAG Website

## Khi dùng skill này

1. Hỏi stack (JS hay Python) và AI provider (Gemini / OpenAI / Claude) nếu chưa rõ
2. Dùng code mẫu dưới đây làm nền — không viết lại từ đầu
3. Điều chỉnh theo use case cụ thể (sản phẩm, tài liệu nội bộ, FAQ, v.v.)
4. Cảnh báo chủ động các lỗi phổ biến ở cuối skill

---

## Kiến trúc hệ thống

```
User (Chat UI)
     ↓
Frontend (React / HTML+JS)      ← nhận input, hiển thị output
     ↓  POST /api/chat
Backend (Node.js / Express)     ← điều phối toàn bộ luồng
     ↓  embed(question)
Embedding Model                 ← chuyển câu hỏi → vector
     ↓  vectorDB.search()
Vector Database                 ← tìm chunk liên quan nhất
     ↓  inject context
AI Agent (Gemini / GPT / Claude) ← sinh câu trả lời từ context
     ↓
Response → User
```

**Nguyên lý cốt lõi:**

1. KHÔNG gửi toàn bộ dữ liệu vào AI
2. LUÔN dùng embedding + vector search
3. CHỈ inject context liên quan vào prompt
4. Nếu không có dữ liệu → trả lời "Không tìm thấy"

---

## Luồng dữ liệu đầy đủ

### Luồng indexing (chạy một lần khi upload file)

```
Upload file → đọc nội dung → chunk theo heading → embed từng chunk → lưu vector DB
```

### Luồng query (mỗi lần user hỏi)

```
User hỏi → embed câu hỏi → search top-K → inject context vào prompt → AI trả lời
```

---

## Thành phần 1 — Upload & Chunking

Chunk theo heading markdown (`#`, `##`, `###`). Quy tắc:

- Mỗi chunk: 200–500 từ
- Loại bỏ chunk quá ngắn (< 30 ký tự)

```js
// chunker.js
export function chunkMarkdown(text) {
  const lines = text.split("\n");
  const chunks = [];
  let current = [];

  for (const line of lines) {
    if (/^#{1,3} /.test(line) && current.length > 0) {
      const chunk = current.join("\n").trim();
      if (chunk.length >= 30) chunks.push(chunk);
      current = [];
    }
    current.push(line);
  }

  const last = current.join("\n").trim();
  if (last.length >= 30) chunks.push(last);

  return chunks;
}
```

**API endpoint nhận file:**

```js
// upload.js
import multer from "multer";
import { chunkMarkdown } from "./chunker.js";
import { indexChunks } from "./indexer.js";

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const text = req.file.buffer.toString("utf-8");
  const chunks = chunkMarkdown(text);

  await indexChunks(chunks, req.file.originalname);

  res.json({ success: true, chunks: chunks.length });
});
```

---

## Thành phần 2 — Embedding & Indexing

```js
// indexer.js
import { getEmbedding } from "./embedding.js";
import { vectorDB } from "./db.js";

export async function indexChunks(chunks, source) {
  for (let i = 0; i < chunks.length; i++) {
    const text = chunks[i];
    const vector = await getEmbedding(text);

    await vectorDB.upsert([
      {
        id: `${source}-${i}`,
        values: vector,
        metadata: { text, source, index: i },
      },
    ]);
  }
  console.log(`✅ Indexed ${chunks.length} chunks from ${source}`);
}
```

---

## Thành phần 3 — Retrieval

```js
// retrieval.js
import { getEmbedding } from "./embedding.js";
import { vectorDB } from "./db.js";

export async function retrieveContext(query, topK = 5) {
  const vector = await getEmbedding(query);
  const results = await vectorDB.query({ vector, topK, includeMetadata: true });

  return results.matches
    .filter((m) => m.score > 0.75) // loại kết quả kém liên quan
    .map((m) => m.metadata);
}
```

---

## Thành phần 4 — AI Adapter Pattern (đa provider)

Hỗ trợ Gemini / OpenAI / Claude qua một interface chung. **Không hardcode 1 provider.**

```js
// ai-adapter.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const PROVIDER = process.env.AI_PROVIDER ?? "gemini"; // gemini | openai | claude

export async function generateReply(messages) {
  if (PROVIDER === "gemini") {
    const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat();
    const res = await chat.sendMessage(messages.at(-1).content);
    return res.response.text();
  }

  if (PROVIDER === "openai") {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.3,
    });
    return res.choices[0].message.content;
  }

  if (PROVIDER === "claude") {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const system = messages.find((m) => m.role === "system")?.content ?? "";
    const turns = messages.filter((m) => m.role !== "system");
    const res = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system,
      messages: turns,
    });
    return res.content[0].text;
  }

  throw new Error(`Unknown AI_PROVIDER: ${PROVIDER}`);
}
```

---

## Thành phần 5 — Prompt & Agent

Prompt phải có cấu trúc rõ, **chỉ dùng context đã retrieve**.

```js
// agent.js
import { generateReply } from "./ai-adapter.js";

const SYSTEM_PROMPT = `
Bạn là trợ lý AI. Trả lời CÂU HỎI chỉ dựa trên DỮ LIỆU được cung cấp.
Nếu dữ liệu không đủ, hãy nói: "Không tìm thấy thông tin về vấn đề này."
Tuyệt đối KHÔNG bịa thêm ngoài dữ liệu. Trả lời tiếng Việt, ngắn gọn.
`.trim();

export async function callAI(question, contextItems, history = []) {
  const contextText = contextItems.length
    ? contextItems.map((c) => `- ${c.text}`).join("\n")
    : "Không có dữ liệu liên quan.";

  const userPrompt = `
=== DỮ LIỆU THAM KHẢO ===
${contextText}

=== CÂU HỎI ===
${question}
  `.trim();

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: userPrompt },
  ];

  return generateReply(messages);
}
```

---

## Thành phần 6 — Backend chính

```js
// server.js
import express from "express";
import { retrieveContext } from "./retrieval.js";
import { callAI } from "./agent.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: "message trống" });

  try {
    const context = await retrieveContext(message);
    const reply = await callAI(message, context, history);
    res.json({ reply });
  } catch (err) {
    console.error("[/api/chat]", err);
    res.status(500).json({ error: "Lỗi server nội bộ" });
  }
});

app.listen(3000, () => console.log("✅ http://localhost:3000"));
```

---

## Thành phần 7 — Frontend (Chat UI)

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>RAG Chatbot</title>
    <style>
      body {
        font-family: sans-serif;
        max-width: 720px;
        margin: 40px auto;
        padding: 0 16px;
      }
      #chat {
        border: 1px solid #ddd;
        height: 420px;
        overflow-y: auto;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
      }
      .user {
        text-align: right;
        color: #1a73e8;
        margin: 6px 0;
      }
      .assistant {
        text-align: left;
        color: #333;
        margin: 6px 0;
      }
      #controls {
        display: flex;
        gap: 8px;
      }
      #input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
      button {
        padding: 10px 18px;
        background: #1a73e8;
        color: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
      #upload {
        margin-bottom: 12px;
      }
    </style>
  </head>
  <body>
    <h2>RAG Chatbot</h2>

    <!-- Upload file -->
    <div id="upload">
      <input type="file" id="file" accept=".md,.txt" />
      <button onclick="uploadFile()">Upload tài liệu</button>
      <span id="upload-status"></span>
    </div>

    <div id="chat"></div>
    <div id="controls">
      <input id="input" placeholder="Nhập câu hỏi..." />
      <button onclick="send()">Gửi</button>
    </div>

    <script>
      const history = [];

      async function send() {
        const input = document.getElementById("input");
        const msg = input.value.trim();
        if (!msg) return;
        input.value = "";
        appendMessage("user", msg);

        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg, history }),
          });
          const data = await res.json();
          appendMessage("assistant", data.reply);
          history.push({ role: "user", content: msg });
          history.push({ role: "assistant", content: data.reply });
          if (history.length > 20) history.splice(0, 2); // giới hạn history
        } catch {
          appendMessage("assistant", "⚠️ Có lỗi xảy ra. Vui lòng thử lại.");
        }
      }

      async function uploadFile() {
        const file = document.getElementById("file").files[0];
        const status = document.getElementById("upload-status");
        if (!file) return;

        const form = new FormData();
        form.append("file", file);

        status.textContent = "Đang upload...";
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        status.textContent = data.success
          ? `✅ Đã index ${data.chunks} chunks`
          : "❌ Upload thất bại";
      }

      function appendMessage(role, text) {
        const div = document.createElement("div");
        div.className = role;
        div.textContent = `${role === "user" ? "Bạn" : "AI"}: ${text}`;
        document.getElementById("chat").appendChild(div);
        div.scrollIntoView();
      }

      document.getElementById("input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") send();
      });
    </script>
  </body>
</html>
```

---

## Tech Stack & cài đặt

### Option A — Full JS (khuyên dùng)

| Tầng        | Công nghệ                   | Cài đặt                          |
| ----------- | --------------------------- | -------------------------------- |
| Frontend    | HTML/CSS/JS hoặc React      | —                                |
| Backend     | Node.js + Express           | `npm i express multer dotenv`    |
| Vector DB   | **Chroma** (local)          | `pip install chromadb`           |
| Embedding   | Gemini `text-embedding-004` | `npm i @google/generative-ai`    |
| LLM default | Gemini `gemini-1.5-flash`   | đã bao gồm                       |
| LLM alt     | OpenAI / Claude             | `npm i openai @anthropic-ai/sdk` |

### Option B — Production

| Tầng      | Công nghệ                             |
| --------- | ------------------------------------- |
| Vector DB | Pinecone hoặc Supabase pgvector       |
| Auth      | Clerk hoặc NextAuth                   |
| Deploy    | Vercel (frontend) + Railway (backend) |

---

## Ví dụ luồng thực tế

```
User hỏi: "Giá sản phẩm A là bao nhiêu?"
            ↓
embed("Giá sản phẩm A là bao nhiêu?")
            ↓
vectorDB.search → top-3:
  [0.94] "Sản phẩm A: 100,000 VND, còn hàng"
  [0.88] "Sản phẩm A Pro: 200,000 VND"
  [0.61] "Chính sách đổi trả..."  ← bị lọc (score < 0.75)
            ↓
Inject 2 chunks đầu vào prompt
            ↓
AI: "Giá sản phẩm A là 100,000 VND và đang còn hàng."
```

---

## Lỗi phổ biến — cảnh báo chủ động

| ❌ Lỗi                              | ✅ Cách đúng                             |
| ----------------------------------- | ---------------------------------------- |
| Không chunk dữ liệu trước khi index | Chunk theo heading, 200–500 từ/chunk     |
| Không dùng vector search            | Embed + semantic search là bắt buộc      |
| Nhét toàn bộ data vào prompt        | Chỉ inject top 3–5 chunk liên quan       |
| Không lọc theo score                | Filter `score > 0.75` để loại kết quả xa |
| Hardcode 1 AI provider              | Dùng AI adapter pattern, đọc từ `.env`   |
| `temperature` cao (> 0.7)           | Đặt 0.2–0.4 để giảm hallucination        |
| API key hardcode trong code         | Lưu trong `.env`, dùng `dotenv`          |
| Không có error handling             | Try/catch mọi API call                   |

---

## Upgrade path (thêm dần)

Xem file [UPGRADES.md](UPGRADES.md) để biết hướng dẫn chi tiết cho:

- Streaming response (SSE)
- Highlight source chunk trong câu trả lời
- Multi-file support
- Chat history lưu DB
- Authentication
- Production vector DB (Pinecone / Supabase)

---

## Checklist trước khi go-live

**Dữ liệu**

- [ ] Tài liệu đã được upload và index thành công
- [ ] Test retrieval: 5–10 câu hỏi mẫu → kết quả đúng

**Backend**

- [ ] `.env` chứa đủ API keys, không hardcode
- [ ] Try/catch ở mọi endpoint
- [ ] Rate limiting đã bật

**AI Agent**

- [ ] System prompt giới hạn AI chỉ dùng context
- [ ] `temperature` ≤ 0.4, `topK` = 3–5, filter score > 0.75

**Kiểm thử**

- [ ] Câu hỏi **có** trong tài liệu → trả lời đúng
- [ ] Câu hỏi **ngoài** tài liệu → AI nói "Không tìm thấy" (không bịa)
