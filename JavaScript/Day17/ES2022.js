// HELPERS
// ══════════════════════════════════════════════════════
function out(id, lines) {
  document.getElementById(id).innerHTML = lines
    .map((l) => `<div>${l}</div>`)
    .join("");
}
function line(text, cls = "") {
  const colors = {
    key: "#93c5fd",
    val: "#fde68a",
    muted: "#6b7280",
    err: "#f87171",
    ok: "#86efac",
  };
  return `<span style="color:${colors[cls] || "#86efac"}">${text}</span>`;
}
function fakeDelay(ms, fail = false) {
  return new Promise((res, rej) =>
    setTimeout(() => (fail ? rej(new Error("Network Error")) : res()), ms),
  );
}
function show(id) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("s-" + id)?.classList.add("active");
  document.querySelector(`[onclick="show('${id}')"]`)?.classList.add("active");
}

// ES6 CLASS & OBJECT
// ES6: class với constructor, method, template literal, arrow function
class Student {
  constructor(id, name, score) {
    this.id = id;
    this.name = name;
    this.score = score;
    this.grade = this.#calcGrade(); // ES2022: private method call
  }
  // ES2022: private method
  #calcGrade() {
    if (this.score >= 9) return "A";
    if (this.score >= 7) return "B";
    if (this.score >= 5) return "C";
    return "F";
  }
  // ES6: method
  info() {
    return `${this.name} — ${this.score} điểm (${this.grade})`;
  }
}

const es6Students = [];
let es6Id = 1;

function es6Add() {
  const name = document.getElementById("es6-name").value.trim();
  const score = parseFloat(document.getElementById("es6-score").value);
  if (!name || isNaN(score)) return;

  const s = new Student(es6Id++, name, score); // ES6: new
  es6Students.push(s);

  // ES6: destructuring
  const { id, name: n, score: sc, grade } = s;

  renderEs6();
  out("es6-out", [
    line(`// ES6: new Student() + destructuring`, "muted"),
    line(`const { id, name, score, grade } = student`),
    line(`id:    ${line(id, "val")}`),
    line(`name:  ${line(n, "val")}`),
    line(`score: ${line(sc, "val")}`),
    line(`grade: ${line(grade, "val")}`),
    line(`info(): ${line(s.info(), "ok")}`),
  ]);
  document.getElementById("es6-name").value = "";
  document.getElementById("es6-score").value = "";
}

function renderEs6() {
  const list = document.getElementById("es6-list");
  if (!es6Students.length) {
    list.innerHTML = '<div class="empty">Trống</div>';
    return;
  }
  list.innerHTML = es6Students
    .map(
      (s, i) => `
    <div class="list-item">
      <span class="list-num">${String(i + 1).padStart(2, "0")}</span>
      <div class="list-main">
        <div class="list-title">${s.name}</div>
        <div class="list-sub">${s.score} điểm · Xếp loại ${s.grade}</div>
      </div>
      <button class="btn outline sm" onclick="es6Remove(${s.id})">✕</button>
    </div>`,
    )
    .join("");
}
function es6Remove(id) {
  const i = es6Students.findIndex((s) => s.id === id);
  if (i !== -1) es6Students.splice(i, 1);
  renderEs6();
}

// ES6 — DESTRUCTURING & SPREAD

function runDestructure() {
  try {
    const raw =
      document.getElementById("d-json").value ||
      '{"name":"An","score":8.5,"class":"12A"}';
    const obj = JSON.parse(raw);
    // ES6: destructuring với default value
    const { name = "Unknown", score = 0, ...rest } = obj; // rest/spread
    out("d-out", [
      line(`// Object destructuring + rest`, "muted"),
      `${line("name", "key")}: ${line(`"${name}"`, "val")}`,
      `${line("score", "key")}: ${line(score, "val")}`,
      `${line("...rest", "key")}: ${line(JSON.stringify(rest), "val")}`,
    ]);
  } catch {
    out("d-out", [line("// JSON không hợp lệ", "err")]);
  }
}

function runSpread() {
  const raw = document.getElementById("s-input").value || "An, Bình, Chi";
  // ES6: rest params simulation with spread
  const names = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const [first, second, ...others] = names; // ES6: array destructuring + rest

  out("s-out", [
    line(`// Array destructuring + rest`, "muted"),
    `${line("first", "key")}: ${line(`"${first}"`, "val")}`,
    `${line("second", "key")}: ${line(`"${second}"`, "val")}`,
    `${line("...others", "key")}: ${line(JSON.stringify(others), "val")}`,
    line(`// Spread để merge`, "muted"),
    `${line("merged", "key")}: ${line(JSON.stringify([...names, "Dũng", "Em"]), "val")}`,
  ]);
}

// ES6 — PROMISE / ASYNC
// ══════════════════════════════════════════════════════
let fetchMode = "ok";
function setFetchMode(m, btn) {
  fetchMode = m;
  document
    .querySelectorAll("#s-promise-es6 .tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
}

async function runFetch() {
  const btn = document.getElementById("fetch-btn");
  btn.disabled = true;
  btn.textContent = "⏳";
  const logs = [];

  try {
    if (fetchMode === "multi") {
      logs.push(line(`// Promise.all — 3 requests song song`, "muted"));
      logs.push(line(`await Promise.all([req1, req2, req3])`));
      const [r1, r2, r3] = await Promise.all([
        fakeDelay(400),
        fakeDelay(600),
        fakeDelay(300),
      ]);
      logs.push(line(`✓ Tất cả xong!`, "ok"));
    } else {
      const fail = fetchMode === "fail";
      logs.push(line(`// async/await fetch`, "muted"));
      logs.push(line(`await fakeDelay(800, fail=${fail})`));
      await fakeDelay(800, fail);
      logs.push(line(`✓ Response OK`, "ok"));
      logs.push(
        `${line("data", "key")}: ${line('{ id:1, name:"An" }', "val")}`,
      );
    }
  } catch (err) {
    logs.push(line(`✗ catch: ${err.message}`, "err"));
  } finally {
    logs.push(line(`// finally — luôn chạy`, "muted"));
    btn.disabled = false;
    btn.textContent = "▶ Run";
  }
  out("fetch-out", logs);
}

//ES2022
// ES2022: class với private fields & methods
class Cart {
  #items = [];
  #nextId = 1;

  #total() {
    // private method
    return this.#items.reduce((s, i) => s + i.price, 0);
  }

  add(name, price) {
    this.#items.push({ id: this.#nextId++, name, price });
    return this;
  }
  remove(id) {
    this.#items = this.#items.filter((i) => i.id !== id);
  }

  get last() {
    return this.#items.at(-1);
  } // ES2022: at()
  get first() {
    return this.#items.at(0);
  }
  get total() {
    return this.#total();
  }
  get all() {
    return [...this.#items];
  }
  get count() {
    return this.#items.length;
  }
}

const cart = new Cart();

function cartAdd() {
  const name = document.getElementById("cart-name").value.trim();
  const price = parseFloat(document.getElementById("cart-price").value);
  if (!name || isNaN(price)) return;

  cart.add(name, price);
  renderCart();

  // ES2022: Object.hasOwn()
  const item = cart.last;
  out("cart-out", [
    line(`// ES2022: #private + at() + Object.hasOwn()`, "muted"),
    `${line("cart.last", "key")}: ${line(`"${item?.name}"`, "val")}  ${line("// at(-1)", "muted")}`,
    `${line("cart.first", "key")}: ${line(`"${cart.first?.name}"`, "val")}  ${line("// at(0)", "muted")}`,
    `${line("cart.total", "key")}: ${line(cart.total.toLocaleString("vi-VN") + " đ", "val")}`,
    `${line('hasOwn(item,"name")', "key")}: ${line(Object.hasOwn(item, "name"), "val")}`, // ES2022
    `${line('hasOwn(item,"qty")', "key")}: ${line(Object.hasOwn(item, "qty"), "val")}`,
    line(`// cart.#items → SyntaxError (private!)`, "muted"),
  ]);
  document.getElementById("cart-name").value = "";
  document.getElementById("cart-price").value = "";
}
function renderCart() {
  const list = document.getElementById("cart-list");
  if (!cart.count) {
    list.innerHTML = '<div class="empty">Giỏ trống</div>';
    return;
  }
  list.innerHTML = cart.all
    .map(
      (item, i) => `
    <div class="list-item">
      <span class="list-num">${String(i + 1).padStart(2, "0")}</span>
      <div class="list-main">
        <div class="list-title">${item.name}</div>
        <div class="list-sub">${item.price.toLocaleString("vi-VN")} đ</div>
      </div>
      <button class="btn outline sm" onclick="cartRemove(${item.id})">✕</button>
    </div>`,
    )
    .join("");
}
function cartRemove(id) {
  cart.remove(id);
  renderCart();
}

// ES2022 — ERROR CAUSE
let errMode = "network";
function setErrMode(m, btn) {
  errMode = m;
  document
    .querySelectorAll("#s-error-cause .tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
}

async function runErrorCause() {
  async function fetchData(mode) {
    try {
      if (mode === "network") throw new Error("Failed to fetch");
      if (mode === "http")
        throw Object.assign(new Error("Not Found"), { status: 404 });
      return { id: 1, name: "An", score: 8.5 };
    } catch (err) {
      // ES2022: Error cause — giữ lỗi gốc
      throw new Error("Không thể tải dữ liệu học sinh", { cause: err });
    }
  }

  const logs = [line(`// ES2022: Error Cause`, "muted")];
  try {
    const data = await fetchData(errMode);
    logs.push(line(`✓ data: ${JSON.stringify(data)}`, "ok"));
  } catch (err) {
    logs.push(
      `${line("err.message", "key")}: ${line(`"${err.message}"`, "err")}`,
    );
    logs.push(
      `${line("err.cause", "key")}:   ${line(`"${err.cause?.message}"`, "val")}  ${line("← lỗi gốc còn đây!", "muted")}`,
    );
  }
  out("err-out", logs);
}
// ES2023 — IMMUTABLE ARRAY
function runImmutable() {
  const raw = document.getElementById("imm-input").value || "5,2,8,1,9,3";
  const arr = raw
    .split(",")
    .map(Number)
    .filter((n) => !isNaN(n));
  if (!arr.length) return;

  // ES2023: toSorted, toReversed, with, findLast
  const sorted = arr.toSorted((a, b) => a - b);
  const reversed = arr.toReversed();
  const replaced = arr.with(0, 99); // Thay index 0 = 99
  const findLast = arr.findLast((n) => n < 5); // ES2023: findLast

  out("imm-out", [
    line(`// ES2023: Immutable array — gốc không đổi`, "muted"),
    `${line("gốc", "key")}:          ${line(JSON.stringify(arr), "val")}`,
    `${line("toSorted()", "key")}:   ${line(JSON.stringify(sorted), "ok")}`,
    `${line("toReversed()", "key")}: ${line(JSON.stringify(reversed), "ok")}`,
    `${line("with(0,99)", "key")}:   ${line(JSON.stringify(replaced), "ok")}`,
    `${line("findLast(<5)", "key")}: ${line(findLast, "ok")}`,
    line(`// gốc vẫn là: ${JSON.stringify(arr)}  ✓`, "muted"),
  ]);
}

//ES2022
// ES2022: class với private fields & methods
class Cart {
  #items = [];
  #nextId = 1;

  #total() {
    // private method
    return this.#items.reduce((s, i) => s + i.price, 0);
  }

  add(name, price) {
    this.#items.push({ id: this.#nextId++, name, price });
    return this;
  }
  remove(id) {
    this.#items = this.#items.filter((i) => i.id !== id);
  }

  get last() {
    return this.#items.at(-1);
  } // ES2022: at()
  get first() {
    return this.#items.at(0);
  }
  get total() {
    return this.#total();
  }
  get all() {
    return [...this.#items];
  }
  get count() {
    return this.#items.length;
  }
}

const cart = new Cart();

function cartAdd() {
  const name = document.getElementById("cart-name").value.trim();
  const price = parseFloat(document.getElementById("cart-price").value);
  if (!name || isNaN(price)) return;

  cart.add(name, price);
  renderCart();

  // ES2022: Object.hasOwn()
  const item = cart.last;
  out("cart-out", [
    line(`// ES2022: #private + at() + Object.hasOwn()`, "muted"),
    `${line("cart.last", "key")}: ${line(`"${item?.name}"`, "val")}  ${line("// at(-1)", "muted")}`,
    `${line("cart.first", "key")}: ${line(`"${cart.first?.name}"`, "val")}  ${line("// at(0)", "muted")}`,
    `${line("cart.total", "key")}: ${line(cart.total.toLocaleString("vi-VN") + " đ", "val")}`,
    `${line('hasOwn(item,"name")', "key")}: ${line(Object.hasOwn(item, "name"), "val")}`, // ES2022
    `${line('hasOwn(item,"qty")', "key")}: ${line(Object.hasOwn(item, "qty"), "val")}`,
    line(`// cart.#items → SyntaxError (private!)`, "muted"),
  ]);
  document.getElementById("cart-name").value = "";
  document.getElementById("cart-price").value = "";
}
function renderCart() {
  const list = document.getElementById("cart-list");
  if (!cart.count) {
    list.innerHTML = '<div class="empty">Giỏ trống</div>';
    return;
  }
  list.innerHTML = cart.all
    .map(
      (item, i) => `
    <div class="list-item">
      <span class="list-num">${String(i + 1).padStart(2, "0")}</span>
      <div class="list-main">
        <div class="list-title">${item.name}</div>
        <div class="list-sub">${item.price.toLocaleString("vi-VN")} đ</div>
      </div>
      <button class="btn outline sm" onclick="cartRemove(${item.id})">✕</button>
    </div>`,
    )
    .join("");
}
function cartRemove(id) {
  cart.remove(id);
  renderCart();
}

// ES2022 — ERROR CAUSE
let errMode = "network";
function setErrMode(m, btn) {
  errMode = m;
  document
    .querySelectorAll("#s-error-cause .tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
}

async function runErrorCause() {
  async function fetchData(mode) {
    try {
      if (mode === "network") throw new Error("Failed to fetch");
      if (mode === "http")
        throw Object.assign(new Error("Not Found"), { status: 404 });
      return { id: 1, name: "An", score: 8.5 };
    } catch (err) {
      // ES2022: Error cause — giữ lỗi gốc
      throw new Error("Không thể tải dữ liệu học sinh", { cause: err });
    }
  }

  const logs = [line(`// ES2022: Error Cause`, "muted")];
  try {
    const data = await fetchData(errMode);
    logs.push(line(`✓ data: ${JSON.stringify(data)}`, "ok"));
  } catch (err) {
    logs.push(
      `${line("err.message", "key")}: ${line(`"${err.message}"`, "err")}`,
    );
    logs.push(
      `${line("err.cause", "key")}:   ${line(`"${err.cause?.message}"`, "val")}  ${line("← lỗi gốc còn đây!", "muted")}`,
    );
  }
  out("err-out", logs);
}
// ES2023 — IMMUTABLE ARRAY
function runImmutable() {
  const raw = document.getElementById("imm-input").value || "5,2,8,1,9,3";
  const arr = raw
    .split(",")
    .map(Number)
    .filter((n) => !isNaN(n));
  if (!arr.length) return;

  // ES2023: toSorted, toReversed, with, findLast
  const sorted = arr.toSorted((a, b) => a - b);
  const reversed = arr.toReversed();
  const replaced = arr.with(0, 99); // Thay index 0 = 99
  const findLast = arr.findLast((n) => n < 5); // ES2023: findLast

  out("imm-out", [
    line(`// ES2023: Immutable array — gốc không đổi`, "muted"),
    `${line("gốc", "key")}:          ${line(JSON.stringify(arr), "val")}`,
    `${line("toSorted()", "key")}:   ${line(JSON.stringify(sorted), "ok")}`,
    `${line("toReversed()", "key")}: ${line(JSON.stringify(reversed), "ok")}`,
    `${line("with(0,99)", "key")}:   ${line(JSON.stringify(replaced), "ok")}`,
    `${line("findLast(<5)", "key")}: ${line(findLast, "ok")}`,
    line(`// gốc vẫn là: ${JSON.stringify(arr)}  ✓`, "muted"),
  ]);
}
