// utils/string.js (nội tuyến để ngắn gọn)
export const cap = (str) => str[0].toUpperCase() + str.slice(1);
export const trim = (str, n) => (str.length > n ? str.slice(0, n) + "…" : str);
