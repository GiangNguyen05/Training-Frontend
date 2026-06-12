# Props và State & useState trong ReactJS

## Mở đầu

Props và State là **hai cơ chế quản lý dữ liệu** cốt lõi của React.
Note:

1. [Vitual DOM](#virtual-dom)
2. [Reconciliation Algorithm](#reconciliation-algorithm)
3. [Shallow Compare](#shallow-compare)

## Props

**Dữ liệu truyền từ component cha xuống con.** Một chiều, read-only.

```jsx
function App() {
  return <ThongTin ten="Giang" tuoi={24} />;
}

function ThongTin({ ten, tuoi }) {
  // destructuring — nên dùng
  return (
    <p>
      {ten} — {tuoi} tuổi
    </p>
  );
}
```

**3 điều cốt lõi:**

**1. Read-only tuyệt đối — không sửa props**

```jsx
function Con({ diem }) {
  diem = diem + 1; // ❌ Không bao giờ làm vậy
  return <p>{diem}</p>;
}
```

React dựa vào luồng dữ liệu một chiều để biết khi nào re-render. Con tự sửa props → React mất kiểm soát → bug.

**2. Truyền hàm qua props để con giao tiếp ngược lên cha**

```jsx
function Con({ onXoa }) {
  return <button onClick={() => onXoa(1)}>Xóa</button>; // Con gọi hàm cha
}

function Cha() {
  function xuLyXoa(id) {
    /* xử lý */
  }
  return <Con onXoa={xuLyXoa} />;
}
```

> Quy ước: props là hàm bắt đầu bằng `on` — `onClick`, `onChange`, `onXoa`...

**3. `children` — prop đặc biệt chứa JSX lồng bên trong**

```jsx
function Card({ title, children }) {
  return (
    <div>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

<Card title="Thông tin">
  <p>Tên: Giang</p> {/* Đây là children */}
</Card>;
```

---

## State & useState

**Dữ liệu nội bộ của component.** Thay đổi → React re-render lại giao diện.

```jsx
const [dem, setDem] = useState(0);
//     ↑       ↑          ↑
//  giá trị  hàm cập nhật  giá trị ban đầu
```

**Tại sao không dùng biến thường?**

```jsx
// ❌ Biến thường — React không biết để re-render
let dem = 0;
dem = dem + 1; // Thay đổi âm thầm, UI đứng yên

// ✅ useState — React được thông báo → re-render
const [dem, setDem] = useState(0);
setDem(dem + 1); // React biết → vẽ lại giao diện
```

**Cập nhật đúng cách:**

```jsx
// Primitive — gán thẳng
setDem(dem + 1);
setTen("Giang");

// Array — tạo mảng mới, không dùng push/splice
setDanhSach([...danhSach, "Angular"]); // thêm
setDanhSach(danhSach.filter((x) => x !== "Vue")); // xóa

// Object — spread, không sửa trực tiếp
setNguoi({ ...nguoi, tuoi: 25 });

// ❌ Sai với cả array lẫn object
danhSach.push("Angular");
setDanhSach(danhSach); // Cùng tham chiếu → React bỏ qua → không re-render
```

**2 điểm hay bị sai nhất:**

**1. Dùng callback khi giá trị mới phụ thuộc vào cũ**

```jsx
// ❌ Sai khi gọi nhiều lần liên tiếp
setDem(dem + 1); // 3 lần → kết quả vẫn là 1 (đều đọc dem = 0)

// ✅ Luôn đúng
setDem((prev) => prev + 1); // 3 lần → kết quả là 3
```

**2. State không cập nhật ngay**

```jsx
const [dem, setDem] = useState(0);

function xuLy() {
  setDem(dem + 1);
  console.log(dem); // Vẫn là 0 — state cập nhật sau khi re-render, không phải ngay lúc này
}
```

---

## So sánh Props và State

| Tiêu chí                       | Props                            | State                       |
| ------------------------------ | -------------------------------- | --------------------------- |
| **Ai tạo ra?**                 | Component cha truyền xuống       | Chính component tự tạo      |
| **Ai thay đổi được?**          | Chỉ component cha                | Chỉ chính component đó      |
| **Mục đích**                   | Nhận dữ liệu / cấu hình từ ngoài | Lưu dữ liệu thay đổi nội bộ |
| **Khi thay đổi có re-render?** | Có (khi cha re-render)           | Có (ngay khi setState)      |
| **Phương thức cập nhật**       | Không thể (read-only)            | `setState` từ `useState`    |

### Phán đoán nhanh: Nên dùng cái nào?

> **Câu hỏi cần tự hỏi:** _"Dữ liệu này đến từ đâu và ai được phép thay đổi nó?"_

```
Dữ liệu đến từ bên ngoài component?
→ Props

Dữ liệu tự component tạo ra và có thể thay đổi?
→ State

Dữ liệu không bao giờ thay đổi?
→ Hằng số thông thường (const), không cần cả hai
```

**Ví dụ thực tế:**

```jsx
function TheSanPham({ ten, gia, anhUrl }) {
  // ten, gia, anhUrl — từ cha truyền vào → Props

  const [daSoYeuThich, setDaSoYeuThich] = useState(false);
  // daSoYeuThich — người dùng bấm tim → State nội bộ của component này

  return (
    <div>
      <img src={anhUrl} alt={ten} />
      <h3>{ten}</h3>
      <p>{gia.toLocaleString()} đ</p>
      <button onClick={() => setDaSoYeuThich(!daSoYeuThich)}>
        {daSoYeuThich ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
```

## Tóm tắt các điểm cần nhớ

**Props:**

- Dữ liệu từ cha → con, chỉ một chiều
- Read-only tuyệt đối, không sửa
- Dùng destructuring cho code sạch hơn
- Truyền hàm qua props để con giao tiếp ngược lên cha
- `children` là props đặc biệt chứa JSX lồng bên trong

**State:**

- Dữ liệu nội bộ, chỉ component đó mới được thay đổi
- Luôn dùng setter (`setState`), không bao giờ sửa trực tiếp
- Array và Object phải tạo giá trị mới, không mutate
- Dùng dạng callback `setState(prev => ...)` khi giá trị mới phụ thuộc vào cũ
- State không cập nhật ngay — bất đồng bộ

## React là gì về mặt kỹ thuật?

React là một **thư viện UI** — nhiệm vụ duy nhất là **đồng bộ dữ liệu với giao diện**.

```
Dữ liệu (state/props)  →  React  →  Giao diện (DOM)
```

Mỗi khi dữ liệu thay đổi, React tự tính toán giao diện cần cập nhật gì và chỉ chạm vào đúng những phần đó.

---

## Virtual DOM

### Vấn đề

Thao tác DOM thật tốn kém — mỗi lần thay đổi, trình duyệt phải:

1. Tính lại CSS
2. Tính lại layout (reflow)
3. Vẽ lại (repaint)

Với app lớn, làm điều này mỗi khi có thay đổi nhỏ → chậm, giật.

### Giải pháp: Virtual DOM

Virtual DOM là **bản sao nhẹ của DOM thật**, tồn tại trong bộ nhớ JS dưới dạng object thông thường:

```js
// DOM thật — trình duyệt quản lý, nặng
<div class="card"><h2>Tiêu đề</h2></div>

// Virtual DOM — chỉ là object JS, rẻ hơn hàng trăm lần
{
  type: 'div',
  props: { className: 'card' },
  children: [{ type: 'h2', children: ['Tiêu đề'] }]
}
```

### Cơ chế 3 bước

```
State thay đổi
      │
      ▼
① Render phase
   Component chạy lại → JSX mới → Virtual DOM mới

      │
      ▼
② Diffing (Reconciliation)
   So sánh Virtual DOM mới vs cũ
   Tìm ra đúng điểm khác nhau

      │
      ▼
③ Commit phase
   Chỉ cập nhật đúng những node DOM thật cần thay đổi
```

**Ví dụ:**

```
VDOM cũ:          VDOM mới:
<ul>              <ul>
  <li>Táo</li>      <li>Táo</li>
  <li>Cam</li>      <li>Cam</li>
</ul>               <li>Nho</li>  ← mới
                  </ul>

→ React chỉ thêm 1 node <li>Nho</li>, không đụng 2 node kia
```

---

## Reconciliation Algorithm

Thuật toán React dùng để so sánh 2 cây VDOM. Mục tiêu: từ `O(n³)` xuống `O(n)`.

### 2 quy tắc nền tảng

**Quy tắc 1: Khác type → xóa cây cũ, tạo cây mới**

```jsx
// Trước: <div><Counter /></div>
// Sau:  <span><Counter /></span>
//
// div → span: khác type
// → Counter bị unmount hoàn toàn, mất hết state
// → Tạo Counter mới từ đầu
```

Hệ quả: **Không khai báo component bên trong component** — mỗi lần cha render, type của con thay đổi → con bị tạo lại, mất state.

```jsx
// ❌ Con tạo lại mỗi lần Cha render
function Cha() {
  function Con() {
    return <p>Hello</p>;
  } // type mới mỗi lần
  return <Con />;
}

// ✅ Khai báo ngoài
function Con() {
  return <p>Hello</p>;
}
function Cha() {
  return <Con />;
}
```

**Quy tắc 2: Cùng type → cập nhật thuộc tính, giữ nguyên con**

```jsx
// Trước: <div className="cũ">...</div>
// Sau:  <div className="mới">...</div>
//
// → Chỉ cập nhật className, không tạo lại div hay con bên trong
```

### Role của `key`

Khi render danh sách, React cần `key` để xác định item nào là item nào:

```jsx
// ❌ Không có key / key là index — sai khi thêm vào đầu
{
  items.map((item, i) => <Item key={i} />);
}
// Thêm item vào đầu → index của tất cả item bị lệch
// → React nghĩ mọi item đều thay đổi → re-render toàn bộ + bug state

// ✅ Key là ID ổn định
{
  items.map((item) => <Item key={item.id} />);
}
// Thêm item vào đầu → React chỉ tạo 1 node mới, di chuyển các node cũ
```

**Quy tắc key:** Duy nhất trong cùng list · Ổn định giữa các lần render · Không dùng `Math.random()`

---

## Shallow Compare

React dùng **Shallow Compare** (so sánh nông) để quyết định có cần re-render không.

```js
// Primitive — so sánh giá trị
1 === 1; // true  → không re-render
"abc" === "abc"; // true  → không re-render

// Reference type — so sánh địa chỉ bộ nhớ
const a = { x: 1 };
const b = { x: 1 };
a === b; // false → re-render (dù nội dung giống hệt)
```

### Tại sao không Deep Compare?

Deep compare (nhìn vào bên trong object) chính xác hơn nhưng tốn kém — object lồng nhiều tầng có thể cực chậm. Shallow compare là đánh đổi hợp lý, miễn là developer tuân thủ **immutability**.

### Hệ quả thực tế

```jsx
// ❌ Object literal trong JSX — địa chỉ mới mỗi lần render → Con luôn re-render
function Cha() {
  return <Con style={{ color: "red" }} />; // {} mới mỗi lần
}

// ✅ Đưa ra ngoài
const STYLE = { color: "red" };
function Cha() {
  return <Con style={STYLE} />; // Luôn cùng địa chỉ
}
```

```jsx
// ❌ Function tạo mới mỗi lần → Con re-render dù logic không đổi
function Cha() {
  const xuLy = () => console.log("click");
  return <Con onClick={xuLy} />;
}

// ✅ useCallback giữ nguyên địa chỉ hàm
function Cha() {
  const xuLy = useCallback(() => console.log("click"), []);
  return <Con onClick={xuLy} />;
}
```

### React.memo

Bọc component để skip re-render khi props không thay đổi (dựa trên shallow compare):

```jsx
const Con = React.memo(function Con({ label }) {
  return <p>{label}</p>;
});
// Chỉ re-render khi label thực sự thay đổi
```

**Dùng memo khi:** Component nặng + props thực sự ổn định.
**Không dùng memo khi:** Component nhẹ hoặc props luôn thay đổi — overhead của memo lớn hơn lợi ích.

---

### Tóm tắt và quy tắc thực hành

**Hiểu cơ chế:**

```
Primitive  → so sánh giá trị     → đáng tin cậy hoàn toàn
Reference  → so sánh địa chỉ     → cần kiểm soát khi nào tạo mới
```

**4 quy tắc thực hành:**

```
1. Không mutate state trực tiếp
   → Địa chỉ không đổi → React không re-render → giao diện sai

2. Không tạo object/array/function mới vô nghĩa trong JSX
   → Địa chỉ luôn mới → re-render thừa → hiệu năng kém

3. Dùng useMemo cho object/array cần ổn định địa chỉ
   const config = useMemo(() => ({ ... }), [deps])

4. Dùng useCallback cho function cần ổn định địa chỉ
   const xuLy = useCallback(() => { ... }, [deps])
```

**Khi nào thực sự cần lo:**

- Component được bọc bằng `React.memo`
- Giá trị dùng trong `useEffect` dependencies
- Props là function hoặc object truyền xuống component con nặng

## Chuỗi đầy đủ khi setState được gọi

```
① setDem(dem + 1) được gọi
       │
② React lên lịch re-render (batch nếu nhiều setState cùng lúc)
       │
③ Render phase
   Component chạy lại → Virtual DOM mới
       │
④ Reconciliation
   So sánh VDOM mới vs cũ (shallow compare + key)
   Tạo danh sách thay đổi cần áp dụng
       │
⑤ Commit phase
   Áp dụng thay đổi lên DOM thật — chỉ đúng node cần cập nhật
       │
⑥ Trình duyệt repaint vùng đã thay đổi
```

**Ví dụ cụ thể:**

```jsx
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Tiêu đề</h1> {/* Không đổi */}
      <p>Số đếm: {count}</p> {/* Thay đổi */}
      <button onClick={() => setCount(count + 1)}>Tăng</button>
    </div>
  );
}
// Bấm nút → React chỉ cập nhật text node bên trong <p>
// <h1> và <button> không bị đụng tới
```

---

## Tóm tắt

| Cơ chế              | Vai trò                                                          |
| ------------------- | ---------------------------------------------------------------- |
| **Virtual DOM**     | Bản sao DOM trong bộ nhớ JS — tránh thao tác DOM thật liên tục   |
| **Reconciliation**  | Thuật toán so sánh VDOM cũ vs mới — O(n) nhờ 2 quy tắc heuristic |
| **Shallow Compare** | So sánh tham chiếu — nhanh, cần immutability để chính xác        |
| **key**             | Giúp Reconciliation xác định đúng item trong danh sách           |

**Nguyên tắc rút ra:**

- Không mutate state — Shallow Compare bỏ qua
- Không tạo object/function mới vô nghĩa trong JSX — gây re-render thừa
- Không khai báo component bên trong component — Reconciliation tạo lại toàn bộ
- Dùng `key` là ID ổn định, không dùng index
