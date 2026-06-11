# JSX và Component trong ReactJS

## Phần 1 — JSX là gì?

### Vấn đề JSX giải quyết

Hãy tưởng tượng bạn đang xây một trang web bán hàng. Bạn cần hiển thị tên sản phẩm, giá, và nút "Thêm vào giỏ". Dữ liệu lấy từ server về.

Với JavaScript thông thường, bạn phải làm thế này:

```js
// JavaScript thông thường — rất rườm rà
const ten = "Áo thun";
const gia = 150000;

const div = document.createElement("div");
const tieuDe = document.createElement("h2");
tieuDe.textContent = ten;
const giaTien = document.createElement("p");
giaTien.textContent = gia + " đ";
const nut = document.createElement("button");
nut.textContent = "Thêm vào giỏ";

div.appendChild(tieuDe);
div.appendChild(giaTien);
div.appendChild(nut);
```

Dài, khó đọc, dễ sai. Và đây mới chỉ là 3 dòng giao diện.

### JSX — Viết HTML ngay trong JavaScript

JSX cho phép bạn viết giao diện trông giống HTML, ngay bên trong file JavaScript:

```jsx
// JSX — ngắn gọn, dễ đọc
const ten = "Áo thun";
const gia = 150000;

const giaoDien = (
  <div>
    <h2>{ten}</h2>
    <p>{gia} đ</p>
    <button>Thêm vào giỏ</button>
  </div>
);
```

### JSX không phải HTML — Có vài điểm khác nhau nhỏ

JSX trông giống HTML nhưng thực ra không phải. Có một số điểm khác cần biết:

**1. Dùng `className` thay vì `class`**

```jsx
// HTML thông thường
<div class="the-san-pham">...</div>

// JSX — phải dùng className
<div className="the-san-pham">...</div>
```

Lý do: `class` là từ khóa đặc biệt trong JavaScript, nên JSX dùng `className` để tránh nhầm lẫn.

**2. Mọi thứ phải có thẻ đóng**

```jsx
// HTML — thẻ img không cần đóng
<img src="anh.jpg">

// JSX — bắt buộc phải đóng
<img src="anh.jpg" />
```

**3. Chỉ được trả về 1 thẻ bọc ngoài**

```jsx
//  Sai — 2 thẻ ngang hàng, không có thẻ bọc ngoài
return (
  <h1>Tiêu đề</h1>
  <p>Nội dung</p>
);

// Đúng — bọc trong 1 thẻ div
return (
  <div>
    <h1>Tiêu đề</h1>
    <p>Nội dung</p>
  </div>
);

// Cũng đúng — dùng Fragment <> nếu không muốn thêm div thừa
return (
  <>
    <h1>Tiêu đề</h1>
    <p>Nội dung</p>
  </>
);
```

**4. Nhúng JavaScript vào JSX bằng dấu `{}`**

Dấu ngoặc nhọn `{}` là "cổng" để đi từ JSX sang JavaScript:

```jsx
const ten = "Giang";
const diem = 9.5;
const laDatGiai = diem >= 9;

return (
  <div>
    {/* Hiển thị biến */}
    <p>Học sinh: {ten}</p>

    {/* Tính toán */}
    <p>Điểm: {diem * 10} / 100</p>

    {/* Điều kiện — hiện hay ẩn */}
    {laDatGiai && <p>🏆 Đạt giải!</p>}

    {/* Gọi hàm */}
    <p>Tên in hoa: {ten.toUpperCase()}</p>
  </div>
);
```

> `{/* ... */}` là cách viết comment trong JSX.

---

## Phần 2 — Component là gì?

### Vấn đề Component giải quyết

Giả sử bạn đang xây trang thương mại điện tử. Có 100 sản phẩm, mỗi sản phẩm hiển thị giống nhau: ảnh, tên, giá, nút mua.

Nếu không có Component, bạn phải copy-paste đoạn HTML đó 100 lần. Khi muốn thay đổi thiết kế (ví dụ đổi màu nút), bạn phải sửa 100 chỗ. Cực kỳ tốn công và dễ sai.

**Component giải quyết bài toán này:** Bạn chỉ viết một lần, dùng lại bao nhiêu lần tùy thích.

### Component — Khối LEGO của giao diện

Hãy nghĩ về giao diện web như một bộ LEGO. Mỗi mảnh LEGO là một Component — một khối giao diện độc lập, có thể lắp ghép tự do với nhau.

```
Trang web
├── Header (Component)
│   ├── Logo (Component)
│   └── Menu (Component)
├── DanhSachSanPham (Component)
│   ├── TheSanPham (Component)
│   ├── TheSanPham (Component)
│   └── TheSanPham (Component)
└── Footer (Component)
```

Mỗi Component tự lo phần giao diện của nó. Khi cần thay đổi `TheSanPham`, bạn chỉ sửa 1 chỗ, tất cả 100 sản phẩm đều được cập nhật.

### Cách viết Component

Một Component trong React đơn giản chỉ là **một hàm JavaScript trả về JSX**:

```jsx
function XinChao() {
  return (
    <div>
      <h1>Xin chào!</h1>
      <p>Đây là component đầu tiên của tôi.</p>
    </div>
  );
}
```

Hai quy tắc bắt buộc:

1. **Tên component phải viết hoa chữ cái đầu** — `XinChao`, không phải `xinChao`
2. **Phải return JSX** — trả về thứ gì đó để hiển thị

### Dùng Component như thẻ HTML

Sau khi viết xong, bạn dùng Component như một thẻ HTML tự tạo:

```jsx
function XinChao() {
  return <h1>Xin chào!</h1>;
}

function App() {
  return (
    <div>
      <XinChao /> {/* Dùng 1 lần */}
      <XinChao /> {/* Dùng lần 2 */}
      <XinChao /> {/* Dùng lần 3 */}
    </div>
  );
}
```

### Ví dụ thực tế — Thẻ sản phẩm

```jsx
// Viết component 1 lần
function TheSanPham() {
  return (
    <div className="the-san-pham">
      <img src="ao-thun.jpg" alt="Áo thun" />
      <h3>Áo thun basic</h3>
      <p>150.000 đ</p>
      <button>Thêm vào giỏ</button>
    </div>
  );
}

// Dùng lại bao nhiêu lần cũng được
function DanhSachSanPham() {
  return (
    <div className="danh-sach">
      <TheSanPham />
      <TheSanPham />
      <TheSanPham />
    </div>
  );
}
```

Tuy nhiên, vấn đề ở đây là 3 thẻ sản phẩm này giống hệt nhau. Thực tế mỗi sản phẩm có tên và giá khác nhau. Đây là lúc **Props** phát huy tác dụng.

### Truyền dữ liệu vào Component bằng Props

Props cho phép bạn truyền dữ liệu vào Component từ bên ngoài, giống như điền thông tin vào một biểu mẫu:

```jsx
// Component nhận dữ liệu qua props
function TheSanPham({ ten, gia, anhUrl }) {
  return (
    <div className="the-san-pham">
      <img src={anhUrl} alt={ten} />
      <h3>{ten}</h3>
      <p>{gia.toLocaleString()} đ</p>
      <button>Thêm vào giỏ</button>
    </div>
  );
}

// Truyền dữ liệu khác nhau vào cùng 1 component
function DanhSachSanPham() {
  return (
    <div className="danh-sach">
      <TheSanPham ten="Áo thun basic" gia={150000} anhUrl="ao-thun.jpg" />
      <TheSanPham ten="Quần jean" gia={450000} anhUrl="quan-jean.jpg" />
      <TheSanPham ten="Giày sneaker" gia={890000} anhUrl="giay.jpg" />
    </div>
  );
}
```

Giờ thì 1 component, 3 sản phẩm khác nhau hoàn toàn. Nếu có 1000 sản phẩm, bạn cũng chỉ cần viết `TheSanPham` đúng 1 lần.

### Lắp ghép Component thành trang web hoàn chỉnh

Đây là sức mạnh thực sự của React. Mỗi phần của trang web là một Component, ghép lại thành một cây:

```jsx
function Logo() {
  return <img src="logo.png" alt="Logo" />;
}

function Menu() {
  return (
    <nav>
      <a href="/">Trang chủ</a>
      <a href="/san-pham">Sản phẩm</a>
      <a href="/lien-he">Liên hệ</a>
    </nav>
  );
}

function Header() {
  return (
    <header>
      <Logo /> {/* Dùng lại component Logo */}
      <Menu /> {/* Dùng lại component Menu */}
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <p>© 2025 Cửa hàng của tôi</p>
    </footer>
  );
}

// App là component gốc — bọc tất cả lại
function App() {
  return (
    <div>
      <Header />
      <DanhSachSanPham />
      <Footer />
    </div>
  );
}
```

---

## Tóm tắt

### JSX

| Khái niệm            | Giải thích đơn giản                             |
| -------------------- | ----------------------------------------------- |
| JSX là gì?           | Cú pháp cho phép viết HTML trong JavaScript     |
| `{}` dùng để làm gì? | Nhúng JavaScript (biến, hàm, tính toán) vào JSX |
| `className`          | Thay thế cho `class` trong JSX                  |
| Fragment `<>`        | Bọc nhiều thẻ mà không tạo thêm div thừa        |

### Component

| Khái niệm        | Giải thích đơn giản                                              |
| ---------------- | ---------------------------------------------------------------- |
| Component là gì? | Khối giao diện độc lập, viết 1 lần, dùng lại nhiều lần           |
| Tên component    | Phải viết hoa chữ cái đầu: `TheSanPham`, không phải `theSanPham` |
| Props là gì?     | Dữ liệu truyền từ ngoài vào component                            |
| Lợi ích lớn nhất | Thay đổi 1 chỗ → cập nhật toàn bộ nơi dùng component đó          |

### Quy tắc vàng

> **Mỗi Component chỉ làm một việc.** Nếu component đang làm quá nhiều thứ, hãy tách nó ra thành các component nhỏ hơn.

---

## Bước tiếp theo

Sau khi nắm JSX và Component, bước tiếp theo là học **State** — cách làm cho giao diện thay đổi khi người dùng tương tác (click nút, nhập form, cuộn trang...).

---
