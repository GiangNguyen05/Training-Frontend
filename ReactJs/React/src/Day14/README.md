# Gọi API thực tế với Axios — Pattern chuẩn

## Tại sao dùng Axios thay vì fetch?

`fetch` là hàm có sẵn trong trình duyệt — dùng được nhưng thiếu nhiều tính năng quan trọng:

|                     | fetch                         | axios                              |
| ------------------- | ----------------------------- | ---------------------------------- |
| Tự parse JSON       | ❌ Phải `.json()` thủ công    | ✅ Tự động                         |
| Lỗi HTTP (4xx, 5xx) | ❌ Không throw, phải tự check | ✅ Tự throw error                  |
| Timeout             | ❌ Phải tự implement          | ✅ Có sẵn                          |
| Interceptor         | ❌ Không có                   | ✅ Có — xử lý token, lỗi tập trung |
| Cancel request      | ❌ AbortController phức tạp   | ✅ Đơn giản hơn                    |

```bash
npm install axios
```

---

## Cấu hình Instance — Nền tảng của Pattern chuẩn

Thay vì gọi `axios.get(...)` trực tiếp, tạo một **instance** riêng với cấu hình chung. Đây là bước quan trọng nhất.

```
src/
└── api/
    └── axiosInstance.js   ← Cấu hình 1 lần, dùng mọi nơi
```

```js
// src/api/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com", // URL gốc — không cần lặp lại mỗi lần gọi
  timeout: 10000, // Tự hủy sau 10 giây nếu server không trả lời
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

**Lợi ích:** Đổi `baseURL` 1 chỗ → ảnh hưởng toàn bộ app. Không cần copy URL vào từng file.

---

## Interceptor — Xử lý tập trung

Interceptor là "trạm kiểm soát" — mọi request và response đều đi qua đây trước khi đến component.

### Request Interceptor — Tự động đính kèm token

```js
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
```

Không cần thêm token thủ công vào mỗi request nữa — interceptor tự làm.

### Response Interceptor — Xử lý lỗi tập trung

```js
api.interceptors.response.use(
  (response) => response, // Request thành công → trả về nguyên

  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token hết hạn → xóa token, về trang login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (status === 403) {
      // Không có quyền → thông báo
      alert("Bạn không có quyền thực hiện hành động này.");
    }

    if (status === 500) {
      // Lỗi server → thông báo chung
      alert("Lỗi server. Vui lòng thử lại sau.");
    }

    return Promise.reject(error); // Vẫn throw để component tự xử lý thêm nếu cần
  },
);
```

---

## Tách Service — Gom các API call theo nhóm

Không gọi API trực tiếp trong component. Tách riêng thành **service file** theo từng nhóm tài nguyên:

```
src/
├── api/
│   ├── axiosInstance.js
│   └── services/
│       ├── userService.js      ← Mọi API liên quan đến User
│       ├── productService.js   ← Mọi API liên quan đến Sản phẩm
│       └── authService.js      ← Đăng nhập, đăng xuất, refresh token
```

```js
// src/api/services/userService.js
import api from "../axiosInstance";

const userService = {
  // Lấy danh sách user
  getAll: (params) => api.get("/users", { params }),

  // Lấy 1 user theo id
  getById: (id) => api.get(`/users/${id}`),

  // Tạo user mới
  create: (data) => api.post("/users", data),

  // Cập nhật user
  update: (id, data) => api.put(`/users/${id}`, data),

  // Xóa user
  delete: (id) => api.delete(`/users/${id}`),
};

export default userService;
```

```js
// src/api/services/authService.js
import api from "../axiosInstance";

const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),

  logout: () => api.post("/auth/logout"),

  getProfile: () => api.get("/auth/me"),
};

export default authService;
```

---

## Dùng trong Component — Pattern chuẩn

### GET — Lấy dữ liệu

```jsx
import { useState, useEffect } from "react";
import userService from "../api/services/userService";

function DanhSachUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Tránh set state sau khi component unmount

    userService
      .getAll()
      .then((res) => {
        if (isMounted) {
          setUsers(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || "Có lỗi xảy ra");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

### POST — Gửi dữ liệu (submit form)

```jsx
function FormTaoUser() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await userService.create(form);
      alert(`Tạo thành công: ${res.data.name}`);
      setForm({ name: "", email: "" }); // Reset form
    } catch (err) {
      setError(err.response?.data?.message || "Tạo thất bại");
    } finally {
      setLoading(false); // Luôn tắt loading dù thành công hay thất bại
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Tên"
      />
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Đang tạo..." : "Tạo user"}
      </button>
    </form>
  );
}
```

---

## Tách logic vào Custom Hook

Khi cùng 1 pattern lặp lại ở nhiều nơi, tách vào custom hook:

```js
// src/hooks/useApi.js
import { useState, useEffect } from "react";

export function useApi(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiFn()
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, deps);

  return { data, loading, error };
}
```

```jsx
// Dùng lại ở mọi component — cực gọn
function DanhSachUser() {
  const { data: users, loading, error } = useApi(() => userService.getAll());

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

---

## Xử lý lỗi đúng cách

### Lấy message lỗi từ response

```js
// Lỗi từ server thường có cấu trúc
// { message: "Email đã tồn tại", code: "DUPLICATE_EMAIL" }

try {
  await userService.create(data);
} catch (err) {
  // Lấy message từ server nếu có, fallback về message mặc định
  const message = err.response?.data?.message || err.message || "Có lỗi xảy ra";

  setError(message);
}
```

### Phân biệt loại lỗi

```js
catch (err) {
  if (!err.response) {
    // Không có response → lỗi mạng, server down
    setError('Không thể kết nối server. Kiểm tra mạng.')
    return
  }

  // Có response → lỗi từ phía server
  switch (err.response.status) {
    case 400: setError('Dữ liệu không hợp lệ.'); break
    case 404: setError('Không tìm thấy.'); break
    case 422: setError(err.response.data.message); break
    default:  setError('Có lỗi xảy ra.')
  }
}
```

---

## Cấu trúc thư mục hoàn chỉnh

```
src/
├── api/
│   ├── axiosInstance.js        ← Cấu hình axios, interceptor
│   └── services/
│       ├── authService.js
│       ├── userService.js
│       └── productService.js
│
├── hooks/
│   └── useApi.js               ← Custom hook gọi API
│
└── components/ pages/ ...
```

---

## Tóm tắt

```
1. Tạo axios instance  →  axiosInstance.js
   baseURL, timeout, headers chung

2. Cấu hình interceptor
   Request  → tự đính token
   Response → xử lý 401/403/500 tập trung

3. Tách service theo nhóm
   userService, productService, authService...
   Không gọi axios trực tiếp trong component

4. Dùng trong component
   GET  → useEffect + try/catch + loading/error state
   POST → async function + try/catch + finally tắt loading

5. Tách Custom Hook
   useApi() → tái sử dụng pattern GET ở mọi nơi
```

| Nguyên tắc                                  | Lý do                                          |
| ------------------------------------------- | ---------------------------------------------- |
| Dùng instance, không dùng `axios` trực tiếp | Đổi config 1 chỗ, áp dụng toàn app             |
| Tách service file                           | Component không biết URL API, dễ đổi sau       |
| Interceptor xử lý 401                       | Không phải component nào cũng tự check token   |
| `finally` để tắt loading                    | Đảm bảo loading tắt dù thành công hay thất bại |
| `isMounted` trong useEffect                 | Tránh set state sau khi component đã unmount   |
