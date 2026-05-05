# Skill Claude

## Tính năng Web:

### Upload tài liệu — kéo thả hoặc chọn file .txt, .md, .pdf (max 5MB)

### Chunking tự động — tách thành chunks 500 ký tự với overlap 50, hiển thị số chunks

### Retrieval trong browser — TF-IDF + keyword similarity, không cần backend

### AI Agent — gửi chunks liên quan vào Claude claude-sonnet-4-20250514, trả lời có trích dẫn nguồn

### Tab Pipeline — giải thích kiến trúc RAG 3 bước

### Tính năng lịch sử:

- Nút "Lịch sử" trên nav — click để mở/đóng panel bên phải chat
- Tự động lưu mỗi cuộc hội thoại vào localStorage ngay sau khi nhận câu trả lời
- Tên tự động — lấy từ câu hỏi đầu tiên của bạn (tối đa 40 ký tự)
- Hiển thị ngày giờ và số câu hỏi cho mỗi session
- Nút "+ Mới" để tạo cuộc hội thoại mới
- Click vào session để xem lại toàn bộ nội dung
- Nút × để xóa từng cuộc hội thoại
- Lịch sử tồn tại sau khi đóng trình duyệt (localStorage)
