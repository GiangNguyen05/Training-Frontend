# Custom Hooks trong React

## Custom Hook

Trong quá trình xây dựng app, bạn sẽ nhận ra **cùng một đoạn logic lặp đi lặp lại** ở nhiều component khác nhau — gọi API, lưu vào localStorage, lắng nghe sự kiện...

**Custom Hook** là cách đóng gói logic đó vào **một hàm riêng có thể tái sử dụng** ở bất kỳ đâu, giống như bạn tạo một công cụ riêng rồi dùng lại nhiều lần.

## Quy tắc bắt buộc

**Tên hàm phải bắt đầu bằng `use`** — đây không phải quy ước tuỳ ý, mà là quy tắc React bắt buộc.

```
useFetch       ✅
useLocalStorage ✅
fetchData      ❌  — React không coi đây là hook
FetchData      ❌  — React coi đây là component, không phải hook
```

Nếu không đặt tên bắt đầu bằng `use`, React sẽ không áp dụng đúng luật Hook bên trong — dẫn đến bug âm thầm như đã gặp ở bài useContext.

**Bên trong Custom Hook có thể gọi các hook khác** — đây chính là điểm khác biệt so với hàm JS thông thường.

```jsx
function useFetch(url) {
  const [data, setData]       = useState(null)   // ✅ Gọi hook bên trong hook
  const [loading, setLoading] = useState(true)

  useEffect(() => {                              // ✅ Gọi hook bên trong hook
    fetch(url).then(...)
  }, [url])

  return { data, loading }
}
```

## Cách tạo Custom Hook

**Trước khi có Custom Hook — Logic lặp lại ở nhiều nơi:**

```jsx
// Component A
function DanhSachUser() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  // ...
}

// Component B — Logic giống hệt, chỉ khác URL
function DanhSachSanPham() {
  const [data, setData] = useState(null); // Lặp lại
  const [loading, setLoading] = useState(true); // Lặp lại
  const [error, setError] = useState(null); // Lặp lại
  useEffect(() => {
    /* giống hệt */
  }, []); // Lặp lại
}
```

**Sau khi tách ra Custom Hook — Viết 1 lần, dùng nhiều nơi:**

```jsx
// hooks/useFetch.js
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
```

```jsx
// Dùng lại ở mọi component — không viết lại logic
function DanhSachUser() {
  const { data, loading, error } = useFetch("/api/users");

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;
  return (
    <ul>
      {data.map((u) => (
        <li key={u.id}>{u.ten}</li>
      ))}
    </ul>
  );
}

function DanhSachSanPham() {
  const { data, loading, error } = useFetch("/api/san-pham");
  // Logic giống hệt, không cần viết lại
}
```

## Custom Hook có thể return bất cứ thứ gì

Không có quy định phải return gì — return tuỳ theo nhu cầu:

```jsx
// Return object
function useFetch(url) {
  return { data, loading, error };
}

// Return array — giống useState
function useToggle(macDinh = false) {
  const [value, setValue] = useState(macDinh);
  const toggle = () => setValue((prev) => !prev);
  return [value, toggle]; // Dùng như [bật, setBật]
}

// Return một giá trị đơn
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // ...
  return isOnline; // Chỉ return true/false
}

// Return không có gì — chỉ chứa side effect
function usePageTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  // Không cần return
}
```

## Ví dụ Custom Hook hay dùng thực tế

### useLocalStorage — Lưu state vào localStorage

```jsx
function useLocalStorage(key, giaTriMacDinh) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : giaTriMacDinh;
  });

  function set(newValue) {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  }

  return [value, set];
}

// Dùng như useState nhưng tự lưu vào localStorage
const [theme, setTheme] = useLocalStorage("theme", "light");
```

### useDebounce — Trì hoãn cập nhật

```jsx
function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Hủy nếu value đổi trong thời gian chờ
  }, [value, delay]);

  return debouncedValue;
}

// Dùng — gọi API sau khi người dùng ngừng gõ 400ms
function TimKiem() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query); // Chỉ thay đổi sau 400ms

  useEffect(() => {
    if (debouncedQuery) fetchKetQua(debouncedQuery);
  }, [debouncedQuery]);
}
```

## Cấu trúc file

Quy ước thường dùng trong dự án thực tế:

```
src/
├── hooks/
│   ├── useFetch.js
│   ├── useLocalStorage.js
│   ├── useDebounce.js
│   └── useToggle.js
└── components/
    └── ...
```

Một file = một hook. Tên file trùng với tên hook.

## Câu hỏi và trả lời

**Q: Custom Hook khác gì hàm JavaScript thông thường?**
Hàm JS thông thường không được gọi các hook bên trong (`useState`, `useEffect`...). Custom Hook được phép — vì React nhận ra prefix `use` và áp dụng đúng luật Hook. Đây là điểm khác biệt duy nhất nhưng cực kỳ quan trọng.

**Q: Mỗi component dùng cùng 1 Custom Hook thì có dùng chung state không?**
**Không.** Mỗi lần component gọi Custom Hook, React tạo ra **một bản state riêng độc lập** cho component đó. Hai component dùng `useFetch('/api/users')` sẽ có `data`, `loading`, `error` hoàn toàn riêng biệt.

**Q: Custom Hook có thể gọi Custom Hook khác không?**
Có. Đây là tính năng mạnh nhất — bạn có thể xây Custom Hook từ các Custom Hook nhỏ hơn.

```jsx
function useUserData(userId) {
  const { data, loading } = useFetch(`/api/users/${userId}`); // Custom Hook gọi Custom Hook
  const debouncedId = useDebounce(userId);
  return { user: data, loading };
}
```

**Q: Khi nào nên tách logic ra Custom Hook?**

```
Logic lặp lại ở 2+ component          →  Nên tách
Logic phức tạp làm component khó đọc  →  Nên tách
Logic cần test riêng độc lập           →  Nên tách
Logic chỉ dùng ở 1 nơi, không phức tạp →  Không cần tách
```

**Q: Custom Hook có bắt buộc phải return gì không?**
Không. Return tuỳ theo nhu cầu — object, array, giá trị đơn, hoặc không return gì cả (nếu hook chỉ có side effect như `usePageTitle`).

**Q: Đặt tên file Custom Hook như thế nào?**
Tên file trùng với tên hook, dùng `.js` hoặc `.jsx` đều được. Đặt trong thư mục `hooks/` để dễ tìm.

```
hooks/useFetch.js         ✅
hooks/use-fetch.js        ✅ (cũng được)
utils/fetchHelper.js      ❌ (không rõ đây là hook)
```

## Tóm tắt

```
Custom Hook = hàm bắt đầu bằng "use" + có thể dùng hook bên trong

Dùng để:  Tách logic lặp lại ra nơi riêng, tái sử dụng ở nhiều component
Return:   Bất cứ thứ gì — object, array, giá trị đơn, hoặc không gì cả
State:    Mỗi component dùng hook có state riêng, không dùng chung
Đặt tên: Phải bắt đầu bằng "use" — bắt buộc, không phải tùy chọn
```

| Custom Hook       | Giải quyết vấn đề gì                      |
| ----------------- | ----------------------------------------- |
| `useFetch`        | Gọi API, quản lý loading/error            |
| `useLocalStorage` | Đồng bộ state với localStorage            |
| `useDebounce`     | Trì hoãn cập nhật, tránh gọi API liên tục |
| `useToggle`       | Bật/tắt một giá trị boolean               |
| `usePageTitle`    | Cập nhật tiêu đề tab trình duyệt          |
