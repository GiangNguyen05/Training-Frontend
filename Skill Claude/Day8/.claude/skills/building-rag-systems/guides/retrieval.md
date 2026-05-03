# Retrieval Optimization

## Basic retrieval

def retrieve(query: str, collection, model,
n_results: int = 5) -> tuple[list[str], list[str]]:
results = collection.query(
query_embeddings=model.encode([query]).tolist(),
n_results=n_results,
include=["documents", "metadatas", "distances"]
)
chunks = results["documents"][0]
sources = [m.get("source", "?") for m in results["metadatas"][0]]
return chunks, sources

## Các vấn đề phổ biến và cách fix

### Kết quả không liên quan → thử Hybrid Search

Kết hợp vector search (semantic) + keyword search (BM25):

# pip install rank-bm25

from rank_bm25 import BM25Okapi
import numpy as np

def hybrid_retrieve(query: str, all_chunks: list[str], collection, model,
alpha: float = 0.5, n_results: int = 5) -> list[str]: # Vector search
q_emb = model.encode([query]).tolist()
vec_results = collection.query(query_embeddings=q_emb,
n_results=len(all_chunks),
include=["documents", "distances"])
vec_docs = vec_results["documents"][0]
vec_scores = [1 - d for d in vec_results["distances"][0]] # convert distance → score

      # BM25 search
      bm25 = BM25Okapi([c.split() for c in all_chunks])
      bm25_scores = bm25.get_scores(query.split())

      # Normalize và kết hợp
      def normalize(scores):
          mn, mx = min(scores), max(scores)
          return [(s - mn) / (mx - mn + 1e-9) for s in scores]

      combined = [alpha * v + (1 - alpha) * b
                  for v, b in zip(normalize(vec_scores), normalize(bm25_scores))]
      ranked = sorted(zip(combined, all_chunks), reverse=True)
      return [doc for _, doc in ranked[:n_results]]

# alpha = 0 → chỉ BM25, alpha = 1 → chỉ vector

# Bắt đầu với alpha=0.5, tăng nếu câu hỏi dùng từ chuyên ngành

### Retrieval thiếu chunk quan trọng → Rerank

Lấy nhiều candidate (n_retrieve=20) rồi rerank lọc top n_final:

# pip install sentence-transformers

from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

# Khởi tạo 1 lần lúc startup, không khởi tạo trong mỗi request

def rerank(query: str, candidate*docs: list[str], n_final: int = 5) -> list[str]:
pairs = [[query, doc] for doc in candidate_docs]
scores = reranker.predict(pairs)
ranked = sorted(zip(scores, candidate_docs), reverse=True)
return [doc for *, doc in ranked[:n_final]]

### Query quá ngắn / mơ hồ → Query Expansion

Sinh thêm câu hỏi tương tự để search rộng hơn:

def expand_and_retrieve(query: str, collection, model, llm_fn,
n_results: int = 5) -> list[str]:
prompt = f"""Sinh 3 cách diễn đạt khác cho câu hỏi sau.
Mỗi cách trên một dòng, không đánh số, không giải thích:
{query}"""

      expanded = llm_fn(prompt).strip().split("\n")
      all_queries = [query] + [q.strip() for q in expanded if q.strip()]

      seen, results = set(), []
      for q in all_queries:
          chunks, _ = retrieve(q, collection, model, n_results=3)
          for c in chunks:
              if c not in seen:
                  seen.add(c)
                  results.append(c)

      return results[:n_results]

## Chọn embedding model

| Model                              | Size  | Tốc độ | Tiếng Việt | Dùng khi                   |
| ---------------------------------- | ----- | ------ | ---------- | -------------------------- |
| all-MiniLM-L6-v2                   | 80MB  | nhanh  | kém        | Bắt đầu, tiếng Anh         |
| paraphrase-multilingual-MiniLM-L12 | 420MB | vừa    | tốt        | Tiếng Việt / đa ngôn ngữ   |
| BAAI/bge-m3                        | 570MB | chậm   | rất tốt    | Production, chất lượng cao |
| text-embedding-3-small (API)       | —     | nhanh  | tốt        | Không muốn chạy local      |
