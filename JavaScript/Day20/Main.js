// Phần 11 — Node ESM: import.meta.url thay __filename
import { fileURLToPath } from "url";
console.log("📂 File:", fileURLToPath(import.meta.url));

// Phần 7 — Import từ barrel (index.js re-export utils + store)
import { cap, trim, add, all, count } from "./index.js";

// Phần 8 — Dynamic import: chỉ load khi cần
const fmt = await import("./utils.js");
console.log("Dynamic load:", fmt.cap("dynamic import hoạt động!"));

// Phần 10 — CJS interop: import core module CJS của Node
import { readFileSync } from "fs"; // fs là CJS, ESM vẫn import được

// Phần 12 — Singleton + live binding
add({ title: "Bài 1: JavaScript Modules" });
add({ title: "Bài 2: ES6 Dynamic Import" });

// Phần 12 — Strict mode tự động (không cần "use strict")
// undeclared = 1; // → ReferenceError ngay

// In kết quả
all().forEach((item, i) =>
  console.log(`${i + 1}. ${cap(trim(item.title, 25))}`),
);
console.log(`Tổng: ${count} bài`); // live binding — tự cập nhật
