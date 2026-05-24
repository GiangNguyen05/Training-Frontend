// ── Class định nghĩa "khuôn" cho một bài hát ──
class Song {
  constructor(id, title, artist) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.liked = false;
  }

  toggleLike() {
    this.liked = !this.liked;
    return this;
  }

  info() {
    return `${this.title} — ${this.artist}`;
  }
}

// ── Class quản lý danh sách ──
class Playlist {
  #songs = []; // Private field — chỉ truy cập được trong class
  #nextId = 1;

  add(title, artist) {
    const song = new Song(this.#nextId++, title, artist);
    this.#songs.push(song);
    return song;
  }

  remove(id) {
    this.#songs = this.#songs.filter((s) => s.id !== id);
  }

  get all() {
    return [...this.#songs]; // Trả về bản sao — bảo vệ dữ liệu gốc
  }

  get count() {
    return this.#songs.length;
  }
}

// ── Sử dụng ──
const playlist = new Playlist();

const s1 = playlist.add("Hãy Trao Cho Anh", "Sơn Tùng M-TP");
const s2 = playlist.add("Người Lạ Ơi", "Karik");
const s3 = playlist.add("Chạy Ngay Đi", "Sơn Tùng M-TP");

s1.toggleLike();

console.log(playlist.count); // 3
console.log(s1.info()); // "Hãy Trao Cho Anh — Sơn Tùng M-TP"
console.log(s1.liked); // true

playlist.remove(s2.id);
console.log(playlist.count); // 2
console.log(playlist.all); // [Song { id:1 }, Song { id:3 }]
