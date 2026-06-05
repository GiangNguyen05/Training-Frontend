// PHẦN 1 — TYPES
// Khai báo kiểu cho từng biến đơn lẻ

type OrderID = string; // "ORD-001"
type Price = number; // 250000
type IsAvailable = boolean; // true / false

// PHẦN 2 — FUNCTIONS
// Khai báo rõ nhận vào gì, trả về gì

function formatPrice(price: Price): string {
  return price.toLocaleString("vi-VN") + " đ";
}

formatPrice(250000); //  "250.000 đ"
formatPrice("free"); //  Error: string không phải number

// PHẦN 3 — INTERFACE
// Mô tả hình dạng của một object

interface Product {
  id: OrderID;
  name: string;
  price: Price;
  available: IsAvailable;
  description?: string; // ? = không bắt buộc
}

interface Customer {
  name: string;
  phone: string;
  address: string;
}

interface Order {
  orderId: OrderID;
  customer: Customer;
  items: Product[];
  createdAt: string;
}

// PHẦN 4 — UNION TYPES
// Một biến có thể là nhiều kiểu, hoặc chỉ được chọn trong danh sách

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";
type PaymentMethod = "cash" | "banking" | "momo";

// PHẦN 5 — TYPE VS INTERFACE
// Interface → mô tả object
// Type → union, danh sách giá trị cố định

// Dùng type cho trạng thái — vì là danh sách cố định
type DeliveryZone = "inner-city" | "suburban" | "province";

// Dùng interface cho dữ liệu phức tạp — vì có nhiều trường
interface OrderSummary {
  order: Order;
  status: OrderStatus;
  payment: PaymentMethod;
  zone: DeliveryZone;
  totalPrice: Price;
}

// CHẠY THỬ — Tạo một đơn hàng thực tế

const product1: Product = {
  id: "SP-001",
  name: "Cà phê sữa đá",
  price: 35000,
  available: true,
};

const product2: Product = {
  id: "SP-002",
  name: "Bánh mì thịt",
  price: 25000,
  available: true,
  description: "Bánh mì giòn nhân thịt nguội",
};

const customer: Customer = {
  name: "Nguyễn Văn Giang",
  phone: "0385147510",
  address: "Đà Nẵng",
};

const order: Order = {
  orderId: "ORD-2026-001",
  customer,
  items: [product1, product2],
  createdAt: "2026-06-05",
};

const summary: OrderSummary = {
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

const wrongOrder: Order = {
  orderId: "ORD-002",
  customer,
  items: [],
  // Error: Property 'createdAt' is missing
};
