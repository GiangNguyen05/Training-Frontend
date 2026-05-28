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
