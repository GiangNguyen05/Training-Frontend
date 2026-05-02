# Upgrades — RAG Website

## Streaming response (SSE)

Gửi từng token về frontend ngay khi AI sinh ra, không đợi toàn bộ câu trả lời.

```js
// server.js — thêm route mới
app.get("/api/chat/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const message = req.query.message;
  const context = await retrieveContext(message);
  const userPrompt = buildPrompt(message, context);

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: userPrompt }],
    stream: true
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? "";
    res.write(`data: ${JSON.stringify({ delta })}\n\n`);
  }
  res.end();
});
```

```js
// frontend — nhận SSE
const es = new EventSource(`/api/chat/stream?message=${encodeURIComponent(msg)}`);
const div = appendMessage("assistant", "");

es.onmessage = e => {
  const { delta } = JSON.parse(e.data);
  div.textContent += delta;
};
es.onerror = () => es.close();
```

---

## Highlight source chunk

Trả về cả `reply` lẫn `sources` để hiển thị nguồn trích dẫn.

```js
// agent.js — trả thêm sources
export async function callAI(question, contextItems, history = []) {
  // ... (giống như cũ)
  const reply = await generateReply(messages);
  return {
    reply,
    sources: contextItems.map(c => ({ text: c.text, source: c.source }))
  };
}
```

```js
// frontend — hiển thị sources
const { reply, sources } = await res.json();
appendMessage("assistant", reply);
if (sources.length) {
  appendSources(sources); // hiển thị danh sách nguồn bên dưới câu trả lời
}
```

---

## Multi-file support

Cho phép upload nhiều file, phân biệt nguồn khi search.

```js
// Giữ nguyên code hiện tại — metadata `source` đã lưu tên file
// Thêm filter khi cần tìm trong file cụ thể:
const results = await vectorDB.query({
  vector,
  topK: 5,
  includeMetadata: true,
  filter: { source: { $eq: "product-catalog.md" } } // optional
});
```

---

## Chat history lưu DB

Thay vì lưu history phía client, lưu vào PostgreSQL hoặc MongoDB.

```js
// Schema đơn giản (PostgreSQL)
CREATE TABLE chat_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id         SERIAL PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id),
  role       TEXT CHECK (role IN ('user', 'assistant')),
  content    TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

```js
// Lấy history theo session
export async function getHistory(sessionId) {
  const rows = await db.query(
    "SELECT role, content FROM chat_messages WHERE session_id = $1 ORDER BY created_at",
    [sessionId]
  );
  return rows.rows;
}
```

---

## Authentication (Clerk)

```bash
npm i @clerk/clerk-sdk-node
```

```js
// middleware
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

app.post("/api/chat", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  // ... xử lý bình thường, lưu history theo userId
});
```

---

## Production Vector DB

### Pinecone

```bash
npm i @pinecone-database/pinecone
```

```js
import { Pinecone } from "@pinecone-database/pinecone";
const pc    = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index("rag-index");
```

### Supabase pgvector

```sql
-- Tạo table trong Supabase
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE documents (
  id        BIGSERIAL PRIMARY KEY,
  content   TEXT,
  source    TEXT,
  embedding VECTOR(768)
);

CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops);
```

```js
const { data } = await supabase.rpc("match_documents", {
  query_embedding: vector,
  match_threshold: 0.75,
  match_count: 5
});
```
