// Phần 4 — Named export: class Cart
// Phần 6 — Default export: instance sẵn dùng
import { withTax, formatVND } from "./product.js"; // Phần 5 — import named

export class Cart {
  #items = [];

  add(name, price, qty = 1) {
    this.#items.push({ name, price, qty });
  }

  remove(name) {
    this.#items = this.#items.filter((i) => i.name !== name);
  }

  get total() {
    return this.#items.reduce((s, i) => s + i.price * i.qty, 0);
  }

  summary() {
    return this.#items
      .map(
        (i) => `  ${i.name} x${i.qty} — ${formatVND(withTax(i.price * i.qty))}`,
      )
      .join("\n");
  }
}

export default new Cart(); // Phần 6 — default export: singleton
