# Review Shallow Compare & useEffect

## Shallow Compare

### Bộ nhớ JavaScript

Trước khi hiểu Shallow Compare, phải hiểu cách JS lưu dữ liệu trong bộ nhớ.

JS có 2 vùng nhớ:

```
Stack                    Heap
─────────────────        ─────────────────────────────
Lưu primitive            Lưu reference type
Truy cập nhanh           Truy cập qua địa chỉ
─────────────────        ─────────────────────────────
ten = "Giang"            0x001 → { ten: "Giang" }
tuoi = 24                0x002 → [1, 2, 3]
laDung = true            0x003 → function() {}
```

**Primitive** — biến chứa trực tiếp giá trị trong Stack:

```js
let a = 10;
let b = a; // b nhận bản sao giá trị
b = 20;
console.log(a); // 10 — a không bị ảnh hưởng
```

**Reference type** — biến chứa địa chỉ trỏ đến Heap:

```js
let a = { x: 1 }; // a chứa địa chỉ → 0x001
let b = a; // b nhận bản sao địa chỉ → 0x001
b.x = 99;
console.log(a.x); // 99 — a và b cùng trỏ đến 0x001
```

```
Stack           Heap
a → 0x001  →   { x: 99 }
b → 0x001  ↗
```

Đây là lý do tại sao mutate object lại ảnh hưởng đến tất cả biến cùng trỏ đến nó.

---

### Shallow Compare là gì?

Shallow Compare là phép so sánh dùng toán tử `===` — so sánh **một tầng**, không đi vào bên trong.

```
Shallow = Nông = Nhìn bề mặt (địa chỉ)
Deep    = Sâu  = Nhìn toàn bộ nội dung bên trong
```

#### Với Primitive — So sánh giá trị

```js
10 === 10; // true
"abc" === "abc"; // true
true === true; // true
null === null; // true
10 === 20; // false
```

#### Với Reference Type — So sánh địa chỉ

```js
const a = { x: 1 }; // 0x001
const b = { x: 1 }; // 0x002 — object mới, địa chỉ khác
const c = a; // 0x001 — cùng địa chỉ với a

a === b; // false — 0x001 !== 0x002 (dù nội dung giống hệt)
a === c; // true  — 0x001 === 0x001

// Array
const arr1 = [1, 2, 3]; // 0x010
const arr2 = [1, 2, 3]; // 0x011
arr1 === arr2; // false

// Function
const fn1 = () => {}; // 0x020
const fn2 = () => {}; // 0x021
fn1 === fn2; // false
```

---

### Shallow Compare với Object — Chi tiết một tầng

Khi so sánh 2 object trong React (ví dụ `React.memo`), React không dùng `===` trực tiếp lên toàn object — nó dùng `shallowEqual`: so sánh từng value của từng key ở tầng đầu tiên.

```js
// Đây là cách React implement shallowEqual bên trong
function shallowEqual(obj1, obj2) {
  // Cùng tham chiếu → bằng nhau ngay
  if (obj1 === obj2) return true;

  // Một trong hai null/undefined
  if (obj1 == null || obj2 == null) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Khác số lượng key
  if (keys1.length !== keys2.length) return false;

  // So sánh từng value — vẫn dùng === (shallow)
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}
```

**Hệ quả — Object phẳng (1 tầng) hoạt động đúng:**

```js
const prev = { ten: "Giang", tuoi: 24 };
const next = { ten: "Giang", tuoi: 24 };

shallowEqual(prev, next);
// 'Giang' === 'Giang' → true
// 24 === 24           → true
// → true → memo SKIP re-render ✅
```

**Hệ quả — Object lồng sâu (nhiều tầng) KHÔNG hoạt động:**

```js
const prev = { nguoi: { ten: "Giang" } };
const next = { nguoi: { ten: "Giang" } };

shallowEqual(prev, next);
// prev.nguoi → 0x001
// next.nguoi → 0x002  (object mới dù nội dung giống)
// 0x001 !== 0x002 → false
// → false → memo re-render dù dữ liệu không đổi ❌
```

---

### Shallow Compare xuất hiện ở đâu trong React?

#### 4.1 React.memo

`React.memo` bọc component, dùng `shallowEqual` để so sánh props cũ vs mới. Nếu bằng nhau → skip re-render.

```jsx
const Con = React.memo(function Con({ ten, tuoi }) {
  console.log("Con render");
  return (
    <p>
      {ten} — {tuoi}
    </p>
  );
});

function Cha() {
  const [dem, setDem] = useState(0);
  return (
    <>
      <button onClick={() => setDem(dem + 1)}>Tăng</button>
      {/* ten và tuoi là primitive → shallowEqual đúng */}
      <Con ten="Giang" tuoi={24} />
    </>
  );
}
// Bấm nút → Cha re-render → Con KHÔNG re-render vì ten và tuoi không đổi ✅
```

**Nhưng với object prop:**

```jsx
function Cha() {
  const [dem, setDem] = useState(0);

  // ❌ Object literal → địa chỉ mới mỗi lần Cha render
  return <Con nguoi={{ ten: "Giang", tuoi: 24 }} />;
  // → shallowEqual: địa chỉ cũ !== địa chỉ mới → re-render
  // → memo vô tác dụng
}

// ✅ Ổn định địa chỉ bằng useMemo
function Cha() {
  const [dem, setDem] = useState(0);
  const nguoi = useMemo(() => ({ ten: "Giang", tuoi: 24 }), []);
  return <Con nguoi={nguoi} />;
  // → Cùng địa chỉ → shallowEqual true → memo hoạt động đúng
}
```

#### 4.2 useCallback

Mỗi lần component render, mọi function bên trong đều được tạo lại với địa chỉ mới:

```jsx
function Cha() {
  // Mỗi lần Cha render → xuLy có địa chỉ mới
  const xuLy = () => fetchData();

  // Con nhận xuLy mới mỗi lần → shallow compare false → luôn re-render
  return <Con onClick={xuLy} />;
}
```

`useCallback` cache hàm, chỉ tạo địa chỉ mới khi dependency thay đổi:

```jsx
function Cha() {
  const [userId, setUserId] = useState(1);

  // ✅ Địa chỉ cố định khi userId không đổi
  const xuLy = useCallback(() => {
    fetchData(userId);
  }, [userId]);
  // userId đổi → xuLy có địa chỉ mới (đúng — logic đã thay đổi)
  // userId không đổi → xuLy cùng địa chỉ → memo của Con skip re-render

  return <Con onClick={xuLy} />;
}
```

#### 4.3 useMemo

`useMemo` cache kết quả tính toán, dùng shallow compare để kiểm tra dependency:

```jsx
function DanhSach({ items, boLoc }) {
  // items và boLoc là dependency
  // Mỗi lần render, React shallow compare dependency cũ vs mới
  // Nếu bằng nhau → trả về kết quả cache, không tính lại
  const ketQua = useMemo(() => {
    return items.filter((item) => item.loai === boLoc);
  }, [items, boLoc]);

  return (
    <ul>
      {ketQua.map((i) => (
        <li key={i.id}>{i.ten}</li>
      ))}
    </ul>
  );
}
```

**Trap với dependency là object:**

```jsx
function Component() {
  // ❌ config tạo mới mỗi render → dependency luôn "mới"
  // → useMemo chạy lại mỗi lần → không có gì được cache
  const config = { page: 1, limit: 10 };

  const data = useMemo(() => fetchData(config), [config]);

  // ✅ Dùng primitive làm dependency
  const data = useMemo(() => fetchData({ page: 1, limit: 10 }), []);
  // hoặc
  const [page] = useState(1);
  const [limit] = useState(10);
  const data = useMemo(() => fetchData({ page, limit }), [page, limit]);
}
```

#### 4.4 useEffect dependencies

`useEffect` dùng shallow compare để quyết định có chạy lại effect không:

```jsx
function Component({ id, config }) {
  // ❌ config là object → địa chỉ mới mỗi render
  // → useEffect chạy lại mỗi render → vòng lặp vô tận hoặc gọi API liên tục
  useEffect(() => {
    fetch(`/api/${config.endpoint}`);
  }, [config]);

  // ✅ Destructure ra primitive
  const { endpoint } = config;
  useEffect(() => {
    fetch(`/api/${endpoint}`);
  }, [endpoint]); // string → so sánh giá trị → đúng
}
```

---

### Immutability — Điều kiện sống còn

Shallow Compare chỉ hoạt động chính xác khi bạn tuân thủ Immutability.

**Quy tắc:** Không bao giờ sửa trực tiếp state. Luôn tạo giá trị mới.

#### Hai hướng bug đối lập

```
Bug 1: Mutate trực tiếp (không tạo mới)
─────────────────────────────────────────────────────────
Địa chỉ không đổi → Shallow compare: cũ === mới → true
→ React KHÔNG re-render dù dữ liệu đã thay đổi
→ Giao diện hiển thị sai

Bug 2: Tạo mới không cần thiết
─────────────────────────────────────────────────────────
Địa chỉ luôn mới → Shallow compare: cũ !== mới → false
→ React LUÔN re-render dù dữ liệu không thay đổi
→ Hiệu năng kém
```

#### Primitive — Không có vấn đề

```jsx
const [ten, setTen] = useState("Giang");

setTen("Nam"); // Giá trị mới → shallow compare false → re-render ✅
setTen("Giang"); // Giá trị giống → shallow compare true → skip ✅
```

#### Object — Phải tạo mới

```jsx
const [nguoi, setNguoi] = useState({ ten: "Giang", tuoi: 24 });

// ❌ Mutate trực tiếp — địa chỉ không đổi
nguoi.tuoi = 25;
setNguoi(nguoi);
// 0x001 === 0x001 → React bỏ qua → giao diện vẫn hiển thị 24

// ✅ Tạo object mới — địa chỉ mới
setNguoi({ ...nguoi, tuoi: 25 }); // Địa chỉ mới 0x002 → re-render đúng

// ✅ Object lồng sâu — phải spread từng tầng
const [data, setData] = useState({
  nguoi: { ten: "Giang", diaChi: { thanhPho: "Da Nang" } },
});

// Sửa thanhPho
setData({
  ...data,
  nguoi: {
    ...data.nguoi,
    diaChi: {
      ...data.nguoi.diaChi,
      thanhPho: "HCM",
    },
  },
});
// Lồng sâu thế này → nên dùng Immer (xem mục 7)
```

#### Array — Phải tạo mới

```jsx
const [danhSach, setDanhSach] = useState([1, 2, 3]);

// ❌ Mutate — địa chỉ không đổi
danhSach.push(4);
setDanhSach(danhSach); // Cùng địa chỉ → không re-render

// ✅ Thêm
setDanhSach([...danhSach, 4]);
setDanhSach((prev) => [...prev, 4]); // Callback form — an toàn hơn

// ✅ Xóa
setDanhSach(danhSach.filter((x) => x !== 2));

// ✅ Sửa
setDanhSach(danhSach.map((x) => (x === 2 ? 99 : x)));

// ✅ Sắp xếp — sort mutate mảng gốc, phải copy trước
setDanhSach([...danhSach].sort((a, b) => a - b));
```

---

### Các Pattern thực tế và cách xử lý

#### Pattern 1 — Ổn định object qua useMemo

```jsx
// Tình huống: config object truyền vào component con có memo
function Cha({ userId }) {
  // ❌ Tạo mới mỗi lần render
  const options = { userId, limit: 10, sort: "desc" };

  // ✅ Cache lại — chỉ tạo mới khi userId thay đổi
  const options = useMemo(
    () => ({ userId, limit: 10, sort: "desc" }),
    [userId],
  );

  return <DanhSach options={options} />;
}
```

#### Pattern 2 — Ổn định function qua useCallback

```jsx
function Cha({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  // ❌ Hàm mới mỗi render
  const guiForm = async (data) => {
    setLoading(true);
    await api.post(data);
    onSuccess();
    setLoading(false);
  };

  // ✅ Stable reference
  const guiForm = useCallback(
    async (data) => {
      setLoading(true);
      await api.post(data);
      onSuccess();
      setLoading(false);
    },
    [onSuccess],
  );
  // onSuccess cũng cần stable — nếu Cha nhận onSuccess từ ông, ông cũng phải useCallback

  return <Form onSubmit={guiForm} loading={loading} />;
}
```

#### Pattern 3 — Tránh object trong useEffect deps

```jsx
function UserProfile({ user }) {
  // ❌ user là object → deps luôn thay đổi
  useEffect(() => {
    document.title = user.ten;
  }, [user]);

  // ✅ Chỉ lấy giá trị cần dùng
  useEffect(() => {
    document.title = user.ten;
  }, [user.ten]); // primitive → đúng
}
```

#### Pattern 4 — Custom comparison trong React.memo

Khi props là object lồng sâu mà bạn cần so sánh sâu hơn:

```jsx
const Con = React.memo(
  function Con({ data }) {
    return <p>{data.nguoi.ten}</p>;
  },
  // Hàm compare tùy chỉnh — trả về true = skip re-render
  (prevProps, nextProps) => {
    return prevProps.data.nguoi.ten === nextProps.data.nguoi.ten;
  },
);
```

> Cẩn thận: custom compare dễ bỏ sót trường hợp → bug khó phát hiện. Chỉ dùng khi thực sự cần.

---

### Immer — Giải quyết bài toán Immutability với object lồng sâu

Spread nhiều tầng rất cồng kềnh và dễ sai:

```jsx
// Không Immer — verbose và dễ miss tầng
setData({
  ...data,
  nguoi: {
    ...data.nguoi,
    diaChi: {
      ...data.nguoi.diaChi,
      thanhPho: "HCM",
    },
  },
});
```

**Immer** cho phép viết như mutate trực tiếp nhưng bên trong tự tạo object mới:

```jsx
import { produce } from "immer";

setData(
  produce((draft) => {
    draft.nguoi.diaChi.thanhPho = "HCM"; // Trông như mutate nhưng thực ra tạo mới
  }),
);
```

Với `useImmer`:

```jsx
import { useImmer } from "use-immer";

const [data, updateData] = useImmer({
  nguoi: { diaChi: { thanhPho: "Da Nang" } },
});

updateData((draft) => {
  draft.nguoi.diaChi.thanhPho = "HCM"; // Immer tự tạo object mới đúng cách
});
```

---

### Khi nào Shallow Compare không đủ — Và cách đối phó

#### Trường hợp 1: Props là object lồng sâu thay đổi ở tầng sâu

```jsx
// Con nhận props.data.items[0].ten thay đổi
// Nhưng data object vẫn cùng địa chỉ (nếu bị mutate)
// → memo nghĩ không thay đổi → Con không re-render → bug

// Giải pháp: đảm bảo immutability đúng cách ở cha
// Hoặc dùng custom compare trong memo
```

#### Trường hợp 2: Selector từ Redux/Zustand trả về object mới mỗi lần

```jsx
// ❌ Tạo object mới mỗi lần → component luôn re-render
const data = useSelector((state) => ({
  ten: state.nguoi.ten,
  tuoi: state.nguoi.tuoi,
}));

// ✅ Dùng shallowEqual của thư viện
import { shallowEqual, useSelector } from "react-redux";
const data = useSelector(
  (state) => ({ ten: state.nguoi.ten, tuoi: state.nguoi.tuoi }),
  shallowEqual, // So sánh object trả về, không phải địa chỉ
);

// ✅ Hoặc tách ra selector riêng
const ten = useSelector((state) => state.nguoi.ten); // primitive
const tuoi = useSelector((state) => state.nguoi.tuoi); // primitive
```

---

### Tóm tắt

```
Primitive  →  So sánh giá trị      →  Đáng tin hoàn toàn
Reference  →  So sánh địa chỉ      →  Phải kiểm soát khi nào tạo mới

Tạo mới khi cần  (immutability)    →  React nhận diện thay đổi đúng
Giữ địa chỉ khi không đổi         →  memo/useCallback/useMemo hoạt động đúng

Hai lỗi đối lập:
  Mutate trực tiếp  →  Địa chỉ cũ  →  React KHÔNG re-render khi cần  →  UI sai
  Tạo mới thừa      →  Địa chỉ mới →  React LUÔN re-render            →  Chậm
```

| API           | Dùng shallowEqual để       | So sánh cái gì                    |
| ------------- | -------------------------- | --------------------------------- |
| `React.memo`  | Quyết định skip re-render  | Props cũ vs mới (từng key tầng 1) |
| `useMemo`     | Quyết định tính toán lại   | Dependency array (từng phần tử)   |
| `useCallback` | Quyết định tạo hàm mới     | Dependency array (từng phần tử)   |
| `useEffect`   | Quyết định chạy lại effect | Dependency array (từng phần tử)   |

## useEffect

`useEffect` đồng bộ component với **thế giới bên ngoài React** — API, DOM, timer, subscription.  
Không có bên ngoài liên quan → không cần effect.

### Dependency Array

```
useEffect(fn)          → Chạy sau mỗi render
useEffect(fn, [])      → Chạy 1 lần khi mount
useEffect(fn, [a, b])  → Chạy khi a hoặc b thay đổi
```

---

### Cleanup

Hàm `return` trong effect — chạy **trước khi effect chạy lại** hoặc **khi unmount**.

```jsx
useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize); // Không có → leak
}, []);
```

Thứ tự:

```
Mount       → Effect chạy
Deps đổi    → Cleanup cũ → Effect mới
Unmount     → Cleanup cuối
```

---

### 4 lỗi cốt lõi

**1. Stale closure — thiếu deps**

```jsx
// ❌ count bị đóng băng tại 0
useEffect(() => {
  setCount(count + 1);
}, []);

// ✅ Callback form — không cần đọc count từ closure
useEffect(() => {
  setCount((prev) => prev + 1);
}, []);
```

**2. Object/Array trong deps — effect chạy mãi**

```jsx
// ❌ filters là object → địa chỉ mới mỗi render → effect chạy mãi
useEffect(() => {
  fetchData(filters);
}, [filters]);

// ✅ Destructure ra primitive
const { page, sort } = filters;
useEffect(() => {
  fetchData({ page, sort });
}, [page, sort]);
```

**3. Function trong deps — vòng lặp vô tận**

```jsx
// ❌ fn tạo mới mỗi render → effect chạy lại → render → fn mới → ...
useEffect(() => { fn() }, [fn])

// ✅ Định nghĩa bên trong effect
useEffect(() => {
  const fetchData = async () => { ... }
  fetchData()
}, [])
```

**4. Race condition khi gọi API**

```jsx
// ❌ User đổi id nhanh → request cũ về sau → ghi đè kết quả đúng
useEffect(() => {
  fetch(`/api/${id}`)
    .then((res) => res.json())
    .then(setData);
}, [id]);

// ✅ AbortController hủy request cũ
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/${id}`, { signal: controller.signal })
    .then((res) => res.json())
    .then(setData)
    .catch((err) => {
      if (err.name !== "AbortError") throw err;
    });
  return () => controller.abort();
}, [id]);
```

---

### Không dùng useEffect khi

```
Transform data   →  useMemo hoặc tính thẳng trong render
Reset state      →  đổi key prop thay vì useEffect
Handle event     →  xử lý trong event handler
```
