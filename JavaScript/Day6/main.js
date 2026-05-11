let todos = [];

// Giả lập server delay (dùng cho tất cả ví dụ bên dưới)
function fakeServer(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 1000);
  });
}

// Đồng bộ
function addTodoA(text) {
  const todo = { id: Date.now(), text, done: false };
  todos.push(todo);
  console.log("Đã thêm:", todo);
  console.log("Danh sách:", todos);
}

addTodoA("Học JavaScript");
addTodoA("Làm bài tập");
//callback
function addTodoB(text, callback) {
  const todo = { id: Date.now(), text, done: false };

  console.log("Đang lưu...");

  fakeServer(todo)
    .then((saved) => {
      todos.push(saved);
      callback(null, saved); // Thành công
    })
    .catch((err) => {
      callback(err, null); // Thất bại
    });
}
addTodoB("Học JavaScript", (err, todo) => {
  if (err) {
    console.log("Lỗi:", err);
    return;
  }
  console.log("Đã lưu:", todo);
});

console.log("Dòng này chạy TRƯỚC khi server trả về!");

// Promise
function addTodoC(text) {
  const todo = { id: Date.now(), text, done: false };

  console.log("Đang lưu...");

  return fakeServer(todo).then((saved) => {
    todos.push(saved);
    return saved;
  });
}
addTodoC("Học JavaScript")
  .then((todo) => console.log("Đã lưu:", todo))
  .catch((err) => console.log("Lỗi:", err));
// Async/Await
async function addTodoD(text) {
  const todo = { id: Date.now(), text, done: false };

  console.log("Đang lưu...");

  try {
    const saved = await fakeServer(todo); // Chờ server
    todos.push(saved);
    console.log("Đã lưu:", saved);
  } catch (err) {
    console.log("Lỗi:", err);
  }
}

addTodoD("Học JavaScript");

//Promise.all - thêm nhiều todo cùng lúc
async function addManyTodos(texts) {
  // Tuần tự — mất 3 giây
  for (const text of texts) {
    await addTodo(text); // Chờ từng cái một
  }

  // Song song — mất ~1 giây
  await Promise.all(
    texts.map((text) => addTodo(text)), // Tất cả chạy cùng lúc
  );
}

addManyTodos(["Học JS", "Làm bài tập", "Đọc sách"]);

// Output (song song):
// Đang lưu... (x3 cùng lúc)
// (sau 1 giây) Đã lưu: Học JS
// (sau 1 giây) Đã lưu: Làm bài tập
// (sau 1 giây) Đã lưu: Đọc sách
