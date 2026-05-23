# Class và Object trong JavaScript ES6

## Mục lục

1. [Class là gì?](#1-class-là-gì)
2. [Object là gì?](#2-object-là-gì)
3. [Constructor](#3-constructor)
4. [Properties và Methods](#4-properties-và-methods)
5. [Getter và Setter](#5-getter-và-setter)
6. [Kế thừa — extends & super](#6-kế-thừa--extends--super)
7. [Private Fields (#)](#7-private-fields-)
8. [Static Methods & Properties](#8-static-methods--properties)
9. [Polymorphism](#9-polymorphism)
10. [Encapsulation](#10-encapsulation)
11. [Mixins — đa kế thừa](#11-mixins--đa-kế-thừa)
12. [Class vs Prototype truyền thống](#12-class-vs-prototype-truyền-thống)
13. [Tổng kết & Bảng tra nhanh](#13-tổng-kết--bảng-tra-nhanh)

---

## 1. Class là gì?

**Class** (lớp) là một **bản thiết kế (blueprint)** — nó mô tả cấu trúc và hành vi của một nhóm đối tượng. Class không phải là dữ liệu thật sự, nó chỉ định nghĩa "khuôn mẫu".

> Hãy nghĩ class như bản vẽ kỹ thuật của một chiếc xe hơi. Bản vẽ không phải là xe, nhưng từ một bản vẽ bạn có thể sản xuất ra hàng nghìn chiếc xe.

```js
class Vehicle {
  constructor(brand, speed) {
    this.brand = brand;
    this.speed = speed;
  }

  describe() {
    return `${this.brand} chạy ${this.speed} km/h`;
  }
}
```

Class được giới thiệu trong **ES6 (ES2015)** như là "syntactic sugar" trên nền prototype của JavaScript.

---

## 2. Object là gì?

**Object** (đối tượng) là một **thực thể cụ thể** được tạo ra từ class bằng từ khoá `new`. Mỗi object có bộ dữ liệu riêng nhưng dùng chung các method từ class.

```js
// Tạo 2 object từ cùng 1 class
const car1 = new Vehicle("Toyota", 180);
const car2 = new Vehicle("BMW", 250);

console.log(car1.describe()); // "Toyota chạy 180 km/h"
console.log(car2.describe()); // "BMW chạy 250 km/h"

// Mỗi object độc lập nhau
car1.brand = "Honda";
console.log(car1.brand); // "Honda"
console.log(car2.brand); // "BMW" — không bị ảnh hưởng
```

Quá trình tạo object từ class gọi là **instantiation** (khởi tạo thực thể).

---

## 3. Constructor

`constructor` là một **method đặc biệt** chạy tự động ngay khi tạo object bằng `new`. Dùng để nhận tham số và khởi tạo giá trị ban đầu.

```js
class Person {
  constructor(name, age) {
    // "this" trỏ tới object vừa được tạo
    this.name = name;
    this.age = age;

    // Có thể tính toán trong constructor
    this.birthYear = new Date().getFullYear() - age;
  }

  greet() {
    return `Xin chào, tôi là ${this.name}, sinh năm ${this.birthYear}`;
  }
}

const p = new Person("An", 25);
console.log(p.greet());
// "Xin chào, tôi là An, sinh năm 1999"
```

**Lưu ý:**

- Mỗi class chỉ có **một** `constructor`.
- Nếu không khai báo, JavaScript tự tạo constructor rỗng.
- Trong class con, phải gọi `super()` trước khi dùng `this`.

---

## 4. Properties và Methods

### 4.1 Instance Properties — thuộc tính của từng object

```js
class Product {
  constructor(name, price) {
    this.name = name; // instance property
    this.price = price; // instance property
    this.inStock = true; // giá trị mặc định
  }
}

const p1 = new Product("Laptop", 25000000);
const p2 = new Product("Chuột", 500000);

// Mỗi object có giá trị riêng
console.log(p1.price); // 25000000
console.log(p2.price); //   500000
```

### 4.2 Instance Methods — hành vi của object

```js
class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  // Method thông thường
  getInfo() {
    return `${this.name}: ${this.price.toLocaleString("vi-VN")} VNĐ`;
  }

  // Method thay đổi state
  applyDiscount(percent) {
    this.price = this.price * (1 - percent / 100);
    return this; // trả về this để chain
  }

  // Method kiểm tra
  isAffordable(budget) {
    return this.price <= budget;
  }
}

const laptop = new Product("Laptop", 25000000);

// Method chaining
laptop.applyDiscount(10).applyDiscount(5);
console.log(laptop.getInfo());
// "Laptop: 21.375.000 VNĐ"

console.log(laptop.isAffordable(20000000)); // false
```

### 4.3 Class Fields (ES2022) — khai báo property ngoài constructor

```js
class Counter {
  count = 0; // public field, mặc định = 0
  step = 1;

  increment() {
    this.count += this.step;
  }
  decrement() {
    this.count -= this.step;
  }
  reset() {
    this.count = 0;
  }
}

const c = new Counter();
c.increment();
c.increment();
c.increment();
console.log(c.count); // 3
c.reset();
console.log(c.count); // 0
```

---

## 5. Getter và Setter

**Getter** cho phép đọc giá trị như property nhưng thực ra là gọi method.
**Setter** cho phép gán giá trị như property nhưng có thể kiểm tra trước khi lưu.

```js
class Temperature {
  constructor(celsius) {
    this._celsius = celsius; // convention: _ nghĩa là "internal"
  }

  // Getter: đọc như property
  get celsius() {
    return this._celsius;
  }

  get fahrenheit() {
    return (this._celsius * 9) / 5 + 32;
  }

  get kelvin() {
    return this._celsius + 273.15;
  }

  // Setter: validate trước khi gán
  set celsius(value) {
    if (value < -273.15) {
      throw new Error("Nhiệt độ không thể thấp hơn 0 Kelvin!");
    }
    this._celsius = value;
  }
}

const temp = new Temperature(100);

// Đọc như property, không cần ()
console.log(temp.celsius); // 100
console.log(temp.fahrenheit); // 212
console.log(temp.kelvin); // 373.15

// Gán giá trị mới qua setter
temp.celsius = 37;
console.log(temp.fahrenheit); // 98.6

// Setter validate — sẽ throw Error
try {
  temp.celsius = -300; // Error: Nhiệt độ không thể thấp hơn 0 Kelvin!
} catch (e) {
  console.log(e.message);
}
```

---

## 6. Kế thừa — extends & super

**Kế thừa** cho phép class con tái sử dụng toàn bộ property và method của class cha, đồng thời có thể **mở rộng** hoặc **ghi đè** (override).

```js
// Class cha (Base class)
class Animal {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  speak() {
    return `${this.name} tạo ra âm thanh`;
  }

  toString() {
    return `[${this.constructor.name}] ${this.name}, ${this.age} tuổi`;
  }
}

// Class con — kế thừa Animal
class Dog extends Animal {
  constructor(name, age, breed) {
    super(name, age); // BẮT BUỘC gọi trước khi dùng this
    this.breed = breed; // thêm property riêng
  }

  // Override method của Animal
  speak() {
    return `${this.name} sủa: Gâu gâu!`;
  }

  // Method riêng của Dog
  fetch(item) {
    return `${this.name} (${this.breed}) đi lấy ${item}!`;
  }
}

class Cat extends Animal {
  constructor(name, age, isIndoor) {
    super(name, age);
    this.isIndoor = isIndoor;
  }

  speak() {
    return `${this.name} kêu: Meo meo~`;
  }

  purr() {
    return `${this.name} đang gừ gừ... 😸`;
  }
}

const dog = new Dog("Rex", 3, "Husky");
const cat = new Cat("Mimi", 2, true);

console.log(dog.speak()); // "Rex sủa: Gâu gâu!"
console.log(dog.fetch("bóng")); // "Rex (Husky) đi lấy bóng!"
console.log(dog.toString()); // "[Dog] Rex, 3 tuổi"

console.log(cat.speak()); // "Mimi kêu: Meo meo~"
console.log(cat.purr()); // "Mimi đang gừ gừ... 😸"

// instanceof kiểm tra chuỗi kế thừa
console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true — Dog là Animal
console.log(cat instanceof Dog); // false
```

### Gọi method của class cha bằng super

```js
class Employee {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }

  getInfo() {
    return `${this.name} — lương: ${this.salary.toLocaleString("vi-VN")} VNĐ`;
  }
}

class Manager extends Employee {
  constructor(name, salary, department) {
    super(name, salary);
    this.department = department;
  }

  getInfo() {
    // Gọi method của class cha, rồi bổ sung thêm
    const base = super.getInfo();
    return `${base} — phòng ban: ${this.department}`;
  }
}

const mgr = new Manager("Tuấn", 50000000, "Kỹ thuật");
console.log(mgr.getInfo());
// "Tuấn — lương: 50.000.000 VNĐ — phòng ban: Kỹ thuật"
```

---

## 7. Private Fields (#)

Private fields được khai báo với tiền tố `#`. Chúng **chỉ truy cập được bên trong class** — đây là encapsulation thực sự trong JavaScript.

```js
class BankAccount {
  // Private fields — không thể truy cập từ bên ngoài
  #balance = 0;
  #owner;
  #transactions = [];

  constructor(owner, initialDeposit = 0) {
    this.#owner = owner;
    this.#balance = initialDeposit;
    if (initialDeposit > 0) {
      this.#transactions.push({ type: "deposit", amount: initialDeposit });
    }
  }

  // Public interface để tương tác
  deposit(amount) {
    if (amount <= 0) throw new Error("Số tiền phải lớn hơn 0");
    this.#balance += amount;
    this.#transactions.push({ type: "deposit", amount });
    return this; // method chaining
  }

  withdraw(amount) {
    if (amount <= 0) throw new Error("Số tiền phải lớn hơn 0");
    if (amount > this.#balance) throw new Error("Số dư không đủ");
    this.#balance -= amount;
    this.#transactions.push({ type: "withdraw", amount });
    return this;
  }

  // Getter — đọc balance nhưng không sửa trực tiếp được
  get balance() {
    return this.#balance;
  }
  get owner() {
    return this.#owner;
  }

  getStatement() {
    return this.#transactions
      .map(
        (t) =>
          `${t.type === "deposit" ? "+" : "-"}${t.amount.toLocaleString("vi-VN")}`,
      )
      .join(", ");
  }
}

const acc = new BankAccount("Lan", 1000000);
acc.deposit(500000).deposit(200000).withdraw(300000);

console.log(acc.balance); // 1400000
console.log(acc.getStatement());
// "+1.000.000, +500.000, +200.000, -300.000"

// Truy cập private field trực tiếp → SyntaxError
// console.log(acc.#balance); // SyntaxError!
```

---

## 8. Static Methods & Properties

`static` khai báo method hoặc property thuộc về **class** chứ không phải object. Gọi trực tiếp qua tên class mà không cần `new`.

```js
class MathUtils {
  // Static property
  static PI = 3.14159265358979;

  // Static methods — utility functions
  static square(n) {
    return n * n;
  }
  static cube(n) {
    return n * n * n;
  }
  static clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }

  static circleArea(r) {
    return MathUtils.PI * MathUtils.square(r);
  }
}

// Gọi trực tiếp qua class — không cần new MathUtils()
console.log(MathUtils.square(5)); // 25
console.log(MathUtils.cube(3)); // 27
console.log(MathUtils.clamp(150, 0, 100)); // 100
console.log(MathUtils.circleArea(7).toFixed(2)); // 153.94
```

### Static factory method — pattern phổ biến

```js
class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  // Static factory methods — nhiều cách tạo object
  static fromHex(hex) {
    const clean = hex.replace("#", "");
    return new Color(
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    );
  }

  static fromArray([r, g, b]) {
    return new Color(r, g, b);
  }

  static black() {
    return new Color(0, 0, 0);
  }
  static white() {
    return new Color(255, 255, 255);
  }
  static red() {
    return new Color(255, 0, 0);
  }

  toHex() {
    return (
      "#" +
      [this.r, this.g, this.b]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  toString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
}

const c1 = Color.fromHex("#ff6b6b");
const c2 = Color.fromArray([100, 200, 50]);
const c3 = Color.black();

console.log(c1.toString()); // "rgb(255, 107, 107)"
console.log(c2.toHex()); // "#64c832"
console.log(c3.toHex()); // "#000000"
```

---

## 9. Polymorphism

**Polymorphism** (đa hình) là khả năng nhiều class khác nhau cùng có một interface (tên method) nhưng mỗi class tự thực thi theo cách riêng.

> Code gọi chung một method — từng object tự quyết định làm gì.

```js
class Shape {
  // "Hợp đồng" — tất cả shape phải implement area()
  area() {
    return 0;
  }
  perimeter() {
    return 0;
  }

  // Method này dùng chung — gọi area() của từng subclass
  describe() {
    return `${this.constructor.name}: diện tích = ${this.area().toFixed(2)}, chu vi = ${this.perimeter().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  area() {
    return Math.PI * this.radius ** 2;
  }
  perimeter() {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(w, h) {
    super();
    this.w = w;
    this.h = h;
  }
  area() {
    return this.w * this.h;
  }
  perimeter() {
    return 2 * (this.w + this.h);
  }
}

class Triangle extends Shape {
  constructor(a, b, c) {
    super();
    this.a = a;
    this.b = b;
    this.c = c;
  }
  perimeter() {
    return this.a + this.b + this.c;
  }
  area() {
    const s = this.perimeter() / 2; // Công thức Heron
    return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
  }
}

// --- Polymorphism trong hành động ---
const shapes = [new Circle(5), new Rectangle(4, 6), new Triangle(3, 4, 5)];

// Một vòng lặp — mỗi shape tự tính theo công thức riêng
shapes.forEach((s) => console.log(s.describe()));
// Circle:    diện tích = 78.54, chu vi = 31.42
// Rectangle: diện tích = 24.00, chu vi = 20.00
// Triangle:  diện tích = 6.00,  chu vi = 12.00

// Tính tổng diện tích — không quan tâm shape là gì
const totalArea = shapes.reduce((sum, s) => sum + s.area(), 0);
console.log("Tổng diện tích:", totalArea.toFixed(2)); // 108.54
```

---

## 10. Encapsulation

**Encapsulation** (đóng gói) là nguyên tắc che giấu dữ liệu nội bộ, chỉ để lộ những gì cần thiết ra ngoài thông qua **public interface**.

```js
class UserAccount {
  // Private — dữ liệu nhạy cảm
  #password;
  #loginAttempts = 0;
  #isLocked = false;

  // Public — thông tin có thể thấy
  username;
  email;

  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.#password = this.#hash(password); // không lưu plain text
  }

  // Private method — chỉ dùng nội bộ
  #hash(str) {
    // Đơn giản hoá — thực tế dùng bcrypt
    return btoa(str + "_secret");
  }

  // Public method — interface cho bên ngoài
  login(password) {
    if (this.#isLocked) {
      return { success: false, message: "Tài khoản bị khoá" };
    }
    if (this.#hash(password) === this.#password) {
      this.#loginAttempts = 0;
      return { success: true, message: `Xin chào, ${this.username}!` };
    }
    this.#loginAttempts++;
    if (this.#loginAttempts >= 3) {
      this.#isLocked = true;
      return {
        success: false,
        message: "Sai mật khẩu 3 lần — tài khoản bị khoá",
      };
    }
    return {
      success: false,
      message: `Sai mật khẩu (${this.#loginAttempts}/3)`,
    };
  }

  changePassword(oldPwd, newPwd) {
    if (this.#hash(oldPwd) !== this.#password) {
      return "Mật khẩu cũ không đúng";
    }
    this.#password = this.#hash(newPwd);
    return "Đổi mật khẩu thành công";
  }

  get isLocked() {
    return this.#isLocked;
  }
}

const user = new UserAccount("nguyen_an", "an@example.com", "pass123");

console.log(user.login("wrong")); // Sai mật khẩu (1/3)
console.log(user.login("wrong")); // Sai mật khẩu (2/3)
console.log(user.login("wrong")); // Sai → tài khoản bị khoá
console.log(user.login("pass123")); // Tài khoản bị khoá

// Dữ liệu nội bộ được bảo vệ
// console.log(user.#password); // SyntaxError!
```

---

## 11. Mixins — đa kế thừa

JavaScript không hỗ trợ đa kế thừa trực tiếp (một class không thể `extends` nhiều class). **Mixin** là giải pháp — trộn method từ nhiều nguồn vào một class.

```js
// Mixin 1: khả năng serialize
const Serializable = (Base) =>
  class extends Base {
    toJSON() {
      return JSON.stringify(this);
    }

    static fromJSON(json) {
      return Object.assign(new this(), JSON.parse(json));
    }
  };

// Mixin 2: khả năng timestamp
const Timestamped = (Base) =>
  class extends Base {
    constructor(...args) {
      super(...args);
      this.createdAt = new Date().toISOString();
      this.updatedAt = new Date().toISOString();
    }

    touch() {
      this.updatedAt = new Date().toISOString();
      return this;
    }
  };

// Mixin 3: khả năng validate
const Validatable = (Base) =>
  class extends Base {
    validate() {
      const errors = [];
      for (const [key, value] of Object.entries(this)) {
        if (value === null || value === undefined || value === "") {
          errors.push(`${key} không được để trống`);
        }
      }
      return { valid: errors.length === 0, errors };
    }
  };

// Class cơ sở
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

// Áp dụng nhiều mixin cùng lúc
class EnhancedUser extends Serializable(Timestamped(Validatable(User))) {
  constructor(name, email, role) {
    super(name, email);
    this.role = role;
  }
}

const u = new EnhancedUser("Bình", "binh@example.com", "admin");

console.log(u.validate()); // { valid: true, errors: [] }
console.log(u.toJSON()); // JSON string của object
console.log(u.createdAt); // ISO timestamp
u.touch();
console.log(u.updatedAt); // timestamp mới hơn
```

---

## 12. Class vs Prototype truyền thống

Class trong ES6 là **syntactic sugar** — bên dưới vẫn là prototype chain. Hiểu sự khác biệt giúp bạn debug tốt hơn.

```js
// Cách cũ — ES5 dùng function constructor + prototype
function PersonES5(name, age) {
  this.name = name;
  this.age = age;
}
PersonES5.prototype.greet = function () {
  return `Xin chào, tôi là ${this.name}`;
};

// Cách mới — ES6 Class (code tương đương, gọn hơn)
class PersonES6 {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  greet() {
    return `Xin chào, tôi là ${this.name}`;
  }
}

// Kết quả giống nhau
const p1 = new PersonES5("An", 25);
const p2 = new PersonES6("Bình", 30);
console.log(p1.greet()); // "Xin chào, tôi là An"
console.log(p2.greet()); // "Xin chào, tôi là Bình"

// Kiểm tra prototype — chứng minh class là syntactic sugar
console.log(typeof PersonES6); // "function" — không phải "class"!
console.log(PersonES6.prototype.greet); // [Function: greet]
console.log(p2.__proto__ === PersonES6.prototype); // true
```

| Tiêu chí       | Function Constructor (ES5)  | Class (ES6+)                |
| -------------- | --------------------------- | --------------------------- |
| Cú pháp        | Dài dòng                    | Gọn, rõ ràng                |
| `new` bắt buộc | Không (dễ quên)             | Có (throw Error nếu thiếu)  |
| Hoisting       | Có (function hoisting)      | Không (Temporal Dead Zone)  |
| `strict mode`  | Không tự động               | Luôn bật trong class body   |
| Private fields | Không native (dùng closure) | `#field` native             |
| Kế thừa        | Phức tạp (Object.create)    | Gọn với `extends` + `super` |

---

## 13. Tổng kết & Bảng tra nhanh

### Bốn trụ cột OOP trong JavaScript

| Khái niệm         | Định nghĩa                         | Từ khoá / Cú pháp              |
| ----------------- | ---------------------------------- | ------------------------------ |
| **Encapsulation** | Đóng gói dữ liệu, che giấu nội bộ  | `#privateField`, getter/setter |
| **Inheritance**   | Class con kế thừa class cha        | `extends`, `super()`           |
| **Polymorphism**  | Cùng tên method, hành vi khác nhau | Override method trong subclass |
| **Abstraction**   | Ẩn chi tiết, chỉ để lộ interface   | Public method, private logic   |

### Bảng tra cú pháp nhanh

```js
// Khai báo class
class ClassName {
  // Class field (ES2022)
  publicField = defaultValue;
  #privateField = defaultValue;
  static staticField = defaultValue;

  // Constructor
  constructor(params) { ... }

  // Instance method
  methodName() { ... }

  // Getter / Setter
  get propName()       { return this.#val; }
  set propName(value)  { this.#val = value; }

  // Static method
  static utilMethod() { ... }

  // Private method
  #internalMethod() { ... }
}

// Kế thừa
class Child extends Parent {
  constructor(params) {
    super(parentParams); // gọi trước this
    this.extra = extra;
  }

  override() {
    const parentResult = super.override(); // gọi method cha
    return parentResult + " + thêm gì đó";
  }
}

// Tạo object
const obj = new ClassName(params);

// Kiểm tra
obj instanceof ClassName  // true/false
obj.constructor.name       // tên class
```

### Khi nào dùng class?

- Khi cần **nhiều object cùng cấu trúc** (users, products, orders...)
- Khi có **logic kế thừa** rõ ràng (Animal → Dog → GoldenRetriever)
- Khi cần **đóng gói dữ liệu** nhạy cảm (BankAccount, UserAuth)
- Khi xây dựng **thư viện hoặc framework**

### Khi nào KHÔNG cần class?

- Object đơn lẻ, không tạo nhiều instance → dùng object literal `{}`
- Logic đơn giản, không có state → dùng plain functions
- Functional programming style → dùng closure / module pattern
