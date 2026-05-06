# Trainning JS

## Giai đoạn 1 — Nền tảng (4-6 tuần)

Học các khái niệm cốt lõi không bao giờ lỗi thời: variables, functions, arrays, objects, DOM manipulation, async/await, fetch API. Đừng bỏ qua phần này dù AI có thể viết code thay bạn — bạn cần hiểu để review và debug code AI sinh ra.

## Giai đoạn 2 — Modern JS + Tooling (3-4 tuần)

`ES2022-2025 features, modules, npm ecosystem, Git, VS Code với AI extensions (GitHub Copilot hoặc Claude). Học cách prompt AI hiệu quả để viết code, giải thích code, và review code của chính bạn.`

Đây là giai đoạn bạn học JavaScript "hiện đại" — tức là cách JS được viết trong thực tế năm 2026, không phải cú pháp cũ từ 10 năm trước. Cụ thể bạn sẽ học:

- `ES2022-2025 features` — những cú pháp mới giúp code ngắn hơn, rõ hơn như optional chaining (?.), nullish coalescing (??), array methods mới, top-level await...
- `Modules` — cách chia code thành nhiều file và import/export giữa chúng, nền tảng của mọi dự án thực tế

- `npm ecosystem` — cách cài và quản lý thư viện, hiểu package.json, biết dùng Vite để tạo project
- `Git` — version control cơ bản, không có Git thì không làm việc được với team hay deploy lên đâu cả
- `VS Code + AI extensions` — thiết lập môi trường làm việc chuẩn với GitHub Copilot hoặc Claude, học cách prompt AI để giải thích code, debug, và gợi ý cải thiện

- Lý do giai đoạn này quan trọng: nếu bỏ qua và nhảy thẳng vào React, bạn sẽ thấy code React rất khó hiểu vì React dùng rất nhiều cú pháp modern JS. Nhiều người học bị stuck ở React không phải vì React khó mà vì JS nền tảng chưa vững.

- [MDN Web Docs]
- [javascript.info]
- [learnjavascript.online]

## Giai đoạn 3 — Framework (6-8 tuần)

`Chọn một: React (thị trường rộng nhất) hoặc Vue (dễ học hơn). Năm 2026 thì React vẫn là lựa chọn an toàn nhất cho việc xin việc.`

Sau khi hiểu JS thuần, bạn học React — thư viện để xây dựng giao diện người dùng. React thay đổi cách bạn nghĩ về UI: thay vì thao tác DOM trực tiếp như giai đoạn 1, bạn mô tả UI trông như thế nào và React tự cập nhật. Cụ thể bạn học:

- `Components` — chia giao diện thành các mảnh nhỏ tái sử dụng được, ví dụ Button, Card, Navbar mỗi cái là một component riêng
- `Props & State` — props là dữ liệu truyền vào component từ bên ngoài, state là dữ liệu component tự quản lý bên trong, hiểu hai thứ này là hiểu 70% React
- `Hooks` — useState, useEffect, useRef... là công cụ để xử lý state, gọi API, và các tác vụ phụ trong component
- `React Router` — điều hướng giữa các trang trong app mà không reload trình duyệt
- `Gọi API` — lấy dữ liệu từ backend về và hiển thị lên UI

Lý do chọn React thay vì Vue hay Angular: React vẫn là framework được tuyển dụng nhiều nhất năm 2026, cộng đồng lớn nhất, tài liệu phong phú nhất, và học xong React thì chuyển sang Next.js — framework fullstack phổ biến nhất hiện tại — rất tự nhiên.

- [react.dev]
- [learnreact.online]

## Giai đoạn 4 — AI-native Development (song song từ giai đoạn 2)

Học cách làm việc với AI tools như Claude Code, Cursor, hoặc Copilot không phải để AI viết hết mà để tăng tốc gấp 3-5 lần. Hiểu khi nào nên tin AI, khi nào cần tự kiểm tra.

## Giai đoạn 5 — Chuyên sâu theo hướng bạn chọn

Frontend: TypeScript + Next.js + Tailwind. Backend: Node.js + Express hoặc Hono. Fullstack: cả hai kết hợp với database (PostgreSQL hoặc SQLite).

## Restful API

### Bước 1 — Hiểu HTTP cơ bản

[developer.mozilla.org/en-US/docs/Web/HTTP/Overview]

### Bước 2 — Thực hành gọi API với Fetch

- Dùng JSONPlaceholder ([jsonplaceholder.typicode.com]) — API giả miễn phí, không cần đăng ký, dùng để luyện tập:
- VD: // Lấy danh sách bài viết
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const posts = await res.json()
  // Tạo bài viết mới
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Bài viết mới", body: "Nội dung..." })
  })
- Luyện đủ 4 kiểu: GET, POST, PUT, DELETE.

### Bước 3 — Gọi API trong React

- Học trên react.dev phần "Fetching Data" — tài liệu chính thức, miễn phí, có ví dụ thực tế.
  Sau đó học TanStack Query (trước gọi là React Query) — đây là thư viện chuẩn nhất để gọi API trong React năm 2026, giúp xử lý loading state, error, cache tự động:

        import { useQuery } from "@tanstack/react-query"

        function Posts() {
        const { data, isLoading, error } = useQuery({
        queryKey: ["posts"],
        queryFn: () => fetch("/api/posts").then(r => r.json())
        })

        if (isLoading) return <p>Đang tải...</p>
        if (error) return <p>Lỗi rồi!</p>

        return posts.map(post => <div>{post.title}</div>)
        }

- Tài liệu TanStack Query: [tanstack.com/query/latest/docs] — miễn phí.

### Bước 4 — Công cụ test API

Cài Bruno hoặc Postman — dùng để test API trước khi viết code React, xem response trông như thế nào. Bruno miễn phí và nhẹ hơn Postman.
