// GIỎ HÀNG

// Định nghĩa types
type ProductID = string | number;

type Category = "electronics" | "clothing" | "food";

type Product = {
  id: ProductID;
  name: string;
  price: number;
  category: Category;
  inStock: boolean;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type Cart = {
  items: CartItem[];
  discount?: number; // % giảm giá, không bắt buộc
};

// ========== Dùng thực tế ==========

const laptop: Product = {
  id: "sp-001",
  name: "MacBook Air M3",
  price: 28000000,
  category: "electronics",
  inStock: true,
};

const shirt: Product = {
  id: "sp-002",
  name: "Áo thun basic",
  price: 250000,
  category: "clothing",
  inStock: false,
};

// Thêm vào giỏ
const cart: Cart = {
  items: [
    { product: laptop, quantity: 1 },
    { product: shirt, quantity: 2 },
  ],
  discount: 10,
};

// Tính tổng tiền
function calcTotal(cart: Cart): number {
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
