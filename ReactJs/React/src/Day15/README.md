# Form nâng cao — Validation

## Vấn đề với form thủ công

Khi tự viết validation bằng tay, code cồng kềnh:

```jsx
// ❌ Tự viết validation — rối, dài, dễ bỏ sót
const [ten, setTen] = useState("");
const [email, setEmail] = useState("");
const [loiTen, setLoiTen] = useState("");
const [loiEmail, setLoiEmail] = useState("");

function validate() {
  let hop_le = true;
  if (!ten) {
    setLoiTen("Vui lòng nhập tên");
    hop_le = false;
  }
  if (!email) {
    setLoiEmail("Vui lòng nhập email");
    hop_le = false;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    setLoiEmail("Email không hợp lệ");
    hop_le = false;
  }
  return hop_le;
}
// Thêm 5 trường nữa → code nhân lên 5 lần...
```

**React Hook Form** giải quyết bài toán này — ít code hơn, nhiều tính năng hơn.

```bash
npm install react-hook-form
```

## Khái niệm cốt lõi React Hook Form

### register

Kết nối input với form — thay cho `value` + `onChange` thủ công.

```jsx
<input {...register("ten")} />
// Tương đương với: value={ten} onChange={e => setTen(e.target.value)}
// Nhưng React Hook Form tự quản lý — không cần useState
```

### handleSubmit

Bọc hàm submit — tự validate trước khi gọi hàm của bạn.

```jsx
<form onSubmit={handleSubmit(onSubmit)}>
// Chỉ gọi onSubmit khi form hợp lệ — không hợp lệ thì hiển thị lỗi
```

### formState.errors

Object chứa tất cả lỗi — tự động cập nhật khi validate.

```jsx
{
  errors.ten && <p>{errors.ten.message}</p>;
}
```

### watch

Theo dõi giá trị của 1 field — dùng khi cần so sánh (ví dụ xác nhận mật khẩu).

```jsx
const matKhau = watch("matKhau"); // Lấy giá trị matKhau để so sánh
```

## Cú pháp cơ bản

```jsx
import { useForm } from "react-hook-form";

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    console.log(data); // { ten: 'Giang', email: '...' }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("ten", {
          required: "Vui lòng nhập tên",
          minLength: { value: 2, message: "Tối thiểu 2 ký tự" },
        })}
        placeholder="Họ tên"
      />
      {errors.ten && <p>{errors.ten.message}</p>}

      <button type="submit">Gửi</button>
    </form>
  );
}
```

## Các quy tắc validation

### required — Bắt buộc nhập

```jsx
{...register('ten', { required: 'Vui lòng nhập tên' })}
```

### minLength / maxLength — Độ dài

```jsx
{...register('matKhau', {
  required: 'Bắt buộc',
  minLength: { value: 6,   message: 'Tối thiểu 6 ký tự' },
  maxLength: { value: 20,  message: 'Tối đa 20 ký tự'   },
})}
```

### pattern — Định dạng bằng Regex

```jsx
{...register('email', {
  required: 'Vui lòng nhập email',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Email không hợp lệ'
  }
})}
```

### min / max — Giá trị số

```jsx
{...register('tuoi', {
  required: 'Bắt buộc',
  min: { value: 18, message: 'Phải đủ 18 tuổi' },
  max: { value: 99, message: 'Tuổi không hợp lệ' },
})}
```

### validate — Kiểm tra tùy chỉnh

```jsx
// Validate đơn giản
{...register('ten', {
  validate: value => value.trim() !== '' || 'Không được chỉ có khoảng trắng'
})}

// Validate bất đồng bộ — kiểm tra email đã tồn tại chưa
{...register('email', {
  validate: async value => {
    const res = await checkEmailExist(value)
    return !res.exists || 'Email đã được sử dụng'
  }
})}
```

### Xác nhận mật khẩu — dùng watch

```jsx
const { register, handleSubmit, watch, formState: { errors } } = useForm()
const matKhau = watch('matKhau')  // Theo dõi giá trị matKhau

{...register('xacNhan', {
  required: 'Bắt buộc',
  validate: value => value === matKhau || 'Mật khẩu không khớp'
})}
```

## Các tính năng quan trọng khác

### mode — Khi nào validate

```jsx
useForm({ mode: "onSubmit" }); // Mặc định — validate khi submit
useForm({ mode: "onBlur" }); // Validate khi rời khỏi field
useForm({ mode: "onChange" }); // Validate ngay khi gõ
useForm({ mode: "all" }); // Kết hợp onBlur và onChange
```

### defaultValues — Giá trị mặc định

```jsx
// Dùng khi edit form (đổ dữ liệu cũ vào)
useForm({
  defaultValues: {
    ten: "Nguyen Van Giang",
    email: "giang@example.com",
  },
});
```

### reset — Xóa trắng form sau khi submit

```jsx
const { register, handleSubmit, reset } = useForm()

function onSubmit(data) {
  await apiCall(data)
  reset()   // Reset toàn bộ về defaultValues
}
```

### setError — Thêm lỗi thủ công từ server

```jsx
const { setError } = useForm();

try {
  await api.post("/users", data);
} catch (err) {
  // Lỗi từ server (ví dụ email đã tồn tại) → hiển thị lỗi đúng field
  setError("email", {
    type: "server",
    message: err.response.data.message,
  });
}
```

### isSubmitting — Trạng thái đang submit

```jsx
const { formState: { errors, isSubmitting } } = useForm()

<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Đang gửi...' : 'Gửi'}
</button>
```

## Kết hợp với Yup — Validation schema

Khi form có nhiều field, viết validation trực tiếp trong `register` sẽ dài. **Yup** cho phép định nghĩa schema riêng, tách biệt khỏi JSX.

```bash
npm install yup @hookform/resolvers
```

```jsx
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Định nghĩa toàn bộ validation ở 1 chỗ
const schema = yup.object({
  ten: yup.string().required("Vui lòng nhập tên").min(2, "Tối thiểu 2 ký tự"),
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  matKhau: yup.string().required("Bắt buộc").min(6, "Tối thiểu 6 ký tự"),
  xacNhan: yup.string().oneOf([yup.ref("matKhau")], "Mật khẩu không khớp"),
  tuoi: yup.number().min(18, "Phải đủ 18 tuổi").required("Bắt buộc"),
});

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // Gắn schema vào form
  });

  // Trong JSX — register chỉ cần tên field, không cần rules
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("ten")} />
      {errors.ten && <p>{errors.ten.message}</p>}

      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}
    </form>
  );
}
```

**React Hook Form + Yup** là pattern được dùng phổ biến nhất trong dự án thực tế.

## Khi nào dùng cái nào

```
Form đơn giản 1-2 field   →  useState thủ công — không cần thư viện
Form 3+ field, có validate →  React Hook Form
Validation phức tạp, nhiều field →  React Hook Form + Yup
```

## Tóm tắt

```
useForm()               →  Khởi tạo form
register('tên', rules)  →  Kết nối input + khai báo validation
handleSubmit(fn)        →  Validate trước khi gọi fn
errors.tenField         →  Lỗi của từng field
watch('tenField')       →  Theo dõi giá trị field — dùng khi cần so sánh
reset()                 →  Xóa trắng form
setError('field', {...})→  Gắn lỗi từ server vào đúng field
isSubmitting            →  Đang gửi hay chưa — disable nút
```

| Rule                    | Dùng cho                            |
| ----------------------- | ----------------------------------- |
| `required`              | Bắt buộc nhập                       |
| `minLength / maxLength` | Độ dài chuỗi                        |
| `min / max`             | Giá trị số                          |
| `pattern`               | Định dạng Regex                     |
| `validate`              | Logic tùy chỉnh hoặc async          |
| Yup `oneOf([ref()])`    | So sánh 2 field (xác nhận mật khẩu) |
