export const formatVND = (amount) =>
  amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
