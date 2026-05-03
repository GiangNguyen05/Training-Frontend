# Tích hợp RAG vào ứng dụng

## Setup logging chuẩn

import logging, time

logging.basicConfig(
level=logging.INFO,
format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("rag")

## RAG function với error handling + logging

def rag_query(query: str, collection, model, reranker=None,
n_retrieve: int = 20, n_final: int = 5) -> dict:
"""
Trả về dict: {answer, sources, latency_ms}
"""
if not query or not query.strip():
raise ValueError("Query không được để trống")

      t0 = time.time()

      # 1. Retrieve
      try:
          q_emb = model.encode([query]).tolist()
          results = collection.query(
              query_embeddings=q_emb,
              n_results=n_retrieve,
              include=["documents", "metadatas", "distances"]
          )
      except Exception as e:
          logger.error(f"Retrieval thất bại: {e}")
          raise

      chunks = results["documents"][0]
      sources = [m.get("source", "?") for m in results["metadatas"][0]]
      distances = results["distances"][0]

      # Từ chối nếu không có chunk liên quan
      # ChromaDB cosine distance: 0 = giống nhau, 2 = khác hoàn toàn
      if min(distances) > 0.8:
          return {"answer": "Tôi không tìm thấy thông tin liên quan trong tài liệu.",
                  "sources": [], "latency_ms": 0}

      # 2. Rerank nếu có
      if reranker:
          scores = reranker.predict([[query, c] for c in chunks])
          ranked = sorted(zip(scores, chunks, sources), reverse=True)
          chunks  = [c for _, c, _ in ranked[:n_final]]
          sources = [s for _, _, s in ranked[:n_final]]
      else:
          chunks  = chunks[:n_final]
          sources = sources[:n_final]

      context = "\n\n".join(chunks)

      # 3. Generate
      prompt = f"""Dựa vào thông tin sau để trả lời câu hỏi.

Nếu không tìm thấy thông tin liên quan, hãy nói rõ.
Chỉ dùng thông tin được cung cấp, không thêm thông tin ngoài.

Thông tin:
{context}

Câu hỏi: {query}"""

      answer = call_llm(prompt)  # thay bằng LLM của bạn
      latency = int((time.time() - t0) * 1000)
      logger.info(f"Query: '{query[:50]}' | {latency}ms | sources: {set(sources)}")

      return {"answer": answer, "sources": list(set(sources)), "latency_ms": latency}

## Tích hợp với FastAPI

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI()

class QueryRequest(BaseModel):
question: str
n_results: int = 5

@app.post("/ask")
async def ask(req: QueryRequest):
try:
return rag_query(req.question)
except ValueError as e:
raise HTTPException(status_code=400, detail=str(e))
except Exception as e:
logger.error(f"Lỗi không xác định: {e}")
raise HTTPException(status_code=500, detail="Lỗi server")

@app.post("/ask/stream")
async def ask_stream(req: QueryRequest):
context = retrieve_context(req.question)

      async def generate():
          async for chunk in stream_llm(context, req.question):
              yield chunk

      return StreamingResponse(generate(), media_type="text/plain")

## Những lỗi phổ biến khi tích hợp

- ChromaDB mất data khi restart
  Fix: luôn dùng PersistentClient(path="./chroma_db"), không dùng Client()

- Context quá dài → LLM confused hoặc vượt token limit
  Fix: n_final ≤ 5, xem settings.md để tune

- Không cite nguồn → người dùng không trust kết quả
  Fix: lưu metadata source vào ChromaDB, trả về sources trong response

- Reranker load chậm mỗi request
  Fix: khởi tạo CrossEncoder 1 lần lúc startup, không khởi tạo trong hàm

- LLM bịa thông tin dù context không có
  Fix: đã xử lý trong prompt ("Chỉ dùng thông tin được cung cấp...") + ngưỡng distance > 0.8 để từ chối sớm
