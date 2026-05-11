# Đồng bộ và Bất đồng bộ trong JavaScript

## Mục lục

1. [Đồng bộ (Synchronous)](#1-đồng-bộ-synchronous)
2. [Bất đồng bộ (Asynchronous)](#2-bất-đồng-bộ-asynchronous)
3. [Callback](#3-callback)
4. [Promise](#4-promise)
5. [Async / Await](#5-async--await)
6. [Promise.all, race, allSettled](#6-promiseall-race-allsettled)
7. [Khi nào dùng cái nào?](#7-khi-nào-dùng-cái-nào)

---

## 1. Đồng bộ (Synchronous)

### Khái niệm

Code chạy **từng dòng một, theo thứ tự từ trên xuống dưới**. Dòng sau không chạy cho đến khi dòng trước hoàn thành hoàn toàn. Đây là cách JavaScript hoạt động mặc định.

### Ví dụ đơn giản

```js
console.log("Bước 1");
console.log("Bước 2");
console.log("Bước 3");

// Output (luôn theo thứ tự):
// Bước 1
// Bước 2
// Bước 3
```

### Vấn đề: Block (đóng băng)

Nếu một tác vụ mất nhiều thời gian, toàn bộ chương trình bị **block** — không thực thi được dòng nào khác trong lúc đó.

```js
function tinhToanNang() {
  // Giả lập vòng lặp nặng mất ~3 giây
  let sum = 0;
  for (let i = 0; i < 5_000_000_000; i++) {
    sum += i;
  }
  return sum;
}

console.log("Bắt đầu");
const result = tinhToanNang(); // ⛔ Block 3 giây, mọi thứ đứng yên
console.log("Kết quả:", result);
console.log("Kết thúc"); // Phải chờ 3 giây mới chạy đến đây
```

> **Hậu quả trên trình duyệt:** Trang web bị "đơ", người dùng không click, không scroll được trong suốt thời gian đó.

---

## 2. Bất đồng bộ (Asynchronous)

### Khái niệm

Các tác vụ nặng (gọi API, đọc file, truy vấn database...) được **đẩy sang nền** để thực hiện. Code tiếp tục chạy mà **không cần chờ**, khi tác vụ xong thì sẽ được thông báo.

### Cơ chế hoạt động (Event Loop)

JavaScript là **single-thread** (chỉ có 1 luồng chạy code), nhưng nhờ **Event Loop** và **Web APIs** (trên trình duyệt) hoặc **libuv** (trên Node.js), nó có thể xử lý bất đồng bộ mà không block.

```
Call Stack          Web APIs / Node APIs       Callback Queue
-----------         --------------------       ---------------
main()          →   setTimeout(fn, 1000)   →   fn() (sau 1s)
fetch(url)      →   HTTP request           →   handler(response)
```

### Ví dụ cơ bản

```js
console.log("Bắt đầu");

setTimeout(() => {
  console.log("Tôi chạy sau 2 giây"); // Không block
}, 2000);

console.log("Kết thúc"); // Chạy NGAY, không chờ setTimeout

// Output:
// Bắt đầu
// Kết thúc
// Tôi chạy sau 2 giây  (sau 2 giây)
```

---

## 3. Callback

### Khái niệm

**Callback** là hàm được truyền vào hàm khác như một tham số. Khi tác vụ bất đồng bộ hoàn thành, hàm callback đó được **gọi lại** (gọi lại = callback).

### Ví dụ cơ bản

```js
function layDuLieu(callback) {
  setTimeout(() => {
    const data = { id: 1, name: "Nguyễn Nam" };
    callback(data); // Gọi lại callback khi xong
  }, 1000);
}

layDuLieu(function (user) {
  console.log("Nhận được:", user.name); // "Nguyễn Nam"
});
```

### Callback Hell — vấn đề khi lồng nhau

Khi cần thực hiện nhiều tác vụ bất đồng bộ **tuần tự**, code lồng nhau trở nên rất khó đọc:

```js
getUser(1, function (user) {
  console.log("User:", user.name);

  getPosts(user.id, function (posts) {
    console.log("Posts:", posts.length);

    getComments(posts[0].id, function (comments) {
      console.log("Comments:", comments.length);

      getLikes(comments[0].id, function (likes) {
        console.log("Likes:", likes); // Quá sâu! 😱
        // Còn tiếp...
      });
    });
  });
});
```

> **Callback Hell** còn gọi là "Pyramid of Doom" vì hình dạng của code. Khó đọc, khó bắt lỗi, khó maintain.

### Cách xử lý lỗi với Callback

Quy ước phổ biến (Node.js style): tham số đầu tiên là `error`.

```js
fs.readFile("file.txt", "utf8", function (err, data) {
  if (err) {
    console.error("Lỗi đọc file:", err.message);
    return; // Dừng lại
  }
  console.log("Nội dung:", data);
});
```

---

## 4. Promise

### Khái niệm

**Promise** là một đối tượng đại diện cho giá trị **chưa có ngay** nhưng sẽ có trong tương lai (hoặc sẽ thất bại). Nó giải quyết vấn đề Callback Hell bằng cách chain `.then()`.

### 3 trạng thái của Promise

| Trạng thái  | Ý nghĩa                   |
| ----------- | ------------------------- |
| `pending`   | Đang chờ, chưa có kết quả |
| `fulfilled` | Thành công, có giá trị    |
| `rejected`  | Thất bại, có lý do lỗi    |

Một Promise **chỉ chuyển trạng thái một lần** và không thể quay lại.

### Tạo một Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // Thực hiện tác vụ bất đồng bộ
  setTimeout(() => {
    const thanhCong = true;

    if (thanhCong) {
      resolve("Dữ liệu đã sẵn sàng!"); // Chuyển sang fulfilled
    } else {
      reject(new Error("Có lỗi xảy ra")); // Chuyển sang rejected
    }
  }, 1000);
});
```

### Sử dụng Promise với .then() / .catch() / .finally()

```js
myPromise
  .then((data) => {
    console.log("Thành công:", data); // Chạy khi fulfilled
    return data.toUpperCase(); // Có thể return để chain tiếp
  })
  .then((transformed) => {
    console.log("Đã transform:", transformed);
  })
  .catch((err) => {
    console.error("Lỗi:", err.message); // Chạy khi rejected
  })
  .finally(() => {
    console.log("Luôn chạy dù thành công hay thất bại");
  });
```

### So sánh Callback vs Promise

```js
// ❌ Callback (lồng nhau, khó đọc)
getUser(1, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      console.log(comments);
    });
  });
});

// ✅ Promise (chain thẳng, dễ đọc)
getUser(1)
  .then((user) => getPosts(user.id))
  .then((posts) => getComments(posts[0].id))
  .then((comments) => console.log(comments))
  .catch((err) => console.error(err));
```

---

## 5. Async / Await

### Khái niệm

`async/await` là **cú pháp hiện đại** (ES2017) giúp viết code bất đồng bộ trông giống như code đồng bộ. Về bản chất, nó là "đường ngọt" (syntactic sugar) trên Promise — bên dưới vẫn dùng Promise.

### Quy tắc cơ bản

- Hàm có `async` luôn **trả về một Promise**.
- `await` chỉ dùng được **bên trong hàm `async`**.
- `await` tạm dừng hàm hiện tại, chờ Promise resolve, rồi lấy giá trị.

```js
// async function luôn trả về Promise
async function xin_chao() {
  return "Hello"; // Tương đương: return Promise.resolve("Hello")
}

xin_chao().then(console.log); // "Hello"
```

### Ví dụ đầy đủ

```js
// Giả lập API calls (trả về Promise)
function getUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: "Nguyễn Nam" }), 500);
  });
}

function getPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve([{ id: 10, title: "Bài viết 1" }]), 500);
  });
}

function getComments(postId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(["Hay quá!", "Cảm ơn bạn"]), 500);
  });
}

// ✅ Với async/await — đọc như code thẳng
async function layDuLieuNguoiDung(userId) {
  try {
    const user = await getUser(userId);
    console.log("User:", user.name);

    const posts = await getPosts(user.id);
    console.log("Số bài viết:", posts.length);

    const comments = await getComments(posts[0].id);
    console.log("Bình luận:", comments);
  } catch (err) {
    // Bắt lỗi từ bất kỳ await nào ở trên
    console.error("Có lỗi:", err.message);
  } finally {
    console.log("Hoàn thành.");
  }
}

layDuLieuNguoiDung(1);
```

### Lưu ý quan trọng: await tuần tự vs song song

```js
// ⚠️ Tuần tự — mất 3 giây (mỗi cái 1s, chờ nhau)
async function tuanTu() {
  const a = await apiA(); // Chờ 1s
  const b = await apiB(); // Chờ thêm 1s
  const c = await apiC(); // Chờ thêm 1s
  // Tổng: ~3 giây
}

// ✅ Song song — mất ~1 giây (chạy cùng lúc)
async function songSong() {
  const [a, b, c] = await Promise.all([apiA(), apiB(), apiC()]);
  // Tổng: ~1 giây (bằng cái chậm nhất)
}
```

> **Nguyên tắc:** Nếu các tác vụ **không phụ thuộc nhau**, hãy dùng `Promise.all` để chạy song song thay vì `await` tuần tự.

---

## 6. Promise.all, race, allSettled

### Promise.all — tất cả phải thành công

Chạy **song song**, trả về mảng kết quả. Nếu **bất kỳ** Promise nào fail → toàn bộ fail ngay.

```js
async function layNhieuDuLieu() {
  try {
    const [user, products, orders] = await Promise.all([
      fetch("/api/user/1").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ]);

    console.log(user, products, orders);
  } catch (err) {
    // Nếu bất kỳ API nào fail, vào đây ngay
    console.error("Một API bị lỗi:", err);
  }
}
```

### Promise.allSettled — đợi tất cả, kể cả fail

Chạy song song, **luôn đợi hết** rồi mới trả về. Mỗi kết quả có `status: 'fulfilled'` hoặc `status: 'rejected'`.

```js
async function layDuLieuKhoangTrong() {
  const results = await Promise.allSettled([
    fetch("/api/user/1").then((r) => r.json()),
    fetch("/api/user/999").then((r) => r.json()), // Có thể 404
    fetch("/api/settings").then((r) => r.json()),
  ]);

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`API ${index} OK:`, result.value);
    } else {
      console.warn(`API ${index} lỗi:`, result.reason.message);
    }
  });
}
```

### Promise.race — lấy cái xong trước

Trả về kết quả của Promise **hoàn thành đầu tiên** (dù thành công hay thất bại).

```js
// Ứng dụng thực tế: timeout cho API call
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout sau ${ms}ms`)), ms),
  );

  return Promise.race([promise, timeout]);
}

async function fetchVoiTimeout() {
  try {
    const data = await withTimeout(fetch("/api/data"), 3000);
    console.log("Dữ liệu:", data);
  } catch (err) {
    console.error(err.message); // "Timeout sau 3000ms" hoặc lỗi mạng
  }
}
```

### Promise.any — lấy cái thành công đầu tiên (ES2021)

Khác với `race`, `any` chỉ resolve khi có ít nhất **1 Promise thành công**. Fail nếu **tất cả** đều fail.

```js
// Ví dụ: thử nhiều server, lấy cái nào phản hồi được trước
const data = await Promise.any([
  fetch("https://server1.com/api"),
  fetch("https://server2.com/api"),
  fetch("https://server3.com/api"),
]);
console.log("Server nhanh nhất đã phản hồi:", data);
```

---

## 7. Khi nào dùng cái nào?

| Tình huống                                    | Nên dùng             |
| --------------------------------------------- | -------------------- |
| Tính toán đơn giản, không cần I/O             | Sync (bình thường)   |
| Làm việc với event, setTimeout cũ             | Callback             |
| Xử lý chuỗi bất đồng bộ tuần tự               | `async/await`        |
| Chạy nhiều tác vụ song song, tất cả phải OK   | `Promise.all`        |
| Chạy nhiều tác vụ, lấy kết quả từng cái       | `Promise.allSettled` |
| Cần kết quả nhanh nhất                        | `Promise.race`       |
| Dự phòng: thử server 1 fail thì dùng server 2 | `Promise.any`        |

### Quy tắc vàng

```
❌ Đừng: await API1(); await API2(); await API3();  // Tuần tự = chậm
✅ Nên: await Promise.all([API1(), API2(), API3()]); // Song song = nhanh
```

```
❌ Đừng: async function() { return await somePromise; }
✅ Nên:  async function() { return somePromise; }     // await không cần thiết khi return
```

```
✅ Luôn dùng try/catch với async/await để bắt lỗi
✅ Luôn có .catch() hoặc try/catch — Promise không bắt lỗi tự động
```
