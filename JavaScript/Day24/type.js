"use strict";
// PHẦN 1 — TYPES
// Khai báo kiểu cho từng biến đơn lẻ
// PHẦN 2 — FUNCTIONS
// Khai báo rõ nhận vào gì, trả về gì
function formatPrice(price) {
  return price.toLocaleString("vi-VN") + " đ";
}
formatPrice(250000); //  "250.000 đ"
formatPrice("free"); //  Error: string không phải number
// CHẠY THỬ — Tạo một đơn hàng thực tế
const product1 = {
  id: "SP-001",
  name: "Cà phê sữa đá",
  price: 35000,
  available: true,
};
const product2 = {
  id: "SP-002",
  name: "Bánh mì thịt",
  price: 25000,
  available: true,
  description: "Bánh mì giòn nhân thịt nguội",
};
const customer = {
  name: "Nguyễn Văn Giang",
  phone: "0385147510",
  address: "Đà Nẵng",
};
const order = {
  orderId: "ORD-2026-001",
  customer,
  items: [product1, product2],
  createdAt: "2026-06-05",
};
const summary = {
  order,
  status: "confirmed",
  payment: "momo",
  zone: "inner-city",
  totalPrice: product1.price + product2.price, // 60000
};
console.log(`Đơn hàng: ${summary.order.orderId}`);
console.log(`Khách hàng: ${summary.order.customer.name}`);
console.log(`Tổng tiền: ${formatPrice(summary.totalPrice)}`); // "60.000 đ"
console.log(`Trạng thái: ${summary.status}`);
// TYPESCRIPT BẮT LỖI
summary.status = "waiting"; //  Error: "waiting" không có trong OrderStatus
summary.payment = "zalopay"; //  Error: "zalopay" không có trong PaymentMethod
product1.price = "miễn phí"; //  Error: string không phải number
const wrongOrder = {
  orderId: "ORD-002",
  customer,
  items: [],
  // Error: Property 'createdAt' is missing
};
