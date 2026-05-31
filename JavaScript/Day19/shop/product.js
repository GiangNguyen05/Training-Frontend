// Phần 3 — Named exports: hằng số và hàm tiện ích
export const TAX_RATE = 0.1;

export function withTax(price) {
  return price * (1 + TAX_RATE);
}

export function formatVND(price) {
  return price.toLocaleString("vi-VN") + " ₫";
}
