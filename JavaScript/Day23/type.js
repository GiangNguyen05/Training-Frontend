"use strict";
// GIỎ HÀNG
// ========== Dùng thực tế ==========
const laptop = {
  id: "sp-001",
  name: "MacBook Air M3",
  price: 28000000,
  category: "electronics",
  inStock: true,
};
const shirt = {
  id: "sp-002",
  name: "Áo thun basic",
  price: 250000,
  category: "clothing",
  inStock: false,
};
// Thêm vào giỏ
const cart = {
  items: [
    { product: laptop, quantity: 1 },
    { product: shirt, quantity: 2 },
  ],
  discount: 10,
};
// Tính tổng tiền
function calcTotal(cart) {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const discount = cart.discount ?? 0;
  return subtotal * (1 - discount / 100);
}
console.log(calcTotal(cart)); // 25450000
//TypeScript bắt lỗi
// laptop.category = "furniture"; // ❌ Error: "furniture" không hợp lệ
// shirt.price = "free"; // ❌ Error: string không phải number
// const wrongItem: CartItem = {
//   product: laptop,
//   quantity: "hai", // ❌ Error: string không phải number
// };
