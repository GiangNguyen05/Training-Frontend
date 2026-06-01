# Javascript modules (P2)

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
