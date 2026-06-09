# Đánh giá chất lượng RAG (thủ công)

## Quy trình test nhanh

Chuẩn bị 5–10 câu hỏi đại diện bao gồm:

- 2–3 câu hỏi trực tiếp (câu trả lời rõ ràng trong tài liệu)
- 2–3 câu hỏi tổng hợp (cần kết hợp nhiều đoạn)
- 1–2 câu hỏi bẫy (tài liệu không có câu trả lời)

## Checklist cho mỗi câu hỏi

Chạy từng câu hỏi và kiểm tra:

Retrieval:

- [ ] Ít nhất 1 trong top-5 chunk chứa câu trả lời đúng?
- [ ] Có chunk rõ ràng không liên quan lọt vào không?

Generation:

- [ ] LLM trả lời đúng nội dung, không bịa thêm?
- [ ] Với câu hỏi bẫy: LLM có thừa nhận "không tìm thấy" không?
- [ ] Câu trả lời có cite đúng nguồn không?

## Đọc kết quả và biết cần fix gì

Retrieval sai (chunk không liên quan):
→ Thử tăng chunk_overlap, hoặc giảm chunk_size
→ Xem retrieval.md: thử hybrid search hoặc rerank

LLM bịa thông tin (hallucination):
→ Thêm vào prompt: "Chỉ dùng thông tin được cung cấp.
Nếu không có, hãy nói 'Tôi không tìm thấy thông tin này.'"

Câu hỏi bẫy: LLM vẫn cố trả lời thay vì từ chối:
→ Thêm ngưỡng distance vào retrieval (xem integration.md):
if min(distances) > 0.8:
return "Tôi không tìm thấy thông tin liên quan trong tài liệu."

Câu hỏi tổng hợp: câu trả lời thiếu ý:
→ Tăng n_final từ 3 lên 5, hoặc thử query expansion (xem retrieval.md)

## Khi nào RAG đạt yêu cầu

Có thể chuyển sang production khi:

- Câu hỏi trực tiếp : 8/10 trả lời đúng
- Câu hỏi bẫy : 8/10 từ chối đúng (không bịa)
- Câu hỏi tổng hợp : 6/10 đủ ý chính
