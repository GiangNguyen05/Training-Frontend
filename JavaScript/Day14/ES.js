// ── ES2022: Class Private Fields ──
class Playlist {
  #songs = [];
  #nextId = 1;

  add(title, artist) {
    this.#songs.push({ id: this.#nextId++, title, artist, liked: false });
    return this;
  }

  remove(id) {
    this.#songs = this.#songs.filter((s) => s.id !== id); // ES2023: toSpliced thay thế
    return this;
  }

  toggle(id) {
    const song = this.#songs.find((s) => s.id === id);
    if (song) song.liked = !song.liked;
    return this;
  }

  // ES2022: Getter
  get last() {
    return this.#songs.at(-1);
  } // ES2022: Array.at()
  get count() {
    return this.#songs.length;
  }
  get all() {
    return this.#songs.toSorted((a, b) => a.title.localeCompare(b.title));
  } // ES2023: toSorted()
}

// ── Khởi tạo ──
const playlist = new Playlist();

playlist
  .add("Hãy Trao Cho Anh", "Sơn Tùng M-TP")
  .add("Người Lạ Ơi", "Karik")
  .add("Có Chắc Yêu", "Sơn Tùng M-TP")
  .add("Chạy Ngay Đi", "Sơn Tùng M-TP")
  .toggle(1);

// ── ES2022: Array.at() ──
console.log("Bài cuối:", playlist.last.title); // "Chạy Ngay Đi"

// ── ES2023: toSorted() — không mutate gốc ──
console.log(
  "Sắp xếp A-Z:",
  playlist.all.map((s) => s.title),
);

// ── ES2024: Object.groupBy() ──
const byArtist = Object.groupBy(playlist.all, (s) => s.artist);
console.log("Theo ca sĩ:", byArtist);
// { "Karik": [...], "Sơn Tùng M-TP": [...] }

// ── ES2023: findLast() ──
const lastLiked = playlist.all.findLast((s) => s.liked);
console.log("Bài thích gần nhất:", lastLiked?.title);

// ── ES2022: Object.hasOwn() ──
const song = playlist.last;
console.log("Có field 'liked'?", Object.hasOwn(song, "liked")); // true
console.log("Có field 'plays'?", Object.hasOwn(song, "plays")); // false

// ── ES2024: Promise.withResolvers() ──
async function confirm(msg) {
  const { promise, resolve } = Promise.withResolvers();
  setTimeout(() => resolve(true), 500); // Giả lập user nhấn OK
  const ok = await promise;
  if (ok) console.log(`✓ ${msg}`);
}

// ── ES2025: Promise.try() — bọc sync/async đồng nhất ──
Promise.try(() => playlist.remove(2)) // sync
  .then(() => confirm("Đã xoá bài hát")) // async
  .then(() => console.log("Còn lại:", playlist.count))
  .catch((err) => console.error("Lỗi:", err.message));

// ── ES2025: Set Methods ──
const liked = new Set(playlist.all.filter((s) => s.liked).map((s) => s.title));
const popular = new Set(["Hãy Trao Cho Anh", "Pháo", "Có Chắc Yêu"]);

console.log("Thích & nổi tiếng:", [...liked.intersection(popular)]);
console.log("Thích hoặc nổi tiếng:", [...liked.union(popular)]);

// ── ES2022: Error cause ──
async function loadSong(id) {
  try {
    const res = await fetch(`/api/songs/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    throw new Error(`Không thể tải bài hát #${id}`, { cause: err }); // ES2022
  }
}

loadSong(999).catch((err) => {
  console.error(err.message); // "Không thể tải bài hát #999"
  console.error(err.cause); // Lỗi gốc vẫn còn
});
