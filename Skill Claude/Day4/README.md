# Skills Claude

## Những thứ quan trọng nhất khi viết skills

### Metadata (name + description)

- Claude thường quyết định có dùng skill hay không dựa vào frontmatter, đặc biệt là:
  - name
    - Ngắn gọn, rõ nghĩa
    - Lowercase + dấu gạch nối
    - Exam:
      processing-pdfs
      writing-documentation
      analyzing-spreadsheets
  - description
    - Phải mô tả:
      - Skill làm gì
      - Khi nào nên dùng
    - Ví dụ:
      description: Extract text and tables from PDF files. Use when working with PDFs, forms, or document extraction.

### Viết càng ngắn càng tốt

- Sai:
  - Giải thích PDF là gì
  - Giải thích Python là gì
  - Nói lan man
- Đúng:
  - Chỉ ghi thứ Claude cần để làm việc.

--> Mỗi token thừa làm giảm hiệu quả context window

### Chia Skill theo cấu trúc nhiều file (Progressive Disclosure)

- Thay vì nhét hết vào SKILL.md
- Nên:
  skill/
  ├── SKILL.md
  ├── examples.md
  ├── reference.md
  └── scripts/

--> Giúp skill lớn nhưng vẫn nhẹ.

### SKILL.md nên là bản đồ, không phải encyclopedia

- SKILL.md nên chứa:
  - Tổng quan
  - Cách dùng nhanh
  - Link sang file khác

--> Không nên chứa mọi chi tiết.

### Dùng workflow từng bước

- Claude làm tốt hơn nếu có checklist rõ ràng
- Ví dụ:
  [ ] Analyze input
  [ ] Validate
  [ ] Execute
  [ ] Verify

--> Đặc biệt tốt cho task nhiều bước.

### Có vòng lặp kiểm tra chất lượng

`Generate → Validate → Fix → Repeat`

- Ví dụ:
  - Sinh code
  - Chạy validator
  - Sửa lỗi
  - Chạy lại

---> Skill đáng tin hơn

### Dùng scripts sẵn thay vì bảo Claude tự code mỗi lần

- Ví dụ: `python scripts/analyze.py`
- Hiệu quả:
  - Ổn định
  - Nhanh
  - Ít hallucination
  - Tiết kiệm token

### Chọn mức tự do phù hợp

- Nếu task linh hoạt: Cho hướng dẫn mở
- Nếu task dễ lỗi: Cho lệnh cụ thể
- Ví dụ migration DB:
  `python migrate.py --verify --backup`

--> Skill tốt biết khi nào nên chặt, khi nào nên mở.

### Test skill bằng use case thật

- Không viết skill theo tưởng tượng.
- Quy trình tốt:
  - Cho Claude làm task chưa có skill
  - Xem nó fail ở đâu
  - Viết skill để vá đúng điểm fail
  - Test lại

## Quan trọng phải ghi nhớ:

-> Metadata quyết định có được dùng hay không
-> Structure quyết định Claude tìm info nhanh hay không
-> Workflow quyết định Claude làm đúng hay không
-> Validation quyết định output có đáng tin hay không
