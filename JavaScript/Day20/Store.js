// Phần 12 — Singleton: chỉ eval 1 lần, mọi nơi import dùng chung state
const items = [];
export let count = 0; // live binding
export const add = (item) => {
  items.push(item);
  count++;
};
export const all = () => [...items];
