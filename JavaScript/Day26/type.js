"use strict";
// Generics: hàm fetch dùng được cho mọi endpoint
async function fetchApi(url) {
    const res = await fetch(url);
    return res.json();
}
// Generics: tìm theo id, T phải có trường id
function findById(items, id) {
    return items.find((item) => item.id === id);
}
// --- Xử lý dữ liệu ---
async function main() {
    try {
        // TypeScript tự biết res.data là Post[]
        const res = await fetchApi("https://jsonplaceholder.typicode.com/posts");
        const posts = res.data;
        // Array methods, kiểu rõ ràng
        const titles = posts.map((p) => p.title);
        const published = posts.filter((p) => p.status === "published");
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
    }
    catch (err) {
        // Lỗi async: try/catch bắt lỗi fetch
        console.error("Không tải được dữ liệu");
    }
}
main();
