---
name: building-rag-systems
description:
  Giúp developer xây dựng và tối ưu hóa RAG (Retrieval-Augmented Generation)
  pipeline bao gồm chunking, embedding, vector search, reranking và tích hợp vào
  ứng dụng. Dùng khi người dùng hỏi về RAG, vector database, semantic search, hay
  muốn LLM trả lời dựa trên tài liệu riêng của họ.
---

# Building RAG Systems

## Khi nào dùng Skill này

- Người dùng muốn LLM trả lời dựa trên tài liệu riêng (PDF, Word, web...)
- Cần cải thiện chất lượng retrieval (chunk không liên quan, thiếu context)
- Tích hợp RAG vào app (chatbot, API, pipeline tự động)
- Hỏi về: vector database, embedding, semantic search, reranking

## Tổng quan pipeline RAG

Ingestion: Tài liệu → Chunking → Embedding → Lưu vào ChromaDB
Retrieval: Query → Embed → Vector search → Rerank → Context
Generation: Context + Query → LLM → Câu trả lời

## Điều hướng

| Vấn đề / Nhu cầu                    | File cần đọc                            |
| ----------------------------------- | --------------------------------------- |
| Chunk quá lớn/nhỏ, mất context      | guides/chunking.md                      |
| Kết quả retrieval không liên quan   | guides/retrieval.md                     |
| Muốn tích hợp vào app/API           | guides/integration.md                   |
| Cần chọn tham số phù hợp            | guides/settings.md                      |
| Muốn đánh giá, debug chất lượng RAG | guides/evaluation.md                    |
| Bắt đầu từ đầu (greenfield)         | guides/settings.md → guides/chunking.md |

## Stack mặc định

- Vector DB: ChromaDB (local, không cần server)
- Embedding: sentence-transformers/all-MiniLM-L6-v2
- Python 3.9+

  pip install chromadb sentence-transformers langchain-text-splitters rank-bm25

# Nếu người dùng đã có stack khác (FAISS, Qdrant, OpenAI embeddings),

# adapt code mẫu theo stack của họ, không ép dùng stack mặc định.
