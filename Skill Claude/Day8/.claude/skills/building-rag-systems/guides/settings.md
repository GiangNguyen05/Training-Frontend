# Chọn tham số RAG — hỏi từng câu

Claude hỏi người dùng theo từng bước dưới đây.
Dừng lại ở bước nào đã đủ thông tin để đưa ra khuyến nghị.

## Bước 1 — Loại tài liệu là gì?

Hỏi: "Tài liệu của bạn thuộc loại nào?"

→ FAQ / Q&A ngắn : chunk_size=200, overlap=20
→ Bài viết / blog / email : chunk_size=500, overlap=50
→ Báo cáo / tài liệu kỹ thuật: chunk_size=700, overlap=80
→ Source code : chunk_size=350, overlap=100
→ Chưa biết / hỗn hợp : chunk_size=500, overlap=50 # mặc định an toàn

## Bước 2 — Ngôn ngữ tài liệu?

Hỏi: "Tài liệu chủ yếu bằng ngôn ngữ nào?"

→ Tiếng Anh : embedding_model = "all-MiniLM-L6-v2" # 80MB, nhanh
→ Tiếng Việt : embedding_model = "paraphrase-multilingual-MiniLM-L12" # 420MB
→ Đa ngôn ngữ / cần chất lượng cao: embedding_model = "BAAI/bge-m3" # 570MB
→ Không muốn chạy local: dùng OpenAI text-embedding-3-small qua API

# Quan trọng: dùng cùng model lúc index và lúc query.

# Đổi model → xóa ChromaDB và index lại toàn bộ.

## Bước 3 — Tốc độ hay chất lượng ưu tiên hơn?

Hỏi: "Bạn đang ở giai đoạn nào — prototype hay production?"

→ Prototype / thử nghiệm nhanh:
n_retrieve=10, n_final=5, use_rerank=False

# Đơn giản, đủ để kiểm tra pipeline hoạt động

→ Production / chất lượng quan trọng:
n_retrieve=20, n_final=5, use_rerank=True

# Lấy nhiều candidate rồi rerank để lọc chunk tốt nhất

→ Production + cần phản hồi nhanh (<500ms):
n_retrieve=10, n_final=3, use_rerank=False

# Giảm số chunk, bỏ rerank để tiết kiệm thời gian

## Bước 4 — LLM có giới hạn context window không?

Chỉ hỏi nếu người dùng chưa đề cập:
"LLM bạn dùng có giới hạn context ngắn không (ví dụ dưới 8k tokens)?"

→ Có, context ngắn : giảm n_final xuống 3, chunk_size xuống 300–400
→ Không / không biết: giữ nguyên kết quả từ bước 3

## Tổng kết — đưa ra khuyến nghị cuối

Sau khi hỏi xong, tóm tắt cho người dùng:

"Dựa trên tình huống của bạn, mình khuyến nghị:

- chunk_size : [X]
- chunk_overlap : [X]
- embedding : [model]
- n_retrieve : [X]
- n_final : [X]
- use_rerank : [True/False]

Bước tiếp theo: xem chunking.md để bắt đầu index tài liệu."

# Nếu người dùng đã cung cấp đủ thông tin trong câu hỏi đầu,

# không cần hỏi lại — đưa ra khuyến nghị luôn.
