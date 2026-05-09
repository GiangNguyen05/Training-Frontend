//   Chủ đề: Quản lý menu cửa hàng đồ uống

const menu = [
  { id: 1, name: "Cà phê đen", price: 25000, category: "coffee", rating: 4.8 },
  { id: 2, name: "Cà phê sữa", price: 30000, category: "coffee", rating: 4.5 },
  { id: 3, name: "Trà xanh", price: 35000, category: "tea", rating: 4.2 },
  {
    id: 4,
    name: "Sinh tố bơ",
    price: 55000,
    category: "smoothie",
    rating: 4.9,
  },
  { id: 5, name: "Nước cam", price: 40000, category: "juice", rating: 4.0 },
  { id: 6, name: "Trà sữa", price: 45000, category: "tea", rating: 4.7 },
  {
    id: 7,
    name: "Sinh tố dâu",
    price: 50000,
    category: "smoothie",
    rating: 4.6,
  },
];

const orders = [
  { itemId: 1, qty: 3 },
  { itemId: 4, qty: 1 },
  { itemId: 6, qty: 2 },
  { itemId: 3, qty: 1 },
];

// 1 – filter: Lọc đồ uống giá dưới 40k và rating >= 4.5
console.log("--- CÂU 1: filter ---");

const affordable = menu.filter(
  (item) => item.price < 40000 && item.rating >= 4.5,
);
console.log(affordable.map((i) => i.name));
// ["Cà phê đen", "Cà phê sữa"]

// 2 – map: Gắn nhãn "HOT 🔥" nếu rating >= 4.7
console.log("\n--- CÂU 2: map ---");

const displayMenu = menu.map((item) => ({
  ...item,
  label: item.rating >= 4.7 ? `🔥 HOT – ${item.name}` : item.name,
}));

displayMenu.forEach((i) => console.log(i.label));
// 🔥 HOT – Cà phê đen
// Cà phê sữa
// Trà xanh
// 🔥 HOT – Sinh tố bơ
// Nước cam
// 🔥 HOT – Trà sữa
// Sinh tố dâu

// 3 – reduce + find: Tính tổng tiền đơn hàng
console.log("\n--- CÂU 3: reduce + find ---");

const totalBill = orders.reduce((total, order) => {
  const item = menu.find((m) => m.id === order.itemId);
  return total + item.price * order.qty;
}, 0);

console.log("Tổng tiền:", totalBill.toLocaleString("vi-VN"), "đ");
// Tổng tiền: 250,000 đ

// 4 – sort: Xếp hạng menu theo rating cao nhất
console.log("\n--- CÂU 4: sort ---");

const topRated = [...menu].sort((a, b) => b.rating - a.rating);
// dùng spread [...menu] để không làm thay đổi mảng gốc

topRated.forEach((item, i) => {
  console.log(`#${i + 1} ${item.name} – ⭐ ${item.rating}`);
});
// #1 Sinh tố bơ – ⭐ 4.9
// #2 Cà phê đen – ⭐ 4.8
// #3 Trà sữa – ⭐ 4.7
// #4 Sinh tố dâu – ⭐ 4.6
// #5 Cà phê sữa – ⭐ 4.5
// #6 Trà xanh – ⭐ 4.2
// #7 Nước cam – ⭐ 4.0

// 5 – reduce: Nhóm sản phẩm theo category
console.log("\n--- CÂU 5: reduce (group by) ---");

const grouped = menu.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item.name);
  return acc;
}, {});

console.log(grouped);
// {
//   coffee:   ["Cà phê đen", "Cà phê sữa"],
//   tea:      ["Trà xanh", "Trà sữa"],
//   smoothie: ["Sinh tố bơ", "Sinh tố dâu"],
//   juice:    ["Nước cam"]
// }

// 6 – some / every: Kiểm tra điều kiện
console.log("\n--- CÂU 6: some / every ---");

const hasExpensive = menu.some((i) => i.price > 50000);
console.log("Có món trên 50k:", hasExpensive); // true

const allGood = menu.every((i) => i.rating >= 4.0);
console.log("Tất cả >= 4 sao:", allGood); // true

const allGreat = menu.every((i) => i.rating >= 4.5);
console.log("Tất cả >= 4.5 sao:", allGreat); // false

// 7 – Destructuring & Spread: Thêm món mới vào menu
console.log("\n--- CÂU 7: Destructuring & Spread ---");

const newItems = [
  { id: 8, name: "Matcha latte", price: 55000, category: "tea", rating: 4.8 },
  { id: 9, name: "Nước dừa", price: 30000, category: "juice", rating: 4.3 },
];

const updatedMenu = [...menu, ...newItems];
console.log("Tổng số món:", updatedMenu.length); // 9

const [topItem, ...rest] = topRated;
console.log("Món hot nhất:", topItem.name); // Sinh tố bơ
console.log(
  "Còn lại:",
  rest.map((i) => i.name),
);
