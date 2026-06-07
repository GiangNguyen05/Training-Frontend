// --- Interfaces ---
interface Post {
  id: number;
  title: string;
  status?: "draft" | "published";
}

// Generics: ApiResponse<T> dùng được cho mọi API
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

// Generics: hàm fetch dùng được cho mọi endpoint
async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  return res.json() as Promise<ApiResponse<T>>;
}

// Generics: tìm theo id, T phải có trường id
function findById<T extends { id: number }>(
  items: T[],
  id: number,
): T | undefined {
  return items.find((item) => item.id === id);
}

// --- Xử lý dữ liệu ---
async function main() {
  try {
    // TypeScript tự biết res.data là Post[]
    const res = await fetchApi<Post[]>(
      "https://jsonplaceholder.typicode.com/posts",
    );

    const posts: Post[] = res.data;

    // Array methods, kiểu rõ ràng
    const titles: string[] = posts.map((p) => p.title);
    const published: Post[] = posts.filter((p) => p.status === "published");

    // Lỗi null: find trả về Post | undefined → kiểm tra trước
    const found = findById(posts, 3);
    if (found) {
      console.log(found.title);
      // status có thể undefined → dùng ??
      console.log(found.status ?? "Chưa phân loại");
    }

    console.log(`Tổng: ${posts.length} bài`);
    console.log(`Tiêu đề đầu tiên: ${titles[0]}`);
    console.log(`Đã xuất bản: ${published.length} bài`);
  } catch (err) {
    // Lỗi async: try/catch bắt lỗi fetch
    console.error("Không tải được dữ liệu");
  }
}

main();
