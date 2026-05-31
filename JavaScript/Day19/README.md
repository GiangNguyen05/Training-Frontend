# JavaScript Modules

## Mục lục

1. [Module là gì? Tại sao cần?](#1-module-là-gì-tại-sao-cần)
2. [Lịch sử phát triển](#2-lịch-sử-phát-triển)
3. [ES Modules — Chuẩn hiện đại](#3-es-modules--chuẩn-hiện-đại)
4. [export — Xuất ra ngoài](#4-export--xuất-ra-ngoài)
5. [import — Nhập vào](#5-import--nhập-vào)
6. [Default Export vs Named Export](#6-default-export-vs-named-export)

---

## 1. Module là gì? Tại sao cần?

**Module** là một file JavaScript độc lập — có **scope riêng**, chủ động **chọn những gì muốn chia sẻ** ra ngoài (`export`) và **những gì muốn dùng** từ bên ngoài (`import`).

### Vấn đề trước khi có modules

```html
<!-- index.html — thời kỳ "dark ages" -->
<script src="utils.js"></script>
<script src="api.js"></script>
<script src="user.js"></script>
<script src="app.js"></script>
```

```js
// utils.js
var helper = "tôi là global"; // ô nhiễm global scope

// api.js
var helper = "tôi ghi đè helper!"; // conflict không hay biết

// user.js — phụ thuộc vào thứ tự load script
// nếu utils.js chưa load xong → crash
```

Hệ quả của việc không có modules:

- **Global scope bị ô nhiễm** — mọi `var` đều là global, dễ conflict tên biến.
- **Phụ thuộc thứ tự** — script A phải load trước script B, dễ gây lỗi ngầm.
- **Không có private** — mọi thứ đều public, không đóng gói được.
- **Khó maintain** — codebase lớn lên, không biết ai dùng gì từ đâu.

### Sau khi có modules

```js
// Mỗi file là một module — scope độc lập
// Khai báo rõ ràng: tôi cần gì, tôi cung cấp gì

import { fetchUser } from "./api.js";
import { formatDate } from "./utils.js";

export function renderProfile(userId) { ... }
```

---

## 2. Lịch sử phát triển

| Thời kỳ | Giải pháp                               | Đặc điểm                                   |
| ------- | --------------------------------------- | ------------------------------------------ |
| 2000s   | Script tags + Global variables          | Thủ công, dễ conflict                      |
| 2009    | **CommonJS** (`require/module.exports`) | Node.js, đồng bộ, không chạy trên browser  |
| 2011    | **AMD** (`define/require`)              | Browser, bất đồng bộ, cú pháp xấu          |
| 2012    | **UMD**                                 | Chạy được cả hai môi trường                |
| 2015    | **ES Modules** (`import/export`)        | Chuẩn native, bất đồng bộ, static analysis |
| 2017+   | ES Modules trong Node.js                | `.mjs` hoặc `"type": "module"`             |

Hiện tại (2024+): **ES Modules là chuẩn duy nhất cần quan tâm** cho code mới. CommonJS vẫn tồn tại nhiều trong hệ sinh thái Node.js.

---

## 3. ES Modules — Chuẩn hiện đại

ES Modules (ESM) là hệ thống module chính thức của JavaScript, được định nghĩa trong ES2015 (ES6).

### Đặc điểm cốt lõi

**Static** — `import`/`export` phải ở top-level, không trong `if` hay function. Điều này giúp bundler phân tích dependency graph tại build time (tree-shaking).

```js
// ✅ Đúng — top-level
import { add } from "./math.js";

// ❌ Sai — không được đặt trong block
if (condition) {
  import { add } from "./math.js"; // SyntaxError
}
```

**Bất đồng bộ** — Module được load bất đồng bộ, không block render.

**Singleton** — Mỗi module chỉ được evaluate **một lần** dù được import nhiều nơi. Mọi nơi import cùng một module đều nhận cùng một instance.

```js
// counter.js
export let count = 0;
export function increment() {
  count++;
}

// a.js
import { increment, count } from "./counter.js";
increment();
console.log(count); // 1

// b.js
import { count } from "./counter.js"; // CÙNG module instance
console.log(count); // 1 — không phải 0!
```

**Live bindings** — Named exports là tham chiếu sống (live binding), không phải copy giá trị.

```js
// math.js
export let x = 1;
export function doubleX() {
  x *= 2;
}

// main.js
import { x, doubleX } from "./math.js";
console.log(x); // 1
doubleX();
console.log(x); // 2 — x tự động cập nhật!
```

---

## 4. export — Xuất ra ngoài

### 4.1 Named Export — xuất có tên

```js
// math.js

// Cách 1: export ngay khi khai báo
export const PI = 3.14159;
export let count = 0;

export function add(a, b) {
  return a + b;
}
export function subtract(a, b) {
  return a - b;
}

export class Calculator {
  multiply(a, b) {
    return a * b;
  }
}

// Cách 2: export ở cuối file (thường dùng hơn — dễ thấy tổng quan)
const PI = 3.14159;
const E = 2.71828;
function add(a, b) {
  return a + b;
}
function mul(a, b) {
  return a * b;
}

export { PI, E, add, mul };

// Cách 3: export với alias (đổi tên)
export { add as sum, mul as product };
```

### 4.2 Default Export — xuất mặc định

Mỗi module chỉ có **tối đa một** default export.

```js
// Button.js
export default function Button({ label, onClick }) {
  return `<button onclick="${onClick}">${label}</button>`;
}

// UserService.js
class UserService {
  async getUser(id)    { ... }
  async createUser(data) { ... }
}
export default new UserService(); // export singleton instance

// config.js
export default {
  apiUrl:  "https://api.example.com",
  timeout: 5000,
  version: "1.0.0",
};
```

### 4.3 Export kết hợp

```js
// api.js — vừa có default vừa có named
export const BASE_URL = "https://api.example.com";
export const TIMEOUT  = 5000;

export async function get(endpoint)       { ... }
export async function post(endpoint, data) { ... }

export default class ApiClient {
  constructor(baseUrl) { this.baseUrl = baseUrl; }
  async request(method, path, data) { ... }
}
```

---

## 5. import — Nhập vào

### 5.1 Import named exports

```js
// Import cụ thể — tree-shakeable, rõ ràng nhất
import { add, subtract, PI } from "./math.js";

// Import với alias — tránh conflict tên
import { add as mathAdd, PI as MathPI } from "./math.js";

// Import tất cả vào namespace (dùng khi cần nhiều thứ)
import * as Math from "./math.js";
Math.add(1, 2);
Math.PI;
```

### 5.2 Import default export

```js
// Tên do người import tự đặt — không cần khớp với tên gốc
import Button from "./Button.js";
import MyButton from "./Button.js"; // cũng được
import ApiClient from "./api.js";
```

### 5.3 Import kết hợp default + named

```js
import ApiClient, { BASE_URL, TIMEOUT, get, post } from "./api.js";
//     ↑ default                ↑ named exports
```

### 5.4 Side-effect import — chỉ chạy module, không lấy gì

```js
// Dùng để: polyfill, global setup, CSS injection, plugin registration
import "./polyfills.js";
import "./styles.css"; // với bundler hỗ trợ
import "./setup-dayjs.js";
```

### 5.5 Quy tắc đường dẫn

```js
// Relative path — bắt đầu bằng . hoặc ..
import { helper } from "./utils.js"; // cùng thư mục
import { config } from "../config.js"; // thư mục cha
import { db } from "../../lib/db.js"; // lên 2 cấp

// Bare specifier — package từ node_modules (cần bundler hoặc import map)
import React from "react";
import { useState } from "react";
import _ from "lodash";

// URL tuyệt đối — dùng trực tiếp trên browser (CDN)
import { html } from "https://cdn.jsdelivr.net/gh/lit/dist/lit.js";
```

---

## 6. Default Export vs Named Export

Đây là một trong những quyết định quan trọng nhất khi thiết kế module API.

### So sánh chi tiết

```js
// ===== NAMED EXPORT =====
// math.js
export function add(a, b) { return a + b; }
export function sub(a, b) { return a - b; }
export const PI = 3.14159;

// Khi import — phải dùng đúng tên
import { add, PI } from "./math.js";

// Có thể rename
import { add as mathAdd } from "./math.js";

// IDE autocomplete hoạt động tốt — biết chính xác tên
// Tree-shaking hiệu quả — chỉ bundle những gì dùng
// Dễ refactor — rename sẽ báo lỗi khắp nơi dùng nó


// ===== DEFAULT EXPORT =====
// Button.js
export default function Button() { ... }

// Khi import — tự đặt tên tuỳ ý
import Button   from "./Button.js";
import Btn      from "./Button.js"; // cũng đúng, nhưng gây nhầm lẫn
import Whatever from "./Button.js"; // valid nhưng tệ

// Dễ gây inconsistency tên trong codebase
// Khó rename/refactor — không có "ràng buộc" tên
```

### Khi nào dùng cái nào?

**Dùng Named Export khi:**

- Module export nhiều thứ (utility functions, constants, types)
- Muốn IDE hỗ trợ autocomplete tốt
- Muốn tree-shaking hiệu quả
- Thư viện / shared code

```js
// ✅ Named export phù hợp
// utils/string.js
export function capitalize(str)      { ... }
export function truncate(str, len)   { ... }
export function slugify(str)         { ... }
export function stripHtml(str)       { ... }
```

**Dùng Default Export khi:**

- Module đại diện cho một thứ duy nhất (một component, một class, một service)
- Convention của framework (React component, Vue SFC, Angular module)

```js
// ✅ Default export phù hợp
// components/UserCard.jsx
export default function UserCard({ user }) { ... }

// services/AuthService.js
export default class AuthService { ... }
```

**Best practice thực tế:** Nhiều team và linter (Airbnb style guide) khuyến nghị **ưu tiên named export** để tránh tên không nhất quán. Default export chỉ dùng cho React components theo convention.

---
