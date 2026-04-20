## Tạo second brain

## Gắn agent vào obsidian

- Có 3 cách:
  - Plugin "Smart Connections"
    - Cách cài: Settings -> Community Plugins -> Tìm Smart Connections.
    - Tính năng: Bạn có thể chat với toàn bộ kho ghi chú HTML/CSS của mình. Ví dụ: "Dựa trên ghi chú của tôi, làm thế nào để responsive cho máy tính bảng?"
    - Yêu cầu: Cần API Key (OpenAI, Anthropic) hoặc chạy local qua LM Studio.
      -Plugin "Text Generator"
    - Cách cài: Tìm và cài đặt Text Generator trong Community Plugins.
    - Cách dùng: Bạn chỉ cần gõ một dòng tiêu đề như "Viết code CSS cho nút bấm 3D", sau đó nhấn phím tắt, AI sẽ tự động sinh nội dung ngay dưới con trỏ chuột.
    - Điểm mạnh: Cho phép tạo các Templates (Prompts) riêng cho việc học Code (ví dụ: Template chuyên để giải thích lỗi Console).
  - Plugin "Copilot" (Khuyên dùng cho Coder)
    - Cách cài: Tìm và cài đặt plugin tên là Copilot.
    - Điểm hay: Nó có chế độ "Index Vault". Sau khi quét xong, Agent này sẽ hiểu mọi dự án Frontend bạn đã lưu. Bạn có thể bôi đen một đoạn code HTML bị lỗi và chọn "Fix this" từ menu.

## Các bước chung để kích hoạt Agent:

- Lấy API Key: Phổ biến nhất là OpenAI API Key. (Cần nạp một ít phí, khoảng $5 là dùng rất lâu).
- Dán Key vào Plugin: Vào phần cài đặt của plugin bạn đã chọn -> dán API Key vào mục "API Key".
- Chọn Model: Chọn gpt-4o hoặc gpt-3.5-turbo tùy vào ngân sách và nhu cầu của bạn.

## Sử dụng key gemini google:

- Lấy API key: https://aistudio.google.com/api-keys
- Vào obsidian:
  - mở cài đặt
  - Chọn copilot:
    - Default chat Model: chọn "google/gemini-2.5-flash
    - API Key: chọn Set Key --> phần gemini nhập API key --> add Model: gemini-2.5-flash

## Cài đặt AI Local(free)

- Bước 1: Cài đặt "Trạm phát" AI (LM Studio)
  - Truy cập lmstudio.ai và tải về máy.
  - Mở LM Studio, tìm kiếm model "Llama 3" hoặc "Phi-3" (đây là các model nhẹ, chạy tốt trên laptop). Nhấn Download.
  - Chọn biểu tượng Local Server (hình mũi tên hai chiều) ở thanh bên trái.
  - Nhấn nút Start Server. Lúc này máy tính của bạn đã trở thành một "trạm phát" AI tại địa chỉ http://localhost:1234.
- Bước 2: Cài đặt "Cổng kết nối" trong Obsidian (Copilot)
  - Trong Obsidian, vào Settings -> Community Plugins -> Browse.
  - Tìm và cài đặt plugin tên là Copilot. Nhấn Enable.
  - Vào phần cài đặt của plugin Copilot:
    - Default Model: Chọn Localhost (LM Studio, Ollama, vLLM, etc.).
    - API Key: Bạn có thể gõ bất kỳ chữ gì (ví dụ: lm-studio) vì nó chạy local nên không cần key thật.
    - Endpoint: Đảm bảo địa chỉ là http://localhost:1234/v1
- Bước 3: Sử dụng AI để học Frontend
  - Hỏi đáp: Nhờ AI giải thích đoạn code CSS bạn vừa copy từ file docs vào.
  - Index Vault: Nhấn vào nút "Index" trong Copilot để AI đọc toàn bộ ghi chú HTML/CSS của bạn. Sau đó bạn có thể hỏi: "Dựa trên ghi chú của tôi, liệt kê các mốc breakpoints cho Tablet".
  - Viết code: Nhờ AI viết nhanh một khung HTML cho dự án mới ngay trong Obsidian.
