# Custom Hook(p2)

- Viết DEMO DEM

## Cấu trúc

```
src/
├── hooks/
│   └── useDemNguoc.js        ← Custom Hook
└── DemNguocNgan(Dai).jsx     ← 2 component dùng cùng hook
```

## useDemNguoc làm gì?

Đóng gói toàn bộ logic đếm ngược vào 1 hook — component dùng không cần biết bên trong hoạt động ra sao.

**Bên trong hook có:**

| Hook        | Vai trò                                         |
| ----------- | ----------------------------------------------- |
| `useState`  | Lưu số giây còn lại, trạng thái đang chạy       |
| `useEffect` | Chạy interval khi bắt đầu, dọn dẹp khi xong     |
| `useRef`    | Lưu timer ID để có thể hủy bằng `clearInterval` |

**Hook return ra:**

```js
{
  (giay, daBD, batDau, reset);
}
//  ↑      ↑      ↑      ↑
// Số    Đang  Hàm bắt  Hàm
// giây  chạy  đầu đếm  reset
```

## Cách dùng trong component

```jsx
const { giay, daBD, batDau, reset } = useDemNguoc(10);
//                                                  ↑
//                                           Số giây bắt đầu
```

Component chỉ cần 1 dòng này — không cần `useState`, `useEffect`, `useRef` trong component.

## Điều quan trọng cần nhớ

**Cùng 1 hook, dùng ở 2 nơi → 2 state hoàn toàn riêng biệt:**

```jsx
function DemNguocNgan() {
  const { giay, batDau, reset } = useDemNguoc(10); // State riêng
}

function DemNguocDai() {
  const { giay, batDau, reset } = useDemNguoc(30); // State riêng — không liên quan
}
```

Bấm Bắt đầu ở `DemNguocNgan` **không ảnh hưởng** `DemNguocDai` — mỗi component có bộ state của riêng mình.

## Nếu không có Custom Hook

Logic phải viết lại trong từng component:

```jsx
// dem nguoc ngan
const [giay, setGiay] = useState(10);
const [daBD, setDaBD] = useState(false);
const timerRef = useRef(null);
useEffect(() => {
  /* logic đếm */
}, [daBD]);

// dem nguoc dai
const [giay, setGiay] = useState(30); // Lặp lại
const [daBD, setDaBD] = useState(false); // Lặp lại
const timerRef = useRef(null); // Lặp lại
useEffect(() => {
  /* logic đếm */
}, [daBD]); // Lặp lại
```
