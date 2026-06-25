# useCallback và useMemo — Tối ưu hiệu năng React

---

## 1. Vấn đề cần giải quyết

Mỗi lần component render, **mọi thứ bên trong đều được tạo lại từ đầu** — biến, hàm, mảng, object.

```jsx
function App() {
  // Mỗi lần render, xuLy là 1 hàm MỚI — địa chỉ bộ nhớ khác
  const xuLy = () => console.log("click");

  // Mỗi lần render, danhSach là 1 mảng MỚI — dù dữ liệu giống hệt
  const danhSach = items.filter((i) => i.active);
}
```

Điều này gây ra 2 vấn đề hiệu năng:

```
Hàm tạo mới mỗi render
→ Component con nhận hàm đó sẽ re-render dù không có gì thay đổi

Tính toán nặng chạy lại mỗi render
→ Lãng phí CPU dù kết quả vẫn giống lần trước
```

`useCallback` và `useMemo` giải quyết 2 vấn đề này.

---

## 2. useCallback — Cache địa chỉ hàm

### Khái niệm

`useCallback` giữ nguyên **địa chỉ bộ nhớ của hàm** giữa các lần render — chỉ tạo hàm mới khi dependency thay đổi.

```jsx
const xuLy = useCallback(() => {
  // Logic hàm
}, [dependency]);
```

```
Không có useCallback:
  Render lần 1 → xuLy ở địa chỉ 0x001
  Render lần 2 → xuLy ở địa chỉ 0x002  ← khác nhau dù logic giống hệt

Có useCallback:
  Render lần 1 → xuLy ở địa chỉ 0x001
  Render lần 2 → xuLy ở địa chỉ 0x001  ← giữ nguyên nếu deps không đổi
```

### Cách dùng

```jsx
function Cha() {
  const [dem, setDem] = useState(0);
  const [ten, setTen] = useState("");

  // ❌ Không có useCallback — xuLy mới mỗi lần Cha render
  const xuLy = () => console.log("click");

  // ✅ Có useCallback — xuLy giữ nguyên khi dem và ten không đổi
  const xuLy = useCallback(() => {
    console.log("click");
  }, []); // Không phụ thuộc gì → chỉ tạo 1 lần duy nhất

  return <Con onClick={xuLy} />;
}
```

### Khi dependency thay đổi — hàm mới được tạo

```jsx
function TimKiem() {
  const [boLoc, setBoLoc] = useState("tat-ca");

  // Khi boLoc đổi → layDuLieu mới được tạo (đúng — logic đã thay đổi)
  // Khi state khác đổi → layDuLieu giữ nguyên địa chỉ cũ
  const layDuLieu = useCallback(() => {
    fetch(`/api/items?loai=${boLoc}`);
  }, [boLoc]);

  return <NutTimKiem onClick={layDuLieu} />;
}
```

### useCallback thực sự có tác dụng khi nào?

`useCallback` **chỉ có ý nghĩa** khi hàm được truyền vào component con có `React.memo`.

```jsx
// Không có React.memo → Con luôn re-render dù props không đổi
// → useCallback không giúp ích gì
function Con({ onClick }) { ... }

// Có React.memo → Con chỉ re-render khi props thực sự thay đổi
// → useCallback mới phát huy tác dụng
const Con = React.memo(function Con({ onClick }) { ... })
```

---

## 3. useMemo — Cache kết quả tính toán

### Khái niệm

`useMemo` lưu lại **kết quả của một phép tính** — chỉ tính lại khi dependency thay đổi.

```jsx
const ketQua = useMemo(() => {
  return phepTinhNang(data);
}, [data]);
```

```
Không có useMemo:
  Render lần 1 → Tính toán → kết quả A
  Render lần 2 → Tính toán lại (dù data không đổi) → kết quả A  ← lãng phí

Có useMemo:
  Render lần 1 → Tính toán → kết quả A, lưu cache
  Render lần 2 → data không đổi → lấy cache → kết quả A  ← không tính lại
```

### Cách dùng

```jsx
function DanhSach({ items, boLoc, sapXep }) {
  // ❌ Không có useMemo — filter + sort chạy lại mỗi render dù items không đổi
  const ketQua = items
    .filter((item) => item.loai === boLoc)
    .sort((a, b) => a[sapXep] - b[sapXep]);

  // ✅ Có useMemo — chỉ tính lại khi items, boLoc hoặc sapXep thay đổi
  const ketQua = useMemo(() => {
    return items
      .filter((item) => item.loai === boLoc)
      .sort((a, b) => a[sapXep] - b[sapXep]);
  }, [items, boLoc, sapXep]);

  return (
    <ul>
      {ketQua.map((item) => (
        <li key={item.id}>{item.ten}</li>
      ))}
    </ul>
  );
}
```

### Ổn định địa chỉ object/array truyền vào component con

```jsx
function Cha() {
  const [dem, setDem] = useState(0);

  // ❌ Config tạo mới mỗi render → Con luôn re-render
  const config = { mau: "blue", size: 14 };

  // ✅ Config giữ nguyên địa chỉ khi dem thay đổi
  const config = useMemo(() => ({ mau: "blue", size: 14 }), []);

  return <Con config={config} />;
}
```

---

## 4. So sánh useCallback và useMemo

|                  | useCallback    | useMemo            |
| ---------------- | -------------- | ------------------ |
| Cache cái gì?    | Địa chỉ hàm    | Kết quả tính toán  |
| Dùng cho         | Function       | Bất kỳ giá trị nào |
| Return           | Hàm được cache | Giá trị được cache |
| Khi nào tính lại | Deps thay đổi  | Deps thay đổi      |

```jsx
// useCallback — cache HÀM
const xuLy = useCallback(() => doSomething(a), [a]);

// useMemo — cache KẾT QUẢ của hàm
const ketQua = useMemo(() => tinhToan(a), [a]);

// Thực ra useCallback(fn, deps) = useMemo(() => fn, deps)
```

---

## 5. Khi nào dùng — Khi nào không cần

### Dùng useCallback khi

```
v Hàm truyền vào component con có React.memo
v Hàm là dependency của useEffect — tránh effect chạy lại vô tận
v Hàm được dùng trong custom hook và cần ổn định
```

### Dùng useMemo khi

```
v Tính toán nặng: filter/sort mảng lớn, parse dữ liệu phức tạp
v Object/Array truyền vào component con có React.memo
v Kết quả được dùng làm dependency trong useEffect/useCallback
```

### KHÔNG cần dùng khi

```
x Component nhỏ, render nhanh — overhead của memo > lợi ích
x Props/deps luôn thay đổi — cache sẽ bị bỏ mỗi lần dù sao
x Chưa có vấn đề hiệu năng thực sự — đừng tối ưu sớm
x Component không có React.memo — useCallback không có tác dụng
```

> **Nguyên tắc vàng:** Đo trước, tối ưu sau. Chỉ dùng `useCallback`/`useMemo` khi đã xác định được component nào đang re-render thừa qua React DevTools.

---

## 6. Những điều cần chú ý

### Dependency phải khai báo đầy đủ

```jsx
function Component({ userId }) {
  // x Thiếu userId trong deps — stale closure
  const layDuLieu = useCallback(() => {
    fetch(`/api/${userId}`); // userId bị đóng băng tại lần đầu
  }, []);

  // v Đầy đủ deps
  const layDuLieu = useCallback(() => {
    fetch(`/api/${userId}`);
  }, [userId]);
}
```

### useMemo không đảm bảo cache mãi mãi

React có thể xóa cache của `useMemo` để giải phóng bộ nhớ khi cần — dùng `useMemo` để tối ưu hiệu năng, không dùng để lưu trữ dữ liệu quan trọng.

### Bản thân useCallback/useMemo cũng có chi phí

Mỗi lần render, React vẫn phải:

1. Chạy hàm dependency comparison
2. Quyết định có dùng cache không

Với component nhỏ, chi phí này có thể **lớn hơn** lợi ích mang lại.

---

## Tóm tắt

```
useCallback(fn, [deps])
  → Cache địa chỉ hàm
  → Chỉ có tác dụng khi truyền vào component con có React.memo
    hoặc dùng làm dependency trong useEffect

useMemo(() => tinhToan(), [deps])
  → Cache kết quả tính toán
  → Dùng khi tính toán nặng hoặc cần ổn định địa chỉ object/array

Cả hai:
  → Chỉ dùng khi CÓ vấn đề hiệu năng, không dùng phòng ngừa
  → Dependency phải khai báo đầy đủ, chính xác
  → Không thay thế cho việc tổ chức code tốt
```
