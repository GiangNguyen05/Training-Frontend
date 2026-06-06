"use strict";
// QUẢN LÝ BÀI VIẾT
// Async/Fetch: Promise<Post[]> báo rõ trả về gì
async function getPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  return res.json();
}
async function main() {
  try {
    const posts = await getPosts(); // Post[]
    //— Array Methods
    const titles = posts.map((p) => p.title); // string[] — lấy tiêu đề
    const first10 = posts.filter((p) => p.id <= 10); // Post[]  — lọc 10 bài đầu
    const found = posts.find((p) => p.id === 5); // Post | undefined — tìm bài id=5
    // Type Narrowing: found có thể undefined → kiểm tra trước
    if (found) {
      console.log(found.title); //  chắc chắn là Post
      console.log(found.category ?? "Chưa phân loại"); // category có thể undefined
    }
    console.log(`Tổng: ${posts.length} bài`);
    console.log(`10 bài đầu: ${first10.length} bài`);
    console.log(`Tiêu đề đầu tiên: ${titles[0]}`);
  } catch (err) {
    console.log("Lỗi kết nối");
  }
}
main();
