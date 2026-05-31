// Phần 5 — import default + named cùng lúc
import cart, { Cart } from "./cart.js";
import { TAX_RATE, formatVND } from "./product.js";

// Dùng singleton (default export)
cart.add("Cà phê", 35000, 2);
cart.add("Bánh mì", 20000, 1);
cart.add("Nước cam", 25000, 3);
cart.remove("Bánh mì");

console.log("=== Giỏ hàng ===");
console.log(cart.summary());
console.log(`Thuế: ${TAX_RATE * 100}%`);
console.log(`Tổng: ${formatVND(cart.total * (1 + TAX_RATE))}`);

// Tạo giỏ mới từ class (named export)
const vipCart = new Cart();
vipCart.add("Laptop", 25000000);
console.log("\n=== VIP Cart ===");
console.log(vipCart.summary());
