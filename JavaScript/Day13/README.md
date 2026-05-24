# Demo Playlist sử dụng Class và Object

## Mục lục

1. [Object là gì?](#1-object)
2. [Class là gì?](#2-class)
3. [Phân tích ví dụ — class Song](#3-phân-tích-ví-dụ--class-song)
4. [Phân tích ví dụ — class Playlist](#4-phân-tích-ví-dụ--class-playlist)
5. [Các khái niệm quan trọng](#5-các-khái-niệm-quan-trọng)
6. [Tóm tắt](#6-tóm-tắt)

---

## 1. Object

**Object** là tập hợp các cặp **key — value**, dùng để nhóm dữ liệu liên quan lại với nhau.

```js
// Object literal — tạo thẳng bằng {}
const song = {
  id: 1,
  title: "Hãy Trao Cho Anh",
  artist: "Sơn Tùng M-TP",
  liked: false,
};

// Truy cập giá trị
console.log(song.title); // "Hãy Trao Cho Anh"
console.log(song["artist"]); // "Sơn Tùng M-TP"

// Thay đổi giá trị
song.liked = true;
```

Object có thể chứa **function** (gọi là method):

```js
const song = {
  title: "Hãy Trao Cho Anh",
  artist: "Sơn Tùng M-TP",

  info() {
    return `${this.title} — ${this.artist}`;
    //      ↑ this trỏ đến chính object này
  },
};

console.log(song.info()); // "Hãy Trao Cho Anh — Sơn Tùng M-TP"
```

**Vấn đề** khi dùng object literal: muốn tạo 10 bài hát thì phải viết 10 object riêng — lặp lại code, khó bảo trì. Đây là lý do cần **Class**.

---

## 2. Class

**Class** là bản thiết kế (blueprint) để tạo ra nhiều object cùng cấu trúc. Mỗi object được tạo từ class gọi là **instance**.

```
Class Song  →  new Song(...)  →  instance (object)
(bản thiết kế)  (tạo mới)       (sản phẩm)
```

```js
class Song {
  constructor(id, title, artist) {
    this.id = id;
    this.title = title;
    this.artist = artist;
  }
}

// Tạo nhiều instance từ cùng một class
const s1 = new Song(1, "Hãy Trao Cho Anh", "Sơn Tùng M-TP");
const s2 = new Song(2, "Người Lạ Ơi", "Karik");
const s3 = new Song(3, "Chạy Ngay Đi", "Sơn Tùng M-TP");
// Cả 3 đều có cấu trúc giống nhau, dữ liệu khác nhau
```

---

## 3. Phân tích ví dụ — class Song

```js
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
```

---

### `constructor` — hàm khởi tạo

Chạy **tự động** ngay khi gọi `new Song(...)`. Dùng để nhận tham số và gán vào `this`.

```js
constructor(id, title, artist) {
  this.id     = id;      // Gán tham số vào thuộc tính của object
  this.title  = title;
  this.artist = artist;
  this.liked  = false;   // Giá trị mặc định — không cần truyền vào
}
```

Cách hoạt động khi gọi `new`:

```js
const s1 = new Song(1, "Hãy Trao Cho Anh", "Sơn Tùng M-TP");
//                  ↑  ↑                    ↑
//                  id title                artist

// s1 là object:
// {
//   id:     1,
//   title:  "Hãy Trao Cho Anh",
//   artist: "Sơn Tùng M-TP",
//   liked:  false          ← tự động có, không cần truyền
// }
```

---

### `this` — trỏ đến instance hiện tại

`this` bên trong class luôn trỏ đến **object đang được gọi method**.

```js
const s1 = new Song(1, "Hãy Trao Cho Anh", "Sơn Tùng M-TP");
const s2 = new Song(2, "Người Lạ Ơi", "Karik");

s1.toggleLike();
// this.liked → s1.liked — chỉ s1 bị ảnh hưởng

s2.toggleLike();
// this.liked → s2.liked — chỉ s2 bị ảnh hưởng
```

---

### Method — hành vi của object

Method là function định nghĩa bên trong class. Mỗi instance đều có thể gọi method đó.

```js
// info() — trả về chuỗi mô tả bài hát
info() {
  return `${this.title} — ${this.artist}`;
}

console.log(s1.info()); // "Hãy Trao Cho Anh — Sơn Tùng M-TP"
console.log(s2.info()); // "Người Lạ Ơi — Karik"
// Cùng method, kết quả khác nhau vì this khác nhau
```

```js
// toggleLike() — đảo trạng thái liked, return this để chain
toggleLike() {
  this.liked = !this.liked;
  return this; // Trả về chính object → có thể chain method
}

// Nhờ return this, có thể viết:
s1.toggleLike().toggleLike(); // Gọi 2 lần liên tiếp
```

---

## 4. Phân tích ví dụ — class Playlist

```js
class Playlist {
  #songs = [];
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
    return [...this.#songs];
  }

  get count() {
    return this.#songs.length;
  }
}
```

---

### Private field `#` — bảo vệ dữ liệu

Field bắt đầu bằng `#` là **private** — chỉ truy cập được từ bên trong class, không thể đọc hay ghi từ bên ngoài.

```js
class Playlist {
  #songs = []; // Private — chứa mảng bài hát
  #nextId = 1; // Private — bộ đếm id tự tăng
}

const playlist = new Playlist();

// ❌ Không thể truy cập từ bên ngoài
console.log(playlist.#songs); // SyntaxError
playlist.#nextId = 999; // SyntaxError

// ✅ Chỉ truy cập qua method public
console.log(playlist.count); // OK — dùng getter
console.log(playlist.all); // OK — dùng getter
```

**Tại sao dùng private?** Nếu `#songs` là public, bên ngoài có thể làm:

```js
playlist.songs.push("không phải Song object"); // Phá vỡ cấu trúc
playlist.songs = null; // Xoá sạch dữ liệu
```

Private field ngăn điều này — buộc phải dùng method `add()` và `remove()` đã được kiểm soát.

---

### `add()` — tạo Song và thêm vào danh sách

```js
add(title, artist) {
  const song = new Song(this.#nextId++, title, artist);
  //                    ↑
  //           this.#nextId tăng sau mỗi lần gọi (1, 2, 3...)
  this.#songs.push(song);
  return song; // Trả về song vừa tạo để dùng ngay
}

const s1 = playlist.add("Hãy Trao Cho Anh", "Sơn Tùng M-TP");
s1.toggleLike(); // Có thể dùng ngay vì add() trả về song
```

`this.#nextId++` — post-increment: dùng giá trị hiện tại làm id, rồi mới tăng lên 1.

```js
// Lần 1: id = 1, sau đó #nextId = 2
// Lần 2: id = 2, sau đó #nextId = 3
// Lần 3: id = 3, sau đó #nextId = 4
```

---

### `remove()` — xoá theo id

```js
remove(id) {
  this.#songs = this.#songs.filter(s => s.id !== id);
  // Tạo mảng mới không chứa song có id trùng
  // Không sửa mảng gốc — immutable pattern
}

playlist.remove(2); // Xoá bài có id = 2
```

---

### Getter `get` — truy cập như thuộc tính

`get` biến method thành thuộc tính — gọi không cần `()`:

```js
get all() {
  return [...this.#songs]; // Spread — trả về bản sao, không phải mảng gốc
}

get count() {
  return this.#songs.length;
}

// Dùng như thuộc tính, không phải method
console.log(playlist.count);  // 3  — không viết playlist.count()
console.log(playlist.all);    // [Song, Song, Song]
```

**Tại sao `[...this.#songs]` thay vì `this.#songs`?**

```js
// Nếu trả về mảng gốc:
const list = playlist.all;
list.push("lạ"); // Vô tình sửa luôn #songs bên trong!

// Trả về bản sao — bên ngoài sửa list không ảnh hưởng #songs
const list = playlist.all;
list.push("lạ"); // Chỉ sửa bản sao, #songs vẫn nguyên
```

---

## 5. Các khái niệm quan trọng

### Class vs Object literal

|               | Object literal `{}` | Class                          |
| ------------- | ------------------- | ------------------------------ |
| Dùng khi      | Chỉ cần 1 object    | Cần nhiều object cùng cấu trúc |
| Tái sử dụng   | Không               | Có — `new ClassName()`         |
| Private field | Không               | Có — `#field`                  |
| Getter/Setter | Có                  | Có                             |
| Kế thừa       | Không               | Có — `extends`                 |

---

### `new` làm gì?

```js
const playlist = new Playlist();
```

`new` thực hiện 4 bước:

```
1. Tạo object rỗng {}
2. Gán prototype của Playlist cho object
3. Chạy constructor() với this = object vừa tạo
4. Trả về object đó
```

---

### Encapsulation — đóng gói

Class `Playlist` che giấu `#songs` và `#nextId`, chỉ để lộ ra các method cần thiết. Đây gọi là **encapsulation** — một trong những nguyên tắc cốt lõi của OOP:

```
Bên ngoài chỉ thấy:          Bên trong ẩn đi:
──────────────────            ────────────────
playlist.add()                #songs = []
playlist.remove()             #nextId = 1
playlist.all
playlist.count
```

---

## 6. Tóm tắt

```
class Song {
  constructor()   → chạy khi new Song(), nhận tham số, gán this
  this.property   → thuộc tính của instance
  method()        → hành vi, dùng this để truy cập thuộc tính
  return this     → cho phép chain method
}

class Playlist {
  #field          → private, chỉ truy cập trong class
  method()        → public, bên ngoài gọi được
  get prop()      → getter, dùng như thuộc tính không cần ()
  [...array]      → trả về bản sao, bảo vệ dữ liệu gốc
}

new ClassName()   → tạo instance mới từ class
instance.method() → gọi method trên instance
instance.prop     → truy cập thuộc tính hoặc getter
```
