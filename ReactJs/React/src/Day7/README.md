# useRef và Lifting State Up

## useRef

### useRef khái niệm

`useRef` là một cái hộp — bạn bỏ thứ gì vào trong, nó giữ nguyên giữa các lần render. Thay đổi giá trị bên trong **không gây re-render**.

```jsx
const hop = useRef(giaTriBanDau);

hop.current; // Đọc giá trị
hop.current = giaMoi; // Ghi giá trị — không trigger re-render
```

### Khác gì useState?

|                          | useState             | useRef                               |
| ------------------------ | -------------------- | ------------------------------------ |
| Thay đổi có re-render?   | Có                   | Không                                |
| Dùng để hiển thị lên UI? | Có                   | Không                                |
| Dùng để làm gì?          | Dữ liệu cần hiển thị | Dữ liệu cần nhớ nhưng không hiển thị |

### Use case 1 — Truy cập DOM trực tiếp

Đây là use case phổ biến nhất. Gắn `ref` vào element → truy cập element đó như JS thuần.

```jsx
import { useRef } from "react";

function TimKiem() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus(); // Focus vào input khi bấm nút
  }

  return (
    <>
      <input ref={inputRef} placeholder="Tìm kiếm..." />
      <button onClick={handleClick}>🔍 Tìm</button>
    </>
  );
}
```

**Các thao tác DOM hay dùng với useRef:**

```jsx
inputRef.current.focus(); // Focus vào input
inputRef.current.blur(); // Bỏ focus
inputRef.current.scrollIntoView(); // Cuộn đến element
videoRef.current.play(); // Play video
videoRef.current.pause(); // Pause video

// Đo kích thước
const { width, height } = boxRef.current.getBoundingClientRect();
```

### Use case 2 — Lưu giá trị không gây re-render

Khi cần nhớ một giá trị giữa các lần render **nhưng không cần hiển thị** nó lên UI.

**Ví dụ — Lưu timer ID để có thể hủy:**

```jsx
function DemNguoc() {
  const [giay, setGiay] = useState(10);
  const timerRef = useRef(null); // Lưu timer ID

  function batDau() {
    timerRef.current = setInterval(() => {
      setGiay((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current); // Hủy khi về 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function dungLai() {
    clearInterval(timerRef.current); // Truy cập timer ID từ ref
  }

  return (
    <div>
      <p>{giay} giây</p>
      <button onClick={batDau}>Bắt đầu</button>
      <button onClick={dungLai}>Dừng</button>
    </div>
  );
}
```

> Tại sao không dùng `useState` cho timer ID? Vì lưu timer ID không cần hiển thị — dùng `useState` sẽ gây re-render thừa mỗi khi set.

**Ví dụ — Lưu giá trị trước đó:**

```jsx
function Component({ diem }) {
  const diemTruocRef = useRef(diem);

  useEffect(() => {
    diemTruocRef.current = diem; // Cập nhật sau mỗi render
  });

  return (
    <p>
      Điểm trước: {diemTruocRef.current} → Điểm hiện tại: {diem}
    </p>
  );
}
```

### Điểm cần nhớ

```
useRef.current thay đổi → KHÔNG re-render → KHÔNG hiển thị lên UI
useState thay đổi       → CÓ re-render   → CÓ hiển thị lên UI

Dùng useRef khi:
   Cần trỏ đến DOM element (focus, play, đo kích thước)
   Cần lưu timer ID, subscription ID
   Cần nhớ giá trị trước đó

Không dùng useRef khi:
   Giá trị cần hiển thị lên màn hình → dùng useState
```

## Lifting State Up

### Vấn đề

Hình dung 2 component anh em: `ThanhTimKiem` và `DanhSach`. Người dùng gõ vào thanh tìm kiếm → danh sách lọc lại.

```
App
├── ThanhTimKiem   ← người dùng gõ từ khóa ở đây
└── DanhSach       ← cần biết từ khóa để lọc
```

`ThanhTimKiem` và `DanhSach` là anh em — **không chia sẻ state trực tiếp được**. Component con không thể đọc state của component anh em khác.

```jsx
//  Không hoạt động — DanhSach không đọc được tuKhoa của ThanhTimKiem
function ThanhTimKiem() {
  const [tuKhoa, setTuKhoa] = useState("");
  return <input onChange={(e) => setTuKhoa(e.target.value)} />;
}

function DanhSach() {
  // tuKhoa ở đâu? Không lấy được!
  return <ul>...</ul>;
}
```

### Giải pháp — Đưa state lên cha

**Lifting State Up** = chuyển state từ component con lên component cha gần nhất chứa cả hai.

```
App (state tuKhoa đặt ở đây)
├── ThanhTimKiem  ← nhận onThayDoi từ cha, gọi khi người dùng gõ
└── DanhSach      ← nhận tuKhoa từ cha, dùng để lọc
```

```jsx
//  State đặt ở cha — cả hai con đều dùng được
function App() {
  const [tuKhoa, setTuKhoa] = useState(""); // State ở cha

  const sanPham = ["Áo thun", "Quần jean", "Giày sneaker", "Mũ"];
  const ketQua = sanPham.filter((sp) =>
    sp.toLowerCase().includes(tuKhoa.toLowerCase()),
  );

  return (
    <div>
      {/* Cha truyền hàm xuống → con gọi khi gõ */}
      <ThanhTimKiem onThayDoi={setTuKhoa} />

      {/* Cha truyền dữ liệu đã lọc xuống */}
      <DanhSach items={ketQua} />
    </div>
  );
}

function ThanhTimKiem({ onThayDoi }) {
  return (
    <input
      placeholder="Tìm sản phẩm..."
      onChange={(e) => onThayDoi(e.target.value)}
    />
  );
}

function DanhSach({ items }) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
```

### Cơ chế hoạt động

```
1. Người dùng gõ vào ThanhTimKiem
        │
2. ThanหTimKiem gọi onThayDoi("áo")
        │
3. App nhận được → setTuKhoa("áo") → re-render
        │
4. App lọc danh sách với tuKhoa = "áo"
        │
5. App truyền kết quả lọc xuống DanhSach
        │
6. DanhSach hiển thị danh sách đã lọc
```

### Ví dụ thực tế hơn — Giỏ hàng

```jsx
function App() {
  const [gioHang, setGioHang] = useState([]);

  function themVaoGio(sanPham) {
    setGioHang([...gioHang, sanPham]);
  }

  function xoaKhoiGio(id) {
    setGioHang(gioHang.filter((sp) => sp.id !== id));
  }

  return (
    <div>
      {/* DanhSachSanPham cần biết để disable nút nếu đã trong giỏ */}
      <DanhSachSanPham gioHang={gioHang} onThem={themVaoGio} />

      {/* GioHang cần danh sách và hàm xóa */}
      <GioHang items={gioHang} onXoa={xoaKhoiGio} />
    </div>
  );
}
```

`gioHang` ở cha — cả `DanhSachSanPham` lẫn `GioHang` đều dùng được, luôn đồng bộ với nhau.

### Khi nào cần Lifting State Up?

```
Tự hỏi: "Ai cần dùng dữ liệu này?"

Chỉ 1 component dùng    → State đặt trong component đó
2+ component anh em dùng → Đưa state lên cha chứa cả hai
Toàn bộ app dùng        → useContext hoặc Redux (giai đoạn sau)
```

### Điểm cần nhớ

```
State chỉ truyền được từ cha → con (qua props)
Anh em không chia sẻ state trực tiếp được

Giải pháp: Đưa state lên cha gần nhất chứa cả hai
  → Cha giữ state
  → Cha truyền dữ liệu xuống các con qua props
  → Con giao tiếp ngược lên cha bằng cách gọi hàm qua props
```
