# Event Handling

## 1. Event là gì

**Event** là mọi hành động người dùng thực hiện trên trang web:

```
Click chuột    → onClick
Gõ bàn phím    → onChange, onKeyDown
Submit form    → onSubmit
Rê chuột       → onMouseEnter, onMouseLeave
Focus input    → onFocus, onBlur
Cuộn trang     → onScroll
```

React lắng nghe các hành động này và chạy hàm bạn chỉ định — gọi là **event handler**.

## Cú pháp cơ bản

HTML thông thường dùng chuỗi string:

```html
<!-- HTML thuần -->
<button onclick="handleClick()">Bấm</button>
```

React dùng **camelCase** và **truyền hàm** (không phải chuỗi):

```jsx
// React
<button onClick={handleClick}>Bấm</button>
```

**3 điểm khác với HTML:**

```
HTML            →  React
onclick         →  onClick
onchange        →  onChange
onsubmit        →  onSubmit
"handleClick()" →  {handleClick}   ← truyền hàm, không gọi ngay
```

## Cách viết event handler

**Cách 1 — Định nghĩa hàm riêng (nên dùng khi logic phức tạp)**

```jsx
function App() {
  function handleClick() {
    alert("Đã bấm!");
  }

  return <button onClick={handleClick}>Bấm</button>;
  //                      ↑ Truyền hàm — không có ()
  //                        Có () là gọi ngay khi render, không phải khi bấm
}
```

**Cách 2 — Arrow function inline (nên dùng khi cần truyền tham số)**

```jsx
function App() {
  return <button onClick={() => alert("Đã bấm!")}>Bấm</button>;
}
```

**Khi nào dùng cách nào:**

```
Logic đơn giản, không cần tham số  →  handleClick (cách 1)
Cần truyền tham số vào hàm         →  () => handleClick(id) (cách 2)
```

## Event Object

Mỗi event handler nhận một **event object** chứa thông tin về sự kiện vừa xảy ra:

```jsx
function handleClick(e) {
  console.log(e.target); // Phần tử được click
  console.log(e.target.value); // Giá trị (với input)
  console.log(e.type); // Loại event: "click", "change"...
}

<button onClick={handleClick}>Bấm</button>;
```

### e.preventDefault() — Ngăn hành vi mặc định

Một số element có hành vi mặc định của trình duyệt:

```jsx
// Form mặc định sẽ reload trang khi submit
function handleSubmit(e) {
  e.preventDefault(); // Ngăn reload
  console.log("Xử lý form mà không reload trang");
}

<form onSubmit={handleSubmit}>
  <button type="submit">Gửi</button>
</form>;
```

### e.stopPropagation() — Ngăn event lan ra ngoài

```jsx
// Click vào Con sẽ kích hoạt cả Cha nếu không stop
function Cha() {
  return (
    <div onClick={() => console.log("Cha")}>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Chặn, không cho lan lên Cha
          console.log("Con");
        }}
      >
        Bấm
      </button>
    </div>
  );
}
// Không stopPropagation: In ra "Con" rồi "Cha"
// Có stopPropagation: Chỉ in ra "Con"
```

## Event thường gặp nhất

### onClick — Bấm chuột

```jsx
function DemSo() {
  const [dem, setDem] = useState(0);

  return (
    <div>
      <p>{dem}</p>
      <button onClick={() => setDem(dem + 1)}>Tăng</button>
      <button onClick={() => setDem(dem - 1)}>Giảm</button>
      <button onClick={() => setDem(0)}>Reset</button>
    </div>
  );
}
```

### onChange — Nhập liệu

```jsx
function Input() {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập gì đó..."
      />
      <p>Bạn đang gõ: {text}</p>
    </div>
  );
}
```

### onSubmit — Gửi form

```jsx
function Form() {
  const [ten, setTen] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log({ ten, email });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={ten}
        onChange={(e) => setTen(e.target.value)}
        placeholder="Tên"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Gửi</button>
    </form>
  );
}
```

### onMouseEnter / onMouseLeave — Rê chuột

```jsx
function Card() {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: hover ? "#e0f2fe" : "white" }}
    >
      {hover ? "Đang rê chuột vào!" : "Rê chuột vào đây"}
    </div>
  );
}
```

### onKeyDown — Phím tắt

```jsx
function Input() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  function handleKeyDown(e) {
    if (e.key === "Enter" && text.trim()) {
      setItems([...items, text]);
      setText("");
    }
  }

  return (
    <>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nhập rồi Enter..."
      />
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </>
  );
}
```

## Truyền tham số vào handler

Hay gặp khi render list — cần biết item nào được bấm:

```jsx
function DanhSach() {
  const [items, setItems] = useState([
    { id: 1, ten: "Táo" },
    { id: 2, ten: "Cam" },
    { id: 3, ten: "Xoài" },
  ]);

  function xoaItem(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.ten}
          {/* Dùng arrow function để truyền id vào */}
          <button onClick={() => xoaItem(item.id)}>Xóa</button>
        </li>
      ))}
    </ul>
  );
}
```

## Điểm hay nhầm nhất

**Gọi hàm thay vì truyền hàm:**

```jsx
// ❌ Có () — hàm chạy ngay khi render, không đợi bấm
<button onClick={handleClick()}>Bấm</button>

// ✅ Không có () — truyền hàm để React gọi khi bấm
<button onClick={handleClick}>Bấm</button>

// ✅ Khi cần truyền tham số — bọc trong arrow function
<button onClick={() => xoaItem(item.id)}>Xóa</button>
```

## Tóm tắt

```
Event     →  Hành động người dùng
Handler   →  Hàm chạy khi event xảy ra
Cú pháp   →  onClick={handleClick}  ← không có ()

e.preventDefault()   →  Ngăn hành vi mặc định (reload form)
e.stopPropagation()  →  Ngăn event lan lên phần tử cha

Truyền tham số  →  onClick={() => handleClick(id)}
```
