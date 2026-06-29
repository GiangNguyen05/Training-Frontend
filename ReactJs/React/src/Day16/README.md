# Demo FormLogin

## Tổng quan

Ví dụ này xây dựng một Login Form sử dụng:

- React
- React Hook Form
- Zod Validation
- @hookform/resolvers

Mục tiêu:

- Tách UI và logic
- Validate form
- Xử lý lỗi từ API
- Loading state
- Disable button
- Show / Hide password

## Cấu trúc project

```
src

│
├── components
│ │
│ ├── LoginForm.jsx
│ └── LoginInput.jsx
│
│
├── hooks
│ │
│ └── useLogin.js
│
│
├── schema
│ │
│ └── login.schema.js
│
│
├── services
│ │
│ └── auth.service.js
│
│
└── styles
│
└── login.css
```

### Ý nghĩa

```
components

- Chứa phần giao diện.
```

```
hooks

- Chứa logic xử lý.
```

```
schema

- Chứa rule validation.

    + Email phải đúng format.

    + Password tối thiểu 6 ký tự.
```

```
services

- Chứa API.

login()
register()
logout()
```

```
styles

- Chứa CSS.
```

## Cài đặt

```
npm install react-hook-form

npm install zod

npm install @hookform/resolvers
```

## Luồng hoạt động

```
User nhập dữ liệu

        |
        v
LoginForm.jsx
        |
        v
useLogin.js
        |
        +------ React Hook Form
        |
        v
Zod Schema
        |
        +------ Sai
        |
        v
Hiển thị errors
        |
        v
Submit
        |
        v
auth.service.js
        |
        v
Backend API
```

## login.schema.js

Code:

```javascript
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),

  password: z.string().min(6, "Password tối thiểu 6 ký tự"),
});
```
