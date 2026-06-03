# Trainning JS (NPM Ecosystem, Package.json & Vite)

## Mục lục

1. [NPM là gì?](#1-npm-là-gì)
2. [Cài đặt Node.js và NPM](#2-cài-đặt-nodejs-và-npm)
3. [Package là gì? Thư viện là gì?](#3-package-là-gì-thư-viện-là-gì)
4. [Các lệnh NPM cơ bản](#4-các-lệnh-npm-cơ-bản)
5. [Hiểu file package.json](#5-hiểu-file-packagejson)
6. [node_modules và .gitignore](#6-node_modules-và-gitignore)
7. [Dependencies vs DevDependencies](#7-dependencies-vs-devdependencies)
8. [Vite là gì? Tại sao dùng Vite?](#8-vite-là-gì-tại-sao-dùng-vite)
9. [Tạo project với Vite](#9-tạo-project-với-vite)
10. [Làm việc hàng ngày với Vite](#10-làm-việc-hàng-ngày-với-vite)
11. [Những lỗi thường gặp](#11-những-lỗi-thường-gặp)
12. [Bảng tra lệnh nhanh](#12-bảng-tra-lệnh-nhanh)

---

## 1. NPM là gì?

**NPM** viết tắt của **Node Package Manager** — hiểu đơn giản là một **kho ứng dụng khổng lồ dành cho lập trình viên JavaScript**.

### Ba thứ cùng tên "npm"

| Cái                | Là gì                                                      |
| ------------------ | ---------------------------------------------------------- |
| **npmjs.com**      | Website — kho chứa 2 triệu+ package                        |
| **npm (phần mềm)** | Công cụ dòng lệnh — dùng để cài/xoá package                |
| **npm (tổ chức)**  | Công ty vận hành hệ sinh thái này (thuộc GitHub/Microsoft) |

---

## 2. Cài đặt Node.js và NPM

NPM đi kèm với **Node.js** — bạn cài Node.js là có luôn npm.

### Bước 1: Tải Node.js

Truy cập **https://nodejs.org** và tải phiên bản **LTS** (Long Term Support — phiên bản ổn định, khuyến nghị dùng).

> **LTS** là phiên bản được hỗ trợ lâu dài, phù hợp cho công việc thực tế. Tránh chọn "Current" — dễ gặp lỗi với thư viện cũ.

### Bước 2: Kiểm tra đã cài thành công

Mở **Terminal** (macOS/Linux) hoặc **Command Prompt / PowerShell** (Windows) và gõ:

```bash
node --version
# Kết quả ví dụ: v20.11.0

npm --version
# Kết quả ví dụ: 10.2.4
```

Nếu thấy số phiên bản hiện ra → cài thành công.

### Mở Terminal ở đâu?

| Hệ điều hành | Cách mở                                      |
| ------------ | -------------------------------------------- |
| **Windows**  | Nhấn `Win + R` → gõ `cmd` → Enter            |
| **macOS**    | `Cmd + Space` → gõ "Terminal" → Enter        |
| **VS Code**  | Menu `Terminal` → `New Terminal` (tiện nhất) |

---

## 3. Package là gì? Thư viện là gì?

**Package** (gói) là một bộ code đã được người khác viết sẵn, đóng gói lại, và chia sẻ lên NPM để mọi người tải về dùng.

**Thư viện (library)** là tên gọi khác của package — nhấn mạnh vào chức năng "cung cấp các hàm tiện ích".

### Ví dụ thực tế

Bạn muốn hiển thị ngày tháng theo định dạng "3 giờ trước", "hôm qua"... Bạn có hai lựa chọn:

**Tự viết (mất 2–3 giờ, dễ có bug):**

```js
function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date) / 1000);
  // ... 50 dòng code xử lý phức tạp
}
```

**Dùng package `dayjs` (mất 30 giây):**

```bash
npm install dayjs
```

```js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

dayjs("2024-01-01").fromNow(); // "3 tháng trước"
```

---

## 4. Các lệnh NPM cơ bản

> **Lưu ý:** Tất cả lệnh npm phải chạy trong thư mục chứa project (có file `package.json`).

### Cài package

```bash
# Cài một package
npm install ten-package

# Ví dụ thực tế
npm install dayjs
npm install axios
npm install lodash
```

**Viết tắt:** `npm install` = `npm i`

```bash
npm i dayjs        # tương đương npm install dayjs
```

### Cài nhiều package cùng lúc

```bash
npm install react react-dom react-router-dom
```

### Gỡ package

```bash
npm uninstall ten-package

# Ví dụ
npm uninstall lodash
```

### Cập nhật package

```bash
# Cập nhật một package
npm update ten-package

# Cập nhật tất cả
npm update
```

### Cài lại toàn bộ sau khi clone project về

```bash
npm install
# Không cần tên package — npm tự đọc package.json và cài tất cả
```

> Khi bạn tải code của người khác về (clone từ GitHub), thư mục `node_modules` thường không có. Chạy `npm install` để cài lại tất cả dependencies.

### Xem các package đã cài

```bash
npm list --depth=0
```

---

## 5. Hiểu file package.json

`package.json` là **"hồ sơ khai sinh"** của project — chứa toàn bộ thông tin: tên, phiên bản, tác giả, và đặc biệt là **danh sách tất cả thư viện mà project đang dùng**.

### Ví dụ file package.json đầy đủ

```json
{
  "name": "my-website",
  "version": "1.0.0",
  "description": "Website bán hàng của tôi",
  "author": "Nguyen Van An <an@example.com>",
  "license": "MIT",

  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },

  "dependencies": {
    "axios": "^1.6.0",
    "dayjs": "^1.11.10",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },

  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

### Giải thích từng trường

| Trường            | Ý nghĩa                                   |
| ----------------- | ----------------------------------------- |
| `name`            | Tên project — viết thường, không dấu cách |
| `version`         | Phiên bản hiện tại của project bạn        |
| `description`     | Mô tả ngắn gọn                            |
| `author`          | Tên tác giả                               |
| `scripts`         | Các lệnh tắt — xem chi tiết bên dưới      |
| `dependencies`    | Thư viện cần để **chạy** app              |
| `devDependencies` | Thư viện chỉ cần khi **phát triển**       |

### Hiểu phần `scripts`

`scripts` là nơi đặt **tên gọi tắt cho các lệnh dài**. Thay vì nhớ lệnh phức tạp, bạn chỉ cần gõ `npm run <tên>`.

```json
"scripts": {
  "dev":   "vite",
  "build": "vite build"
}
```

```bash
npm run dev      # tương đương gõ: vite
npm run build    # tương đương gõ: vite build
```

> **Mẹo:** `dev` và `start` có thể chạy bằng `npm run dev` hoặc `npm start` (không cần `run`).

### Hiểu ký hiệu phiên bản

```
"react": "^18.2.0"
          │  │ │
          │  │ └── Patch: sửa bug nhỏ
          │  └──── Minor: thêm tính năng mới, không phá vỡ cũ
          └─────── Major: thay đổi lớn, có thể phá vỡ code cũ
```

| Ký hiệu   | Ý nghĩa                                | Ví dụ                               |
| --------- | -------------------------------------- | ----------------------------------- |
| `^18.2.0` | Chấp nhận minor + patch mới            | 18.2.1, 18.3.0 — OK; 19.0.0 — không |
| `~18.2.0` | Chỉ chấp nhận patch mới                | 18.2.1 — OK; 18.3.0 — không         |
| `18.2.0`  | Đúng phiên bản đó, không hơn không kém | Chỉ 18.2.0                          |
| `*`       | Phiên bản mới nhất bất kỳ              | Không nên dùng — dễ vỡ              |

---

## 6. node_modules và .gitignore

### node_modules là gì?

Khi bạn chạy `npm install`, NPM tải tất cả package về và lưu vào thư mục **`node_modules`**.

```
my-project/
├── node_modules/      ← thư mục này (thường rất lớn: 100MB–500MB)
│   ├── react/
│   ├── dayjs/
│   └── ...            ← hàng trăm thư mục con
├── src/
├── package.json
└── package-lock.json
```

### Tại sao node_modules rất nặng?

Vì mỗi package bạn cài có thể **phụ thuộc vào nhiều package khác** (gọi là transitive dependencies). Ví dụ: bạn cài 3 package, nhưng chúng kéo theo 200 package phụ thuộc.

### Không bao giờ đưa node_modules lên Git

Thư mục `node_modules` **không được commit lên Git** vì:

- Quá nặng (hàng trăm MB)
- Người khác có thể tự tạo lại bằng `npm install`
- Gây conflict không cần thiết

Tạo file **`.gitignore`** trong thư mục gốc và thêm vào:

```
node_modules/
dist/
.env
```

> Vite tự tạo file `.gitignore` phù hợp khi bạn khởi tạo project — bạn không cần làm thủ công.

### package-lock.json là gì?

File này được npm tự tạo và tự cập nhật. Nó **ghi lại chính xác phiên bản** của mọi package (kể cả package phụ thuộc) để đảm bảo mọi người trong team cài đúng cùng một phiên bản.

> **Nên commit `package-lock.json` lên Git** — khác với `node_modules`.

---

## 7. Dependencies vs DevDependencies

Đây là điểm **nhiều người hay nhầm** nhất.

### Dependencies — thư viện chạy thật

Là những thư viện mà app của bạn **cần để hoạt động khi người dùng mở website**.

```bash
# Cài vào dependencies (mặc định)
npm install react
npm install axios
npm install dayjs
```

### DevDependencies — thư viện chỉ dùng khi phát triển

Là những thư viện chỉ cần **trong quá trình bạn code**, không cần thiết khi deploy lên server.

```bash
# Cài vào devDependencies (thêm flag --save-dev hoặc -D)
npm install --save-dev vite
npm install -D eslint
npm install -D prettier
```

### So sánh dễ hiểu

| Loại              | Ví dụ                  | Cần khi dùng thật? |
| ----------------- | ---------------------- | ------------------ |
| `dependencies`    | React, Axios, Dayjs    | ✅ Có              |
| `devDependencies` | Vite, ESLint, Prettier | ❌ Không           |

> **Hình ảnh:** Xây nhà — gạch, xi măng là `dependencies` (cần để ngôi nhà tồn tại). Máy trộn bê tông, giàn giáo là `devDependencies` (chỉ cần trong quá trình xây, sau đó không cần nữa).

### Khi nào quan trọng?

Khi **deploy lên server**, bạn có thể chỉ cài dependencies (nhẹ hơn):

```bash
npm install --production
# Chỉ cài dependencies, bỏ qua devDependencies
```

---

## 8. Vite là gì? Tại sao dùng Vite?

**Vite** (đọc là "vít", tiếng Pháp nghĩa là "nhanh") là công cụ giúp bạn:

- **Tạo nhanh** cấu trúc project chuẩn
- **Chạy server phát triển** với tính năng hot reload (thay đổi code → trình duyệt tự cập nhật ngay)
- **Đóng gói (build)** code thành file tối ưu để đưa lên internet

### Tại sao Vite thay thế Create React App?

Trước đây người ta dùng **Create React App (CRA)** để tạo project React. Nhưng CRA chậm và nặng. Vite ra đời năm 2021 và nhanh hơn CRA khoảng **10–100 lần**.

| Tiêu chí           | Create React App | Vite           |
| ------------------ | ---------------- | -------------- |
| Khởi động server   | 30–60 giây       | < 1 giây       |
| Hot reload         | 2–5 giây         | Tức thì        |
| Build production   | Chậm             | Nhanh          |
| Cộng đồng hiện tại | Đang giảm        | Đang tăng mạnh |

### Vite hỗ trợ nhiều framework

Vite không chỉ dành cho React — nó hỗ trợ:

- **Vanilla JS** (JS thuần, không framework)
- **React**
- **Vue**
- **Svelte**
- **Lit**
- **Preact**

---

## 9. Tạo project với Vite

### Bước 1: Chạy lệnh tạo project

```bash
npm create vite@latest
```

Vite sẽ hỏi bạn từng bước:

```
✔ Project name: › my-app
✔ Select a framework: › React
✔ Select a variant: › JavaScript
```

> Nếu muốn đặt tên ngay trong lệnh:
>
> ```bash
> npm create vite@latest my-app -- --template react
> ```

### Bước 2: Di chuyển vào thư mục project

```bash
cd my-app
```

### Bước 3: Cài dependencies

```bash
npm install
```

### Bước 4: Chạy server phát triển

```bash
npm run dev
```

Kết quả:

```
  VITE v5.0.0  ready in 213 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Mở trình duyệt vào **http://localhost:5173** — website đang chạy!

### Cấu trúc project Vite tạo ra

```
my-app/
├── public/             ← File tĩnh (ảnh, favicon...)
│   └── vite.svg
├── src/                ← Code của bạn — làm việc chủ yếu ở đây
│   ├── assets/
│   ├── App.jsx         ← Component chính
│   ├── App.css
│   ├── main.jsx        ← Entry point — điểm khởi đầu của app
│   └── index.css
├── index.html          ← File HTML gốc
├── package.json        ← Thông tin project & dependencies
├── vite.config.js      ← Cấu hình Vite
└── .gitignore          ← Danh sách file không đưa lên Git
```

### Giải thích các file quan trọng

**`index.html`** — Điểm khởi đầu của toàn bộ website. Trình duyệt mở file này đầu tiên.

**`src/main.jsx`** — Điểm khởi đầu của code JavaScript. Tất cả bắt đầu từ đây.

**`src/App.jsx`** — Component gốc. Bạn bắt đầu viết UI từ file này.

**`vite.config.js`** — Cấu hình cho Vite (thêm plugin, đặt alias đường dẫn...). Người mới thường không cần chỉnh.

---

## 10. Làm việc hàng ngày với Vite

### Workflow cơ bản mỗi ngày

```bash
# 1. Vào thư mục project
cd my-app

# 2. Chạy server (làm lần đầu hoặc sau khi tắt máy)
npm run dev

# 3. Mở trình duyệt vào http://localhost:5173
# 4. Code... Vite tự reload trình duyệt mỗi khi lưu file

# 5. Khi xong, tắt server bằng Ctrl + C
```

### Thêm thư viện mới vào project

```bash
# Ví dụ: thêm axios để gọi API
npm install axios

# Sau đó dùng trong code
# import axios from 'axios'
```

Không cần tắt `npm run dev` — cài xong dùng luôn được.

### Build để đưa lên internet

Khi code xong và muốn deploy:

```bash
npm run build
```

Vite tạo ra thư mục **`dist/`** chứa toàn bộ website đã được tối ưu (nén, minify). Đưa nội dung thư mục này lên hosting là xong.

```
dist/
├── index.html
├── assets/
│   ├── index-Bc9kFo3h.js    ← JS đã minify, tên random để cache-busting
│   └── index-DiwrgTda.css
└── vite.svg
```

### Xem trước bản build trước khi deploy

```bash
npm run preview
# Mở http://localhost:4173 để xem bản build
```

> Khác với `npm run dev` (chạy trực tiếp code nguồn), `npm run preview` chạy bản đã build — gần giống nhất với môi trường thật.

### Cài thêm thư viện và dùng ngay

```bash
# Ví dụ: cài và dùng date-fns
npm install date-fns
```

```js
// Trong file .jsx hoặc .js của bạn
import { format } from "date-fns";

const today = format(new Date(), "dd/MM/yyyy");
console.log(today); // "15/03/2024"
```

---

## 11. Những lỗi thường gặp

### Lỗi: `npm: command not found`

**Nguyên nhân:** Node.js chưa được cài hoặc chưa được nhận diện.

**Cách sửa:**

```bash
# Cài lại Node.js từ https://nodejs.org
# Sau khi cài, mở Terminal mới và thử lại
node --version
npm --version
```

---

### Lỗi: `Cannot find module 'ten-package'`

**Nguyên nhân:** Package chưa được cài, hoặc `node_modules` bị xoá.

**Cách sửa:**

```bash
npm install         # cài lại tất cả theo package.json
# hoặc
npm install ten-package  # cài riêng package đó
```

---

### Lỗi: `Port 5173 is already in use`

**Nguyên nhân:** Một server Vite khác đang chạy ở cổng đó.

**Cách sửa:**

```bash
# Cách 1: Tắt Terminal cũ rồi chạy lại
npm run dev

# Cách 2: Vite tự động dùng cổng khác (5174, 5175...)
# Không cần lo, nhìn vào output để biết cổng mới
```

---

### Lỗi: `EACCES: permission denied`

**Nguyên nhân:** Không có quyền ghi vào thư mục (thường xảy ra trên macOS/Linux).

**Cách sửa:**

```bash
# KHÔNG dùng sudo với npm install — gây thêm vấn đề
# Thay vào đó, sửa quyền sở hữu thư mục npm
sudo chown -R $(whoami) ~/.npm
```

---

### Lỗi: `npm WARN deprecated`

**Đây không phải lỗi** — chỉ là cảnh báo một package nào đó đã lỗi thời. App vẫn chạy bình thường. Chỉ cần lo nếu cảnh báo về package bạn đang dùng trực tiếp.

---

### Package cài xong nhưng import báo lỗi

**Kiểm tra lại tên import** — đôi khi tên package và tên import khác nhau:

```bash
npm install @mui/material   # tên package có @ và /
```

```js
import Button from "@mui/material/Button"; // import dùng đường dẫn con
```

---

## 12. Bảng tra lệnh nhanh

### Lệnh NPM

| Lệnh                       | Chức năng                             |
| -------------------------- | ------------------------------------- |
| `npm install`              | Cài tất cả package trong package.json |
| `npm install <package>`    | Cài một package mới                   |
| `npm install -D <package>` | Cài package vào devDependencies       |
| `npm uninstall <package>`  | Gỡ một package                        |
| `npm update`               | Cập nhật tất cả package               |
| `npm run <script>`         | Chạy lệnh trong phần scripts          |
| `npm list --depth=0`       | Liệt kê package đã cài                |
| `npm outdated`             | Xem package nào có bản mới            |

### Lệnh Vite

| Lệnh                     | Chức năng               |
| ------------------------ | ----------------------- |
| `npm create vite@latest` | Tạo project mới         |
| `npm run dev`            | Chạy server phát triển  |
| `npm run build`          | Build ra bản production |
| `npm run preview`        | Xem trước bản build     |

### Phím tắt Terminal

| Phím       | Chức năng                      |
| ---------- | ------------------------------ |
| `Ctrl + C` | Tắt server đang chạy           |
| `↑ ↓`      | Xem lịch sử lệnh đã gõ         |
| `Tab`      | Tự hoàn thành tên file/thư mục |
| `Ctrl + L` | Xóa màn hình Terminal          |

---

## Tóm tắt toàn bộ luồng

```
1. Cài Node.js từ nodejs.org
        ↓
2. npm create vite@latest   ← tạo project
        ↓
3. cd my-app && npm install ← cài dependencies
        ↓
4. npm run dev              ← chạy server, bắt đầu code
        ↓
5. npm install <package>    ← thêm thư viện khi cần
        ↓
6. npm run build            ← đóng gói khi xong
        ↓
7. Đưa thư mục dist/ lên hosting
```
