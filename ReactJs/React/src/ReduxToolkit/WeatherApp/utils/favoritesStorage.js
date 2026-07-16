const STORAGE_KEY = "weather-app:favorites";

export function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Không đọc được localStorage, dùng danh sách rỗng:", err);
    return [];
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.warn("Không lưu được vào localStorage:", err);
  }
}
