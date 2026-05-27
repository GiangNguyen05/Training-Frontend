// ES2022: Class Private Fields & Methods
class ClassRoom {
  #students = [];
  #nextId = 1;

  // ES2022: Private method
  #calcGrade(score) {
    if (score >= 9) return "A";
    if (score >= 7) return "B";
    if (score >= 5) return "C";
    return "F";
  }

  add(name, score) {
    this.#students.push({
      id: this.#nextId++,
      name,
      score,
      grade: this.#calcGrade(score), // Gọi private method
    });
    return this;
  }

  // ES2022: Getter + Array.at()
  get top() {
    return this.#students.toSorted((a, b) => b.score - a.score).at(0);
  } // ES2023: toSorted
  get last() {
    return this.#students.at(-1);
  } // ES2022: at()
  get all() {
    return [...this.#students];
  }

  // ES2024: Object.groupBy()
  get byGrade() {
    return Object.groupBy(this.#students, (s) => s.grade);
  }

  // ES2023: findLast()
  findLastPassed() {
    return this.#students.findLast((s) => s.score >= 5);
  }
}

// ── Khởi tạo ──────────────────────────────────────────────────
const room = new ClassRoom();

room
  .add("An", 8.5)
  .add("Bình", 6.0)
  .add("Chi", 9.2)
  .add("Dũng", 4.5)
  .add("Em", 7.8);

// ES2022: Array.at()
console.log("Bài cuối thêm vào:", room.last.name); // "Em"
console.log("Học sinh giỏi nhất:", room.top.name); // "Chi"

// ES2024: Object.groupBy()
const grouped = room.byGrade;
console.log("Nhóm theo điểm:", grouped);
// { A: [{name:"Chi",...}], B: [{name:"An",...},{name:"Em",...}], C: [{name:"Bình",...}], F: [{...}] }

// ES2023: findLast()
console.log("Người cuối qua môn:", room.findLastPassed().name); // "Em"

// ES2022: Object.hasOwn()
const student = room.last;
console.log("Có field 'grade'?", Object.hasOwn(student, "grade")); // true
console.log("Có field 'absent'?", Object.hasOwn(student, "absent")); // false

// ES2023: toSorted() — không mutate gốc
const sorted = room.all.toSorted((a, b) => a.name.localeCompare(b.name));
console.log(
  "A-Z:",
  sorted.map((s) => s.name),
); // ["An", "Bình", "Chi", "Dũng", "Em"]
console.log(
  "Gốc vẫn nguyên:",
  room.all.map((s) => s.name),
); // ["An", "Bình", "Chi", "Dũng", "Em"] — thứ tự thêm vào

// ES2025: Set Methods — so sánh danh sách đậu/rớt
const passed = new Set(room.all.filter((s) => s.score >= 5).map((s) => s.name));
const honors = new Set(["Chi", "An", "Hoa"]); // Danh sách khen thưởng

console.log("Đậu và được khen:", [...passed.intersection(honors)]); // ["Chi", "An"]
console.log("Đậu nhưng chưa khen:", [...passed.difference(honors)]); // ["Bình", "Em"]

// ES2024: Promise.withResolvers() — xác nhận xoá học sinh
async function confirmRemove(name) {
  const { promise, resolve } = Promise.withResolvers();
  setTimeout(() => resolve(true), 300); // Giả lập user nhấn OK
  const ok = await promise;
  if (ok) console.log(`Đã xoá học sinh: ${name}`);
}

// ES2025: Promise.try() — bọc sync/async đồng nhất
Promise.try(() => {
  const student = room.all.find((s) => s.name === "Dũng");
  if (!student) throw new Error("Không tìm thấy học sinh"); // sync throw
  return confirmRemove(student.name); // async
})
  .then(() => console.log("Hoàn tất"))
  .catch((err) => console.error("Lỗi:", err.message));

// ES2022: Error cause — wrap lỗi giữ nguyên gốc
async function loadStudents(classId) {
  try {
    const res = await fetch(`/api/classes/${classId}/students`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    throw new Error(`Không thể tải lớp #${classId}`, { cause: err });
  }
}

loadStudents(99).catch((err) => {
  console.error(err.message); // "Không thể tải lớp #99"
  console.error(err.cause); // Lỗi gốc vẫn còn
});

// ES2025: Iterator Helpers — lazy, không tạo mảng trung gian
function* studentStream() {
  yield* room.all; // Giả lập stream dữ liệu lớn
}

const topTwo = studentStream()
  .filter((s) => s.score >= 7) // Lọc khá trở lên
  .map((s) => `${s.name} (${s.score})`) // Format
  .take(2) // Chỉ lấy 2
  .toArray();

console.log("Top 2 khá+:", topTwo); // ["An (8.5)", "Chi (9.2)"]
