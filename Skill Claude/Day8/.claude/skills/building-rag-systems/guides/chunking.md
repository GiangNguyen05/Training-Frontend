# Chunking Strategy

## Nguyên tắc chọn chunk size

Xem settings.md để chọn chunk_size phù hợp với loại tài liệu.

## Fixed-size chunking

from langchain_text_splitters import RecursiveCharacterTextSplitter
import logging

logger = logging.getLogger(**name**)

def chunk_document(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list[str]:
if not text or not text.strip():
raise ValueError("Document rỗng hoặc chỉ có whitespace")

      splitter = RecursiveCharacterTextSplitter(
          chunk_size=chunk_size,
          chunk_overlap=chunk_overlap,
          separators=["\n\n", "\n", ". ", " "],
      )
      chunks = splitter.split_text(text)

      if len(chunks) == 0:
          raise ValueError("Không tạo được chunk nào từ tài liệu")

      logger.info(f"Tạo {len(chunks)} chunks từ {len(text)} ký tự")
      return chunks

## Semantic chunking (cho tài liệu có cấu trúc)

Chia chunk theo ranh giới ngữ nghĩa thay vì đếm ký tự.
Phù hợp với: báo cáo, sách giáo khoa, tài liệu kỹ thuật có heading rõ ràng.

from langchain_text_splitters import MarkdownHeaderTextSplitter

def chunk_markdown(text: str) -> list[str]:
headers = [("#", "H1"), ("##", "H2"), ("###", "H3")]
splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers)
docs = splitter.split_text(text)
return [d.page_content for d in docs if d.page_content.strip()]

## Lưu chunk vào ChromaDB

import chromadb
from sentence_transformers import SentenceTransformer

def index_chunks(chunks: list[str], source: str = "unknown",
model_name: str = "all-MiniLM-L6-v2",
chroma_path: str = "./chroma_db",
collection_name: str = "my_docs") -> None:

      client = chromadb.PersistentClient(path=chroma_path)
      collection = client.get_or_create_collection(collection_name)
      model = SentenceTransformer(model_name)

      try:
          embeddings = model.encode(chunks, show_progress_bar=True).tolist()
      except Exception as e:
          logger.error(f"Lỗi khi tạo embedding: {e}")
          raise

      # Tạo ID duy nhất dựa trên source + index
      ids = [f"{source}_chunk_{i}" for i in range(len(chunks))]
      metadatas = [{"source": source, "chunk_index": i} for i in range(len(chunks))]

      collection.add(documents=chunks, embeddings=embeddings,
                     ids=ids, metadatas=metadatas)
      logger.info(f"Đã index {len(chunks)} chunks từ '{source}'")

## Debug chunk quality

def inspect_chunks(chunks: list[str], sample: int = 5) -> None:
print(f"Tổng: {len(chunks)} chunks")
print(f"Trung bình: {sum(len(c) for c in chunks)//len(chunks)} ký tự/chunk")
print(f"--- {sample} chunk đầu ---")
for i, c in enumerate(chunks[:sample]):
print(f"[{i}] {c[:120]}{'...' if len(c) > 120 else ''}\n")

# Kiểm tra trước khi index toàn bộ:

# - Mỗi chunk có đủ nghĩa khi đọc độc lập không?

# - Có bị cắt giữa câu/ý quan trọng không?

# - Metadata (source, chunk_index) có được lưu kèm không?
