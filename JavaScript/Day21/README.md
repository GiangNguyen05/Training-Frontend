# JavaScript Modules — Tài Liệu Toàn Diện

## Mục lục

1. [Module là gì? Tại sao cần?](#1-module-là-gì-tại-sao-cần)
2. [Lịch sử phát triển](#2-lịch-sử-phát-triển)
3. [ES Modules — Chuẩn hiện đại](#3-es-modules--chuẩn-hiện-đại)
4. [export — Xuất ra ngoài](#4-export--xuất-ra-ngoài)
5. [import — Nhập vào](#5-import--nhập-vào)
6. [Default Export vs Named Export](#6-default-export-vs-named-export)
7. [Re-export — Barrel Files](#7-re-export--barrel-files)
8. [Dynamic Import — import()](#8-dynamic-import--import)
9. [Module trong trình duyệt](#9-module-trong-trình-duyệt)
10. [CommonJS — Node.js truyền thống](#10-commonjs--nodejs-truyền-thống)
11. [ES Modules trong Node.js](#11-es-modules-trong-nodejs)
12. [Module Scope & Đặc điểm riêng](#12-module-scope--đặc-điểm-riêng)
13. [Circular Dependencies](#13-circular-dependencies)
14. [Bundler và Module Resolution](#14-bundler-và-module-resolution)
15. [Patterns thực tế](#15-patterns-thực-tế)
16. [Pitfalls thường gặp](#16-pitfalls-thường-gặp)
17. [Bảng tra nhanh & Tổng kết](#17-bảng-tra-nhanh--tổng-kết)

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

## 7. Re-export — Barrel Files

**Re-export** là pattern xuất lại những gì đã import từ module khác — tạo ra một "cổng vào" tập trung.

### Cú pháp re-export

```js
// Cách 1: re-export named
export { add, subtract } from "./math.js";

// Cách 2: re-export tất cả
export * from "./math.js";

// Cách 3: re-export với alias
export { default as Button } from "./Button.js";
export { add as mathAdd } from "./math.js";

// Cách 4: re-export default
export { default } from "./Button.js";
```

### Barrel file pattern — index.js

Barrel file là file `index.js` tập hợp và re-export từ nhiều module con, tạo ra một public API gọn gàng.

```
src/
  components/
    Button/
      Button.jsx
      Button.test.jsx
      Button.css
    Input/
      Input.jsx
      Input.test.jsx
    Modal/
      Modal.jsx
      Modal.css
    index.js          ← barrel file
  utils/
    string.js
    date.js
    number.js
    index.js          ← barrel file
  services/
    auth.js
    api.js
    index.js          ← barrel file
```

```js
// components/index.js — barrel file
export { default as Button } from "./Button/Button.jsx";
export { default as Input } from "./Input/Input.jsx";
export { default as Modal } from "./Modal/Modal.jsx";

// utils/index.js — barrel file
export * from "./string.js";
export * from "./date.js";
export * from "./number.js";

// services/index.js — barrel file
export { default as authService } from "./auth.js";
export { default as apiService } from "./api.js";
```

```js
// Trước barrel file — import rải rác
import Button from "../../components/Button/Button.jsx";
import Input from "../../components/Input/Input.jsx";
import Modal from "../../components/Modal/Modal.jsx";

// Sau barrel file — gọn và rõ ràng
import { Button, Input, Modal } from "../../components";
import { capitalize, formatDate } from "../../utils";
```

### Cảnh báo với barrel files

Barrel files tiện lợi nhưng có thể gây **slow build** và **bloated bundles** nếu dùng `export *` không cẩn thận — bundler khó tree-shake. Trong dự án lớn, ưu tiên import trực tiếp từ file nguồn.

---

## 8. Dynamic Import — import()

**Static import** phải ở top-level và load ngay khi module được parse. **Dynamic import** là hàm `import()` trả về Promise — load module theo yêu cầu (on-demand).

### Cú pháp

```js
// Static — load ngay, luôn luôn
import { heavyFunction } from "./heavy.js";

// Dynamic — load khi cần, trả về Promise
const module = await import("./heavy.js");
module.heavyFunction();

// Destructure ngay
const { add, subtract } = await import("./math.js");

// Import default
const { default: Button } = await import("./Button.js");
```

### Use cases thực tế

**Code splitting — lazy load theo route:**

```js
// router.js
const routes = {
  "/": () => import("./pages/Home.js"),
  "/profile": () => import("./pages/Profile.js"),
  "/settings": () => import("./pages/Settings.js"),
  "/admin": () => import("./pages/Admin.js"), // heavy module
};

async function navigate(path) {
  const { default: Page } = await routes[path]();
  Page.render();
}

// Chỉ tải Admin.js khi người dùng thực sự vào /admin
```

**Load theo điều kiện:**

```js
async function processFile(file) {
  if (file.type === "application/pdf") {
    // Chỉ load thư viện PDF khi thực sự cần
    const { PDFParser } = await import("./lib/pdf-parser.js");
    return PDFParser.parse(file);
  }

  if (file.type.startsWith("image/")) {
    const { ImageProcessor } = await import("./lib/image-processor.js");
    return ImageProcessor.process(file);
  }
}
```

**Load theo môi trường:**

```js
async function loadConfig() {
  const env = process.env.NODE_ENV;

  // Load config khác nhau tuỳ environment
  const config = await import(`./config.${env}.js`);
  return config.default;
}
```

**Load polyfill chỉ khi cần:**

```js
async function initApp() {
  // Chỉ load polyfill nếu browser không hỗ trợ
  if (!window.IntersectionObserver) {
    await import("./polyfills/intersection-observer.js");
  }

  startApp();
}
```

---

## 9. Module trong trình duyệt

### Khai báo type="module"

```html
<!-- Báo browser đây là ES Module -->
<script type="module" src="./app.js"></script>

<!-- Inline module -->
<script type="module">
  import { greet } from "./utils.js";
  greet("World");
</script>
```

### Khác biệt quan trọng với script thường

```html
<!-- Script thường -->
<script src="app.js"></script>
<!-- - Load đồng bộ (block render) nếu không có async/defer
     - Global scope — var tạo ra window.varName
     - Chạy nhiều lần nếu include nhiều lần -->

<!-- Module script -->
<script type="module" src="app.js"></script>
<!-- - Tự động defer — không block render
     - Module scope — không leak ra global
     - Chỉ execute một lần dù include nhiều lần
     - Luôn strict mode
     - Hỗ trợ top-level await (ES2022) -->
```

### Top-level await

```js
// app.js — module script
// Có thể dùng await ở top-level trong module
const config = await fetch("/api/config").then((r) => r.json());
const db = await initDatabase(config.dbUrl);

console.log("App ready:", config.version);
```

### Import Maps — quản lý bare specifier trên browser

```html
<script type="importmap">
  {
    "imports": {
      "lodash": "https://cdn.skypack.dev/lodash",
      "react": "https://esm.sh/react@18",
      "react-dom/": "https://esm.sh/react-dom@18/",
      "@utils/": "/src/utils/"
    }
  }
</script>

<script type="module">
  import _ from "lodash"; // resolve từ importmap
  import React from "react";
  import { formatDate } from "@utils/date.js";
</script>
```

---

## 10. CommonJS — Node.js truyền thống

CommonJS (CJS) là hệ thống module mặc định của Node.js từ 2009. Vẫn phổ biến vì hầu hết package npm được publish dưới dạng CJS.

### Cú pháp cơ bản

```js
// math.js — CommonJS export
const PI = 3.14159;

function add(a, b) {
  return a + b;
}
function sub(a, b) {
  return a - b;
}

// Xuất ra ngoài
module.exports = { PI, add, sub };

// Hoặc export từng cái
module.exports.PI = PI;
module.exports.add = add;

// Shorthand exports
exports.multiply = (a, b) => a * b;
// Cẩn thận: exports chỉ là alias của module.exports
// Gán lại exports = {...} sẽ KHÔNG hoạt động!
```

```js
// main.js — CommonJS import
const { add, sub, PI } = require("./math.js");
const fs = require("fs"); // core module
const lodash = require("lodash"); // npm package

console.log(add(1, 2)); // 3
console.log(PI); // 3.14159
```

### Đặc điểm CommonJS

**Đồng bộ** — `require()` block thread cho đến khi load xong. Ổn với Node.js (disk I/O nhanh), không phù hợp với browser.

**Dynamic** — `require()` có thể đặt ở bất kỳ đâu, kể cả trong `if` hay function.

```js
// CJS — dynamic, có thể gọi bất kỳ đâu
function loadPlugin(name) {
  const plugin = require(`./plugins/${name}.js`); // dynamic!
  return plugin;
}
```

**Copy value** — CJS export là bản copy, không phải live binding như ESM.

```js
// counter.js (CJS)
let count = 0;
function increment() {
  count++;
}
module.exports = { count, increment };

// main.js
const { count, increment } = require("./counter.js");
console.log(count); // 0
increment();
console.log(count); // vẫn 0! — đây là bản copy, không phải live binding
```

---

## 11. ES Modules trong Node.js

Node.js hỗ trợ ESM từ v12 (experimental) và ổn định từ v14+.

### Cách bật ESM trong Node.js

**Cách 1: Đổi extension thành `.mjs`**

```
math.mjs    ← ES Module
utils.mjs
app.mjs
```

**Cách 2: Thêm `"type": "module"` vào package.json (khuyến nghị)**

```json
{
  "name": "my-project",
  "type": "module",
  "version": "1.0.0"
}
```

Sau đó tất cả `.js` file trong project đều được treat là ESM.

**Cách 3: Dùng `.cjs` cho file nào cần CommonJS**

```
app.js       ← ESM (vì "type": "module")
legacy.cjs   ← CJS (override bằng extension)
```

### ESM trong Node — lưu ý quan trọng

```js
// ✅ Phải có extension đầy đủ — Node không tự thêm .js
import { add } from "./math.js"; // đúng
import { add } from "./math"; // sai — lỗi trong Node ESM

// ✅ __dirname và __filename không có trong ESM
// Phải tạo thủ công
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ import.meta — metadata của module
console.log(import.meta.url); // file:///home/user/app.js
console.log(import.meta.dirname); // /home/user (Node 21.2+)
```

### Interop CJS ↔ ESM

```js
// ESM import từ CJS package
import lodash from "lodash"; // default import — lấy module.exports
import { map, filter } from "lodash"; // có thể không hoạt động với mọi CJS

// CJS require ESM — KHÔNG được! CJS không thể require ESM
// Phải dùng dynamic import
async function loadESM() {
  const { something } = await import("./esm-module.js");
}
```

---

## 12. Module Scope & Đặc điểm riêng

### Scope độc lập

Mỗi module có scope riêng. Khai báo trong module không leak ra global.

```js
// module-a.js
const secret = "chỉ tồn tại trong module này";
let counter = 0;
// window.secret === undefined — không leak!

// module-b.js
const secret = "tôi cũng có biến tên secret — không conflict";
```

### Singleton pattern tự nhiên

Module chỉ được evaluate một lần. Rất hữu ích để tạo shared state.

```js
// store.js
const state = {
  user: null,
  theme: "light",
  notifications: [],
};

export function getState() {
  return { ...state };
}
export function setState(partial) {
  Object.assign(state, partial);
}
export function subscribe(fn) {
  // simplified observer
  const original = setState;
  // ...
}
```

```js
// Bất kỳ file nào import store.js đều dùng CÙNG state object
import { getState, setState } from "./store.js";

setState({ user: { name: "An" } });
console.log(getState().user); // { name: "An" }
```

### Strict mode tự động

Module luôn chạy trong strict mode — không cần khai báo `"use strict"`.

```js
// module.js — strict mode tự động
x = 5; // ReferenceError — không có var/let/const
delete Object.prototype; // TypeError
arguments.caller; // TypeError
```

### import.meta

Object chứa metadata của module hiện tại.

```js
// app.js
console.log(import.meta.url);
// "file:///home/user/project/app.js" (Node)
// "http://localhost:3000/app.js" (Browser)

// Pattern phổ biến để detect môi trường
const isDev = import.meta.env?.DEV; // Vite
const isProd = import.meta.env?.PROD; // Vite
const mode = import.meta.env?.MODE; // Vite

// Vitest — chạy test nếu là entry point
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test("add", () => expect(add(1, 2)).toBe(3));
}
```

---

## 13. Circular Dependencies

**Circular dependency** xảy ra khi module A import module B, và B lại import A. Đây là một trong những vấn đề phức tạp nhất khi làm việc với modules.

```
a.js → import từ b.js
b.js → import từ a.js   ← circular!
```

### Ví dụ và hệ quả

```js
// a.js
import { b } from "./b.js";
export const a = "value-a";
console.log("a sees b:", b); // có thể là undefined!

// b.js
import { a } from "./a.js";
export const b = "value-b";
console.log("b sees a:", a); // có thể là undefined!
```

Vì ESM live binding, circular dependency không crash ngay nhưng có thể trả về `undefined` nếu module chưa được khởi tạo xong khi được tham chiếu.

### Cách xử lý

**Cách 1: Tách shared code ra module thứ ba**

```js
// shared.js — không import từ a hay b
export const SHARED_CONSTANT = "abc";
export function sharedHelper() { ... }

// a.js
import { SHARED_CONSTANT } from "./shared.js";  // không còn circular

// b.js
import { SHARED_CONSTANT } from "./shared.js";
```

**Cách 2: Dùng dynamic import để defer**

```js
// a.js
export async function doSomething() {
  const { b } = await import("./b.js"); // load sau, không circular
  return b();
}
```

**Cách 3: Dependency Injection**

```js
// Thay vì import trực tiếp, nhận dependency qua tham số
// a.js
export function createA(bInstance) {
  return { run: () => bInstance.help() };
}

// main.js — kết nối ở ngoài
import { createB } from "./b.js";
import { createA } from "./a.js";
const b = createB();
const a = createA(b); // inject b vào a
```

---

## 14. Bundler và Module Resolution

Trong môi trường production, code thường đi qua **bundler** (Webpack, Rollup, Vite, esbuild) để tối ưu. Hiểu bundler giúp bạn viết module hiệu quả hơn.

### Tree Shaking

Bundler phân tích static import để loại bỏ code không dùng.

```js
// math.js
export function add(a, b)         { return a + b; }   // DÙNG
export function subtract(a, b)    { return a - b; }   // DÙNG
export function obscureFormula(x) { ... }             // KHÔNG DÙNG

// main.js
import { add, subtract } from "./math.js";
// obscureFormula sẽ bị loại khỏi bundle cuối!
```

Tree shaking **không hoạt động** khi:

```js
// ❌ Import * ngăn tree shaking
import * as Math from "./math.js";
Math.add(1, 2);

// ❌ CJS không tree-shakeable
const { add } = require("./math.js");

// ❌ Side effects trong module level
console.log("side effect!"); // bundler không dám bỏ
```

Khai báo `sideEffects` trong package.json để giúp bundler:

```json
{
  "sideEffects": false,
  "sideEffects": ["./src/styles.css", "./src/polyfills.js"]
}
```

### Module Resolution Algorithm

```js
// Vite / Node.js resolve theo thứ tự:
import { x } from "./utils";

// 1. ./utils (exact) → không tồn tại
// 2. ./utils.js      → tìm thấy → dùng
// 3. ./utils.ts      → (nếu có TypeScript)
// 4. ./utils/index.js
// 5. Lỗi: Cannot find module

// Bare specifier
import _ from "lodash";
// → tìm trong node_modules/lodash
// → đọc package.json: "main", "module", "exports"
// → resolve file entry point
```

### Vite — Path Alias

```js
// vite.config.js
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
});

// Giờ có thể dùng:
import { Button } from "@components"; // thay vì ../../components
import { formatDate } from "@utils"; // thay vì ../../../utils
```

---

## 15. Patterns thực tế

### Pattern 1: Service Module

```js
// services/UserService.js
const BASE = "https://api.example.com";

async function request(method, path, data) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const userService = {
  getAll: () => request("GET", "/users"),
  getById: (id) => request("GET", `/users/${id}`),
  create: (data) => request("POST", "/users", data),
  update: (id, d) => request("PUT", `/users/${id}`, d),
  delete: (id) => request("DELETE", `/users/${id}`),
};
```

### Pattern 2: Constants Module

```js
// constants/index.js
export const APP_NAME = "MyApp";
export const VERSION = "2.0.0";

export const ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest",
});

export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
});

export const ROUTES = Object.freeze({
  HOME: "/",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  ADMIN: "/admin",
});
```

### Pattern 3: Utility Module

```js
// utils/string.js
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export const truncate = (str, n) =>
  str.length > n ? str.slice(0, n) + "…" : str;
export const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
export const stripHtml = (str) => str.replace(/<[^>]*>/g, "");
export const countWords = (str) => str.trim().split(/\s+/).length;

// utils/date.js
export const formatDate = (d, locale = "vi-VN") =>
  new Date(d).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const units = [
    [31536000, "năm"],
    [2592000, "tháng"],
    [86400, "ngày"],
    [3600, "giờ"],
    [60, "phút"],
    [1, "giây"],
  ];
  for (const [div, unit] of units) {
    const val = Math.floor(seconds / div);
    if (val >= 1) return `${val} ${unit} trước`;
  }
  return "vừa xong";
};
```

### Pattern 4: Plugin / Registry Module

```js
// plugins/registry.js
const plugins = new Map();

export function register(name, plugin) {
  if (plugins.has(name)) {
    console.warn(`Plugin "${name}" đã tồn tại, sẽ bị ghi đè`);
  }
  plugins.set(name, plugin);
}

export function get(name) {
  if (!plugins.has(name)) throw new Error(`Plugin "${name}" chưa được đăng ký`);
  return plugins.get(name);
}

export function getAll() {
  return Object.fromEntries(plugins);
}
export function has(name) {
  return plugins.has(name);
}
export function unregister(name) {
  plugins.delete(name);
}
```

### Pattern 5: Feature Flag Module

```js
// features.js
const flags = {
  NEW_DASHBOARD: import.meta.env.VITE_FF_NEW_DASHBOARD === "true",
  DARK_MODE: import.meta.env.VITE_FF_DARK_MODE !== "false", // default on
  BETA_EDITOR: import.meta.env.VITE_FF_BETA_EDITOR === "true",
};

export const isEnabled = (flag) => flags[flag] ?? false;
export const withFeature = (flag, fn) => (isEnabled(flag) ? fn() : null);
```

---

## 16. Pitfalls thường gặp

### Pitfall 1: Quên extension trong Node.js ESM

```js
// ❌ Sẽ lỗi trong Node.js ESM
import { add } from "./math";

// ✅ Phải có extension
import { add } from "./math.js";
```

### Pitfall 2: Gán lại exports trong CJS

```js
// ❌ Không hoạt động — gán lại exports biến mất
exports = { add, sub }; // exports không còn link với module.exports

// ✅ Đúng
module.exports = { add, sub };
```

### Pitfall 3: Nhầm lẫn default export khi re-export

```js
// ❌ Không re-export được default như này
export * from "./Button.js"; // * không bao gồm default export!

// ✅ Phải explicit
export { default as Button } from "./Button.js";
// hoặc
export { default } from "./Button.js";
```

### Pitfall 4: Dùng import() không xử lý lỗi

```js
// ❌ Network lỗi → unhandled rejection
const module = await import("./heavy.js");

// ✅ Luôn xử lý lỗi
try {
  const module = await import("./heavy.js");
} catch (err) {
  console.error("Không tải được module:", err);
  // hiện fallback UI
}
```

### Pitfall 5: Barrel file gây bundle bloat

```js
// ❌ Import 1 function nhưng load cả thư viện
import { formatDate } from "@utils"; // barrel import * from date, string, number...

// ✅ Import trực tiếp khi quan tâm bundle size
import { formatDate } from "@utils/date.js";
```

### Pitfall 6: Circular dependency ngầm

```
// Dấu hiệu: giá trị import là undefined khi runtime
// Cách debug:
console.log("module A loading...");
import { b } from "./b.js";
console.log("b is:", b); // nếu undefined → circular!
```

---

## 17. Bảng tra nhanh & Tổng kết

### Cú pháp ESM — tổng hợp

```js
// ── EXPORT ──────────────────────────────────────────
export const x = 1;                   // named export inline
export function fn() {}               // named export function
export class Cls {}                   // named export class
export { a, b, c };                   // named export list
export { a as alpha, b as beta };     // named export với alias
export default expression;            // default export
export default function() {}          // default export function
export { x } from "./other.js";       // re-export named
export { default } from "./other.js"; // re-export default
export * from "./other.js";           // re-export tất cả named
export * as ns from "./other.js";     // re-export vào namespace

// ── IMPORT ──────────────────────────────────────────
import defaultExport from "./m.js";          // import default
import { a, b } from "./m.js";               // import named
import { a as alpha } from "./m.js";         // import với alias
import defaultExport, { a, b } from "./m.js";// import cả hai
import * as ns from "./m.js";                // import namespace
import "./m.js";                             // side-effect only

// ── DYNAMIC ─────────────────────────────────────────
const mod = await import("./m.js");          // dynamic import
```

### So sánh ESM vs CJS

| Tiêu chí        | ES Modules                   | CommonJS                        |
| --------------- | ---------------------------- | ------------------------------- |
| Cú pháp         | `import/export`              | `require/module.exports`        |
| Thực thi        | Bất đồng bộ                  | Đồng bộ                         |
| Phân tích       | Static (build time)          | Dynamic (runtime)               |
| Binding         | Live binding                 | Copy value                      |
| Tree shaking    | ✅ Tốt                       | ❌ Khó                          |
| Browser native  | ✅                           | ❌ (cần bundler)                |
| Top-level await | ✅                           | ❌                              |
| `__dirname`     | ❌ (dùng import.meta)        | ✅                              |
| Dùng khi        | Code mới, frontend, Node 14+ | Node.js legacy, npm packages cũ |

### Checklist khi thiết kế module

- [ ] Mỗi module có **trách nhiệm rõ ràng** — Single Responsibility
- [ ] Export **interface tối giản** — chỉ những gì cần thiết
- [ ] Dùng **named export** cho utilities, **default export** cho component
- [ ] Tránh **side effects** ở module level
- [ ] Kiểm tra **circular dependencies** khi gặp `undefined` lạ
- [ ] Dùng **dynamic import** cho code path ít dùng
- [ ] Thêm extension `.js` khi dùng Node.js ESM
- [ ] Khai báo `sideEffects` trong package.json nếu publish npm

### Kết luận

Module là nền tảng của mọi JavaScript application hiện đại. Nắm vững modules nghĩa là:

- Viết code **có tổ chức**, dễ maintain
- Tối ưu **bundle size** thông qua tree shaking và code splitting
- Tránh được vô số **bug ngầm** do scope conflict và circular dependency
- Làm việc hiệu quả với mọi **framework và toolchain** hiện đại
